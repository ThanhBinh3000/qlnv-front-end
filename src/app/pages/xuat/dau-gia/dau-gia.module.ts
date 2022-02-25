import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DauGiaComponent } from './dau-gia.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DauGiaRoutingModule } from './dau-gia-routing.module';

@NgModule({
  declarations: [DauGiaComponent],
  imports: [CommonModule, ComponentsModule, DauGiaRoutingModule],
})
export class DauGiaModule {}
