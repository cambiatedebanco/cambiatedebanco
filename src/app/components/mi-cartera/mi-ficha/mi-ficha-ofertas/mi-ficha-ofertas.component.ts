import { Component, OnInit, Input, ViewChild, EventEmitter, Output, Renderer, OnDestroy , OnChanges } from '@angular/core';
import { getHeaders } from '../../../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mi-ficha-ofertas',
  templateUrl: './mi-ficha-ofertas.component.html',
  styleUrls: ['./mi-ficha-ofertas.component.css']
})
export class MiFichaOfertasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ofertasBBSS;
  @Input() ofertasPPFF;
  @Input() ofertasAlerta;
  @Input() showMainContent;
  @Input() rut;
  @Input() item;
  @ViewChild('closebutton', null) closebutton;
  @ViewChild('closebuttonAuto', null) closebuttonAuto;
  @ViewChild('closebuttonEmail', null) closebuttonEmail;
  @ViewChild('closebuttonConfirmGestion', null) closebuttonConfirmGestion;
  @ViewChild('openButtonFormGestion', null) openButtonFormGestion;

  @Output() completeGestion = new EventEmitter<boolean> ();

  @Input() set afiliado(afiliado) {
    this._afiliado = afiliado;
  }
  get afiliado() {
    return this._afiliado;
  }
  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo() {
    return this._ejecutivo;
  }
  _afiliado: any;
  _ejecutivo: any;
  detailObjectPPFF = null;
  detailObjectBBSS = null;
  detailObjectAlerta = null;
  detailAlerta = null;
  IsmodelShow = false;
  _ofertasPPFFPrimero: any;
  _ofertasAlertaPrimero: any;

  //showMainContent: Boolean = false;
  user = null;
  headers: any;
  constructor(private render: Renderer,
    private postgresService: PostgresService,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { this.user = user;
                                  this.headers = getHeaders(user);} })
    ).subscribe(
      _ => {
      }
    );

  }


  ngOnChanges(){
    this.detailObjectPPFF = this.detailObjectAlerta = this._ofertasPPFFPrimero = this._ofertasAlertaPrimero = null;



  }

  public showDetailPPFF(item,event) {
    this.detailObjectAlerta = this.detailObjectBBSS = this._ofertasPPFFPrimero = this._ofertasAlertaPrimero = null;
    this.detailObjectPPFF = item;
    this.showMainContent = true;

  }
  public Showh(){
    this.showMainContent =  false;
  }

  public showDetailBBss(item) {
    this.detailObjectPPFF = this.detailObjectAlerta = this._ofertasPPFFPrimero = this._ofertasAlertaPrimero = null;
    this.detailObjectBBSS = item;
    this.showMainContent = true;
  }

  public showDetailAlerta(item) {
    this.detailObjectPPFF = this.detailObjectBBSS = this._ofertasPPFFPrimero = this._ofertasAlertaPrimero = null;
    this.detailObjectAlerta = item;
    this.showMainContent = true;
  }

  solicitarActualizacion(actualizar: boolean){
    this.closeModal();
    this.actualizarTimeline(actualizar);
    // Emitir actualizacion..
  }
  closeModal(){
    this.closebuttonAuto.nativeElement.click();
    this.closebutton.nativeElement.click();
  }
  actualizarTimeline(isUpdate) {
    this.completeGestion.emit(isUpdate)
  }

  changeItem(item) {
    this.item = item;
  }

  closeModalObject(){
    this.closebuttonConfirmGestion.nativeElement.click();
  }

  saveTimelineAlerta(){
    const time = new Date();
    //time.setHours(time.getHours()-4);
    let dataTimeline = {
        rut_persona: this._afiliado.rut_persona,
        ejecutivo : this._ejecutivo.email.toLowerCase(),
        id_operador : this._ejecutivo.rut,
        canal : 'CEO',
        tipo_gestion : this.item.tipo_producto + ' ' + this.item.alerta,
        comentarios : 'Se informa al afiliado acerca de ' + this.item.tipo_producto + ' ' + this.item.alerta,
        fechaContacto : time,
        tipo_interaccion : 'Atiende Ejecutivo',
        campana : '',
        estado_gestion : 'Informado'
    };

    this.postgresService.saveTimeLine(dataTimeline, this.headers).subscribe(res => console.log(res),
    err => {console.error(err); }, () => {
      this.actualizarTimeline(true);
      Swal.fire({
        title: 'OK',
        text: 'Correo enviado correctamente',
        type: 'success'
      }).then( function() {

      });
      this.closebuttonConfirmGestion.nativeElement.click();

    });
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    this.closebuttonConfirmGestion.nativeElement.click();
    this.closebuttonAuto.nativeElement.click();
    this.closebutton.nativeElement.click();
      this.detailObjectPPFF = this.detailObjectAlerta = this._ofertasPPFFPrimero = this._ofertasAlertaPrimero = null;

  }

}
