import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../../components/components.module";
import {MainModule} from "../../../../layout/main/main.module";
import { MainTochucTrienkhaiComponent } from './main-tochuc-trienkhai/main-tochuc-trienkhai.component';
import { QdPdKetQuaBdgComponent } from './main-tochuc-trienkhai/qd-pd-ket-qua-bdg/qd-pd-ket-qua-bdg.component';
import { ThongTinDauGiaComponent } from './main-tochuc-trienkhai/thong-tin-dau-gia/thong-tin-dau-gia.component';
import { ChiTietThongTinDauGiaComponent } from './main-tochuc-trienkhai/thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia.component';


@NgModule({
  declarations: [
    MainTochucTrienkhaiComponent,
    QdPdKetQuaBdgComponent,
    ThongTinDauGiaComponent,
    ChiTietThongTinDauGiaComponent
  ],
  exports: [
    MainTochucTrienkhaiComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule
  ]
})
export class ToChucTrienKhaiModule {
}
