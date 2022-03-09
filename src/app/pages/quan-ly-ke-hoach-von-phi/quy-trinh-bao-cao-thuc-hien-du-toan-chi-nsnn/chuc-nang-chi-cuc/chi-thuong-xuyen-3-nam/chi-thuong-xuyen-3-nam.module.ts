import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiThuongXuyen3NamRoutingModule } from './chi-thuong-xuyen-3-nam-routing.module';
import { ChiThuongXuyen3NamComponent } from './chi-thuong-xuyen-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ChiThuongXuyen3NamComponent,
  ],
  imports: [
    CommonModule,
    ChiThuongXuyen3NamRoutingModule,
    ComponentsModule,
  ],
})

export class ChiThuongXuyen3NamModule {}
