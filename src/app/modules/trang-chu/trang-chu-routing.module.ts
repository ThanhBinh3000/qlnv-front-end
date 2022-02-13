import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
import { TrangChuContainer } from './containers';
import { TrangChuLazyModule } from './trang-chu-lazy.module';

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
                component: TrangChuContainer,
            },
        ],
    },
];

@NgModule({
    imports: [TrangChuLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrangChuRoutingModule {}
