import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatTuRoutingModule } from './vat-tu-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { VatTuComponent } from './vat-tu.component';
import { QuyetDinhPheDuyetKeHoachLCNTComponent } from './quyet-dinh-phe-duyet-ke-hoach-lcnt/quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { ThongTinLCNTComponent } from './thong-tin-lcnt/thong-tin-lcnt.component';
import { ChiTietThongTinLCNTComponent } from './chi-tiet-thong-tin-lcnt/chi-tiet-thong-tin-lcnt.component';
import { ChiTietThongTinGoiThauComponent } from './chi-tiet-thong-tin-goi-thau/chi-tiet-thong-tin-goi-thau.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { HopDongMuaComponent } from './hop-dong-mua/hop-dong-mua.component';
import { ThongTinHopDongMuaComponent } from './thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';

@NgModule({
  declarations: [
    VatTuComponent,
    QuyetDinhPheDuyetKeHoachLCNTComponent,
    ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent,
    ThongTinLCNTComponent,
    ChiTietThongTinLCNTComponent,
    ChiTietThongTinGoiThauComponent,
    QuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
    HopDongMuaComponent,
    ThongTinHopDongMuaComponent,
  ],
  imports: [
    CommonModule,
    VatTuRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class VatTuModule { }