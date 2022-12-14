import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {QdPheDuyetQuyetToanBtcComponent} from './qd-phe-duyet-quyet-toan-btc.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    QdPheDuyetQuyetToanBtcComponent,
  ],
  exports: [
    QdPheDuyetQuyetToanBtcComponent,
  ]
})
export class QdPheDuyetQuyetToanBtcModule {
}
