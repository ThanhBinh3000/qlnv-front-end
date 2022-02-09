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
        path: 'quan-ly-nguoi-dung',
        component: MasterLayoutComponent,
        // canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/quan-ly-nguoi-dung/quan-ly-nguoi-dung-routing.module').then(m => m.QuanLyNguoiDungRoutingModule),
    },
    {
        path: 'danh-muc-don-vi',
        component: MasterLayoutComponent,
        // canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/danh-muc-don-vi/danh-muc-don-vi-routing.module').then(m => m.DanhMucDonViRoutingModule),
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
