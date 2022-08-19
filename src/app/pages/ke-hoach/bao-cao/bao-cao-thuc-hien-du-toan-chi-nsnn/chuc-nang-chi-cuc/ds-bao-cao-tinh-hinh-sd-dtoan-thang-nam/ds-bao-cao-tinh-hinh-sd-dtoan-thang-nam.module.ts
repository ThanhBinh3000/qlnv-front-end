import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsBaoCaoTinhHinhSdDtoanThangNamRoutingModule } from './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-routing.module';
import { DsBaoCaoTinhHinhSdDtoanThangNamComponent } from './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component';



@NgModule({
  declarations: [DsBaoCaoTinhHinhSdDtoanThangNamComponent],
  imports: [CommonModule, DsBaoCaoTinhHinhSdDtoanThangNamRoutingModule, ComponentsModule],
  exports:[DsBaoCaoTinhHinhSdDtoanThangNamComponent]
})
export class DsBaoCaoTinhHinhSdDtoanThangNamModule {}
