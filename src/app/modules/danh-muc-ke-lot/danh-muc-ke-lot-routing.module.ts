import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { DanhMucKeLotContainer } from './containers';
import { DanhMucKeLotLazyModule } from './danh-muc-ke-lot-lazy.module';

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
                component: DanhMucKeLotContainer,
            },
        ],
    },
];

@NgModule({
    imports: [DanhMucKeLotLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucKeLotRoutingModule {}
