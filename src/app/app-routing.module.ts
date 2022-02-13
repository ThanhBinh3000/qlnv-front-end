import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AuthGuard } from './modules/auth';
import { BlankLayoutComponent, MasterLayoutComponent } from './modules/shared/layouts';

const routes: Routes = [
    {
        path: '',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
        import('./modules/trang-chu/trang-chu-routing.module').then(m => m.TrangChuRoutingModule),
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
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/quan-ly-nguoi-dung/quan-ly-nguoi-dung-routing.module').then(m => m.QuanLyNguoiDungRoutingModule),
    },
    {
        path: 'dmuc-donvi',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/danh-muc-don-vi/danh-muc-don-vi-routing.module').then(m => m.DanhMucDonViRoutingModule),
    },
    {
        path: 'dmuc-dvi-tinh',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/danh-muc-don-vi-tinh/danh-muc-don-vi-tinh-routing.module').then(m => m.DanhMucDonViTinhRoutingModule),
    },
    {
        path: 'trang-chu',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/trang-chu/trang-chu-routing.module').then(m => m.TrangChuRoutingModule),
    },
    {
        path: 'dmuc-hang', 
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/danh-muc-hang-dtqg/danh-muc-hang-dtqg-routing.module').then(m => m.DanhMucHangDtqgRoutingModule),
    },
    {
        path: 'dmuc-cong-cu',
        component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/danh-muc-cong-cu-dung-cu/danh-muc-cong-cu-dung-cu-routing.module').then(m => m.DanhMucCongCuDungCuRoutingModule),
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
