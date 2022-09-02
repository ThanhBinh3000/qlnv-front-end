import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DinhMucComponent } from './dinh-muc.component';

const routes: Routes = [
    {
        path: '',
        component: DinhMucComponent,
        children: [
            {
                path: '',
                redirectTo: 'dinh-muc-phi-bao-quan',
                pathMatch: 'full'
            },
            {
                path: 'dinh-muc-phi-bao-quan',
                loadChildren: () =>
                    import(
                        '../dinh-muc/dinh-muc-phi-bao-quan/dinh-muc-phi-bao-quan.module'
                    ).then((m) => m.DinhMucPhiBaoQuanModule),
            },
            {
                path: 'dinh-muc-trang-bi-cong-cu',
                loadChildren: () =>
                    import(
                        '../dinh-muc/dinh-muc-trang-bi-cong-cu/dinh-muc-trang-bi-cong-cu.module'
                    ).then((m) => m.DinhMucTrangBiCongCuModule),
            },
            {
                path: 'mang-pvc-cong-cu-dung-cu',
                loadChildren: () =>
                    import(
                        '../dinh-muc/mang-pvc-cong-cu-dung-cu/mang-pvc-cong-cu-dung-cu.module'
                    ).then((m) => m.MangPvcCongCuDungCuModule),
            },
            {
                path: 'may-moc-thiet-bi',
                loadChildren: () =>
                    import(
                        '../dinh-muc/may-moc-thiet-bi/may-moc-thiet-bi.module'
                    ).then((m) => m.MayMocThietBiModule),
            },
            {
                path: 'bao-hiem',
                loadChildren: () =>
                    import(
                        '../dinh-muc/bao-hiem/bao-hiem.module'
                    ).then((m) => m.BaoHiemModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DinhMucRoutingModule { }
