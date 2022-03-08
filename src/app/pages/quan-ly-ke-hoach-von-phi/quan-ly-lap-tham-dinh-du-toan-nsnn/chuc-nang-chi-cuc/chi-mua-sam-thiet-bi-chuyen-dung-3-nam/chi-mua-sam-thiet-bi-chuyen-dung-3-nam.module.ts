import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiMuaSamThietBiChuyenDung3NamRoutingModule } from './chi-mua-sam-thiet-bi-chuyen-dung-3-nam-routing.module';
import { ChiMuaSamThietBiChuyenDung3NamComponent } from './chi-mua-sam-thiet-bi-chuyen-dung-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ChiMuaSamThietBiChuyenDung3NamComponent,
  ],
  imports: [
    CommonModule,
    ChiMuaSamThietBiChuyenDung3NamRoutingModule,
    ComponentsModule,
  ],
})

export class ChiMuaSamThietBiChuyenDung3NamModule {}
