import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoHiemComponent } from './bao-hiem.component';
import { BaoHiemRoutingModule } from './bao-hiem-routing.module';
import { ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent } from './tong-hop-de-xuat-nhu-cau-bao-hiem-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc/thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component';
import { TongHopDeXuatNhuCauBaoHiemCucComponent } from './tong-hop-de-xuat-nhu-cau-bao-hiem-cuc/tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    BaoHiemRoutingModule,
  ],
  declarations: [
    BaoHiemComponent,
    TongHopDeXuatNhuCauBaoHiemCucComponent,
    ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent
  ]
})
export class BaoHiemModule { }
