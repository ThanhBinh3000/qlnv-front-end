import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucHinhThucBaoQuanContainer } from './containers';
import { DanhMucHinhThucBaoQuanLazyModule } from './danh-muc-hinh-thuc-bao-quan-lazy.module';

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
                component: DanhMucHinhThucBaoQuanContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucHinhThucBaoQuanLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucHinhThucBaoQuanRoutingModule {}
