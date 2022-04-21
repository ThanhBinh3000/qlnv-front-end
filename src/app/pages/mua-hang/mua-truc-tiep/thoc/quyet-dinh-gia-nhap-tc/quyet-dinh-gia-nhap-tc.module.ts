import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhGiaNhapTCRoutingModule } from './quyet-dinh-gia-nhap-tc-routing.module';
import { QuyetDinhGiaNhapTCComponent } from './quyet-dinh-gia-nhap-tc.component';

@NgModule({
  declarations: [QuyetDinhGiaNhapTCComponent],
  imports: [CommonModule, QuyetDinhGiaNhapTCRoutingModule, ComponentsModule],
})
export class QuyetDinhGiaNhapTCModule {}
