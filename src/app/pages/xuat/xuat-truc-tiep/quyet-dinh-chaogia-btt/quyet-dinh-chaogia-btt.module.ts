import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {QuyetDinhChaogiaBttComponent} from "./quyet-dinh-chaogia-btt.component";
import {QuyetDinhChaoGiaComponent} from './quyet-dinh-chao-gia/quyet-dinh-chao-gia.component';
import {
  ChiTietQuyetDinhChaoGiaComponent
} from './quyet-dinh-chao-gia/chi-tiet-quyet-dinh-chao-gia/chi-tiet-quyet-dinh-chao-gia.component';
import {KeHoachBanTrucTiepModule} from "../ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.module";

@NgModule({
  declarations: [
    QuyetDinhChaogiaBttComponent,
    QuyetDinhChaoGiaComponent,
    ChiTietQuyetDinhChaoGiaComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    KeHoachBanTrucTiepModule,

  ],
  exports: [
    QuyetDinhChaogiaBttComponent,
    ChiTietQuyetDinhChaoGiaComponent,
  ]
})
export class QuyetDinhChaogiaBttModule {
}
