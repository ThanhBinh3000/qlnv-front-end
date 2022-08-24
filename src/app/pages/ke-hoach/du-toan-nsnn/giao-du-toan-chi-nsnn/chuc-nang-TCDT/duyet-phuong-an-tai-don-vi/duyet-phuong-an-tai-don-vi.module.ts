import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DuyetPhuongAnTaiDonViComponent } from './duyet-phuong-an-tai-don-vi.component';
import { DuyetPhuongAnTaiDonViRoutingModule } from './duyet-phuong-an-tai-don-vi-routing.module';

@NgModule({
  declarations: [DuyetPhuongAnTaiDonViComponent],
  imports: [CommonModule, DuyetPhuongAnTaiDonViRoutingModule, ComponentsModule],
})
export class DuyetPhuongAnTaiDonViModule {}
