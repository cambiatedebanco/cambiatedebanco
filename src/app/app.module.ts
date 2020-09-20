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
import { AgmCoreModule } from '@agm/core';
import {MatSelectModule} from '@angular/material/select';

import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { MatStepperModule } from '@angular/material/stepper';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { LeftBarComponent } from './components/left-bar/left-bar.component';
// Dialog
import { registerLocaleData } from '@angular/common';

  // importar locales
import localesEsCl from '@angular/common/locales/es-CL';
import { SplitPipe } from './pipe/split.pipe';
import { FilterArrayPipe } from './pipe/filterArray.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { ReplacePipe } from './pipe/replace.pipe';
import { FilterPipe } from './pipe/filter.pipe';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { IdleComponent } from './components/idle/idle.component';
import { PostgresService } from './services/postgres/postgres.service';

import { CarteraHomeComponent } from './components/mi-cartera/cartera-home/cartera-home.component';

import { AgePipe } from './pipe/age.pipe';
import { CalendarComponent } from './components/calendar/calendar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { EmailComponent } from './components/email/email.component';
import { DirectionsMapDirective } from './directives/directions-map.directive';
import { FormLeadComponent } from './components/mi-cartera/form-lead/form-lead.component';
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
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    LeftBarComponent,
    SplitPipe,
    FilterArrayPipe,
    TruncatePipe,
    ReplacePipe,
    FilterPipe,
    AdminRolesComponent,
    CrearUsuarioComponent,
    ModificarUsuarioComponent,
    IdleComponent,
    CarteraHomeComponent,
    AgePipe,
    CalendarComponent,
    EmailComponent,
    DirectionsMapDirective,
    FormLeadComponent,
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

  ]
})
export class AppModule { }
