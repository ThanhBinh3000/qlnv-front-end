import { DeNghiCapVonBoNganhModule } from './../de-nghi-cap-von-bo-nganh/de-nghi-cap-von-bo-nganh.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ThongTinTonghopComponent } from './thong-tin-tong-hop/thong-tin-tong-hop.component';
import { TongHopComponent } from './tong-hop.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    DeNghiCapVonBoNganhModule
  ],
  declarations: [
    TongHopComponent,
    ThongTinTonghopComponent
  ],
  exports: [
    TongHopComponent,
  ]
})
export class TongHopModule { }
