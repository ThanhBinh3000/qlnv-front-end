import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TonghopRoutingModule } from './tong-hop-routing.module';
import { TongHopComponent } from './tong-hop.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TongHopComponent],
  imports: [CommonModule, TonghopRoutingModule, ComponentsModule],
})
export class TonghopModule {}
