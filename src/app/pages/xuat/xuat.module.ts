import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatRoutingModule } from './xuat-routing.module';
import { XuatComponent } from './xuat.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';

@NgModule({
  declarations: [XuatComponent],
  imports: [CommonModule, XuatRoutingModule, ComponentsModule, MainModule],
})
export class XuatModule {}
