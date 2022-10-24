import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SuaChuaComponent} from "./sua-chua.component";
import {DanhSachHangDtqgComponent} from "./danh-sach-hang-dtqg/danh-sach-hang-dtqg.component";
import {TongHopDanhSachComponent} from "./tong-hop-danh-sach/tong-hop-danh-sach.component";
import {QuyetDinhSuaChuaComponent} from "./quyet-dinh-sua-chua/quyet-dinh-sua-chua.component";
import {XuatHangDtqgComponent} from "./xuat-hang-dtqg/xuat-hang-dtqg.component";
import {PhieuKiemDinhClComponent} from "./phieu-kiem-dinh-cl/phieu-kiem-dinh-cl.component";
import {NhapHangDtqgComponent} from "./nhap-hang-dtqg/nhap-hang-dtqg.component";
import {BaoCaoKqComponent} from "./bao-cao-kq/bao-cao-kq.component";

const routes: Routes = [
  {
    path: '',
    component: SuaChuaComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach-hang',
        pathMatch: 'full',
      },
      {
        path: 'danh-sach-hang',
        component: DanhSachHangDtqgComponent,
      },
      {
        path: 'tong-hop-danh-sach-hang',
        component: TongHopDanhSachComponent,
      },
      {
        path: 'quyet-dinh-sua-chua',
        component: QuyetDinhSuaChuaComponent,
      },
      {
        path: 'xuat-hang-dtqg',
        component: XuatHangDtqgComponent,
      },
      {
        path: 'phieu-kiem-dinh-chat-luong',
        component: PhieuKiemDinhClComponent,
      },
      {
        path: 'nhap-hang-dtqg',
        component: NhapHangDtqgComponent,
      },
      {
        path: 'bao-cao-ket-qua',
        component: BaoCaoKqComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuaChuaRoutingModule { }
