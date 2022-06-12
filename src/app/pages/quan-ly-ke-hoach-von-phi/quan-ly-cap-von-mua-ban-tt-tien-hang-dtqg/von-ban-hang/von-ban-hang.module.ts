import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VonBanHangRoutingModule } from './von-ban-hang-routing.module';
import { VonBanHangComponent } from './von-ban-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [VonBanHangComponent],
  imports: [CommonModule, VonBanHangRoutingModule, ComponentsModule],
})
export class VonBanHangModule {}
