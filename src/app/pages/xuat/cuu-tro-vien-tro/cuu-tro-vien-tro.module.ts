import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CuuTroVienTroRoutingModule } from './cuu-tro-vien-tro-routing.module';
import { CuuTroVienTroComponent } from './cuu-tro-vien-tro.component';
import { QuyetDinhPheDuyetPhuongAnModule } from './quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.module';
import { TongHopPhuongAnModule } from './tong-hop-phuong-an/tong-hop-phuong-an.module';
import { XayDungPhuongAnModule } from './xay-dung-phuong-an/xay-dung-phuong-an.module';
@NgModule({
  declarations: [
    CuuTroVienTroComponent,
  ],
  imports: [
    CommonModule,
    CuuTroVienTroRoutingModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhPheDuyetPhuongAnModule,
    TongHopPhuongAnModule,
    XayDungPhuongAnModule,
  ],
})
export class CuuTroVienTroModule { }
