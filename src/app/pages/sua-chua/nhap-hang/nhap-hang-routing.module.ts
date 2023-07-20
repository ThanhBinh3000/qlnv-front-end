import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapHangComponent } from './nhap-hang.component';
import { QuyetDinhNhComponent } from './quyet-dinh-nh/quyet-dinh-nh.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { BangKeNhapComponent } from './bang-ke-nhap/bang-ke-nhap.component';
import { BbKthucNhapComponent } from './bb-kthuc-nhap/bb-kthuc-nhap.component';
import { ThemMoiQdnhComponent } from './quyet-dinh-nh/them-moi-qdnh/them-moi-qdnh.component';
import { ThemMoiPnkComponent } from './phieu-nhap-kho/them-moi-pnk/them-moi-pnk.component';
import { ThemMoiBknComponent } from './bang-ke-nhap/them-moi-bkn/them-moi-bkn.component';
import { ThemMoiKthucComponent } from './bb-kthuc-nhap/them-moi-kthuc/them-moi-kthuc.component';

const routes: Routes = [
  {
    path: '',
    component: NhapHangComponent,
    children: [
      {
        path: '',
        redirectTo: 'giao-nv-nh',
        pathMatch: 'full',
      },
      // Region quyết định giao nv nhâp hàng
      {
        path: 'giao-nv-nh',
        component: QuyetDinhNhComponent
      },
      {
        path: 'giao-nv-nh/them-moi',
        component: ThemMoiQdnhComponent
      },
      {
        path: 'giao-nv-nh/chi-tiet/:id',
        component: ThemMoiQdnhComponent
      },
      // Region phiếu nhập kho
      {
        path: 'phieu-nhap-kho',
        component: PhieuNhapKhoComponent
      },
      {
        path: 'phieu-nhap-kho/them-moi',
        component: ThemMoiPnkComponent
      },
      {
        path: 'phieu-nhap-kho/chi-tiet/:id',
        component: ThemMoiPnkComponent
      },
      // Region bảng kê nhập vật tư
      {
        path: 'bang-ke-nhap',
        component: BangKeNhapComponent
      },
      {
        path: 'bang-ke-nhap/them-moi',
        component: ThemMoiBknComponent
      },
      {
        path: 'bang-ke-nhap/chi-tiet/:id',
        component: ThemMoiBknComponent
      },
      // Region biên bản giao nhận/kết thúc nhâp kho
      {
        path: 'bb-kt-nhap',
        component: BbKthucNhapComponent
      },
      {
        path: 'bb-kt-nhap/them-moi',
        component: ThemMoiKthucComponent
      },
      {
        path: 'bb-kt-nhap/chi-tiet/:id',
        component: ThemMoiKthucComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhapHangRoutingModule { }
