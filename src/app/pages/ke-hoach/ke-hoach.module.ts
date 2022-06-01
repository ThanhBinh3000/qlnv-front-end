import { ThongTinChiTieuKeHoachNamComponent } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachRoutingModule } from './ke-hoach-routing.module';
import { KeHoachComponent } from './ke-hoach.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DeXuatDieuChinhComponent } from './de-xuat-dieu-chinh/de-xuat-dieu-chinh.component';
import { ThongTinDeXuatDieuChinhComponent } from './thong-tin-de-xuat-dieu-chinh/thong-tin-de-xuat-dieu-chinh.component';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    KeHoachComponent,
    DieuChinhThongTinChiTieuKeHoachNamComponent,
    // DieuChinhChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent,
    DeXuatDieuChinhComponent,
    ThongTinDeXuatDieuChinhComponent,
  ],
  imports: [
    CommonModule,
    KeHoachRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
    DirectivesModule
  ],
})
export class KeHoachModule { }
