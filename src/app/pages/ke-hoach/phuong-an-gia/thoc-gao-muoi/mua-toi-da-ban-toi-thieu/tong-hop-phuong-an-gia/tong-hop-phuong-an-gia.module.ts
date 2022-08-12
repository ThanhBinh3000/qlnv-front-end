import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopPhuongAnGiaComponent } from './tong-hop-phuong-an-gia.component';


@NgModule({
  declarations: [TongHopPhuongAnGiaComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [TongHopPhuongAnGiaComponent],
})
export class TongHopPhuongAnGiaModule { }
