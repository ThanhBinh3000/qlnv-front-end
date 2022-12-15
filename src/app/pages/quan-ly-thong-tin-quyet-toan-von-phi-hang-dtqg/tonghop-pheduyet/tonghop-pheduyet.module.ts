import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TonghopPheduyetComponent} from "./tonghop-pheduyet.component";
import {DuLieuTongHopTcdtModule} from "./du-lieu-tong-hop-tcdt/du-lieu-tong-hop-tcdt.module";
import {QdPheduyetQuyetToanBtcModule} from "./qd-pheduyet-quyet-toan-btc/qd-pheduyet-quyet-toan-btc.module";
import {ComponentsModule} from "../../../components/components.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {TonghopPheduyetRoutingModule} from "./tonghop-pheduyet-routing.module";


@NgModule({
  declarations: [
    TonghopPheduyetComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    DuLieuTongHopTcdtModule,
    QdPheduyetQuyetToanBtcModule,
    TonghopPheduyetRoutingModule
  ]
})
export class TonghopPheduyetModule {
}
