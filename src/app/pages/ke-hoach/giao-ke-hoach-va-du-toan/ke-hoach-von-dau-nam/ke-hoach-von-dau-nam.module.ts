import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeHoachVonDauNamComponent } from './ke-hoach-von-dau-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ChiTieuKeHoachNamComponent } from './chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ThongTinChiTieuKeHoachNamComponent } from './chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DieuChinhKeHoachModule } from './dieu-chinh-ke-hoach/dieu-chinh-ke-hoach.module';
import { DuToanNsnnModule } from './du-toan-nsnn/du-toan-nsnn.module';
import { QuyetDinhModule } from './quyet-dinh/quyet-dinh.module';

@NgModule({
  declarations: [
    KeHoachVonDauNamComponent,
    ChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    DieuChinhKeHoachModule,
    DuToanNsnnModule,
    QuyetDinhModule,
  ],
  exports: [
    KeHoachVonDauNamComponent,
    ChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent,
  ]
})
export class KeHoachVonDauNamModule { }
