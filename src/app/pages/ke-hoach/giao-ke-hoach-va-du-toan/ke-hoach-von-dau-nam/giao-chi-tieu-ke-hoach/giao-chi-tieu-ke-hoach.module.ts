import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {ChiTieuKeHoachNamComponent} from "../chi-tieu-ke-hoach-nam-cap-tong-cuc/qd-giao-chi-tieu-ke-hoach-nam.component";
import {
  ThongTinChiTieuKeHoachNamComponent
} from "../chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component";

@NgModule({
  declarations: [
    ChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    ChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent
  ]
})
export class GiaoChiTieuKeHoachModule {
}
