import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhMucDonViRoutingModule } from './danh-muc-don-vi-routing.module';
import { DanhMucDonViComponent } from './danh-muc-don-vi.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhMucDonViComponent],
  imports: [CommonModule, DanhMucDonViRoutingModule, ComponentsModule],
})
export class DanhMucDonViModule {}
