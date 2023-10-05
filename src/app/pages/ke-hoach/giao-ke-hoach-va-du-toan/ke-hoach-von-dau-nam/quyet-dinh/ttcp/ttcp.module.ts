import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TtcpComponent } from './ttcp.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemQuyetDinhTtcpComponent } from './them-quyet-dinh-ttcp/them-quyet-dinh-ttcp.component';

@NgModule({
  declarations: [TtcpComponent, ThemQuyetDinhTtcpComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [TtcpComponent],
})
export class TtcpModule {}
