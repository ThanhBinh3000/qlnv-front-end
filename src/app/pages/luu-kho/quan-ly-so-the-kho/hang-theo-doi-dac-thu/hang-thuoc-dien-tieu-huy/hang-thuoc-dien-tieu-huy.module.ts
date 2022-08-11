import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangThuocDienTieuHuyComponent } from './hang-thuoc-dien-tieu-huy.component';
import { ThemHangThuocDienTieuHuyComponent } from './them-hang-thuoc-dien-tieu-huy/them-hang-thuoc-dien-tieu-huy.component';

@NgModule({
  declarations: [HangThuocDienTieuHuyComponent, ThemHangThuocDienTieuHuyComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangThuocDienTieuHuyComponent],
})
export class HangThuocDienTieuHuyModule {}
