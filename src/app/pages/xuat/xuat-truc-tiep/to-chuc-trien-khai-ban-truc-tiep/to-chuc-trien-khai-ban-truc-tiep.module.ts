import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { MainTochucTrienkhiBantructiepComponent } from './main-tochuc-trienkhi-bantructiep/main-tochuc-trienkhi-bantructiep.component';
import { ThongTinBanTrucTiepComponent } from './thong-tin-ban-truc-tiep/thong-tin-ban-truc-tiep.component';


@NgModule({
  declarations: [
    MainTochucTrienkhiBantructiepComponent,
    ThongTinBanTrucTiepComponent,
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
