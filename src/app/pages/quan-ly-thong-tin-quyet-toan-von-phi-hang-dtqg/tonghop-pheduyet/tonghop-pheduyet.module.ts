import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DuLieuTongHopTcdtComponent} from "./du-lieu-tong-hop-tcdt/du-lieu-tong-hop-tcdt.component";
import {QdPheduyetQuyetToanBtcComponent} from "./qd-pheduyet-quyet-toan-btc/qd-pheduyet-quyet-toan-btc.component";




@NgModule({
  declarations: [
    DuLieuTongHopTcdtComponent,
    QdPheduyetQuyetToanBtcComponent
  ],
  exports: [
    DuLieuTongHopTcdtComponent,
    QdPheduyetQuyetToanBtcComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TonghopPheduyetModule { }
