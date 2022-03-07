import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhuCauPhiNhapXuat3NamRoutingModule } from './nhu-cau-phi-nhap-xuat-3-nam-routing.module';
import { NhuCauPhiNhapXuat3NamComponent } from './nhu-cau-phi-nhap-xuat-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhuCauPhiNhapXuat3NamComponent,
  ],
  imports: [
    CommonModule,
    NhuCauPhiNhapXuat3NamRoutingModule,
    ComponentsModule,
  ],
})

export class NhuCauPhiNhapXuat3NamModule {}
