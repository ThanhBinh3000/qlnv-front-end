import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhSachBaoCaoRoutingModule } from './danh-sach-bao-cao-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachBaoCaoComponent,
  ],
  imports: [
    CommonModule,
    DanhSachBaoCaoRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachBaoCaoModule {}
