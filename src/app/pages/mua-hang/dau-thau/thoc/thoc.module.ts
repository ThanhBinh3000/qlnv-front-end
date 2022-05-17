import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ChiTietThongTinDauThauComponent } from './chi-tiet-thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau.component';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { PhuongAnTrinhTongCucComponent } from './phuong-an-trinh-tong-cuc/phuong-an-trinh-tong-cuc.component';
import { QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent } from './quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThocRoutingModule } from './thoc-routing.module';
import { ThocComponent } from './thoc.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';
import { ThongTinDauThauComponent } from './thong-tin-dau-thau/thong-tin-dau-thau.component';
import { ThongTinLuongDauThauGaoComponent } from './thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent } from './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';

@NgModule({
  declarations: [
    ThocComponent,
    LuongDauThauGaoComponent,
    ThongTinLuongDauThauGaoComponent,
    PhuongAnTrinhTongCucComponent,
    ThongTinChungPhuongAnTrinhTongCucComponent,
    QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
    ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
    ThongTinDauThauComponent,
    ChiTietThongTinDauThauComponent,
    QuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
  ],
  imports: [
    CommonModule,
    ThocRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class ThocModule { }