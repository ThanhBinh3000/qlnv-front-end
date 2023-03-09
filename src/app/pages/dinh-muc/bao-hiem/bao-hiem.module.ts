import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoHiemComponent } from './bao-hiem.component';
import { BaoHiemRoutingModule } from './bao-hiem-routing.module';
import { ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent } from './tong-hop-de-xuat-nhu-cau-bao-hiem-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component';
import { TongHopDeXuatNhuCauBaoHiemCucComponent } from './tong-hop-de-xuat-nhu-cau-bao-hiem-cuc/tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component';
import { TongHopDeXuatNhuCauBaoHiemChiCucComponent } from './tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc/tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc.component';
import { ThongTinTongHopDeXuatNhuCauBaoHiemChiCucComponent } from './tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc.component';
import { QdMuaSamBaoHiemComponent } from './qd-mua-sam-bao-hiem/qd-mua-sam-bao-hiem.component';
import { TongHopGtriBaoHiemComponent } from './tong-hop-gtri-bao-hiem/tong-hop-gtri-bao-hiem.component';
import { DeXuatHopDongChiCucComponent } from './de-xuat-hop-dong-chi-cuc/de-xuat-hop-dong-chi-cuc.component';
import {
  ThemMoiDeXuatBaoHiemCcComponent
} from "./de-xuat-hop-dong-chi-cuc/them-moi-de-xuat-bao-hiem-cc/them-moi-de-xuat-bao-hiem-cc.component";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    BaoHiemRoutingModule,
  ],
    declarations: [
        BaoHiemComponent,
        TongHopDeXuatNhuCauBaoHiemCucComponent,
        ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent,
        TongHopDeXuatNhuCauBaoHiemChiCucComponent,
        ThongTinTongHopDeXuatNhuCauBaoHiemChiCucComponent,
        QdMuaSamBaoHiemComponent,
        TongHopGtriBaoHiemComponent,
        DeXuatHopDongChiCucComponent,
        ThemMoiDeXuatBaoHiemCcComponent,
        ThongTinTongHopDeXuatNhuCauBaoHiemChiCucComponent,
    ],
  exports: [
    BaoHiemComponent,
    TongHopDeXuatNhuCauBaoHiemCucComponent,
    TongHopDeXuatNhuCauBaoHiemChiCucComponent,
  ]
})
export class BaoHiemModule { }
