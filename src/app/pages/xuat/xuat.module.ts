import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatRoutingModule } from './xuat-routing.module';
import { XuatComponent } from './xuat.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { XuatTieuHuyComponent } from './xuat-tieu-huy/xuat-tieu-huy.component';
import {XuatTieuHuyModule} from "./xuat-tieu-huy/xuat-tieu-huy.module";

@NgModule({
  declarations: [XuatComponent, XuatTieuHuyComponent],
  imports: [CommonModule, XuatRoutingModule, ComponentsModule, MainModule, XuatTieuHuyModule],
})
export class XuatModule {}
