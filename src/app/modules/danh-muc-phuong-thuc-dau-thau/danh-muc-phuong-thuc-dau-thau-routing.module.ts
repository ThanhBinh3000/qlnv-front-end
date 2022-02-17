import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucPhuongThucDauThauContainer } from './containers';
import { DanhMucPhuongThucDauThauLazyModule } from './danh-muc-phuong-thuc-dau-thau-lazy.module';

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
                component: DanhMucPhuongThucDauThauContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucPhuongThucDauThauLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucPhuongThucDauThauRoutingModule {}
