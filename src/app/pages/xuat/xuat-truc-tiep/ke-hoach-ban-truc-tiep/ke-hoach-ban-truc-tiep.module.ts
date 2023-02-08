import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { MainKeHoachBanTrucTiepComponent } from './main-ke-hoach-ban-truc-tiep/main-ke-hoach-ban-truc-tiep.component';
import { DeXuatKhBanTrucTiepComponent } from './de-xuat-kh-ban-truc-tiep/de-xuat-kh-ban-truc-tiep.component';
import { ThemMoiDeXuatKhBanTrucTiepComponent } from './de-xuat-kh-ban-truc-tiep/them-moi-de-xuat-kh-ban-truc-tiep/them-moi-de-xuat-kh-ban-truc-tiep.component';
import { TongHopKeHoachBanTrucTiepComponent } from './tong-hop-ke-hoach-ban-truc-tiep/tong-hop-ke-hoach-ban-truc-tiep.component';
import { ThemMoiTongHopKhBanTrucTiepComponent } from './tong-hop-ke-hoach-ban-truc-tiep/them-moi-tong-hop-kh-ban-truc-tiep/them-moi-tong-hop-kh-ban-truc-tiep.component';



@NgModule({
  declarations: [
    MainKeHoachBanTrucTiepComponent,
    DeXuatKhBanTrucTiepComponent,
    ThemMoiDeXuatKhBanTrucTiepComponent,
    TongHopKeHoachBanTrucTiepComponent,
    ThemMoiTongHopKhBanTrucTiepComponent
  ],
  exports: [
    MainKeHoachBanTrucTiepComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule
  ]
})
export class KeHoachBanTrucTiepModule { }
