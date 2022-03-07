import { DanhSachDauThauComponent } from './luong-thuc/danh-sach-dau-thau/danh-sach-dau-thau.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './luong-thuc/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { ThongTinLuongDauThauGaoComponent } from './luong-thuc/thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './luong-thuc/thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';
import { LuongDauThauGaoComponent } from './luong-thuc/luong-dau-thau-gao/luong-dau-thau-gao.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './luong-thuc/quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './luong-thuc/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';

import { ThongTinDauThauComponent } from './luong-thuc/thong-tin-dau-thau/thong-tin-dau-thau.component';
import { ChiTietThongTinDauThauComponent } from './luong-thuc/chi-tiet-thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau.component';
import { KeHoachLuaChonNhaThauVatTuComponent } from './vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu.component';

const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
  },
  {
    path: 'danh-sach-dau-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/:id',
    component: ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
  },
  {
    path: 'luong-dau-thau-gao/thong-tin-luong-dau-thau-gao/:id',
    component: ThongTinLuongDauThauGaoComponent,
  },
  {
    path: 'luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/:id',
    component: ThongTinChungPhuongAnTrinhTongCucComponent,
  },
  {
    path: 'luong-dau-thau-gao',
    component: LuongDauThauGaoComponent,
  },
  {
    path: 'danh-sach-dau-thau',
    component: DanhSachDauThauComponent,
  },
  {
    path: 'quyet-dinh-phe-duyet-ket-qua-lcnt',
    component: QuyetDinhPheDuyetKetQuaLCNTComponent,
  },
  {
    path: 'quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/:id',
    component: ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
  },
  {
    path: 'thong-tin-dau-thau',
    component: ThongTinDauThauComponent,
  },
  {
    path: 'thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau/:id',
    component: ChiTietThongTinDauThauComponent,
  },
  {
    path: 'ke-hoach-lua-chon-nha-thau-vat-tu',
    component: KeHoachLuaChonNhaThauVatTuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule { }
