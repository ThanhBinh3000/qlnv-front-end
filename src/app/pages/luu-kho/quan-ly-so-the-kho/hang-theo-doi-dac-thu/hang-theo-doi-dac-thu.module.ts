import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangDtqgHetHanBaoHanhModule } from './hang-dtqg-het-han-bao-hanh/hang-dtqg-het-han-bao-hanh.module';
import { HangHongCanBaoHanhModule } from './hang-hong-can-bao-hanh/hang-hong-can-bao-hanh.module';
import { HangHongHocGiamChatLuongModule } from './hang-hong-hoc-giam-chat-luong/hang-hong-hoc-giam-chat-luong.module';
import { HangSapHetHanBaoHanhModule } from './hang-sap-het-han-bao-hanh/hang-sap-het-han-bao-hanh.module';
import { HangSapHetHanLuuKhoModule } from './hang-sap-het-han-luu-kho/hang-sap-het-han-luu-kho.module';
import { HangTheoDoiDacThuRoutingModule } from './hang-theo-doi-dac-thu-routing.module';
import { HangTheoDoiDacThuComponent } from './hang-theo-doi-dac-thu.component';
import { HangThuocDienThanhLyModule } from './hang-thuoc-dien-thanh-ly/hang-thuoc-dien-thanh-ly.module';
import { HangThuocDienTieuHuyModule } from './hang-thuoc-dien-tieu-huy/hang-thuoc-dien-tieu-huy.module';

@NgModule({
  declarations: [HangTheoDoiDacThuComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    HangTheoDoiDacThuRoutingModule,
    HangThuocDienThanhLyModule,
    HangThuocDienTieuHuyModule,
    HangSapHetHanLuuKhoModule,
    HangSapHetHanBaoHanhModule,
    HangHongHocGiamChatLuongModule,
    HangHongCanBaoHanhModule,
    HangDtqgHetHanBaoHanhModule,
  ],
  exports: [HangTheoDoiDacThuComponent],
})
export class HangTheoDoiDacThuModule {}
