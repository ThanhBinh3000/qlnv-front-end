import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapVonBoNganhComponent } from './de-nghi-cap-von-bo-nganh.component';
import { ThongTinDeNghiCapVonBoNganhComponent } from './thong-tin-de-nghi-cap-von-bo-nganh/thong-tin-de-nghi-cap-von-bo-nganh.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    DeNghiCapVonBoNganhComponent,
    ThongTinDeNghiCapVonBoNganhComponent,
  ],
  exports: [
    DeNghiCapVonBoNganhComponent,
    ThongTinDeNghiCapVonBoNganhComponent,
  ]
})
export class DeNghiCapVonBoNganhModule { }
