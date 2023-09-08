import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { KhknBaoQuanComponent } from './khkn-bao-quan.component';
import { QuanLyCongTrinhNghienCuuBaoQuanComponent } from './quan-ly-cong-trinh-nghien-cuu-bao-quan/quan-ly-cong-trinh-nghien-cuu-bao-quan.component';
import { QuanLyQuyChuanKyThuatQuocGiaComponent } from './quan-ly-quy-chuan-ky-thuat-quoc-gia/quan-ly-quy-chuan-ky-thuat-quoc-gia.component';

const routes: Routes = [
    {
        path: '',
        component: KhknBaoQuanComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'quan-ly-cong-trinh-nghien-cuu-bao-quan',
                component: QuanLyCongTrinhNghienCuuBaoQuanComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'quan-ly-quy-chuan-ky-thuat-quoc-gia',
                component: QuanLyQuyChuanKyThuatQuocGiaComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KhknBaoQuanRoutingModule { }
