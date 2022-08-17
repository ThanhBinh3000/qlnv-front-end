import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeXuatPhuongAnGiaHaiComponent } from './de-xuat-phuong-an-gia-hai.component';

@NgModule({
  declarations: [DeXuatPhuongAnGiaHaiComponent,],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [DeXuatPhuongAnGiaHaiComponent],
})
export class DeXuatPhuongAnGiaHaiModule { }
