import { DanhSachDauThauComponent } from './danh-sach-dau-thau/danh-sach-dau-thau.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { ThongTinLuongDauThauGaoComponent } from './thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';


const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
  },
  {
    path: 'them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/:id',
    component: ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
  },
  {
    path: 'thong-tin-luong-dau-thau-gao/:id',
    component: ThongTinLuongDauThauGaoComponent,
  },
  {
    path: 'thong-tin-chung-phuong-an-trinh-tong-cuc/:id',
    component: ThongTinChungPhuongAnTrinhTongCucComponent,
  }, {
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule { }
