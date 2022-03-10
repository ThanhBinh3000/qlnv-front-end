import { NhuCauKeHoachDtxd3NamComponent } from './nhu-cau-ke-hoach-dtxd3-nam.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhuCauKeHoachDtxd3NamRoutingModule } from './nhu-cau-ke-hoach-dtxd3-nam-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhuCauKeHoachDtxd3NamComponent,
  ],
  imports: [
    CommonModule,
    NhuCauKeHoachDtxd3NamRoutingModule,
    ComponentsModule,
  ],
})

export class NhuCauKeHoachDtxd3NamModule {}
