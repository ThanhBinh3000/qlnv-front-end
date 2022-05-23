import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietNhapTheoPhuongThucDauThauComponent } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import { ThongTinBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan.component';

const routes: Routes = [
    {
        path: '',
        component: ChiTietNhapTheoPhuongThucDauThauComponent,
        children: [
            {
                path: 'danh-sach',
                redirectTo: '',
                pathMatch: 'full',
            },
            {
                path: '',
                component: ChiTietNhapTheoPhuongThucDauThauComponent,
            },
            {
                path: 'bien-ban',
                component: LapBienBanNghiemThuBaoQuanComponent,
            },
            {
                path: 'bien-ban/thong-tin/:id',
                component: ThongTinBienBanNghiemThuBaoQuanComponent,
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChiTietNhapTheoPhuongThucDauThauRoutingModule { }
