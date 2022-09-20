import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapPhiChiRoutingModule } from './cap-phi-chi-routing.module';
import { CapPhiChiComponent } from './cap-phi-chi.component';
import { DeNghiCapPhiBoNganhModule } from "./de-nghi-cap-phi-bo-nganh/de-nghi-cap-phi-bo-nganh.module";
import { TongHopModule } from "./tong-hop/tonghop.module";
import { TongHopTheoDoiCapVonModule } from './tong-hop-theo-doi-cap-von/tong-hop-theo-doi-cap-von.module';
import { ThongTriDuyetYDuToanModule } from './thong-tri-duyet-y-du-toan/thong-tri-duyet-y-du-toan.module';
@NgModule({
    declarations: [
        CapPhiChiComponent,
    ],
    imports: [
        CommonModule,
        CapPhiChiRoutingModule,
        ComponentsModule,
        DirectivesModule,
        DeNghiCapPhiBoNganhModule,
        TongHopModule,
        TongHopTheoDoiCapVonModule,
        ThongTriDuyetYDuToanModule
    ],
})
export class CapPhiChiModule { }
