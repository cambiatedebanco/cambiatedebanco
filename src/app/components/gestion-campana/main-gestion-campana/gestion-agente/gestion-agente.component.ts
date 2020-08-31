import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from 'src/app/components/utility';
import Swal from 'sweetalert2';
import { DialogAsignarAgente } from 'src/app/dialogs/dialog-asignar-agente';

@Component({
  selector: 'app-gestion-agente',
  templateUrl: './gestion-agente.component.html',
  styleUrls: ['./gestion-agente.component.css']
})
export class GestionAgenteComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  headers = null;
  dataSucursal: any[];
  displayedColumns: string[] = ['cod', 'origen', 'destino','agente_detail', 'modificar', 'agente', 'dotacion']
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isReady: boolean = false;
  sucursalesDisponibles = [];
  subscriptionEnabledSuc: Subscription;
  subscriptionAllSuc: Subscription;
  private subscriptions = new Subscription();

  constructor(private authService: AuthService, private postgresService: PostgresService, public dialog: MatDialog) { }

  ngOnInit() {
    this.prepareHeaders();
  }
  prepareHeaders() {
    this.authService.getestado()
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())
    this.getSucursales();
  }
  getSucursales() {
   this.subscriptionAllSuc = this.postgresService.getSucursales(this.headers).subscribe(_ => {
      this.dataSucursal = _;
      this.dataSource.data = this.dataSucursal;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isReady = true;
    }, error => {
      console.log(error)
    })
  }

  applyFilter(value: string) {
    let filterValue = value.trim()
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  getSucursalesDisponibles() {
    this.subscriptions.add(
      this.postgresService.getSucursalesEnabled(this.headers).subscribe(result => {
        this.sucursalesDisponibles = result;
      }, error => {
        console.error(error)
      })
    )
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if(typeof this.subscriptionAllSuc !== 'undefined'){
      this.subscriptionAllSuc.unsubscribe();
    }
  }

  openDialog(element): void {

    this.subscriptionEnabledSuc = this.postgresService.getSucursalesEnabled(this.headers).subscribe(data => {
      this.sucursalesDisponibles = data;
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '350px',
        data: { sucursales: this.sucursalesDisponibles, origen: element.origen, destino: null }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let data = { destino: result, origen: element.idsucursal }
          this.subscriptions.add(this.postgresService.updateSucursalDestino(data, this.headers).subscribe(_ => {
            Swal.fire({ title: 'OK', text: 'Reasignación satisfactoria creada exitosamente', type: 'success' }).then(_ => {
              this.getSucursales();
              // reload
            })
          }, error => {
            Swal.fire({ title: 'Ups', text: 'Algo salio mal', type: 'error' }).then(_ => {
              // reload
            })
          }))
        }
      });
    }, error => {
      console.error(error)
    })

  }

  openDialogupdateAgente(element): void {
    let ID_AGENTE = 2;
    this.postgresService.getAgentesDisponibles(this.headers).subscribe(
      response => {

        this.postgresService.getUsuarioPorCargoSuc(ID_AGENTE, element.idsucursal, this.headers).subscribe(_=> {
          console.log(_)
          const dialogRef = this.dialog.open(DialogAsignarAgente, {
            width: '350px',
            data: { agentes: response,  actualAgent: _ }
          })
          dialogRef.afterClosed().subscribe(result => {
            if(result) {
              let data = {idsucursal: element.idsucursal, agente: result}
              this.postgresService.setagenteSucursal(data, this.headers).subscribe(_ => {
               Swal.fire({ title: 'OK', text: 'Reasignación satisfactoria creada exitosamente', type: 'success' }).then(_ => {
                this.getSucursales();
               })
              })
            }
           })
        })

      }
    )
  }
}

@Component({
  selector: 'dialog-overview-dialog',
  templateUrl: 'dialog-overview-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  selected: String;
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmSelect() {
    if(this.selected === ""){
      this.dialogRef.close()
    }
    this.dialogRef.close(this.selected)
  }

}



export interface DialogData {
  sucursales: any[],
  actualAgent:any
  origen:any
}
