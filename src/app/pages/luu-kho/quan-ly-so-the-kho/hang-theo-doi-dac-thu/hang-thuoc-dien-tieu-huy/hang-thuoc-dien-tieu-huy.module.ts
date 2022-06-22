import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangThuocDienTieuHuyComponent } from './hang-thuoc-dien-tieu-huy.component';

@NgModule({
  declarations: [HangThuocDienTieuHuyComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangThuocDienTieuHuyComponent],
})
export class HangThuocDienTieuHuyModule {}
