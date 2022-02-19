import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucDonViLienQuanContainer } from './containers';
import { DanhMucDonViLienQuanLazyModule } from './danh-muc-don-vi-lien-quan-lazy.module';

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
                component: DanhMucDonViLienQuanContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucDonViLienQuanLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucDonViLienQuanRoutingModule {}
