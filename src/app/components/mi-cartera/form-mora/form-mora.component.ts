import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';
import { getHeaders } from '../../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-mora',
  templateUrl: './form-mora.component.html',
  styleUrls: ['./form-mora.component.css']
})
export class FormMoraComponent implements OnInit, OnDestroy {
  @Output() completeGestion = new EventEmitter<boolean> ();
  @ViewChild('closebuttonMora', null) closebuttonMora;
  @Input() rut;
  @Input() set afiliado(afiliado) {
    this._afiliado = afiliado;
  }
  get afiliado() {
    return this._afiliado;
  }
  _afiliado: any;
  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo() {
    return this._ejecutivo;
  }
  _ejecutivo: any;
  mora: any;
  headers: any;
  user = null;

  constructor(private postgresService: PostgresService,
              private authService: AuthService) { }

  ngOnInit() {

    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { this.user = user;
                                  this.headers = getHeaders(user);} })
    ).subscribe(
      _ => {
        this.getAfiliadoMora(this.rut, this.headers);
      }
    );
  }


  private getAfiliadoMora(id: string, headers) {
    this.postgresService.getAfiliadoMora(id, headers).subscribe((moraSnap: any) => {
      this.mora = moraSnap;
    });
  }

  saveTimelineAlerta() {
    const time = new Date();
    //time.setHours(time.getHours()-4);
    let dataTimeline = {
        rut_persona: this._afiliado.rut_persona,
        ejecutivo : this._ejecutivo.EMAIL.toLowerCase(),
        id_operador : this._ejecutivo.RUT,
        canal : 'CEO',
        tipo_gestion : 'Crédito Mora',
        comentarios : 'Se informa al afiliado acerca de Crédito en Mora',
        fechaContacto : time,
        tipo_interaccion : 'Atiende Ejecutivo',
        campana : 'Mora',
        estado_gestion : 'Informado'
    };

    this.postgresService.saveTimeLine(dataTimeline, this.headers).subscribe(res => console.log(res), 
    err => {
      console.log(err);
    },
    () => {
      this.completeGestion.emit(true);
      Swal.fire({
        title: 'Gestionado',
        text: 'Información Actualizada',
        type: 'success'
      }).then(() => {
        this.closebuttonMora.nativeElement.click();
      });

    }
  )
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    this.closebuttonMora.nativeElement.click();
  }

}
