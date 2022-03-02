import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';

const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule {}
