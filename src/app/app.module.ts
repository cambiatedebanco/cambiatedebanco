import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { environment }  from '../environments/environment';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as funnel from 'highcharts/modules/funnel';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {DragDropModule} from '@angular/cdk/drag-drop';


import { ClickOutsideModule } from 'ng-click-outside';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { GoogleLoginProvider,  AuthService } from 'angularx-social-login';
import { AuthServiceConfig } from 'angularx-social-login';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MapaComponent } from './components/mapa/mapa.component';
import { AgmCoreModule } from '@agm/core';
import {MatSelectModule} from '@angular/material/select';

import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { MatStepperModule } from '@angular/material/stepper';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TwitterComponent } from './components/twitter/twitter.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { ComerciosComponent } from './components/comercios/comercios.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmpresaMainComponent } from './components/empresa-main/empresa-main.component';
import { ListaAfiliadosComponent } from './components/lista-afiliados/lista-afiliados.component';
import { UsoProductosFinancierosComponent } from './components/uso-productos-financieros/uso-productos-financieros.component';
import { EmpresaDemograficoComponent } from './components/empresa-demografico/empresa-demografico.component';
import { OutputGraphComponent } from './components/output-graph/output-graph.component';
import { HttpClientModule } from '@angular/common/http';
import { UsoBssComponent } from './components/uso-bss/uso-bss.component';
import { CostoFugaComponent } from './components/costo-fuga/costo-fuga.component';
import { BuscarComponent } from './components/buscar/buscar.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { LoginComponent } from './components/login/login.component';
import { KpiUnoComponent } from './components/kpi-uno/kpi-uno.component';
import { KpiDosComponent } from './components/kpi-dos/kpi-dos.component';
import { KpiTresComponent } from './components/kpi-tres/kpi-tres.component';
import { KpiCuatroComponent } from './components/kpi-cuatro/kpi-cuatro.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { OfertasUnoComponent } from './components/ofertas-uno/ofertas-uno.component';
import { OfertasDosComponent } from './components/ofertas-dos/ofertas-dos.component';
import { OfertasTresComponent } from './components/ofertas-tres/ofertas-tres.component';
import { HomeRowUnoComponent } from './components/home-row-uno/home-row-uno.component';
import { HomeRowDosComponent } from './components/home-row-dos/home-row-dos.component';
import { HomeRowTresComponent } from './components/home-row-tres/home-row-tres.component';
import { AfiliadoComponent } from './components/afiliado/afiliado.component';
import { LeftBarComponent } from './components/left-bar/left-bar.component';
import { EmpresaInfoComponent } from './components/empresa-info/empresa-info.component';
import { PpffCreditoComponent } from './components/ppff-credito/ppff-credito.component';
import { PpffSeguroComponent } from './components/ppff-seguro/ppff-seguro.component';
import { PpffAhorroComponent } from './components/ppff-ahorro/ppff-ahorro.component';
import { BuscarAfiliadoComponent } from './components/buscar-afiliado/buscar-afiliado.component';
import { OfertaAfSeguroComponent } from './components/oferta-af-seguro/oferta-af-seguro.component';
import { OfertaAfCreditoComponent } from './components/oferta-af-credito/oferta-af-credito.component';
import { OfertaAfBeneficiosComponent } from './components/oferta-af-beneficios/oferta-af-beneficios.component';
import { OfertaAfAprobprecalComponent } from './components/oferta-af-aprobprecal/oferta-af-aprobprecal.component';
import { OfertaAfAhorroComponent } from './components/oferta-af-ahorro/oferta-af-ahorro.component';
import { AfiliadoDemograficoComponent } from './components/afiliado-demografico/afiliado-demografico.component';
import { OfertaAfSeguroAutoComponent } from './components/oferta-af-seguro-auto/oferta-af-seguro-auto.component';
import { MiFichaGestionComponent} from 'src/app/components/mi-cartera/mi-ficha/mi-ficha-gestion/mi-ficha-gestion.component'
import { GestionTam } from 'src/app/components/gestion-tam/gestion-tam.component';

// Dialog
import { DialogEmail } from 'src/app/dialogs/dialog-email';
import { DialogAsignarAgente } from 'src/app/dialogs/dialog-asignar-agente';
import { DialogLoginExterno } from 'src/app/dialogs/dialog-login-externo';

import { LeadComponent } from './components/lead/lead.component';
import { LeadsComponent } from './components/leads/leads.component';
import { registerLocaleData } from '@angular/common';

  // importar locales
import localesEsCl from '@angular/common/locales/es-CL';
import { OutformpensionadosComponent } from './components/outformpensionados/outformpensionados.component';
import { SplitPipe } from './pipe/split.pipe';
import { FilterArrayPipe } from './pipe/filterArray.pipe';
import { MainEmpresaComponent } from './components/main-empresa/main-empresa.component';
import { FormReferidosPensionadosComponent } from './components/form-referidos-pensionados/form-referidos-pensionados.component';
import { ReferidosAutoListaComponent } from './components/referidos-auto-lista/referidos-auto-lista.component';
import { ReferidosSeguroCarComponent } from './components/referidos-seguro-car/referidos-seguro-car.component';
import { AutoReferidoComponent } from './components/auto-referido/auto-referido.component';
import { SimuladorBaseComponent } from './components/simulador-base/simulador-base.component';
import { LeadsFichaComponent } from './components/leads-ficha/leads-ficha.component';
import { TruncatePipe } from './pipe/truncate.pipe';
import { ReplacePipe } from './pipe/replace.pipe';
import { FilterPipe } from './pipe/filter.pipe'
import { SimuladorExternoComponent } from './components/simulador-externo/simulador-externo.component';
import { SimuladorCarteraComponent } from './components/mi-cartera/cartera-simulador/simulador-cartera.component';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { IdleComponent } from './components/idle/idle.component';
import { PostgresService } from './services/postgres/postgres.service';
import { TicketTerminadosComponent } from './components/atencion-virtual/ticket-terminados/ticket-terminados.component';
import { TicketHomeComponent } from './components/atencion-virtual/ticket-home/ticket-home.component';
import { TicketEsperaComponent } from './components/atencion-virtual/ticket-espera/ticket-espera.component';
import { TicketNuevosComponent } from './components/atencion-virtual/ticket-nuevos/ticket-nuevos.component';
import { TicketChatHomeComponent } from './components/atencion-virtual/ticket-chat-home/ticket-chat-home.component';
import { TicketChatFormComponent } from './components/atencion-virtual/ticket-chat-form/ticket-chat-form.component';
import { TicketChatTalkComponent } from './components/atencion-virtual/ticket-chat-talk/ticket-chat-talk.component';
import { RegionConfirmedComponent } from './components/region-confirmed/region-confirmed.component';
import { ValoresTotalCovidComponent } from './components/valores-total-covid/valores-total-covid.component';
import { Home2Component } from './components/home2/home2.component';
import { CampaignHomeComponent } from './components/admin-campaign/campaign-home/campaign-home.component';
//
import { AdminSimulacionWebComponent } from './components/admin-simulacion-web/admin-simulacion-web.component';
import { CrudCampanaComponent } from './components/gestion-campana/crud-campana/crud-campana.component';
import { CampanaCelulaComponent } from './components/gestion-campana/campana-celula/campana-celula.component';
import { CampanaSucursalComponent } from './components/gestion-campana/campana-sucursal/campana-sucursal.component';
import { CreateCampanaComponent } from './components/gestion-campana/crud-campana/create-campana/create-campana.component';
import { UpdateCampanaComponent } from './components/gestion-campana/crud-campana/update-campana/update-campana.component';
import { MainGestionCampanaComponent } from './components/gestion-campana/main-gestion-campana/main-gestion-campana.component';
import { GestionSocioComponent } from './components/gestion-campana/main-gestion-campana/gestion-socio/gestion-socio.component';
import { CreateSocioComponent } from './components/gestion-campana/main-gestion-campana/create-socio/create-socio.component';
import { GestionAgenteComponent, DialogOverviewExampleDialog } from './components/gestion-campana/main-gestion-campana/gestion-agente/gestion-agente.component';
import { CreateAgenteComponent } from './components/gestion-campana/main-gestion-campana/create-agente/create-agente.component';

import { CarteraHomeComponent } from './components/mi-cartera/cartera-home/cartera-home.component';
import { CarteraGestionComponent } from './components/mi-cartera/cartera-gestion/cartera-gestion.component';
import { CarteraFichaAfiliadoComponent } from './components/mi-cartera/cartera-ficha-afiliado/cartera-ficha-afiliado.component';
//

import { MiFichaComponent } from './components/mi-cartera/mi-ficha/mi-ficha.component';
import { MiFichaEncuestaComponent } from './components/mi-cartera/mi-ficha/mi-ficha-encuesta/mi-ficha-encuesta.component';
import { MiFichaTimelineComponent } from './components/mi-cartera/mi-ficha/mi-ficha-timeline/mi-ficha-timeline.component';
import { MiFichaMktgComponent } from './components/mi-cartera/mi-ficha/mi-ficha-mktg/mi-ficha-mktg.component';
import { MiFichaProductosComponent } from './components/mi-cartera/mi-ficha/mi-ficha-productos/mi-ficha-productos.component';
import { MiFichaDemograficoComponent } from './components/mi-cartera/mi-ficha/mi-ficha-demografico/mi-ficha-demografico.component';
import { MiFichaOfertasComponent } from './components/mi-cartera/mi-ficha/mi-ficha-ofertas/mi-ficha-ofertas.component';
import { AgePipe } from './pipe/age.pipe';
import { FormAutoFullComponent } from './components/mi-cartera/form-auto-full/form-auto-full.component';
import { FormMoraComponent } from './components/mi-cartera/form-mora/form-mora.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { EmailComponent } from './components/email/email.component';
import { DirectionsMapDirective } from './directives/directions-map.directive';
import { FormLeadComponent } from './components/mi-cartera/form-lead/form-lead.component';
import { LeadsFichaPgComponent } from './components/leads-ficha-pg/leads-ficha-pg.component';

 
import { LoginExtComponent } from './components/login-ext/login-ext.component';
import { HomeTamComponent } from './components/home-atm/home-tam.component';
import { GestionadosTamComponent } from './components/gestionados-tam/gestionados-tam.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { SuccessComponent } from './components/tarjeta/success/success.component';
import { PendingComponent } from './components/tarjeta/pending/pending.component';
import { ErrorComponent } from './components/tarjeta/error/error.component';
import { MainComponent } from './components/main/main.component';
import {NgxMaterialToolsModule} from 'ngx-material-tools';
import { ConfiguradorOfertaComponent } from './components/tarjeta/configurador-oferta/configurador-oferta.component';


