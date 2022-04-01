import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsBaoCaoTinhHinhSdDtoanThangNamTuCCRoutingModule } from './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC-routing.module';
import { DsBaoCaoTinhHinhSdDtoanThangNamTuCCComponent } from './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.component';



@NgModule({
  declarations: [DsBaoCaoTinhHinhSdDtoanThangNamTuCCComponent],
  imports: [CommonModule, DsBaoCaoTinhHinhSdDtoanThangNamTuCCRoutingModule, ComponentsModule],
})
export class DsBaoCaoTinhHinhSdDtoanThangNamTuCCModule {}
