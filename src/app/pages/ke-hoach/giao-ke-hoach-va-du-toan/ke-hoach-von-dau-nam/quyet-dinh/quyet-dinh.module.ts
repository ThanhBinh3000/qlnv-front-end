import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhComponent } from './quyet-dinh.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TtcpModule } from './ttcp/ttcp.module';
import { BtcGiaoCacBoNganhModule } from './btc-giao-cac-bo-nganh/btc-giao-cac-bo-nganh.module';
import { BtcGiaoTcdtModule } from './btc-giao-tcdt/btc-giao-tcdt.module';
import { TcdtGiaoCacDonviComponent } from './tcdt-giao-cac-donvi/tcdt-giao-cac-donvi.component';
import { ThongTinTcdtGiaoCacDonviComponent } from './tcdt-giao-cac-donvi/thong-tin-tcdt-giao-cac-donvi/thong-tin-tcdt-giao-cac-donvi.component';
import { ThemSuaVatTuChiTietComponent } from './tcdt-giao-cac-donvi/thong-tin-tcdt-giao-cac-donvi/them-sua-vat-tu-chi-tiet/them-sua-vat-tu-chi-tiet.component';

@NgModule({
  declarations: [QuyetDinhComponent, TcdtGiaoCacDonviComponent, ThongTinTcdtGiaoCacDonviComponent, ThemSuaVatTuChiTietComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    TtcpModule,
    BtcGiaoCacBoNganhModule,
    BtcGiaoTcdtModule,
  ],
  exports: [QuyetDinhComponent],
})
export class QuyetDinhModule { }