registerLocaleData(localesEsCl, 'es-Cl');
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('1002850217781-4fqsv4j9lvlcthc47striovod92isnd9.apps.googleusercontent.com')
  },
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider('561602290896109')
  // },
  // {
  //   id: LinkedInLoginProvider.PROVIDER_ID,
  //   provider: new LinkedInLoginProvider("78iqy5cu2e1fgr")
  // }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    TwitterComponent,
    ComerciosComponent,
    HomeComponent,
    NavbarComponent,
    EmpresaMainComponent,
    ListaAfiliadosComponent,
    UsoProductosFinancierosComponent,
    EmpresaDemograficoComponent,
    OutputGraphComponent,
    UsoBssComponent,
    CostoFugaComponent,
    BuscarComponent,
    EmpresaComponent,
    EmpresasComponent,
    LoginComponent,
    KpiUnoComponent,
    KpiDosComponent,
    KpiTresComponent,
    KpiCuatroComponent,
    OfertasComponent,
    MiFichaGestionComponent,
    OfertasUnoComponent,
    OfertasDosComponent,
    OfertasTresComponent,
    HomeRowUnoComponent,
    HomeRowDosComponent,
    HomeRowTresComponent,
    AfiliadoComponent,
    LeftBarComponent,
    EmpresaInfoComponent,
    PpffCreditoComponent,
    PpffSeguroComponent,
    PpffAhorroComponent,
    BuscarAfiliadoComponent,
    OfertaAfSeguroComponent,
    OfertaAfCreditoComponent,
    OfertaAfBeneficiosComponent,
    OfertaAfAprobprecalComponent,
    OfertaAfAhorroComponent,
    AfiliadoDemograficoComponent,
    OfertaAfSeguroAutoComponent,
    LeadComponent,
    LeadsComponent,
    OutformpensionadosComponent,
    SplitPipe,
    FilterArrayPipe,
    MainEmpresaComponent,
    FormReferidosPensionadosComponent,
    ReferidosAutoListaComponent,
    ReferidosSeguroCarComponent,
    AutoReferidoComponent,
    SimuladorBaseComponent,
    LeadsFichaComponent,
    TruncatePipe,
    ReplacePipe,
    FilterPipe,
    SimuladorExternoComponent,
    AdminRolesComponent,
    CrearUsuarioComponent,
    ModificarUsuarioComponent,
    IdleComponent,
    TicketTerminadosComponent,
    TicketHomeComponent,
    TicketEsperaComponent,
    TicketNuevosComponent,
    TicketChatHomeComponent,
    TicketChatFormComponent,
    TicketChatTalkComponent,
    RegionConfirmedComponent,
    ValoresTotalCovidComponent,
    Home2Component,
    CampaignHomeComponent,
     MiFichaComponent,
    MiFichaEncuestaComponent,
    MiFichaTimelineComponent,
    MiFichaMktgComponent,
    MiFichaProductosComponent,
    MiFichaDemograficoComponent,
    MiFichaOfertasComponent,
    CarteraHomeComponent,
    CarteraGestionComponent,
    CarteraFichaAfiliadoComponent,
    SimuladorCarteraComponent,
    AgePipe,
    FormAutoFullComponent,
    FormMoraComponent,
    CalendarComponent,
    EmailComponent,
    DirectionsMapDirective,
    AdminSimulacionWebComponent,
    CrudCampanaComponent,
    CampanaCelulaComponent,
    CampanaSucursalComponent,
    CreateCampanaComponent,
    UpdateCampanaComponent,
    MainGestionCampanaComponent,
    GestionSocioComponent,
    CreateSocioComponent,
    GestionAgenteComponent,
    DialogOverviewExampleDialog,
    DialogAsignarAgente,
    DialogEmail,
    DialogAsignarAgente,
    CreateAgenteComponent,
    FormLeadComponent,
    LeadsFichaPgComponent,
    DialogLoginExterno,
    GestionTam,
    CreateAgenteComponent,
    LoginExtComponent,
    HomeTamComponent,
    GestionadosTamComponent,
    TarjetaComponent,
    SuccessComponent,
    PendingComponent,
    ErrorComponent,
    MainComponent,
    ConfiguradorOfertaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    ChartModule,
    FormsModule,
    MatSidenavModule,
    ReactiveFormsModule,
    NgxMaterialToolsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    NgIdleKeepaliveModule.forRoot(),
    ScrollingModule,
    HttpClientModule,
    CKEditorModule,
    CalendarModule.forRoot({
provide:DateAdapter,
useFactory: adapterFactory
    }),
    AgmCoreModule.forRoot({
     // apiKey: 'AIzaSyBuebRDmqnoxgKynukBumnmrovAfVx8T9A'
      apiKey: 'AIzaSyAarjPy9Qk9bSEYvwY08o5rA4p_CVzMMSs',
      libraries:["places"]
    }),
    AgmJsMarkerClustererModule,
    MatCheckboxModule,
    AngularDualListBoxModule,
    MatTabsModule,
    NgxMaterialTimepickerModule,
    AngularDualListBoxModule,
    ClickOutsideModule
  ],
  exports:[MatToolbarModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Cl' },
    {provide: HIGHCHARTS_MODULES, useFactory: () => [funnel]},
    AngularFirestore,
    PostgresService,
    AuthService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogOverviewExampleDialog,
    DialogAsignarAgente, 
    DialogEmail, 
    DialogLoginExterno,
  ]
})
export class AppModule { }
