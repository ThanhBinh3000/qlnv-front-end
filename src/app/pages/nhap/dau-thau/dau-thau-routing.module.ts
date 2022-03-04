import { DanhSachDauThauComponent } from './danh-sach-dau-thau/danh-sach-dau-thau.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';

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
    path: 'luong-dau-thau-gao',
    component: LuongDauThauGaoComponent,
  },
  {
    path: 'danh-sach-dau-thau',
    component: DanhSachDauThauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule {}
