import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainPhuongAnGiaModule } from './main-phuong-an-gia/main-phuong-an-gia.module';
import { PhuongAnGiaRoutingModule } from './phuong-an-gia-routing.module';
import { PhuongAnGiaComponent } from './phuong-an-gia.component';


@NgModule({
  declarations: [
    PhuongAnGiaComponent,
  ],
  imports: [
    CommonModule,
    PhuongAnGiaRoutingModule,
    ComponentsModule,
    MainPhuongAnGiaModule,
  ],
})
export class PhuongAnGiaModule { }
