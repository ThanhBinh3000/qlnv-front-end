import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './luong-thuc/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThongTinLuongDauThauGaoComponent } from './luong-thuc/thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './luong-thuc/thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';

import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { LuongDauThauGaoComponent } from './luong-thuc/luong-dau-thau-gao/luong-dau-thau-gao.component';
import { DanhSachDauThauComponent } from './luong-thuc/danh-sach-dau-thau/danh-sach-dau-thau.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './luong-thuc/quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './luong-thuc/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinDauThauComponent } from './luong-thuc/thong-tin-dau-thau/thong-tin-dau-thau.component';
import { ChiTietThongTinDauThauComponent } from './luong-thuc/chi-tiet-thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau.component';
import { DauThauTabComponent } from './dau-thau-tab/dau-thau-tab.component';
import { KeHoachLuaChonNhaThauVatTuComponent } from './vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu.component';

@NgModule({
  declarations: [
    DauThauComponent,
    ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
    ThongTinLuongDauThauGaoComponent,
    ThongTinChungPhuongAnTrinhTongCucComponent,
    LuongDauThauGaoComponent,
    DanhSachDauThauComponent,
    QuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinDauThauComponent,
    ChiTietThongTinDauThauComponent,
    DauThauTabComponent,
    KeHoachLuaChonNhaThauVatTuComponent,
  ],
  imports: [CommonModule, DauThauRoutingModule, ComponentsModule],
})
export class DauThauModule { }
