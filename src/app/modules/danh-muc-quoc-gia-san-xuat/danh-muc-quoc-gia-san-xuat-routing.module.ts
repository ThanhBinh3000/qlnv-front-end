import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucQuocGiaSanXuatContainer } from './containers';
import { DanhMucQuocGiaSanXuatLazyModule } from './danh-muc-quoc-gia-san-xuat-lazy.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        data: {
            pageTitle: 'Maintaining Nurse Accounts',
        },
        children: [
            {
                path: '',
                component: DanhMucQuocGiaSanXuatContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucQuocGiaSanXuatLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucQuocGiaSanXuatRoutingModule {}
