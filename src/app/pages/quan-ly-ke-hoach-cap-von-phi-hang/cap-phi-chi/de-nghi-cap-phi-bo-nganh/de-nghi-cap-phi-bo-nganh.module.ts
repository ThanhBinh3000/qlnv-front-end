import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapPhiBoNganhComponent } from './de-nghi-cap-phi-bo-nganh.component';
import { ThongTinDeNghiCapPhiBoNganhComponent } from './thong-tin-de-nghi-cap-phi-bo-nganh/thong-tin-de-nghi-cap-phi-bo-nganh.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    DeNghiCapPhiBoNganhComponent,
    ThongTinDeNghiCapPhiBoNganhComponent
  ],
  exports: [
    DeNghiCapPhiBoNganhComponent,
    ThongTinDeNghiCapPhiBoNganhComponent
  ]
})
export class DeNghiCapPhiBoNganhModule { }
