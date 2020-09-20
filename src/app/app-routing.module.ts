import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard'

import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';

import { CarteraHomeComponent } from './components/mi-cartera/cartera-home/cartera-home.component';
import { FormLeadComponent } from './components/mi-cartera/form-lead/form-lead.component';

import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { SuccessComponent } from './components/tarjeta/success/success.component';
import { PendingComponent } from './components/tarjeta/pending/pending.component';
import { ErrorComponent } from './components/tarjeta/error/error.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MainComponent},
  { path: 'admin-roles', component: AdminRolesComponent, canActivate: [AdminGuard] },
  { path: 'modificar-usuario/:id', component: ModificarUsuarioComponent, canActivate: [AdminGuard], runGuardsAndResolvers: 'always' },
  { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [AdminGuard] },
  { path: 'mi-cartera-home', component: CarteraHomeComponent, canActivate: [AuthGuard] },
  { path: 'tarjeta', component: TarjetaComponent, canActivate: [AuthGuard] },
  { path: 'success', component: SuccessComponent },
  { path: 'pending', component: PendingComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent, canActivate: [AuthGuard] },
  { path: 'form-lead/:id', component: FormLeadComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
  { path: '**', pathMatch: 'full', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
