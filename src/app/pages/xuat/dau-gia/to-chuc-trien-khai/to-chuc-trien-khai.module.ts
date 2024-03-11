import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../../components/components.module";
import {MainModule} from "../../../../layout/main/main.module";
import {MainTochucTrienkhaiComponent} from './main-tochuc-trienkhai/main-tochuc-trienkhai.component';
import {ThongTinDauGiaComponent} from './main-tochuc-trienkhai/thong-tin-dau-gia/thong-tin-dau-gia.component';
import {
  ChiTietThongTinDauGiaComponent
} from './main-tochuc-trienkhai/thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia.component';
import {
  ThongtinDaugiaComponent
} from './main-tochuc-trienkhai/thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia/thongtin-daugia/thongtin-daugia.component';
import {KeHoachBanDauGiaModule} from '../ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module';
import {QuyetDinhPheDuyetKetQuaModule} from "../quyet-dinh-phe-duyet-ket-qua/quyet-dinh-phe-duyet-ket-qua.module";

@NgModule({
  declarations: [
    MainTochucTrienkhaiComponent,
    ThongTinDauGiaComponent,
    ChiTietThongTinDauGiaComponent,
    ThongtinDaugiaComponent,
  ],
  exports: [
    MainTochucTrienkhaiComponent,
    ThongtinDaugiaComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    KeHoachBanDauGiaModule,
    QuyetDinhPheDuyetKetQuaModule
  ]
})
export class ToChucTrienKhaiModule {
}
