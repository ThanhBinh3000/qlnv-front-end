import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { XuatTrucTiepComponent } from './xuat-truc-tiep.component';
import { XuatTrucTiepRoutingModule } from './xuat-truc-tiep-routing.module';
import { KeHoachBanTrucTiepComponent } from './ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.component';
import { KeHoachBanTrucTiepModule } from './ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.module';
import { ToChucTrienKhaiBanTrucTiepComponent } from './to-chuc-trien-khai-ban-truc-tiep/to-chuc-trien-khai-ban-truc-tiep.component';
import { ToChucTrienKhaiBanTrucTiepModule } from './to-chuc-trien-khai-ban-truc-tiep/to-chuc-trien-khai-ban-truc-tiep.module';
import { DieuChinhKhBanTrucTiepComponent } from './dieu-chinh-kh-ban-truc-tiep/dieu-chinh-kh-ban-truc-tiep.component';
import { DieuChinhKhBanTrucTiepModule } from './dieu-chinh-kh-ban-truc-tiep/dieu-chinh-kh-ban-truc-tiep.module';
import { HopDongBttModule } from './hop-dong-btt/hop-dong-btt.module';
import { GiaoNvXuatHangBttModule } from './giao-nv-xuat-hang-btt/giao-nv-xuat-hang-btt.module';
import { KiemTraCluongBttModule } from './kiem-tra-cluong-btt/kiem-tra-cluong-btt.module';

@NgModule({
  declarations: [
    XuatTrucTiepComponent,
    KeHoachBanTrucTiepComponent,
    ToChucTrienKhaiBanTrucTiepComponent,
    DieuChinhKhBanTrucTiepComponent,
  ],
  imports: [
    CommonModule,
    XuatTrucTiepRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KeHoachBanTrucTiepModule,
    ToChucTrienKhaiBanTrucTiepModule,
    DieuChinhKhBanTrucTiepModule,
    HopDongBttModule,
    GiaoNvXuatHangBttModule,
    KiemTraCluongBttModule,
  ],
})
export class XuatTrucTiepModule {
}
