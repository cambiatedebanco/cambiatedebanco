import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {ExportService} from '../../services/export-file/export.service';
import { tap } from 'rxjs/operators';
import { getHeaders } from '../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['rut', 'nombre', 'email', 'modifica', 'elimina'];
  navigationSubscription;
  getUsuariosAllSubscribe;
  headers = null;
  dataUsers: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  


  constructor(
    public firestoreservice: FirestoreService,
    private router: Router,
    private excelService: ExportService,
    private postgresService: PostgresService,
    private authService: AuthService) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });

    }

  initialiseInvites() {
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { 
      this.headers = getHeaders(user)
      this.getUsuariosCla(getHeaders(this.headers))
       } })
    ).subscribe(
      _ => {}
    )
  }

  ngAfterViewInit() {
  }

  getUsuariosCla(headers){
    this.getUsuariosAllSubscribe = this.postgresService.getUsuariosCla(headers).subscribe(
      data => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = data;
        this.dataUsers = data;
      }
    )
  }

  exportAsXLSX(): void {
    const dataUsersXlsx = [];
    this.dataUsers.forEach(function (data) {
      dataUsersXlsx.push({
        RUT: data.rut,
        DV: data.dv_rut ,
        NOMBRES: data.nombres ,
        APELLIDO_PATERNO: data.apellido_paterno ,
        APELLIDO_MATERNO: data.apellido_materno ,
        EMAIL: data.email ,
        SUCURSAL: data.sucursal,
        ES_EJEC:  (data.es_ejec === 1 ? 'SI' : 'NO'),
        NIVEL_ACCESO:  (data.nivel_acceso === 1 ? 'AFILIADO/EMPRESA' : data.nivel_acceso === 2 ? 'EMPRESA' : data.nivel_acceso === 3 ? 'PERSONA' : 'ADMINISTRADOR'),
      });
    });

    this.excelService.exportExcel(dataUsersXlsx , 'usuarios_ceocrm');
 }

  onModificar(id) {
    this.router.navigate(['modificar-usuario', id], { skipLocationChange : true});
  }

  onCampana(id) {
    this.router.navigate(['campaign-home', id], { skipLocationChange : true});
  }

   onEliminar(id) {
    Swal.fire({
      title: 'Eliminar',
      text: 'Esta seguro de eliminar usuario',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'No, Mantenerlo'
    }).then((result) => {
      if (result.value) {
        //TO DO DELETE CAMPAIN
        this.firestoreservice.deleteCampaignsEjec(id);
        this.postgresService.deleteUsuarioPorRut(id, this.headers).subscribe((_ => {
          this.deleteRowInDataSourceByRut(id);
        }))
        Swal.fire(
          'Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );
      }
    });
   }

   deleteRowInDataSourceByRut(id){
    let index:number = this.dataUsers.findIndex(element => element.rut == id)
    this.dataUsers.splice(index, 1)
    this.dataSource= new MatTableDataSource<Element>(this.dataUsers);
    this.dataSource.paginator = this.paginator;
   }


   

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {

  }


  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }

    if (this.getUsuariosAllSubscribe) {
      this.getUsuariosAllSubscribe.unsubscribe();
     }
  }

}
