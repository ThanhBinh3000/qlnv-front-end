import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VatTuThietBiComponent } from './vat-tu-thiet-bi.component';
import { QuyetDinhGiaCdtnnModule } from './quyet-dinh-gia-cdtnn/quyet-dinh-gia-cdtnn.module';
import { DeXuatPhuongAnGiaModule } from './de-xuat-phuong-an-gia/de-xuat-phuong-an-gia.module';
import { QuyetDinhGiaBtcModule } from './quyet-dinh-gia-btc/quyet-dinh-gia-btc.module';
import { QuyetDinhDieuChinhCdtnnModule } from './quyet-dinh-dieu-chinh-cdtnn/quyet-dinh-dieu-chinh-cdtnn.module';
import { GiaMuaBanComponent } from './gia-mua-ban/gia-mua-ban.component';
import { GiaCuTheComponent } from './gia-cu-the/gia-cu-the.component';
import { DeXuatPagComponent } from './gia-mua-ban/de-xuat-pag/de-xuat-pag.component';
import { QuyetDinhBtcPagComponent } from './gia-mua-ban/quyet-dinh-btc-pag/quyet-dinh-btc-pag.component';
import { ThemMoiDeXuatPagComponent } from './gia-mua-ban/de-xuat-pag/them-moi-de-xuat-pag/them-moi-de-xuat-pag.component';
import { ThemMoiQdBtcPagComponent } from './gia-mua-ban/quyet-dinh-btc-pag/them-moi-qd-btc-pag/them-moi-qd-btc-pag.component';
import {QdGctTcdtnnComponent} from "./gia-cu-the/qd-gct-tcdtnn/qd-gct-tcdtnn.component";
import {QdDcTcdtnnComponent} from "./gia-cu-the/qd-dc-tcdtnn/qd-dc-tcdtnn.component";
import {DeXuatPhuongAnGctComponent} from "./gia-cu-the/de-xuat-phuong-an-gct/de-xuat-phuong-an-gct.component";
import {
  ThemMoiDeXuatGctComponent
} from "./gia-cu-the/de-xuat-phuong-an-gct/them-moi-de-xuat-gct/them-moi-de-xuat-gct.component";
import {ThemMoiQdgTcdtnnComponent} from "./gia-cu-the/qd-gct-tcdtnn/them-moi-qdg-tcdtnn/them-moi-qdg-tcdtnn.component";
import {ThemMoiDcTcdtnnComponent} from "./gia-cu-the/qd-dc-tcdtnn/them-moi-dc-tcdtnn/them-moi-dc-tcdtnn.component";

@NgModule({
  declarations: [VatTuThietBiComponent, GiaMuaBanComponent, GiaCuTheComponent, DeXuatPagComponent, QuyetDinhBtcPagComponent, ThemMoiDeXuatPagComponent, ThemMoiQdBtcPagComponent, QdGctTcdtnnComponent, QdDcTcdtnnComponent, DeXuatPhuongAnGctComponent, ThemMoiDeXuatGctComponent, ThemMoiQdgTcdtnnComponent, ThemMoiDcTcdtnnComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    DeXuatPhuongAnGiaModule,
    QuyetDinhGiaCdtnnModule,
    QuyetDinhGiaBtcModule,
    QuyetDinhDieuChinhCdtnnModule
  ],
  exports: [
    VatTuThietBiComponent,
  ]
})
export class VatTuThietBiModule { }
