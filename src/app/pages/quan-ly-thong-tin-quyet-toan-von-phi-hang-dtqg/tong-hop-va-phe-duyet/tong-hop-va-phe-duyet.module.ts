import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {TongHopVaPheDuyetRoutingModule} from './tong-hop-va-phe-duyet-routing.module';
import {TongHopVaPheDuyetComponent} from './tong-hop-va-phe-duyet.component';
import {DuLieuTongHopTcdtModule} from "./du-lieu-tong-hop-tcdt/du-lieu-tong-hop-tcdt.module";
import {QdPheDuyetQuyetToanBtcModule} from "./qd-phe-duyet-quyet-toan-btc/qd-phe-duyet-quyet-toan-btc.module";

@NgModule({
  declarations: [
    TongHopVaPheDuyetComponent,
  ],
  imports: [
    CommonModule,
    TongHopVaPheDuyetRoutingModule,
    ComponentsModule,
    DirectivesModule,
    DuLieuTongHopTcdtModule,
    QdPheDuyetQuyetToanBtcModule
  ],
})
export class TongHopVaPheDuyetModule {
}
