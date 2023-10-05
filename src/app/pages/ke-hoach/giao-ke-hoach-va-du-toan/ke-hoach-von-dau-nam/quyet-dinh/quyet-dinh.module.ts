import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhComponent } from './quyet-dinh.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TtcpModule } from './ttcp/ttcp.module';
import { BtcGiaoCacBoNganhModule } from './btc-giao-cac-bo-nganh/btc-giao-cac-bo-nganh.module';
import { BtcGiaoTcdtModule } from './btc-giao-tcdt/btc-giao-tcdt.module';

@NgModule({
  declarations: [QuyetDinhComponent],
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
