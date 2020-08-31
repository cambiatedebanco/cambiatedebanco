import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaderStts } from '../utility';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-tam',
  templateUrl: './home-tam.component.html',
  styleUrls: ['./home-tam.component.css']
})
export class HomeTamComponent implements OnInit, OnDestroy {

  @ViewChild('mapContainer', {static: false}) mapContainer: ElementRef;

  headers: any;
  public isData = false;
  public searchForm: FormGroup;
  hoy = null;
  lat: number;
  lng: number;
  direccion = null;
  comuna = null;
  afiliado = null;
  nombre_ap = null;

  icon = {
    url: 'assets/images/marker.png',
    scaledSize: {
      width: 32,
      height: 32
    }
  }

  tamSubscription: Subscription;

  referenceAtm: any[];
  constructor(private postgresService: PostgresService,
    private http: HttpClient,
    private authService: AuthService,
    public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.hoy= Date();
    let user = this.authService.isUserLoggedIn()
    this.headers = getHeaderStts(user);
    this.searchForm = this.formBuilder.group({ rut: new FormControl('', [Validators.required]) });
  }


  getMap(address, numero, comuna) {
    numero = numero || '';
    this.direccion = address + ' ' + numero;
    this.comuna = comuna || '';
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ address +', '+ comuna +', Chile&key=AIzaSyAarjPy9Qk9bSEYvwY08o5rA4p_CVzMMSs' )
      .subscribe((res: any) => {
        this.lat = res.results[0].geometry.location.lat;
        this.lng = res.results[0].geometry.location.lng;
      });

  }


  onGestion(id: any) {
    this.router.navigate(['gestion-tam', id], { skipLocationChange: true });
  }

  onSubmitRut() {
    const formData = this.searchForm.value;
    const rut = formData.rut;
    if (rut === '') {
      return;
    }
    this.getAtmLike(rut);
  }

  getAtmLike(rut) {
    this.tamSubscription = this.postgresService.getTamLike(rut, this.headers).
      subscribe(result => {
        const isNull = (value) => typeof value === "object" && !value
        if (result.length > 0) {
          if(isNull(result[0].email_colaborador)){
            this.isData = true;
            this.afiliado = result[0];
            this.nombre_ap = result[0].nombres.split(' ')[0] + ' ' + result[0].ap_paterno + ' ' + result[0].ap_materno;
            //const {x, y} = this.mapContainer.nativeElement.getBoundingClientRect();
            this.getMap(result[0].dir_calle, result[0].dir_numero, result[0].dir_comuna);
            window.scrollTo(0, 500);
          }else{
            Swal.fire({
              title: 'Hey!',
              text: 'El afiliado ya fue gestionado',
              type: 'info'
            }).then(() => {
              this.isData = false;
              window.scrollTo(0, 0);
              this.searchForm.controls.rut.setValue('');
             });
          }

        } else {
          Swal.fire({
            title: 'Ups!',
            text: 'El afiliado no fue encontrado',
            type: 'info'
          }).then(() => {
            this.isData = false;
            window.scrollTo(0, 0);
            this.searchForm.controls.rut.setValue('');
           });
        }
      }, error => {
        console.error(error);
      });
  }

  ngOnDestroy() {
    if (typeof this.tamSubscription !== 'undefined') {
      this.tamSubscription.unsubscribe();
    }
  }

}
