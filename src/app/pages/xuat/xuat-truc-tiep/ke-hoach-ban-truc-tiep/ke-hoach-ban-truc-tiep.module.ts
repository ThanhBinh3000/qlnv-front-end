import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { MainKeHoachBanTrucTiepComponent } from './main-ke-hoach-ban-truc-tiep/main-ke-hoach-ban-truc-tiep.component';
import { DeXuatKhBanTrucTiepComponent } from './de-xuat-kh-ban-truc-tiep/de-xuat-kh-ban-truc-tiep.component';
import { ThemMoiDeXuatKhBanTrucTiepComponent } from './de-xuat-kh-ban-truc-tiep/them-moi-de-xuat-kh-ban-truc-tiep/them-moi-de-xuat-kh-ban-truc-tiep.component';
import { TongHopKeHoachBanTrucTiepComponent } from './tong-hop-ke-hoach-ban-truc-tiep/tong-hop-ke-hoach-ban-truc-tiep.component';
import { ThemMoiTongHopKhBanTrucTiepComponent } from './tong-hop-ke-hoach-ban-truc-tiep/them-moi-tong-hop-kh-ban-truc-tiep/them-moi-tong-hop-kh-ban-truc-tiep.component';
import { QuyetDinhPheDuyetKhBanTrucTiepComponent } from './quyet-dinh-phe-duyet-kh-ban-truc-tiep/quyet-dinh-phe-duyet-kh-ban-truc-tiep.component';
import { ThemMoiQdPheDuyetKhBanTrucTiepComponent } from './quyet-dinh-phe-duyet-kh-ban-truc-tiep/them-moi-qd-phe-duyet-kh-ban-truc-tiep/them-moi-qd-phe-duyet-kh-ban-truc-tiep.component';
import { ThongTinKhBanTrucTiepComponent } from './quyet-dinh-phe-duyet-kh-ban-truc-tiep/them-moi-qd-phe-duyet-kh-ban-truc-tiep/thong-tin-kh-ban-truc-tiep/thong-tin-kh-ban-truc-tiep.component';
import { KeHoachVonDauNamModule } from "../../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";



@NgModule({
  declarations: [
    MainKeHoachBanTrucTiepComponent,
    DeXuatKhBanTrucTiepComponent,
    ThemMoiDeXuatKhBanTrucTiepComponent,
    TongHopKeHoachBanTrucTiepComponent,
    ThemMoiTongHopKhBanTrucTiepComponent,
    QuyetDinhPheDuyetKhBanTrucTiepComponent,
    ThemMoiQdPheDuyetKhBanTrucTiepComponent,
    ThongTinKhBanTrucTiepComponent
  ],
  exports: [
    MainKeHoachBanTrucTiepComponent,
    ThemMoiQdPheDuyetKhBanTrucTiepComponent,
    ThemMoiDeXuatKhBanTrucTiepComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    KeHoachVonDauNamModule
  ]
})
export class KeHoachBanTrucTiepModule { }
