import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucLoaiHinhNhapXuatContainer } from './containers';
import { DanhMucLoaiHinhNhapXuatLazyModule } from './danh-muc-Loai-hinh-nhap-xuat-lazy.module';

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
                component: DanhMucLoaiHinhNhapXuatContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucLoaiHinhNhapXuatLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucLoaiHinhNhapXuatRoutingModule {}
