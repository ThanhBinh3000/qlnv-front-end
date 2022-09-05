import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KhknBaoQuanComponent } from './khkn-bao-quan.component';
import { QuanLyCongTrinhNghienCuuBaoQuanComponent } from './quan-ly-cong-trinh-nghien-cuu-bao-quan/quan-ly-cong-trinh-nghien-cuu-bao-quan.component';
import { QuanLyQuyChuanKyThuatQuocGiaComponent } from './quan-ly-quy-chuan-ky-thuat-quoc-gia/quan-ly-quy-chuan-ky-thuat-quoc-gia.component';

const routes: Routes = [
    {
        path: '',
        component: KhknBaoQuanComponent,
        children: [
            {
                path: '',
                redirectTo: 'quan-ly-cong-trinh-nghien-cuu-bao-quan',
                pathMatch: 'full'
            },
            {
                path: 'quan-ly-cong-trinh-nghien-cuu-bao-quan',
                component: QuanLyCongTrinhNghienCuuBaoQuanComponent
            },
            {
                path: 'quan-ly-quy-chuan-ky-thuat-quoc-gia',
                component: QuanLyQuyChuanKyThuatQuocGiaComponent
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KhknBaoQuanRoutingModule { }
