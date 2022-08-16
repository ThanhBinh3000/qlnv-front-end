import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeXuatPhuongAnGiaComponent } from './de-xuat-phuong-an-gia.component';
import { ThemDeXuatPhuongAnGiaComponent } from './them-de-xuat-phuong-an-gia/them-de-xuat-phuong-an-gia.component';


@NgModule({
  declarations: [DeXuatPhuongAnGiaComponent, ThemDeXuatPhuongAnGiaComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [DeXuatPhuongAnGiaComponent],
})
export class DeXuatPhuongAnGiaModule { }
