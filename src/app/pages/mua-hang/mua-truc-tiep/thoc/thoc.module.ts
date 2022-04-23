import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { BienBanKetThucNhapKhoComponent } from './bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho.component';
import { ThongTinBienBanKetThucNhapKhoComponent } from './bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho.component';
import { PhieuKiemNghiemChatLuongHangDTQGComponent } from './phieu-kiem-nghiem-chat-luong-hang-dtqg/phieu-kiem-nghiem-chat-luong-hang-dtqg.component';
import { ThongTinPhieuKiemNghiemChatLuongHangDTQGComponent } from './phieu-kiem-nghiem-chat-luong-hang-dtqg/thong-tin-phieu-kiem-nghiem-chat-luong-hang-dtqg/thong-tin-phieu-kiem-nghiem-chat-luong-hang-dtqg.component';
import { PhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { PhieuNhapDieuChinhComponent } from './phieu-nhap-dieu-chinh/phieu-nhap-dieu-chinh.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { ThongTinPhieuNhapKhoComponent } from './phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThocRoutingModule } from './thoc-routing.module';
import { ThocComponent } from './thoc.component';

@NgModule({
  declarations: [
    ThocComponent,
    PhieuKiemTraChatLuongHangDTQGNhapKhoComponent,
    ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent,
    PhieuNhapKhoComponent,
    ThongTinPhieuNhapKhoComponent,
    BienBanKetThucNhapKhoComponent,
    ThongTinBienBanKetThucNhapKhoComponent,
    PhieuNhapDieuChinhComponent,
    PhieuKiemNghiemChatLuongHangDTQGComponent,
    ThongTinPhieuKiemNghiemChatLuongHangDTQGComponent,
  ],
  imports: [
    CommonModule,
    ThocRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class ThocModule { }