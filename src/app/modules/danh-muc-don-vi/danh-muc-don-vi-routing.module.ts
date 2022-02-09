import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucDonViContainer } from './containers';
import { DanhMucDonViLazyModule } from './danh-muc-don-vi-lazy.module';

const routes: Routes = [
    {
        path: '',
        // canActivate: [AuthGuard],
        data: {
            pageTitle: 'Maintaining Nurse Accounts',
        },
        children: [
            {
                path: '',
                component: DanhMucDonViContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucDonViLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucDonViRoutingModule {}
