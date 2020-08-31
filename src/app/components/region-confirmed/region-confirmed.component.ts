import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from '../../services/postgres/postgres.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-region-confirmed',
  templateUrl: './region-confirmed.component.html',
  styleUrls: ['./region-confirmed.component.css']
})
export class RegionConfirmedComponent implements OnInit {
  private subscription: Subscription;
  constructor(private authService: AuthService, private postgresService: PostgresService) { }
  regionData = [];
  totalConfirmed = 0;
  colaboradoresRegion = [];
  total = 0;
  @Output() coordenadasDesdeRegion = new EventEmitter<any>();
  @Output() filtro_region = new EventEmitter<any>();
  @Output() filtro_tipo = new EventEmitter<any>();
  @Output() IscheckedSalco = new EventEmitter<any>();
  @Output() IscheckedCverde = new EventEmitter<any>();
  @Output() IscheckedAhumada = new EventEmitter<any>();
  @Input('tipo') tipo;
  private headers = null;
  private user = null;

  ngOnInit() {

    this.authService.isUserLoggedInAuth().pipe(
      // Repetir paso en caso de llamado de la api
      tap(user => {
        if (user) { this.user = user }
      })
    ).subscribe(_ => {
      let headers = this.headers = this.getHeaders(this.user);// Prepare headers
      this.getColaboradoresRegionApi(headers);
    })
  }




  ngOnDestroy() {

  }

  sendPosition(element: any) {
    this.coordenadasDesdeRegion.emit(element);
    this.filtro_region.emit(element);

  }

  onChangeSalco(checked){
    this.IscheckedSalco.emit(checked);
  }

  onChangeCruzVerde(checked){
    this.IscheckedCverde.emit(checked);
  }

  onChangeAhumada(checked){
    this.IscheckedAhumada.emit(checked);
  }

  sendTipo(tipo: any) {
    if (tipo == '2') {
      this.postgresService.getAfiliadosRegion(0, this.headers).subscribe((regiones: any) => {
        this.colaboradoresRegion = [];
        this.total = 0;
        regiones.forEach((region: any) => {
          this.colaboradoresRegion.push({
            data: region
          });
          this.total += parseInt(region.n);

        });

      });
    }
    if (tipo == '1') {
      this.getColaboradoresRegionApi(this.headers);
    }
    this.filtro_tipo.emit(tipo);
  }

  private getHeaders(user) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.ma
      })
    };
  }
  private getColaboradoresRegionApi(headers, id: number = 0) {
    this.postgresService.getColaboradoresRegion(id, headers).subscribe((regiones: any) => {
      this.colaboradoresRegion = [];
      this.total = 0;
      regiones.forEach((region: any) => {
        this.colaboradoresRegion.push({
          data: region
        });
        this.total += parseInt(region.n);
      });
    });
  }

}
