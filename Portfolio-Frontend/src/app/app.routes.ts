// RouterComponent
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home-section/home-section.component';
import { ContactComponent } from './features/contact/contact.component';
import { PortfolioShowcaseComponent } from './features/portfolio/portfolio-showcase/portfolio-showcase.component';

export const routes: Routes = [
  { path: 'admin/login', loadComponent: () => import('./features/admin/admin-login.component').then((m) => m.AdminLoginComponent), data: { robots: 'noindex,nofollow' } },
  { path: 'admin', canActivate: [() => import('./core/auth/admin.guard').then((m) => m.adminGuard)], loadComponent: () => import('./features/admin/admin-console.component').then((m) => m.AdminConsoleComponent), data: { robots: 'noindex,nofollow' } },
  { path: '', component: HomeComponent },
  { path: 'portfolio', component: PortfolioShowcaseComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
