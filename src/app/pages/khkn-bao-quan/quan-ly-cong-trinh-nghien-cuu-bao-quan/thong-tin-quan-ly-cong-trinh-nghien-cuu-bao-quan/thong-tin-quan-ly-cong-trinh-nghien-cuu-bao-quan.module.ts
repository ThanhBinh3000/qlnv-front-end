import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NghiemThuThanhLyModule } from './nghiem-thu-thanh-ly/nghiem-thu-thanh-ly.module';
import { ThongTinChungModule } from './thong-tin-chung/thong-tin-chung.module';
import { ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent } from './thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component';
import { TienDoThucHienModule } from './tien-do-thuc-hien/tien-do-thuc-hien.module';

@NgModule({
  declarations: [ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NghiemThuThanhLyModule,
    ThongTinChungModule,
    TienDoThucHienModule
  ],
  exports: [ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent],
})
export class ThongTinQuanLyCongTrinhNghienCuuModule { }
