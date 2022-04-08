import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyLapThamDinhDuToanNSNNComponent } from './quan-ly-lap-tham-dinh-du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyLapThamDinhDuToanNSNNComponent,
  },
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tong-hop/tong-hop.module'
      ).then((m) => m.TonghopModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-DTQG-giai-doan-3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-DTQG-giai-doan-3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },

  {
    path:'tong-hop-du-toan-chi-thuong-xuyen-hang-nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/tong-hop-du-toan-chi-thuong-xuyen-hang-nam.module'
      ).then((m) => m.TongHopDuToanChiThuongXuyenHangNamModule),
  },
  {
    path:'tong-hop-du-toan-chi-thuong-xuyen-hang-nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/tong-hop-du-toan-chi-thuong-xuyen-hang-nam.module'
      ).then((m) => m.TongHopDuToanChiThuongXuyenHangNamModule),
  },
  {
    path:'tong-hop-du-toan-chi-thuong-xuyen-hang-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/tong-hop-du-toan-chi-thuong-xuyen-hang-nam.module'
      ).then((m) => m.TongHopDuToanChiThuongXuyenHangNamModule),
  },

  {
    path:'du-toan-phi-xuat-hang-dtqg-hang-nam-vtct',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.module'
      ).then((m) => m.DuToanPhiNhapXuatDtqgHangNamVtctModule),
  },
  {
    path:'du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.module'
      ).then((m) => m.DuToanPhiNhapXuatDtqgHangNamVtctModule),
  },
  {
    path:'du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.module'
      ).then((m) => m.DuToanPhiNhapXuatDtqgHangNamVtctModule),
  },
  {
    path:'du-toan-xuat-nhap-hang-dtqg-hang-nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-xuat-nhap-hang-dtqg-hang-nam/du-toan-xuat-nhap-hang-dtqg-hang-nam.module'
      ).then((m) => m.DuToanXuatNhapHangDtqgHangNamModule),
  },
  {
    path:'du-toan-xuat-nhap-hang-dtqg-hang-nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-xuat-nhap-hang-dtqg-hang-nam/du-toan-xuat-nhap-hang-dtqg-hang-nam.module'
      ).then((m) => m.DuToanXuatNhapHangDtqgHangNamModule),
  },
  {
    path:'du-toan-xuat-nhap-hang-dtqg-hang-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-xuat-nhap-hang-dtqg-hang-nam/du-toan-xuat-nhap-hang-dtqg-hang-nam.module'
      ).then((m) => m.DuToanXuatNhapHangDtqgHangNamModule),
  },

  {
    path:'ke-hoach-bao-quan-hang-nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/ke-hoach-bao-quan-hang-nam/ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.KeHoachBaoQuanHangNamModule),
  },
  {
    path:'ke-hoach-bao-quan-hang-nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/ke-hoach-bao-quan-hang-nam/ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.KeHoachBaoQuanHangNamModule),
  },
  {
    path:'ke-hoach-bao-quan-hang-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/ke-hoach-bao-quan-hang-nam/ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.KeHoachBaoQuanHangNamModule),
  },

  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-DTQG-giai-doan-3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-ung-dung-cntt-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-ung-dung-CNTT-giai-doan-3nam/dutoanchiungdungCNTTgiaidoan3nam.module')
    .then(m => m.DutoanchiungdungCNTTgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-ung-dung-cntt-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-ung-dung-CNTT-giai-doan-3nam/dutoanchiungdungCNTTgiaidoan3nam.module')
    .then(m => m.DutoanchiungdungCNTTgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-ung-dung-cntt-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-ung-dung-CNTT-giai-doan-3nam/dutoanchiungdungCNTTgiaidoan3nam.module')
    .then(m => m.DutoanchiungdungCNTTgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-mua-sam-may-moc-thiet-bi-chuyen-dung-3nam/dutoanchimuasammaymocthietbichuyendung3nam.module')
    .then(m => m.Dutoanchimuasammaymocthietbichuyendung3namModule),
  },
  {
    path:'du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-mua-sam-may-moc-thiet-bi-chuyen-dung-3nam/dutoanchimuasammaymocthietbichuyendung3nam.module')
    .then(m => m.Dutoanchimuasammaymocthietbichuyendung3namModule),
  },
  {
    path:'du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-mua-sam-may-moc-thiet-bi-chuyen-dung-3nam/dutoanchimuasammaymocthietbichuyendung3nam.module')
    .then(m => m.Dutoanchimuasammaymocthietbichuyendung3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/tonghopnhucauchingansachnhanuocgiadoan3nam.module')
    .then(m => m.Tonghopnhucauchingansachnhanuocgiadoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/tonghopnhucauchingansachnhanuocgiadoan3nam.module')
    .then(m => m.Tonghopnhucauchingansachnhanuocgiadoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/tonghopnhucauchingansachnhanuocgiadoan3nam.module')
    .then(m => m.Tonghopnhucauchingansachnhanuocgiadoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/tonghopnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Tonghopnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/tonghopnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Tonghopnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/tonghopnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Tonghopnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/chitietnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Chitietnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/chitietnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Chitietnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/chitietnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Chitietnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.module')
    .then(m => m.Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namModule),
  },
  {
    path:'tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.module')
    .then(m => m.Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namModule),
  },
  {
    path:'tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.module')
    .then(m => m.Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namModule),
  },
  {
    path:'xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-NSNN-cho-cac-don-vi/xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.module')
    .then(m => m.XaydungphuongangiaosokiemtratranchiNSNNchocacdonviModule),
  },
  {
    path:'xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/:id',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-NSNN-cho-cac-don-vi/xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.module')
    .then(m => m.XaydungphuongangiaosokiemtratranchiNSNNchocacdonviModule),
  },
  {
    path:'so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/so-kiem-tra-tran-chi-NSNN-cua-cac-don-vi/sokiemtratranchiNSNNcuacacdonvi.module')
    .then(m => m.SokiemtratranchiNSNNcuacacdonviModule),
  },
  {
    path:'so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/:id',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/so-kiem-tra-tran-chi-NSNN-cua-cac-don-vi/sokiemtratranchiNSNNcuacacdonvi.module')
    .then(m => m.SokiemtratranchiNSNNcuacacdonviModule),
  },
  {
    path: 'xay-dung-ke-hoach-von-dau-tu',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-danh-muc-von-dau-tu-xdcb-3-nam/xay-dung-ke-hoach-von-dau-tu.module'
      ).then((m) => m.XayDungKeHoachVonDauTuModule),
  },
  {
    path: 'xay-dung-ke-hoach-von-dau-tu/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-danh-muc-von-dau-tu-xdcb-3-nam/xay-dung-ke-hoach-von-dau-tu.module'
      ).then((m) => m.XayDungKeHoachVonDauTuModule),
  },
  {
    path: 'xay-dung-ke-hoach-von-dau-tu/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-danh-muc-von-dau-tu-xdcb-3-nam/xay-dung-ke-hoach-von-dau-tu.module'
      ).then((m) => m.XayDungKeHoachVonDauTuModule),
  },
  {
    path: 'xay-dung-nhu-cau-nhap-xuat-hang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-nhu-cau-nhap-xuat-hang-nam/xay-dung-nhu-cau-nhap-xuat-hang-nam.module'
      ).then((m) => m.XayDungNhuCauNhapXuatHangNamModule),
  },
  {
    path: 'xay-dung-nhu-cau-nhap-xuat-hang-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-nhu-cau-nhap-xuat-hang-nam/xay-dung-nhu-cau-nhap-xuat-hang-nam.module'
      ).then((m) => m.XayDungNhuCauNhapXuatHangNamModule),
  },
  {
    path: 'xay-dung-nhu-cau-nhap-xuat-hang-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-nhu-cau-nhap-xuat-hang-nam/xay-dung-nhu-cau-nhap-xuat-hang-nam.module'
      ).then((m) => m.XayDungNhuCauNhapXuatHangNamModule),
  },
  {
    path: 'xay-dung-ke-hoach-bao-quan-hang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-bao-quan-hang-nam/xay-dung-ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.XayDungKeHoachBaoQuanHangNamModule),
  },
  {
    path: 'xay-dung-ke-hoach-bao-quan-hang-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-bao-quan-hang-nam/xay-dung-ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.XayDungKeHoachBaoQuanHangNamModule),
  },
  {
    path: 'xay-dung-ke-hoach-bao-quan-hang-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-bao-quan-hang-nam/xay-dung-ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.XayDungKeHoachBaoQuanHangNamModule),
  },
  {
    path: 'nhu-cau-xuat-hang-vien-tro',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-xuat-hang-vien-tro/nhu-cau-xuat-hang-vien-tro.module'
      ).then((m) => m.NhuCauXuatHangVienTroModule),
  },
  {
    path: 'nhu-cau-xuat-hang-vien-tro/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-xuat-hang-vien-tro/nhu-cau-xuat-hang-vien-tro.module'
      ).then((m) => m.NhuCauXuatHangVienTroModule),
  },
  {
    path: 'nhu-cau-xuat-hang-vien-tro/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-xuat-hang-vien-tro/nhu-cau-xuat-hang-vien-tro.module'
      ).then((m) => m.NhuCauXuatHangVienTroModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong3-nam/xay-dung-ke-hoach-quy-tien-luong3-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuong3NamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong3-nam/xay-dung-ke-hoach-quy-tien-luong3-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuong3NamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong3-nam/xay-dung-ke-hoach-quy-tien-luong3-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuong3NamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong-hang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong-hang-nam/xay-dung-ke-hoach-quy-tien-luong-hang-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuongHangNamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong-hang-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong-hang-nam/xay-dung-ke-hoach-quy-tien-luong-hang-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuongHangNamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong-hang-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong-hang-nam/xay-dung-ke-hoach-quy-tien-luong-hang-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuongHangNamModule),
  },
  {
    path: 'thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.module'
      ).then((m) => m.ThuyetMinhChiDeTaiDuAnNghienCuuKhModule),
  },
  {
    path: 'thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.module'
      ).then((m) => m.ThuyetMinhChiDeTaiDuAnNghienCuuKhModule),
  },
  {
    path: 'thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.module'
      ).then((m) => m.ThuyetMinhChiDeTaiDuAnNghienCuuKhModule),
  },
  {
    path:'nhu-cau-ke-hoach-dtxd3-nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/nhu-cau-ke-hoach-dtxd3-nam/nhu-cau-ke-hoach-dtxd3-nam.module')
    .then(m => m.NhuCauKeHoachDtxd3NamModule),
  },
  {
    path:'nhu-cau-ke-hoach-dtxd3-nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/nhu-cau-ke-hoach-dtxd3-nam/nhu-cau-ke-hoach-dtxd3-nam.module')
    .then(m => m.NhuCauKeHoachDtxd3NamModule),
  },
  {
    path:'nhu-cau-ke-hoach-dtxd3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/nhu-cau-ke-hoach-dtxd3-nam/nhu-cau-ke-hoach-dtxd3-nam.module')
    .then(m => m.NhuCauKeHoachDtxd3NamModule),
  },

  {
    path:'ke-hoach-quy-tien-luong-nam-n1',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-quy-tien-luong-nam-n1/ke-hoach-quy-tien-luong-nam-n1.module')
    .then(m => m.KeHoachQuyTienLuongNamN1Module),
  },
  {
    path:'ke-hoach-quy-tien-luong-nam-n1/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-quy-tien-luong-nam-n1/ke-hoach-quy-tien-luong-nam-n1.module')
    .then(m => m.KeHoachQuyTienLuongNamN1Module),
  },
  {
    path:'ke-hoach-quy-tien-luong-nam-n1/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-quy-tien-luong-nam-n1/ke-hoach-quy-tien-luong-nam-n1.module')
    .then(m => m.KeHoachQuyTienLuongNamN1Module),
  },
  {
    path:'ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam.module')
    .then(m => m.KeHoachDuToanCaiTaoSuaChuaHtKt3NamModule),
  },
  {
    path:'ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam.module')
    .then(m => m.KeHoachDuToanCaiTaoSuaChuaHtKt3NamModule),
  },
  {
    path:'ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam.module')
    .then(m => m.KeHoachDuToanCaiTaoSuaChuaHtKt3NamModule),
  },
  {
    path:'du-toan-chi-du-tru-quoc-gia-gd3-nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-du-tru-quoc-gia-gd3-nam/du-toan-chi-du-tru-quoc-gia-gd3-nam.module')
    .then(m => m.DuToanChiDuTruQuocGiaGd3NamModule),
  },
  {
    path:'du-toan-chi-du-tru-quoc-gia-gd3-nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-du-tru-quoc-gia-gd3-nam/du-toan-chi-du-tru-quoc-gia-gd3-nam.module')
    .then(m => m.DuToanChiDuTruQuocGiaGd3NamModule),
  },
  {
    path:'du-toan-chi-du-tru-quoc-gia-gd3-nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/du-toan-chi-du-tru-quoc-gia-gd3-nam/du-toan-chi-du-tru-quoc-gia-gd3-nam.module')
    .then(m => m.DuToanChiDuTruQuocGiaGd3NamModule),
  },
  {
    path: 'tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn',
    loadChildren: () =>
      import(
        './Phuongangiaosokiemtratranchi/tim-kiem-phuong-an-QDCV-giao-so-kiem-tra-NSNN/timkiemphuonganQDCVgiaosokiemtraNSNN.module'
      ).then((m) => m.TimkiemphuonganQDCVgiaosokiemtraNSNNModule),
  },
  {
    path: 'tim-kiem-so-kiem-tra-tran-chi-nsnn-cua-cac-don-vi',
    loadChildren: () =>
      import(
        './Phuongangiaosokiemtratranchi/tim-kiem-so-kiem-tra-tran-chi-NSNN-cua-cac-don-vi/timkiemsokiemtratranchiNSNNcuacacdonvi.module'
      ).then((m) => m.TimkiemsokiemtratranchiNSNNcuacacdonviModule),
  },
  {
    path: 'qd-cv-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './Phuongangiaosokiemtratranchi/QDCV-giao-so-kiem-tra-tran-chi-NSNN-cho-cac-don-vi/QDCVgiaosokiemtratranchiNSNNchocacdonvi.module'
      ).then((m) => m.QDCVgiaosokiemtratranchiNSNNchocacdonviModule),
  },

  {
    path: 'danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn',
    loadChildren: () =>
      import(
        './nhom-cuc-nang-cuc-khu-vuc/danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn/danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn.module'
      ).then((m) => m.DanhSachVanBanGuiTcdtVeDuToanNsnnModule),
  },
  {
    path: 'van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam',
    loadChildren: () =>
      import(
        './nhom-cuc-nang-cuc-khu-vuc/van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam/van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.module'
      ).then((m) => m.VanBanGuiTcdtVeNsnnVaKhtc3NamModule),
  },
  {
    path: 'van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam/:id',
    loadChildren: () =>
      import(
        './nhom-cuc-nang-cuc-khu-vuc/van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam/van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.module'
      ).then((m) => m.VanBanGuiTcdtVeNsnnVaKhtc3NamModule),
  },
  {
    path:'ke-hoach-dao-tao-boi-duong-3-nam-tc',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module')
    .then(m => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path:'ke-hoach-dao-tao-boi-duong-3-nam-tc/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module')
    .then(m => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path:'ke-hoach-dao-tao-boi-duong-3-nam-tc/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module')
    .then(m => m.KeHoachDaoTaoBoiDuong3NamModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
