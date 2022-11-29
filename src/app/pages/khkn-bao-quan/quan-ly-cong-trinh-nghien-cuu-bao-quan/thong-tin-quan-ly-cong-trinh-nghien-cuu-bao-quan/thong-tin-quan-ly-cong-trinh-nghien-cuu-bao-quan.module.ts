import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NghiemThuThanhLyComponent } from './nghiem-thu-thanh-ly/nghiem-thu-thanh-ly.component';
import { ThongTinChungComponent } from './thong-tin-chung/thong-tin-chung.component';
import { ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent } from './thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component';
import { TienDoThucHienComponent } from './tien-do-thuc-hien/tien-do-thuc-hien.component';

@NgModule({
  declarations: [
    ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent,
    NghiemThuThanhLyComponent,
    ThongTinChungComponent,
    TienDoThucHienComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent],
})
export class ThongTinQuanLyCongTrinhNghienCuuModule { }
