import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { QuanLyThongTinQuyetToanVonPhiHangDtqgComponent } from './quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.component';
import { QuanLyThongTinQuyetToanVonPhiHangDtqgRoutingModule } from './quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg-routing.module';
@NgModule({
  declarations: [QuanLyThongTinQuyetToanVonPhiHangDtqgComponent],
  imports: [
    CommonModule,
    QuanLyThongTinQuyetToanVonPhiHangDtqgRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule
  ],
})
export class QuanLyThongTinQuyetToanVonPhiHangDtqgModule {}
