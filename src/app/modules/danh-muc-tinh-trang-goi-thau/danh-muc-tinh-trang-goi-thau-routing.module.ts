import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucTinhTrangGoiThauContainer } from './containers';
import { DanhMucTinhTrangGoiThauLazyModule } from './danh-muc-tinh-trang-goi-thau-lazy.module';

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
                component: DanhMucTinhTrangGoiThauContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucTinhTrangGoiThauLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucTinhTrangGoiThauRoutingModule {}
