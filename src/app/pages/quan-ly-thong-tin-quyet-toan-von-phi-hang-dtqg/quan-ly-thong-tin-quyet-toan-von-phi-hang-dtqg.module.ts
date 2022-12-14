import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { QuanLyThongTinQuyetToanVonPhiHangDtqgComponent } from './quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.component';
import { QuanLyThongTinQuyetToanVonPhiHangDtqgRoutingModule } from './quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg-routing.module';
import { TonghopPheduyetComponent } from './tonghop-pheduyet/tonghop-pheduyet.component';
import { DuLieuTongHopTcdtComponent } from './tonghop-pheduyet/du-lieu-tong-hop-tcdt/du-lieu-tong-hop-tcdt.component';
import { QdPdQuyetToanBtcComponent } from './tonghop-pheduyet/qd-pd-quyet-toan-btc/qd-pd-quyet-toan-btc.component';
@NgModule({
  declarations: [QuanLyThongTinQuyetToanVonPhiHangDtqgComponent, TonghopPheduyetComponent, DuLieuTongHopTcdtComponent, QdPdQuyetToanBtcComponent],
  imports: [
    CommonModule,
    QuanLyThongTinQuyetToanVonPhiHangDtqgRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
  ],
})
export class QuanLyThongTinQuyetToanVonPhiHangDtqgModule {}
