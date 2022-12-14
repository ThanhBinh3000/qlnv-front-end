import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {TongHopVaPheDuyetRoutingModule} from './tong-hop-va-phe-duyet-routing.module';
import {TongHopVaPheDuyetComponent} from './tong-hop-va-phe-duyet.component';
import {DuLieuTongHopTcdtModule} from "./du-lieu-tong-hop-tcdt/du-lieu-tong-hop-tcdt.module";
import {QdPheDuyetQuyetToanBtcModule} from "./qd-phe-duyet-quyet-toan-btc/qd-phe-duyet-quyet-toan-btc.module";
// import {DeNghiCapPhiBoNganhModule} from "./de-nghi-cap-phi-bo-nganh/de-nghi-cap-phi-bo-nganh.module";
// import {ThongTriDuyetYDuToanModule} from './thong-tri-duyet-y-du-toan/thong-tri-duyet-y-du-toan.module';
// import {TongHopTheoDoiCapVonModule} from './tong-hop-theo-doi-cap-von/tong-hop-theo-doi-cap-von.module';
// import {TongHopModule} from "./tong-hop/tonghop.module";

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
export class CapPhiChiModule {
}
