import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KeHoachVonDauNamComponent} from './ke-hoach-von-dau-nam.component';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {ChiTieuKeHoachNamComponent} from './chi-tieu-ke-hoach-nam-cap-tong-cuc/qd-giao-chi-tieu-ke-hoach-nam.component';
import {
  ThongTinChiTieuKeHoachNamComponent
} from './chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import {DieuChinhKeHoachModule} from './dieu-chinh-ke-hoach/dieu-chinh-ke-hoach.module';
import {DuToanNsnnModule} from './du-toan-nsnn/du-toan-nsnn.module';
import {QuyetDinhModule} from './quyet-dinh/quyet-dinh.module';
import {
  ThemSuaKeHoachVatTuComponent
} from './chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/them-sua-ke-hoach-vat-tu/them-sua-ke-hoach-vat-tu.component';
import { GiaoChiTieuKeHoachComponent } from './giao-chi-tieu-ke-hoach/giao-chi-tieu-ke-hoach.component';
import { PaGiaoChiTieuKeHoachComponent } from './pa-giao-chi-tieu-ke-hoach/pa-giao-chi-tieu-ke-hoach.component';
import { ThongTinPaGiaoChiTieuKeHoachComponent } from './pa-giao-chi-tieu-ke-hoach/thong-tin-pa-giao-chi-tieu-ke-hoach/thong-tin-pa-giao-chi-tieu-ke-hoach.component';

@NgModule({
  declarations: [
    KeHoachVonDauNamComponent,
    ChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent,
    ThemSuaKeHoachVatTuComponent,
    GiaoChiTieuKeHoachComponent,
    PaGiaoChiTieuKeHoachComponent,
    ThongTinPaGiaoChiTieuKeHoachComponent,
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
export class KeHoachVonDauNamModule {
}
