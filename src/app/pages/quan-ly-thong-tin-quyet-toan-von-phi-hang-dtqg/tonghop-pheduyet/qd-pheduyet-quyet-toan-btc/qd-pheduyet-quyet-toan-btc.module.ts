import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import {QdPheduyetQuyetToanBtcComponent} from "./qd-pheduyet-quyet-toan-btc.component";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    QdPheduyetQuyetToanBtcComponent,
  ],
  exports: [
    QdPheduyetQuyetToanBtcComponent,
  ]
})
export class QdPheduyetQuyetToanBtcModule { }
