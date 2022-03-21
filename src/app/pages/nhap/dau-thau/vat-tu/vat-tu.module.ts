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

@NgModule({
  declarations: [
    VatTuComponent,
    QuyetDinhPheDuyetKeHoachLCNTComponent,
    ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent,
    ThongTinLCNTComponent,
    ChiTietThongTinLCNTComponent,
  ],
  imports: [
    CommonModule,
    VatTuRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class VatTuModule { }