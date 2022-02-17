import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucDiaBanHanhChinhContainer } from './containers';
import { DanhMucPhuongXaContainer } from './containers/danh-muc-phuong-xa.container';
import { DanhMucQuanHuyenContainer } from './containers/danh-muc-quan-huyen.container';
import { DanhMucDiaBanHanhChinhLazyModule } from './danh-muc-dia-ban-hanh-chinh-lazy.module';

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
                component: DanhMucDiaBanHanhChinhContainer,
            },
            {
                path: 'dmuc-quan-huyen/:id',
                component: DanhMucQuanHuyenContainer,
            },
            {
                path: 'dmuc-quan-huyen/:id/dmuc-phuong-xa/:id',
                component: DanhMucPhuongXaContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucDiaBanHanhChinhLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucDiaBanHanhChinhRoutingModule {}
