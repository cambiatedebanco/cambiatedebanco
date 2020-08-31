import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaders } from '../../utility';
import { tap } from 'rxjs/operators';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crud-campana',
  templateUrl: './crud-campana.component.html',
  styleUrls: ['./crud-campana.component.css']
})
export class CrudCampanaComponent implements OnInit {
  headers = null;
  displayedColumns: string[] = ['idcampana', 'nombre', 'created_time', 'modifica', 'elimina'];
  dataCampains: any[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  authSubscription: Subscription;
  deleteSubscription: Subscription;
  constructor(private authService:AuthService, private postgresService:PostgresService, private router:Router) { }

  ngOnInit() {

    this.authSubscription = this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { 
      this.headers = getHeaders(user)
       } })
    ).subscribe(
      _ => {
        this.getCampains();
      }
    )
  }
  getCampains(){
    this.postgresService.getAllCampains(this.headers).subscribe(
      data => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = data;
        console.log(data)
        this.dataCampains = data;
      }
    )
  }

  onEliminar(id){
    Swal.fire({
      title: 'Eliminar',
      text: 'Estas seguro de eliminar esta campaña?',
      type: 'warning',
      showCancelButton:true,
      confirmButtonText:'Si, eliminalo!',
      cancelButtonText: 'No, Mantengamoslo'
    }).then((result) => {
      if(result.value){
        this.deleteCampain(id)
      }
    })
  }
  deleteCampain(id){
    this.deleteSubscription = this.postgresService.deleteCampain(id, this.headers).subscribe((_ => {
      this.deleteRowInDataSourceById(id)
      Swal.fire('Eliminado!', 
      'La campaña ha sido eliminada',
      'success')
    }))

  }
  deleteRowInDataSourceById(id){
    let index:number = this.dataCampains.findIndex(element => element.idcampana == id)
    this.dataCampains.splice(index, 1)
    this.dataSource= new MatTableDataSource<Element>(this.dataCampains);
  }


  applyFilter(value:string){
    let filterValue = value.trim()
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }

  ngOnDestroy(){
    if(this.authSubscription){
      this.authSubscription.unsubscribe();
    }
    if(this.deleteSubscription){
      this.deleteSubscription.unsubscribe();
    }

  }
}
