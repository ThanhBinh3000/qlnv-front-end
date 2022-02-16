import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucKyBaoQuanContainer } from './containers';
import { DanhMucKyBaoQuanLazyModule } from './danh-muc-ky-bao-quan-lazy.module';

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
                component: DanhMucKyBaoQuanContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucKyBaoQuanLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucKyBaoQuanRoutingModule {}
