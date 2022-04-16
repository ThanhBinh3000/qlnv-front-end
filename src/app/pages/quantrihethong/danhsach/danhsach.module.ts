import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachComponent } from './danhsach.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DanhSachRoutingModule } from './danhsach-routing.module';

@NgModule({
  declarations: [
    DanhSachComponent,
  ],
  imports: [CommonModule, DanhSachRoutingModule, ComponentsModule, MainModule],
})
export class DanhSachModule { }
