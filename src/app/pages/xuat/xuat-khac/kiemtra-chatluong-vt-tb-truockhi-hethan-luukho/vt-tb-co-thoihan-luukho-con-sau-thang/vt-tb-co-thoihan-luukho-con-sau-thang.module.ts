import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToanBoDanhSachComponent } from './toan-bo-danh-sach/toan-bo-danh-sach.component';
import { TongHopDanhSachComponent } from './tong-hop-danh-sach/tong-hop-danh-sach.component';
import { QuyetDinhGiaoNhiemVuXuatHangComponent } from './quyet-dinh-giao-nhiem-vu-xuat-hang/quyet-dinh-giao-nhiem-vu-xuat-hang.component';
import { QuyetDinhXuatGiamVatTuComponent } from './quyet-dinh-xuat-giam-vat-tu/quyet-dinh-xuat-giam-vat-tu.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { NhapKhoComponent } from './nhap-kho/nhap-kho.component';



@NgModule({
  declarations: [
    ToanBoDanhSachComponent,
    TongHopDanhSachComponent,
    QuyetDinhGiaoNhiemVuXuatHangComponent,
    QuyetDinhXuatGiamVatTuComponent,
    KiemTraChatLuongComponent,
    XuatKhoComponent,
    NhapKhoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VtTbCoThoihanLuukhoConSauThangModule { }
