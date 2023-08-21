  import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuaChuaComponent } from "src/app/pages/sua-chua/sua-chua.component";
import { DanhSachSuaChuaComponent } from "src/app/pages/sua-chua/danh-sach-sua-chua/danh-sach-sua-chua.component";
import { TongHopComponent } from './tong-hop/tong-hop.component';
import { TrinhThamDinhComponent } from './trinh-tham-dinh/trinh-tham-dinh.component';
import { QuyetDinhComponent } from './quyet-dinh/quyet-dinh.component';
import { XuatHangComponent } from './xuat-hang/xuat-hang.component';
import { KiemTraClComponent } from './kiem-tra-cl/kiem-tra-cl.component';
import { NhapHangComponent } from './nhap-hang/nhap-hang.component';
import { BaoCaoComponent } from './bao-cao/bao-cao.component';
import { ThemMoiTtdComponent } from './trinh-tham-dinh/them-moi-ttd/them-moi-ttd.component';
import { ThemMoiQdComponent } from './quyet-dinh/them-moi-qd/them-moi-qd.component';
import { ThemMoiKtraclComponent } from './kiem-tra-cl/them-moi-ktracl/them-moi-ktracl.component';
import { ThemMoiBcComponent } from './bao-cao/them-moi-bc/them-moi-bc.component';

const routes: Routes = [
  {
    path: '',
    component: SuaChuaComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach',
        pathMatch: 'full',
      },
      {
        path: 'danh-sach',
        component: DanhSachSuaChuaComponent,
      },
      {
        path: 'tong-hop',
        component: TongHopComponent
      },

      // Region Trình Thẩm Định
      {
        path: 'trinh-tham-dinh',
        component: TrinhThamDinhComponent
      },
      {
        path: 'trinh-tham-dinh/them-moi',
        component: ThemMoiTtdComponent
      },
      {
        path: 'trinh-tham-dinh/chi-tiet/:id',
        component: ThemMoiTtdComponent
      },

      // Region Quyết định
      {
        path: 'quyet-dinh',
        component: QuyetDinhComponent
      },
      {
        path: 'quyet-dinh/them-moi',
        component: ThemMoiQdComponent
      },
      {
        path: 'quyet-dinh/chi-tiet/:id',
        component: ThemMoiQdComponent
      },

      // Region xuất hàng
      {
        path: 'xuat-hang',
        loadChildren: () =>
          import(
            '../sua-chua/xuat-hang/xuat-hang.module'
          ).then((m) => m.XuatHangModule),
      },

      // Region kiểm tra chất lượng
      {
        path: 'kiem-tra-cl',
        component: KiemTraClComponent
      },
      {
        path: 'kiem-tra-cl/them-moi',
        component: ThemMoiKtraclComponent
      },
      {
        path: 'kiem-tra-cl/chi-tiet/:id',
        component: ThemMoiKtraclComponent
      },
      // Region nhập hàng
      {
        path: 'nhap-hang',
        loadChildren: () =>
          import(
            '../sua-chua/nhap-hang/nhap-hang.module'
          ).then((m) => m.NhapHangModule),
      },
      // region Báo cáo
      {
        path: 'bao-cao',
        component: BaoCaoComponent
      },
      {
        path: 'bao-cao/them-moi',
        component: ThemMoiBcComponent
      },
      {
        path: 'bao-cao/chi-tiet/:id',
        component: ThemMoiBcComponent
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuaChuaRoutingModule { }
