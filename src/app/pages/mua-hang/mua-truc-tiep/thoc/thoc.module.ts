import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { PhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
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
  ],
  imports: [
    CommonModule,
    ThocRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class ThocModule { }