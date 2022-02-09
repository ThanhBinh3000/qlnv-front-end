import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
// import { CanDeactivateFormGuard } from '../shared/guards';
import { QuanLyDanhMucHangDTQGContainer } from './containers';
import { QuanLyDanhMucHangDTQGLazyModule } from './quan-ly-danh-muc-hang-dtqg-lazy.module';

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
                component: QuanLyDanhMucHangDTQGContainer,
            },
        ],
    },
];

@NgModule({
    imports: [QuanLyDanhMucHangDTQGLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuanLyDanhMucHangDTQGRoutingModule {}
