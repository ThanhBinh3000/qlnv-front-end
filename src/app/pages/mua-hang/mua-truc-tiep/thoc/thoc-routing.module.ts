import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { ThongTinPhieuNhapKhoComponent } from './phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThocComponent } from './thoc.component';

const routes: Routes = [
  {
    path: '',
    component: ThocComponent,
    children: [
      {
        path: 'phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho',
        component: PhieuKiemTraChatLuongHangDTQGNhapKhoComponent
      },
      {
        path: 'phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/:id',
        component: ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent
      },
      {
        path: 'phieu-nhap-kho',
        component: PhieuNhapKhoComponent
      },
      {
        path: 'phieu-nhap-kho/thong-tin-phieu-nhap-kho/:id',
        component: ThongTinPhieuNhapKhoComponent
      },
      {
        path: 'ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc',
        loadChildren: () =>
          import(
            '../thoc/ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc/ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc.module'
          ).then((m) => m.DsQuyetDinhMuaTrucTiepTCModule),
      },
      {
        path: 'ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc/thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc/:id',
        loadChildren: () =>
          import(
            '../thoc/thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc/thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc.module'
          ).then((m) => m.ThongTinQDPheDuyetKhMuaTrucTiepTCModule),
      },
      {
        path: 'quyet-dinh-gia-nhap-tc',
        loadChildren: () =>
          import(
            '../thoc/quyet-dinh-gia-nhap-tc/quyet-dinh-gia-nhap-tc.module'
          ).then((m) => m.QuyetDinhGiaNhapTCModule),
      },
      {
        path: 'quyet-dinh-gia-nhap-tc/thong-tin-qd-gia-nhap-tc/:id',
        loadChildren: () =>
          import(
            '../thoc/thong-tin-qd-gia-nhap-tc/thong-tin-qd-gia-nhap-tc.module'
          ).then((m) => m.ThongTinQDGiaNhapModule),
      },
      {
        path: 'ds-thong-tin-mua-truc-tiep-tc',
        loadChildren: () =>
          import(
            '../thoc/ds-thong-tin-mua-truc-tiep-tc/ds-thong-tin-mua-truc-tiep-tc.module'
          ).then((m) => m.DsThongTinMuaTrucTiepTCModule),
      },
      {
        path: 'ds-thong-tin-mua-truc-tiep-tc/thong-tin-mua-truc-tiep-tc/:id',
        loadChildren: () =>
          import(
            '../thoc/thong-tin-mua-truc-tiep-tc/thong-tin-mua-truc-tiep-tc.module'
          ).then((m) => m.ThongTinMuaTrucTiepTCModule),
      },
      {
        path: 'ds-hop-dong-mua-tc',
        loadChildren: () =>
          import('../thoc/ds-hop-dong-mua-tc/ds-hop-dong-mua-tc.module').then(
            (m) => m.DsHopDongMuaTCModule,
          ),
      },
      {
        path: 'ds-hop-dong-mua-tc/thong-tin-hop-dong-mua-tc/:id',
        loadChildren: () =>
          import(
            '../thoc/thong-tin-hop-dong-mua-tc/thong-tin-hop-dong-mua-tc.module'
          ).then((m) => m.ThongTinHopDongMuaTCModule),
      },
      {
        path: 'ds-hop-dong-mua-tc/thong-tin-hop-dong-mua-tc/:id/thong-tin-phu-luc-hop-dong-tc/:id',
        loadChildren: () =>
          import(
            '../thoc/thong-tin-phu-luc-hop-dong-tc/thong-tin-phu-luc-hop-dong-tc.module'
          ).then((m) => m.ThongTinPhuLucHopDongTCModule),
      },
      {
        path: 'ds-lenh-nhap-tc',
        loadChildren: () =>
          import('../thoc/ds-lenh-nhap-tc/ds-lenh-nhap-tc.module').then(
            (m) => m.DsLenhNhapTCModule,
          ),
      },
      {
        path: 'ds-bien-ban-nghiem-thu-ke-lot-tc',
        loadChildren: () =>
          import(
            '../thoc/ds-bien-ban-nghiem-thu-ke-lot-tc/ds-bien-ban-nghiem-thu-ke-lot-tc.module'
          ).then((m) => m.DsBienBanNghiemThuKeLotTCModule),
      },
      {
        path: 'ds-bien-ban-nghiem-thu-ke-lot-tc/thong-tin-bien-ban-nghiem-thu-ke-lot-tc/:id',
        loadChildren: () =>
          import(
            '../thoc/thong-tin-bien-ban-nghiem-thu-ke-lot-tc/thong-tin-bien-ban-nghiem-thu-ke-lot-tc.module'
          ).then((m) => m.ThongTinBienBanNghiemThuKeLotTCModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThocRoutingModule { }
