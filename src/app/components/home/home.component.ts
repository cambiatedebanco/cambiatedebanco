import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { Colaborador } from '../../classes/colaborador.class';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PostgresService } from '../../services/postgres/postgres.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  marcador: Marcador[] = [];
  colaborador: Colaborador[] = [];
  marcadorFarmacia: Marcador[] = [];
  afiliados = [];
  contagios = [];
  IscheckedSalco = false;
  IscheckedCverde = false;
  IscheckedAhumada = false;
  public regiones: any = [];
  public comercio: any = [];
  public empresas: any = [];
  colaboradoresPos = [];
  userPerfil: any;
  user: any;
  codigoSucursal: any;
  lat = -33.4372;
  lng = -70.6506;
  zoom = 12;
  zoneMap: any;
  tipo = 1;
  colaboradoresComuna: any = [];
  vulnerabilidadComuna: any = [];
  comuna = '';
  total_colaboradores = 0;
  region = 0;
  headers: any;


  constructor(public _firestoreservice: FirestoreService, private authService: AuthService, private _route: Router,
    private route: ActivatedRoute, private postgresService: PostgresService) {


    this._firestoreservice.getSucursales().subscribe((mapaSnapShot) => {
      mapaSnapShot.forEach((mapaData: any) => {
        this.marcador.push(new Marcador(
          mapaData.payload.doc.data().latitud,
          mapaData.payload.doc.data().longitud,
          mapaData.payload.doc.data().sucursal,
          mapaData.payload.doc.data().direccion,
          mapaData.payload.doc.data().estado_sucursal
        ));
      });
    });

    // MOVER ... 
    this.getComercios();
    this.getRegiones();

    this.user = this.authService.isUserLoggedIn();
      this.postgresService.getUsuarioPorMail(this.user.email.toUpperCase(), this.headers).subscribe
      (resp => {
        // if eject
        this.codigoSucursal = resp[0].codigo_sucursal;
      }) 

  }


  ngOnInit() {
    this.authService.isUserLoggedInAuth().pipe(
      tap(user => {
        if (user) {
          this.user = user;
          this.headers =  (this.user);
        }
        else {
          this.logoutUser();
        }
      })
    ).subscribe(_ => {
      this.getContagiosCovid(this.headers);
      this.getColaboradoresPos(this.headers);
      this.getColaboradoresComunaApi(this.headers);
      this.getAfiliadosComunaMap(this.headers);
      this.getFarmaciasOperativa(this.headers);
    }

    );


  }
  logoutUser() {
    this.authService.logout()
      .then(res => {

        //this.userDetails = undefined;
        //  this.userPerfil= undefined;
        localStorage.removeItem('user');
        localStorage.removeItem('user_perfil');

      }, err => {
        //this.showMessage("danger", err.message);
      });
  }

  private getContagiosCovid(headers: any, filtro: string = 'comuna') {
    this.postgresService.getContagiosCovid(filtro, headers).subscribe((contagios: any) => {
      this.contagios = [];
      contagios.forEach((contagio: any) => {
        this.contagios.push({
          data: contagio
        });
      });
    });
  }

  private getColaboradoresPos(headers, id = 0, ) {
    this.postgresService.getColaboradoresPos(id, headers).subscribe((posiciones: any) => {
      this.colaborador = [];
      posiciones.forEach((posicion: any) => {
        this.colaborador.push(new Colaborador(posicion.latitud, posicion.longitud, posicion.nombres));
      });
    });
  }


  private getColaboradoresComunaApi(headers, region: number = 0) {
    this.postgresService.getColaboradoresComuna(region, headers).subscribe((comunas: any) => {
      this.total_colaboradores = 0;
      this.colaboradoresComuna = [];
      comunas.forEach((comuna: any) => {
        this.colaboradoresComuna.push({
          data: comuna
        });
        this.total_colaboradores += parseInt(comuna.colaboradores);
      });
    });
  }

  private getAfiliadosComunaMap(headers, id: number = 0) {
    this.postgresService.getAfiliadosComuna(id, headers).subscribe((posiciones: any) => {
      this.afiliados = [];
      posiciones.forEach((comuna: any) => {
        if (comuna.lat == null || comuna.lng == null) {
          return;
        }
        this.afiliados.push({ comuna: comuna.comuna, lat: comuna.lat, lng: comuna.lng, n: comuna.n, radius: Math.sqrt(comuna.n) * 15 });
      });
    });
  }


  public seleccionaRegion(region: any) {
    this._firestoreservice.getCentrar(region.value).subscribe((regionesSnapShot: any) => {

      regionesSnapShot.forEach((region: any) => {
        this.lat = region.payload.doc.data().latitud;
        this.lng = region.payload.doc.data().longitud;

      });
      this.getComercios(region.value);
    });
  }

  private getComercios(id: number = 13) {
    this._firestoreservice.getComercios(id).subscribe((comercioSnapShot: any) => {
      this.comercio = [];
      comercioSnapShot.forEach((comercios: any) => {
        this.comercio.push({
          id: comercios.payload.doc.id,
          data: comercios.payload.doc.data()
        });
      });
    });
  }
  private getRegiones() {
    this._firestoreservice.getRegiones().subscribe((regionesSnapShot: any) => {
      this.regiones = [];
      regionesSnapShot.forEach((region: any) => {
        this.regiones.push({
          id: region.payload.doc.id,
          data: region.payload.doc.data()
        });
      });
    });
  }

  setFocusMap(zone: any) {
    this.lat = zone.lat;
    this.lng = zone.lng;
  }


  setTipo(tipo: any) {
    this.tipo = tipo;
    if (this.tipo == 1) {
      this.zoom = 12;
      this.getColaboradoresComunaApi(this.headers, this.region);
    }

    if (this.tipo == 2) {
      this.zoom = 11;
      this.getAfiliadosComunaApi(this.region, this.headers);
    }
  }


  setRegion(zone: any) {
    this.region = zone.region;
    if (this.tipo == 1) {
      this.getColaboradoresComunaApi(this.headers, this.region);
    }

    if (this.tipo == 2) {
      this.getAfiliadosComunaApi(this.region, this.headers);

    }
  }

  setCheckedSalco(checked: any){
  this.IscheckedSalco = checked;
  }

  setCheckedAhumada(checked: any){
    this.IscheckedAhumada = checked;
    }

    setCheckedCverde(checked: any){
      this.IscheckedCverde = checked;
      }

  private getAfiliadosComunaApi(region, headers) {
    this.postgresService.getAfiliadosComuna(region, headers).subscribe((comunas: any) => {
      this.colaboradoresComuna = [];
      this.total_colaboradores = 0;
      comunas.forEach((comuna: any) => {
        this.colaboradoresComuna.push({
          data: comuna
        });
        this.total_colaboradores += parseInt(comuna.colaboradores);
      });
    });
  }

  private getFarmaciasOperativa(headers) {
    this.postgresService.getFarmaciasOperativas(headers).subscribe((farmacias: any) => {
      this.marcadorFarmacia = [];
      farmacias.forEach((farmacia: any) => {
        this.marcadorFarmacia.push(new Marcador(
          farmacia.local_lat,
          farmacia.local_lng,
          farmacia.local,
          farmacia.local_direccion,
          'Operativa'
        ));
      });
    });
  }

  OnDestroy() {
  }

}
