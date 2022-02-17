import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucPhuongThucBaoQuanContainer } from './containers';
import { DanhMucPhuongThucBaoQuanLazyModule } from './danh-muc-phuong-thuc-bao-quan-lazy.module';

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
                component: DanhMucPhuongThucBaoQuanContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucPhuongThucBaoQuanLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucPhuongThucBaoQuanRoutingModule {}
