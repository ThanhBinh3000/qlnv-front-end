import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
// import { CanDeactivateFormGuard } from '../shared/guards';
import { QuanLyNguoiDungContainer } from './containers';
import { QuanLyNguoiDungLazyModule } from './quan-ly-nguoi-dung-lazy.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        // canDeactivate: [CanDeactivateFormGuard],
        data: {
            pageTitle: 'Maintaining Nurse Accounts',
        },
        children: [
            {
                path: '',
                component: QuanLyNguoiDungContainer,
            },
        ],
    },
];

@NgModule({
    imports: [QuanLyNguoiDungLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuanLyNguoiDungRoutingModule {}
