import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DauGiaRoutingModule } from './dau-gia-routing.module';
import { DauGiaComponent } from './dau-gia.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DauGiaComponent],
  imports: [CommonModule, DauGiaRoutingModule, ComponentsModule],
})
export class DauGiaModule {}
