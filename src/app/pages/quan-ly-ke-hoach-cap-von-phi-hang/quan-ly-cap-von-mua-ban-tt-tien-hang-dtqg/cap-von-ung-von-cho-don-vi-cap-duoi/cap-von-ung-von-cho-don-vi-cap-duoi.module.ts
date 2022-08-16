import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapVonUngVonChoDonViCapDuoiRoutingModule } from './cap-von-ung-von-cho-don-vi-cap-duoi-routing.module';
import { CapVonUngVonChoDonViCapDuoiComponent } from './cap-von-ung-von-cho-don-vi-cap-duoi.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [CapVonUngVonChoDonViCapDuoiComponent],
  imports: [CommonModule, CapVonUngVonChoDonViCapDuoiRoutingModule, ComponentsModule],
})
export class CapVonUngVonChoDonViCapDuoiModule {}
