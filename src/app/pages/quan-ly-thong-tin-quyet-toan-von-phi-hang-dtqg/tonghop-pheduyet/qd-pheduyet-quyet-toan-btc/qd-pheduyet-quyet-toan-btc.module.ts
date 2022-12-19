import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import {QdPheduyetQuyetToanBtcComponent} from "./qd-pheduyet-quyet-toan-btc.component";
import { ThongTinQdPheduyetQuyetToanBtcComponent } from './thong-tin-qd-pheduyet-quyet-toan-btc/thong-tin-qd-pheduyet-quyet-toan-btc.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    QdPheduyetQuyetToanBtcComponent,
    ThongTinQdPheduyetQuyetToanBtcComponent,
  ],
  exports: [
    QdPheduyetQuyetToanBtcComponent,
  ]
})
export class QdPheduyetQuyetToanBtcModule { }
