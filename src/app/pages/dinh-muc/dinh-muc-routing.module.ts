import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { DinhMucPhiBaoQuanComponent } from './dinh-muc-phi-bao-quan/dinh-muc-phi-bao-quan.component';
import { DinhMucComponent } from './dinh-muc.component';

const routes: Routes = [
    {
        path: '',
        component: DinhMucComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dinh-muc-phi-bao-quan',
                pathMatch: 'full'
            },
            {
                path: 'dinh-muc-phi-bao-quan',
                component: DinhMucPhiBaoQuanComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'dinh-muc-trang-bi-cong-cu',
                loadChildren: () =>
                    import(
                        '../dinh-muc/dinh-muc-trang-bi-cong-cu/dinh-muc-trang-bi-cong-cu.module'
                    ).then((m) => m.DinhMucTrangBiCongCuModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'mang-pvc-cong-cu-dung-cu',
                loadChildren: () =>
                    import(
                        '../dinh-muc/mang-pvc-cong-cu-dung-cu/mang-pvc-cong-cu-dung-cu.module'
                    ).then((m) => m.MangPvcCongCuDungCuModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'may-moc-thiet-bi',
                loadChildren: () =>
                    import(
                        '../dinh-muc/may-moc-thiet-bi/may-moc-thiet-bi.module'
                    ).then((m) => m.MayMocThietBiModule),
                canActivate: [AuthGuard],
            },
            {
                path: 'bao-hiem',
                loadChildren: () =>
                    import(
                        '../dinh-muc/bao-hiem/bao-hiem.module'
                    ).then((m) => m.BaoHiemModule),
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DinhMucRoutingModule { }
