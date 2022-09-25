import { ThongTriDuyetYDuToanModule } from './thong-tri-duyet-y-du-toan/thong-tri-duyet-y-du-toan.module';
import { DeNghiCapVonBoNganhModule } from './de-nghi-cap-von-bo-nganh/de-nghi-cap-von-bo-nganh.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapVonChiRoutingModule } from './cap-von-chi-routing.module';
import { CapVonChiComponent } from './cap-von-chi.component';
import { TongHopModule } from './tong-hop/tong-hop.module';
import { TongHopTheoDoiCapVonModule } from './tong-hop-theo-doi-cap-von/tong-hop-theo-doi-cap-von.module';
@NgModule({
  declarations: [
    CapVonChiComponent,
  ],
  imports: [
    CommonModule,
    CapVonChiRoutingModule,
    ComponentsModule,
    DirectivesModule,
    DeNghiCapVonBoNganhModule,
    TongHopModule,
    ThongTriDuyetYDuToanModule,
    TongHopTheoDoiCapVonModule
  ],
})
export class CapVonChiModule { }
