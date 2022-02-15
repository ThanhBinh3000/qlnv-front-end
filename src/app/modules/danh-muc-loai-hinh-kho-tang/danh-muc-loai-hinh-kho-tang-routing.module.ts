import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucLoaiHinhKhoTangContainer } from './containers';
import { DanhMucLoaiHinhKhoTangLazyModule } from './danh-muc-loai-hinh-kho-tang-lazy.module';

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
                component: DanhMucLoaiHinhKhoTangContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucLoaiHinhKhoTangLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucLoaiHinhKhoTangRoutingModule {}
