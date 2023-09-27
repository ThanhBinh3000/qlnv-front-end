import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../../components/components.module";
import {MainModule} from "../../../../layout/main/main.module";
import {
  MainTochucTrienkhiBantructiepComponent
} from './main-tochuc-trienkhi-bantructiep/main-tochuc-trienkhi-bantructiep.component';
import {ThongTinBanTrucTiepComponent} from './thong-tin-ban-truc-tiep/thong-tin-ban-truc-tiep.component';
import {
  ThemMoiThongTinBanTrucTiepComponent
} from './thong-tin-ban-truc-tiep/them-moi-thong-tin-ban-truc-tiep/them-moi-thong-tin-ban-truc-tiep.component';
import {KeHoachBanTrucTiepModule} from '../ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.module';
import {QuyetDinhChaogiaBttModule} from "../quyet-dinh-chaogia-btt/quyet-dinh-chaogia-btt.module";


@NgModule({
  declarations: [
    MainTochucTrienkhiBantructiepComponent,
    ThongTinBanTrucTiepComponent,
    ThemMoiThongTinBanTrucTiepComponent,
  ],
  exports: [
    MainTochucTrienkhiBantructiepComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    KeHoachBanTrucTiepModule,
    QuyetDinhChaogiaBttModule
  ]
})
export class ToChucTrienKhaiBanTrucTiepModule {
}
