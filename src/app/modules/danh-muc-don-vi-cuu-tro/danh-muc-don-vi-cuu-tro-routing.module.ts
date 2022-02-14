import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucDonViCuuTroContainer } from './containers';
import { DanhMucDonViCuuTroLazyModule } from './danh-muc-don-vi-cuu-tro-lazy.module';

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
                component: DanhMucDonViCuuTroContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucDonViCuuTroLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucDonViCuuTroRoutingModule {}
