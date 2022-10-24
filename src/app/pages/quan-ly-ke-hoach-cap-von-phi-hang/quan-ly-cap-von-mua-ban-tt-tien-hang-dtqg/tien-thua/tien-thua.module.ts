import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TienThuaRoutingModule } from './tien-thua-routing.module';
import { TienThuaComponent } from './tien-thua.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TienThuaComponent],
  imports: [CommonModule, TienThuaRoutingModule, ComponentsModule],
})
export class TienThuaModule {}
