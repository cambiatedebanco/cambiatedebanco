import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { BuscarComponent } from './components/buscar/buscar.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard'

import { BuscarAfiliadoComponent } from './components/buscar-afiliado/buscar-afiliado.component';
import { LeadsComponent } from './components/leads/leads.component';
import { LeadComponent } from './components/lead/lead.component';
import { OutformpensionadosComponent } from './components/outformpensionados/outformpensionados.component';
import { MainEmpresaComponent } from './components/main-empresa/main-empresa.component';
import { FormReferidosPensionadosComponent } from './components/form-referidos-pensionados/form-referidos-pensionados.component';
import { ReferidosAutoListaComponent } from './components/referidos-auto-lista/referidos-auto-lista.component';
import { ReferidosSeguroCarComponent } from './components/referidos-seguro-car/referidos-seguro-car.component';
import { SimuladorBaseComponent } from './components/simulador-base/simulador-base.component';
import { SimuladorExternoComponent } from './components/simulador-externo/simulador-externo.component';
import { LeadsFichaComponent } from './components/leads-ficha/leads-ficha.component';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { TicketHomeComponent } from './components/atencion-virtual/ticket-home/ticket-home.component';
import { TicketChatHomeComponent } from './components/atencion-virtual/ticket-chat-home/ticket-chat-home.component';
import { Home2Component } from './components/home2/home2.component';
import { EncuestaDiferidosComponent } from './components/encuestas/encuesta-diferidos/encuesta-diferidos.component';
import { EncuestaEmpresasComponent } from './components/encuestas/encuesta-empresas/encuesta-empresas.component';
import { QuizBranchComponent } from './components/quiz/quiz-branch/quiz-branch.component';
import { QuizMainComponent } from './components/quiz/quiz-main/quiz-main.component';
import { SurveyComponent } from './components/quiz/survey/survey.component';
import { CampaignHomeComponent } from './components/admin-campaign/campaign-home/campaign-home.component';
import { DesuscribirComponent } from './components/encuestas/desuscribir/desuscribir.component';
import { MiFichaComponent } from './components/mi-cartera/mi-ficha/mi-ficha.component';
import { CarteraHomeComponent } from './components/mi-cartera/cartera-home/cartera-home.component';
import { CarteraGestionComponent } from './components/mi-cartera/cartera-gestion/cartera-gestion.component';
import { CarteraFichaAfiliadoComponent } from './components/mi-cartera/cartera-ficha-afiliado/cartera-ficha-afiliado.component';
import { FormAutoFullComponent } from './components/mi-cartera/form-auto-full/form-auto-full.component';

import { AdminSimulacionWebComponent } from './components/admin-simulacion-web/admin-simulacion-web.component';
import { CrudCampanaComponent } from './components/gestion-campana/crud-campana/crud-campana.component';
import { CampanaCelulaComponent } from './components/gestion-campana/campana-celula/campana-celula.component';
import { CampanaSucursalComponent } from './components/gestion-campana/campana-sucursal/campana-sucursal.component';
import { CreateCampanaComponent } from './components/gestion-campana/crud-campana/create-campana/create-campana.component'
import { UpdateCampanaComponent } from './components/gestion-campana/crud-campana/update-campana/update-campana.component';
import { MainGestionCampanaComponent } from './components/gestion-campana/main-gestion-campana/main-gestion-campana.component';
import { GestionSocioComponent } from './components/gestion-campana/main-gestion-campana/gestion-socio/gestion-socio.component';
import { CreateSocioComponent } from './components/gestion-campana/main-gestion-campana/create-socio/create-socio.component';


import { GestionAgenteComponent } from './components/gestion-campana/main-gestion-campana/gestion-agente/gestion-agente.component';
import { CreateAgenteComponent } from './components/gestion-campana/main-gestion-campana/create-agente/create-agente.component';
import { FormLeadComponent } from './components/mi-cartera/form-lead/form-lead.component';
import { LeadsFichaPgComponent } from './components/leads-ficha-pg/leads-ficha-pg.component';

import { LoginExtComponent } from './components/login-ext/login-ext.component';
import { HomeTamComponent } from './components/home-atm/home-tam.component';
import { GestionTam } from './components/gestion-tam/gestion-tam.component';
import { GestionadosTamComponent } from './components/gestionados-tam/gestionados-tam.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { SuccessComponent } from './components/tarjeta/success/success.component';
import { PendingComponent } from './components/tarjeta/pending/pending.component';
import { ErrorComponent } from './components/tarjeta/error/error.component';
import { MainComponent } from './components/main/main.component';
const routes: Routes = [
  { path: 'simulador', component: SimuladorBaseComponent, canActivate: [AuthGuard] },
  { path: 'simulador_ext', component: SimuladorExternoComponent },
  { path: 'encuesta_diferidos/:idEncuesta/:rutPersona/:idFecha', component: EncuestaDiferidosComponent },
  { path: 'encuesta_empresas/:idEncuesta/:rutEmpresa/:email/:idFecha', component: EncuestaEmpresasComponent },
  { path: 'desuscribir/:email', component: DesuscribirComponent },
  { path: 'quiz_branch', component: QuizBranchComponent },
  { path: 'quiz_main', component: QuizMainComponent },
  { path: 'quiz_survey', component: SurveyComponent },
  { path: 'simulacion_web', component: AdminSimulacionWebComponent, canActivate: [AuthGuard] },
  { path: 'empresa/:id', component: EmpresaComponent, canActivate: [AuthGuard] },
  { path: 'empresas', component: EmpresasComponent, canActivate: [AuthGuard] },
  { path: 'main-empresa', component: MainEmpresaComponent, canActivate: [AuthGuard] },
  { path: 'referidos-pensionados', component: FormReferidosPensionadosComponent, canActivate: [AuthGuard] },
  { path: 'referidos-auto-lista', component: ReferidosAutoListaComponent, canActivate: [AuthGuard] },
  { path: 'referidos-seguro-auto', component: ReferidosSeguroCarComponent, canActivate: [AuthGuard] },
  { path: 'pensionados', component: OutformpensionadosComponent },
  { path: 'lead/:id', component: LeadComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path: 'leads', component: LeadsComponent, canActivate: [AuthGuard] },
  { path: 'leads-ficha', component: LeadsFichaComponent, canActivate: [AuthGuard] },
  { path: 'leads-ficha-pg', component: LeadsFichaPgComponent, canActivate: [AuthGuard] },
  { path: 'home2', component: Home2Component, canActivate: [AuthGuard] },
  { path: 'buscar/:id', component: BuscarComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path: 'buscar_afiliado/:id', component: BuscarAfiliadoComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path: 'login', component: LoginComponent },
  { path: '', component:MainComponent},
  { path: 'login-externo', component: LoginExtComponent },
  { path: 'admin-roles', component: AdminRolesComponent, canActivate: [AdminGuard] },
  { path: 'modificar-usuario/:id', component: ModificarUsuarioComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always' },
  { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [AdminGuard] },
  { path: 'ticket-home', component: TicketHomeComponent, canActivate: [AuthGuard] },
  { path: 'mi-ficha/:id', component: MiFichaComponent, canActivate: [AuthGuard] },
  { path: 'cartera-ficha-afiliado/:id', component: CarteraFichaAfiliadoComponent, canActivate: [AuthGuard] },
  { path: 'mi-cartera-home', component: CarteraHomeComponent, canActivate: [AuthGuard] },
  { path: 'cartera-gestion/:id', component: CarteraGestionComponent, canActivate: [AuthGuard] },
  { path: 'form-auto-full/:id', component: FormAutoFullComponent, canActivate: [AuthGuard] },
  { path: 'campana-celula', component: CampanaCelulaComponent, canActivate: [AuthGuard] },
  { path: 'campana-sucursal', component: CampanaSucursalComponent, canActivate: [AuthGuard] },
  { path: 'crud-campana', component: CrudCampanaComponent, canActivate: [AuthGuard] },
  { path: 'create-campana', component: CreateCampanaComponent, canActivate: [AuthGuard] },
  { path: 'update-campana', component: UpdateCampanaComponent, canActivate: [AuthGuard] },
  { path: 'home-tam', component: HomeTamComponent, canActivate: [AuthGuard] },
  { path: 'tarjeta', component: TarjetaComponent, canActivate: [AuthGuard] },
  { path: 'success', component: SuccessComponent, canActivate: [AuthGuard] },
  { path: 'pending', component: PendingComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent, canActivate: [AuthGuard] },
  { path: 'gestion-tam/:id', component: GestionTam, canActivate: [AuthGuard] },
  { path: 'gestionados-tam', component: GestionadosTamComponent, canActivate: [AuthGuard] },
  {
    path: 'main-gestion-campana', component: MainGestionCampanaComponent, canActivate: [AuthGuard],
    children: [{
      path: 'gestion-socio', component: GestionSocioComponent, canActivate: [AuthGuard],
    },
    {
      path: 'gestion-agente', component: GestionAgenteComponent, canActivate: [AuthGuard]
    }
    ]
  },
  {
    path: 'create-socio', component: CreateSocioComponent, canActivate: [AuthGuard],
  },
  {
    path: 'create-agente', component: CreateAgenteComponent, canActivate: [AuthGuard],
  },
  {
    path: 'ticket-chat-home/:idDoc/:rutEjec/:rutCli/:nomEjec/:nomCli/:fAct/:fCrea',
    component: TicketChatHomeComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { path: 'campaign-home/:id', component: CampaignHomeComponent, canActivate: [AuthGuard] },
  { path: 'form-lead/:id', component: FormLeadComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path: '**', pathMatch: 'full', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
