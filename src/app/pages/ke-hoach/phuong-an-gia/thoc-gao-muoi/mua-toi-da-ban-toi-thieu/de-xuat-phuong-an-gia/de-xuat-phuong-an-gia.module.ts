import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeXuatPhuongAnGiaComponent } from './de-xuat-phuong-an-gia.component';
import { ThemQdDeXuatPhuongAnGiaComponent } from './them-qd-de-xuat-phuong-an-gia/them-qd-de-xuat-phuong-an-gia.component';


@NgModule({
  declarations: [DeXuatPhuongAnGiaComponent, ThemQdDeXuatPhuongAnGiaComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [DeXuatPhuongAnGiaComponent],
})
export class DeXuatPhuongAnGiaModule { }
