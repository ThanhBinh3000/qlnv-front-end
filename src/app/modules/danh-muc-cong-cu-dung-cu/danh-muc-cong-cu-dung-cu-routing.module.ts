import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucCongCuDungCuContainer } from './containers';
import { DanhMucCongCuDungCuLazyModule } from './danh-muc-cong-cu-dung-cu-lazy.module';

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
                component: DanhMucCongCuDungCuContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucCongCuDungCuLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucCongCuDungCuRoutingModule {}
