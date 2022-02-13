import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucHangDtqgContainer } from './containers/danh-muc-hang-dtqg.container';
import { DanhMucHangDtqgLazyModule } from './danh-muc-hang-dtqg-lazy.module';

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
                component: DanhMucHangDtqgContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucHangDtqgLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucHangDtqgRoutingModule {}
