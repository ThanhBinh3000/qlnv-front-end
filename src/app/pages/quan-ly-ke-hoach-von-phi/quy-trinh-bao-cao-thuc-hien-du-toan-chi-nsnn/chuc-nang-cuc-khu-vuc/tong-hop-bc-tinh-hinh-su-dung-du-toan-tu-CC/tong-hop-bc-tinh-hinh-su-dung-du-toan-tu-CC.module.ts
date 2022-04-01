import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopBCTinhHinhSuDungDuToanTuCCRoutingModule } from './tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC-routing.module';
import { TongHopBCTinhHinhSuDungDuToanTuCCComponent } from './tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.component';



@NgModule({
  declarations: [TongHopBCTinhHinhSuDungDuToanTuCCComponent],
  imports: [CommonModule, TongHopBCTinhHinhSuDungDuToanTuCCRoutingModule, ComponentsModule],
})
export class TongHopBCTinhHinhSuDungDuToanTuCCModule {}
