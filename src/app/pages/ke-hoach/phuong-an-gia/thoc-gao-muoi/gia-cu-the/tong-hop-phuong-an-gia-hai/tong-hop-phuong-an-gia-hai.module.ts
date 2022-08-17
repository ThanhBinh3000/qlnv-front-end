import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopPhuongAnGiaHaiComponent } from './tong-hop-phuong-an-gia-hai.component';


@NgModule({
  declarations: [TongHopPhuongAnGiaHaiComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [TongHopPhuongAnGiaHaiComponent],
})
export class TongHopPhuongAnGiaHaiModule { }
