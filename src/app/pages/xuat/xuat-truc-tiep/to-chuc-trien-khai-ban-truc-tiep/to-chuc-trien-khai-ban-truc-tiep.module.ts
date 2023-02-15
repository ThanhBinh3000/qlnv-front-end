import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { MainTochucTrienkhiBantructiepComponent } from './main-tochuc-trienkhi-bantructiep/main-tochuc-trienkhi-bantructiep.component';
import { ThongTinBanTrucTiepComponent } from './thong-tin-ban-truc-tiep/thong-tin-ban-truc-tiep.component';
import { ThemMoiThongTinBanTrucTiepComponent } from './thong-tin-ban-truc-tiep/them-moi-thong-tin-ban-truc-tiep/them-moi-thong-tin-ban-truc-tiep.component';
import { QdPdKetQuaBttComponent } from './qd-pd-ket-qua-btt/qd-pd-ket-qua-btt.component';
import { ThemQdPdKetQuaBttComponent } from './qd-pd-ket-qua-btt/them-qd-pd-ket-qua-btt/them-qd-pd-ket-qua-btt.component';


@NgModule({
  declarations: [
    MainTochucTrienkhiBantructiepComponent,
    ThongTinBanTrucTiepComponent,
    ThemMoiThongTinBanTrucTiepComponent,
    QdPdKetQuaBttComponent,
    ThemQdPdKetQuaBttComponent,
  ],
  exports: [
    MainTochucTrienkhiBantructiepComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule
  ]
})
export class ToChucTrienKhaiBanTrucTiepModule {
}
