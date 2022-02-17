import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucLoaiHinhBaoQuanContainer } from './containers';
import { DanhMucLoaiHinhBaoQuanLazyModule } from './danh-muc-loai-hinh-bao-quan-lazy.module';

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
                component: DanhMucLoaiHinhBaoQuanContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucLoaiHinhBaoQuanLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucLoaiHinhBaoQuanRoutingModule {}
