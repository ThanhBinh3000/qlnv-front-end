import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietThongTinDauThauComponent } from './chi-tiet-thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau.component';
import { DanhSachDauThauComponent } from './danh-sach-dau-thau/danh-sach-dau-thau.component';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { PhuongAnTrinhTongCucComponent } from './phuong-an-trinh-tong-cuc/phuong-an-trinh-tong-cuc.component';
import { QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent } from './quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { ThocComponent } from './thoc.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';
import { ThongTinDauThauComponent } from './thong-tin-dau-thau/thong-tin-dau-thau.component';
import { ThongTinLuongDauThauGaoComponent } from './thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent } from './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';

const routes: Routes = [
  {
    path: '',
    component: ThocComponent,
    children: [
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        component: LuongDauThauGaoComponent,
      },
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/:id',
        component: ThongTinLuongDauThauGaoComponent,
      },
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        component: DanhSachDauThauComponent,
      },
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-cuc/:id',
        component: ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc',
        component: PhuongAnTrinhTongCucComponent,
      },
      {
        path: 'phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc/:id',
        component: ThongTinChungPhuongAnTrinhTongCucComponent,
      },
      {
        path: 'phuong-an-ke-hoach-lua-chon-nha-thau-cuc',
        component: PhuongAnTrinhTongCucComponent,
      },
      {
        path: 'phuong-an-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-phuong-an-ke-hoach-lua-chon-nha-thau-cuc/:id',
        component: ThongTinChungPhuongAnTrinhTongCucComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-tong-cuc',
        component: QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-tong-cuc/:id',
        component: ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-cuc',
        component: QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-cuc/:id',
        component: ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'nhap-thong-tin-dau-thau-cuc',
        component: ThongTinDauThauComponent,
      },
      {
        path: 'nhap-thong-tin-dau-thau-cuc/thong-tin-nhap-thong-tin-dau-thau-cuc/:id',
        component: ChiTietThongTinDauThauComponent,
      },
      {
        path: 'nhap-quyet-dinh-ket-qua-nha-thau-cuc',
        component: QuyetDinhPheDuyetKetQuaLCNTComponent,
      },
      {
        path: 'nhap-quyet-dinh-ket-qua-nha-thau-cuc/thong-tin-nhap-quyet-dinh-ket-qua-nha-thau-cuc/:id',
        component: ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThocRoutingModule { }
