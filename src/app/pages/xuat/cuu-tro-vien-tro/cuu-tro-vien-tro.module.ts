import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CuuTroVienTroRoutingModule } from './cuu-tro-vien-tro-routing.module';
import { CuuTroVienTroComponent } from './cuu-tro-vien-tro.component';
import { TongHopPhuongAnModule } from './tong-hop-phuong-an/tong-hop-phuong-an.module';
import { XayDungPhuongAnModule } from './xay-dung-phuong-an/xay-dung-phuong-an.module';
import { QuyetDinhPheDuyetPhuongAnModule } from "./quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.module";
import { QuyetDinhGnvXuatHangModule } from "./quyet-dinh-gnv-xuat-hang/quyet-dinh-gnv-xuat-hang.module";
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { KiemTraChatLuongModule } from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { XuatKhoModule } from './xuat-kho/xuat-kho.module';

@NgModule({
  declarations: [
    CuuTroVienTroComponent,
    KiemTraChatLuongComponent,
    XuatKhoComponent,


  ],
  imports: [
    CommonModule,
    CuuTroVienTroRoutingModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhPheDuyetPhuongAnModule,
    TongHopPhuongAnModule,
    XayDungPhuongAnModule,
    QuyetDinhGnvXuatHangModule,
    KiemTraChatLuongModule,
    XuatKhoModule
  ],
})
export class CuuTroVienTroModule {
}
