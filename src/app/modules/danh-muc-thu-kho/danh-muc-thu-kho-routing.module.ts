import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucThuKhoContainer } from './containers';
import { DanhMucThuKhoLazyModule } from './danh-muc-thu-kho-lazy.module';

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
                component: DanhMucThuKhoContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucThuKhoLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucThuKhoRoutingModule {}
