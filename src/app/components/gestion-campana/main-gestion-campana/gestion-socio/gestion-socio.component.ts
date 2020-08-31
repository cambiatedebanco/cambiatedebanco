import { Component, OnInit, ViewChild } from '@angular/core';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaderStts } from 'src/app/components/utility';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-socio',
  templateUrl: './gestion-socio.component.html',
  styleUrls: ['./gestion-socio.component.css']
})
export class GestionSocioComponent implements OnInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  headers = null;
  dataSocios :any[];
  displayedColumns: string[] = ['rut', 'nombre','modificar', 'eliminar']
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  authSubscription: Subscription;
  postgresSubscription: Subscription;
  ID_DEFAULT_CARGO = null;
  constructor(private authService:AuthService, private postgresService:PostgresService) { }

  ngOnInit() {
    this.prepareHeaders()
  }

  prepareHeaders(){
    this.authService.getestado()
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())

    this.getSocios();
  }


  getSocios(){
    this.postgresSubscription = this.postgresService.getUsuariosCla(this.headers, 1).subscribe(data => {
      this.dataSocios = data;
      this.dataSource.data = this.dataSocios;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    },error=> {
      console.error(error)
    })
  }

  applyFilter(value:string){
    let filterValue = value.trim()
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  ngOnDestroy(){
    if(typeof this.authSubscription !== 'undefined'){
      this.authSubscription.unsubscribe();
    }
    if(typeof this.postgresSubscription !== 'undefined'){
      this.postgresSubscription.unsubscribe();
    }
  }

  turnOffSocio(socio){
    socio.id_cargo = this.ID_DEFAULT_CARGO;
    let data = socio;
    this.postgresService.updateRolUsuario(data, this.headers).subscribe(_ => {
      Swal.fire({
        title: 'OK',
        text: 'Usuario ha sido Actualizado',
        type: 'success'
      }).then(() => {
        this.deleteRowInDataSourceById(socio.rut);
      });
    }, error => {
      Swal.fire({
        title: 'Ups!',
        text: 'Usuario no se ha sido Actualizado',
        type: 'warning'
      }).then(() => {
      });
    })

  }
  deleteRowInDataSourceById(id){
    console.log(id);
    let index:number = this.dataSocios.findIndex(element => element.rut === id)
    this.dataSocios.splice(index, 1)
    this.dataSource= new MatTableDataSource<Element>(this.dataSocios);
  }
}
