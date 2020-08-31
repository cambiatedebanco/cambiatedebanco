import { Component, OnInit, OnDestroy  } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-simulacion-web',
  templateUrl: './admin-simulacion-web.component.html',
  styleUrls: ['./admin-simulacion-web.component.css']
})
export class AdminSimulacionWebComponent implements OnInit, OnDestroy  {
  format = { add: 'Agregar', remove: 'Remover', all: 'Todo', none: 'Nada',
  direction: DualListComponent.LTR, draggable: true, locale: 'es' };
  navigationSubscription;
  getECVSubscribe;
  cEOSucursalesSubscribe;
  campaignsSubscribe;
  getAsignaLeadsSubscribe;
  origendestSubscribe;
  sucursales: any;
  campaigns: any;
  codigoSucursal: any = 0;
  codigoSucursalDestino: any = 0;
  codigoCampaign: any = 0;
  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  confirmed: Array<any>;
  disabled = false;
  sourceLeft = true;
  check = false;
  sourceInit: Array<any>;
  destinationInit: Array<any>;
  filterAsignadosSucursal: Array<any>;
  filterDeleteIdDoc: Array<any>;
  modal = true;
  origendest: any;

  constructor(
    public firestoreservice: FirestoreService,
    private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    this.cEOSucursalesSubscribe = this.firestoreservice.getCEOSucursales().subscribe((sucursalesSnapShot: any) => {
      this.sucursales = [];
      sucursalesSnapShot.forEach((sucursal: any) => {
        this.sucursales.push({
          id: sucursal.payload.doc.id,
          data: sucursal.payload.doc.data()
        });
      });
    });

    this.campaignsSubscribe = this.firestoreservice.getCampaings().subscribe((campaignsSnapShot: any) => {
      this.campaigns = [];
      campaignsSnapShot.forEach((campaign: any) => {
        if (campaign.payload.doc.data().id_campaign === 4) {
        this.campaigns.push({
          id: campaign.payload.doc.id,
          data: campaign.payload.doc.data()
        });
      }
      });
    });

    this.origendestSubscribe = this.firestoreservice.getOrigenDestino().subscribe((origendestSnapShot: any) => {
      this.origendest = [];
      origendestSnapShot.forEach((oridest: any) => {
        this.origendest.push(oridest);
      });
    });

    this.initECVAll();
    this.initAsignLeadsAll();

  }

  ngOnInit() {
  }

  selectInputCampaign(campaignId: any) {
    this.codigoCampaign = campaignId;
    if (this.codigoSucursal !== 0) {
      this.codigoSucursalDestino = 0;
      this.check = false;
      this.initDualList();
    }
  }

  selectInput(codSucursal: any) {
    this.codigoSucursal = codSucursal;
    this.check = false;
    this.codigoSucursalDestino = 0;
    this.initDualList();

  }

  selectInputDestino(codSucursal: any) {
    this.codigoSucursalDestino = codSucursal;
    const data_ori_dest = {
      origen: parseInt(this.codigoSucursal),
      destino: parseInt(this.codigoSucursalDestino)
    };
    const data_dest_dest = {
      origen: parseInt(this.codigoSucursalDestino),
      destino: parseInt(this.codigoSucursalDestino)
    };

    this.firestoreservice.setOrigenDestino(this.codigoSucursal, data_ori_dest);
    this.firestoreservice.setOrigenDestino(this.codigoSucursalDestino, data_dest_dest);

    this.initDualList();
  }


  initDualList() {
    if ( this.codigoSucursal === this.codigoSucursalDestino ||
      (parseInt(this.codigoSucursal) !== 0 && parseInt(this.codigoSucursalDestino) === 0)) {
       this.initECVSourceSucursal();
    } else {
      const origen = this.getMatriz(this.codigoSucursal);
      const destino = this.getMatriz(this.codigoSucursalDestino);
      this.source = Array.from(new Set(origen.concat(destino)));
      this.confirmed = destino;
    }

  }

  echoDestination(ejecutivosArray: any) {
    this.initAsignLeadsAll();
    let sucursalAsignada: any;
    let sucursalDestino: any;
    if ( this.codigoSucursal === this.codigoSucursalDestino ||
      (parseInt(this.codigoSucursal) !== 0 && parseInt(this.codigoSucursalDestino) === 0)) {
        const destinationArray = this.filterDestinationInit(this.codigoSucursal);
        this.deleteAsignaLeads(destinationArray);
        sucursalAsignada = this.codigoSucursal;
        sucursalDestino = this.codigoSucursal;
      } else {
        const deleteArray = this.getIdDocumentAsign(ejecutivosArray);
        this.deleteAsignaLeads(deleteArray);
        sucursalAsignada = this.codigoSucursal;
        sucursalDestino = this.codigoSucursalDestino;
    }

    let dataEjec: any;
    if (ejecutivosArray.length > 0) {
      ejecutivosArray.forEach((data, index) => {
          dataEjec = {
            campana: parseInt(this.codigoCampaign),
            email_ejecutivo: data.EMAIL.toLowerCase() ,
            estado: 1 ,
            prioridad: index + 1,
            rut_ejecutivo: data.rut ,
            codigo_sucursal: parseInt(sucursalDestino)
          };
          this.firestoreservice.insertEjecCampaign(dataEjec);
        });

      const data = {
          contador: 0,
          prioridad: ejecutivosArray.length,
          codigo_sucursal: parseInt(sucursalDestino),
          id_campaign: parseInt(this.codigoCampaign)
        };

      const data_ori_dest = {
            origen: parseInt(sucursalAsignada),
            destino: parseInt(sucursalDestino)
      };

      const data_dest_dest = {
        origen: parseInt(sucursalDestino),
        destino: parseInt(sucursalDestino)
      };

      this.firestoreservice.setPrioriByDoc(this.codigoCampaign + '-' + sucursalDestino, data);
      this.firestoreservice.setOrigenDestino(sucursalAsignada, data_ori_dest);
      this.firestoreservice.setOrigenDestino(sucursalDestino, data_dest_dest);
    } else {
     this.confirmed = [];
    }
    }

    deleteAsignaLeads(deleteDoc: any) {
    if ( deleteDoc.length > 0) {
      deleteDoc.forEach((data: any) => {
        const deleteAsignaLeads = this.firestoreservice.deleteAsignaLeads(data.propertyId);
        deleteAsignaLeads.then(() => {
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      })
      .finally(() => {
      });
    });
  }
}

    initECVAll() {
      this.getECVSubscribe = this.firestoreservice.getECV().subscribe(
        dataSnap => {
          this.sourceInit = [];
          if (typeof dataSnap !== 'undefined') {
              dataSnap.forEach((row: any) => {
                this.sourceInit.push(row);
             });
          }
          this.display = this.ejecutivosLabel;
          this.key = 'RUT';
      });
    }

    initAsignLeadsAll() {
      this.getAsignaLeadsSubscribe = this.firestoreservice.getAsignaLeads().subscribe(
        dataSnap => {
          this.destinationInit = [];
          if (typeof dataSnap !== 'undefined') {
              dataSnap.forEach((row: any) => {
                this.destinationInit.push(row);
             });
          }
      });
    }

    filterDestinationInit(codigoSucursal: any) {
      return this.destinationInit.filter(item =>
        item.codigo_sucursal === parseInt(codigoSucursal)
        && item.campana === parseInt(this.codigoCampaign)
        );
    }

    filterAssignByDestino(codigoSucursal: any) {
      return this.destinationInit.filter(item =>
        item.codigo_suc_destino === parseInt(codigoSucursal)
        && item.campana === parseInt(this.codigoCampaign)
        );
    }

    getIdDocumentAsign(array: any) {
      const matrix = [];
      array.forEach((filter: any) => {
        this.destinationInit.forEach((assign: any) => {
          if ( assign.rut_ejecutivo === filter.RUT
            && parseInt(this.codigoCampaign) === parseInt(assign.campana)) {
            matrix.push(assign);
          }
        });
     });
      return matrix;
    }

    initECVSourceSucursal() {
      this.initAsignLeadsAll();
      this.filterAsignadosSucursal  = this.getMatriz(this.codigoSucursal);
      const prepareSource  = this.prepareSourceInit(this.destinationInit);
      this.source = Array.from(new Set(prepareSource.concat(this.filterAsignadosSucursal)));
      this.confirmed = this.filterAsignadosSucursal ;
      this.display = this.ejecutivosLabel;
      this.key = 'RUT';
    }

    getMatriz(codigoSuc: any) {
      const matrixSearchDestination = this.destinationInit.filter(item =>
        item.codigo_sucursal === parseInt(codigoSuc) 
        && item.campana === parseInt(this.codigoCampaign)
        );
      const matrix = [];
      matrixSearchDestination.forEach((filter: any) => {
        this.sourceInit.forEach((source: any) => {
          if ( filter.rut_ejecutivo === source.RUT) {
            matrix.push(source);
          }
        });
     });
      return matrix;
    }

    prepareSourceInit(array: any) {
      const matrix = Array.from(this.sourceInit);
      array.forEach((filter: any) => {
        matrix.forEach((source: any, index) => {
          if ( filter.rut_ejecutivo === source.RUT
            && parseInt(this.codigoCampaign) === parseInt(filter.campana)) {
            matrix.splice(index, 1);
          }
        });
     });
      return matrix;
    }

    modelChange(check: any) {
      this.check = check;
      if (!check) {
        this.codigoSucursalDestino = 0 ;
        this.confirmed = [];
        this.initDualList();
      }

    }

    private ejecutivosLabel(item: any) {
      return item.RUT + ' - ' + item.NOMBRES + ' ' + item.APELLIDO_PATERNO;
    }

    doDisable() {
      this.disabled = !this.disabled;
    }

    ngOnDestroy(): void {
      // avoid memory leaks here by cleaning up after ourselves. If we
      // don't then we will continue to run our initialiseInvites()
      // method on every navigationEnd event.
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }

      if (this.cEOSucursalesSubscribe) {
        this.cEOSucursalesSubscribe.unsubscribe();
      }

      if (this.campaignsSubscribe) {
        this.cEOSucursalesSubscribe.unsubscribe();
      }

      if (this.getECVSubscribe) {
        this.getECVSubscribe.unsubscribe();
      }

      if (this.getAsignaLeadsSubscribe) {
        this.getAsignaLeadsSubscribe.unsubscribe();
      }

      if (this.origendestSubscribe) {
        this.origendestSubscribe.unsubscribe();
      }
      

    }
}
