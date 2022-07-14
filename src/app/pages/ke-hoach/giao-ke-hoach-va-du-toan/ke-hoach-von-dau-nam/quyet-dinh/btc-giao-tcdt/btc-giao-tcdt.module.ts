import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtcGiaoTcdtComponent } from './btc-giao-tcdt.component';
import { ThemQuyetDinhBtcGiaoTcdtModule } from './them-quyet-dinh-btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [BtcGiaoTcdtComponent],
  imports: [CommonModule, ComponentsModule, ThemQuyetDinhBtcGiaoTcdtModule],
  exports: [BtcGiaoTcdtComponent],
})
export class BtcGiaoTcdtModule {}
