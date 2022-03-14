
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhSachKeHoachPhanBoNganSachComponent } from './danh-sach-ke-hoach-phan-bo-ngan-sach.component';
import { DanhSachKeHoachPhanBoNganSachRoutingModule } from './danh-sach-ke-hoach-phan-bo-ngan-sach-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachKeHoachPhanBoNganSachComponent,
  ],
  imports: [
    CommonModule,
    DanhSachKeHoachPhanBoNganSachRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachKeHoachPhanBoNganSachModule {}
