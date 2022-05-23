import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietNhapTheoPhuongThucDauThauComponent } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import { ThongTinBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan.component';
import { QuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/quan-ly-bang-ke-can-hang.component';
import { ThongTinQuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';
import { QuanLyPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';

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
            {
                path: 'phieu-kiem-tra',
                component: QuanLyPhieuKiemTraChatLuongHangComponent,
            },
            {
                path: 'phieu-kiem-tra/thong-tin/:id',
                component: ThemMoiPhieuKiemTraChatLuongHangComponent,
            },
            {
                path: 'phieu-nhap-kho',
                component: QuanLyPhieuNhapKhoComponent,
            },
            {
                path: 'phieu-nhap-kho/thong-tin/:id',
                component: ThemMoiPhieuNhapKhoComponent,
            },
            {
                path: 'bang-ke-hang',
                component: QuanLyBangKeCanHangComponent,
            },
            {
                path: 'bang-ke-hang/thong-tin/:id',
                component: ThongTinQuanLyBangKeCanHangComponent,
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChiTietNhapTheoPhuongThucDauThauRoutingModule { }
