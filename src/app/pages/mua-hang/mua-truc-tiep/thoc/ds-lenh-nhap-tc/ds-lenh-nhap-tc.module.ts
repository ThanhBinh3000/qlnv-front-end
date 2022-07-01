import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsLenhNhapTCComponent } from './ds-lenh-nhap-tc.component';
import { DsLenhNhapTCRoutingModule } from './ds-lenh-nhap-tc-routing.module';

@NgModule({
  declarations: [DsLenhNhapTCComponent],
  imports: [CommonModule, DsLenhNhapTCRoutingModule, ComponentsModule],
})
export class DsLenhNhapTCModule {}
