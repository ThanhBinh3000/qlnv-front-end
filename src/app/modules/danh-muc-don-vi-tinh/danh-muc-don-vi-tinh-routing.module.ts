import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucDonViTinhContainer } from './containers';
import { DanhMucDonViTinhLazyModule } from './danh-muc-don-vi-tinh-lazy.module';

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
                component: DanhMucDonViTinhContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucDonViTinhLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucDonViTinhRoutingModule {}
