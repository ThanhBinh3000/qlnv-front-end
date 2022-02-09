import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AuthGuard } from './modules/auth';
import { BlankLayoutComponent, MasterLayoutComponent } from './modules/shared/layouts';

const routes: Routes = [
    {
        path: '',
        component: MasterLayoutComponent,
        loadChildren: () => import('./modules/landing-page/landing-page.module').then(m => m.LandingPageModule),
    },
    {
        path: 'login',
        component: BlankLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.AuthRoutingModule),
    },
    {
        path: 'reset-password',
        loadChildren: () =>
            import('./modules/reset-password/reset-password-routing.module').then(m => m.ResetPasswordRoutingModule),
    },
    {
        path: 'Dashboard',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule),
    },
    {
        path: 'Employee',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/employee/employee-routing.module').then(m => m.EmployeeRoutingModule),
    },
    {
        path: 'Settings',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/user-settings/user-settings-routing.module').then(m => m.UserSettingsRoutingModule),
    },
    {
        path: 'quan-ly-nguoi-dung',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/quan-ly-nguoi-dung/quan-ly-nguoi-dung-routing.module').then(m => m.QuanLyNguoiDungRoutingModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: QuicklinkStrategy,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
