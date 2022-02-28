import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DieuChinhThongTinChiTieuKeHoachNamRoutingModule } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc-routing.module';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { LuaChonInComponent } from './lua-chon-in/lua-chon-in.component';
import { ThongTinLuongThucComponent } from './thong-tin-luong-thuc/thong-tin-luong-thuc.component';
import { ThongTinVatTuTrongNamComponent } from './thong-tin-vat-tu-trong-nam/thong-tin-vat-tu-trong-nam.component';
import { DanhSachVatTuHangHoaComponent } from './thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa/danh-sach-vat-tu-hang-hoa.component';

@NgModule({
  declarations: [
    DieuChinhThongTinChiTieuKeHoachNamComponent,
    LuaChonInComponent,
    ThongTinLuongThucComponent,
    ThongTinVatTuTrongNamComponent,
    DanhSachVatTuHangHoaComponent,
  ],
  imports: [
    CommonModule,
    DieuChinhThongTinChiTieuKeHoachNamRoutingModule,
    ComponentsModule,
  ],
})
export class DieuChinhThongTinChiTieuKeHoachNamModule { }
