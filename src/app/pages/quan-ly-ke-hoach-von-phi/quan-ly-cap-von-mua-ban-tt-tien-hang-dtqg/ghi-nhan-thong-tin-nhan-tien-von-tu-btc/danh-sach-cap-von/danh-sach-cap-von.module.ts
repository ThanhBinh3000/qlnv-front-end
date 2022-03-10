import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachCapVonRoutingModule } from './danh-sach-cap-von-routing.module';
import { DanhSachCapVonComponent } from './danh-sach-cap-von.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachCapVonComponent,
  ],
  imports: [
    CommonModule,
    DanhSachCapVonRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachCapVonModule {}
