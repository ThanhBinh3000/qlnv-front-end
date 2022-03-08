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
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-ung-dung-cntt-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/dutoanchiungdungCNTTgiaidoan3nam/dutoanchiungdungCNTTgiaidoan3nam.module')
    .then(m => m.DutoanchiungdungCNTTgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-ung-dung-cntt-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/dutoanchiungdungCNTTgiaidoan3nam/dutoanchiungdungCNTTgiaidoan3nam.module')
    .then(m => m.DutoanchiungdungCNTTgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-ung-dung-cntt-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/dutoanchiungdungCNTTgiaidoan3nam/dutoanchiungdungCNTTgiaidoan3nam.module')
    .then(m => m.DutoanchiungdungCNTTgiaidoan3namModule),
  },
  {
    path:'du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/dutoanchimuasammaymocthietbichuyendung3nam/dutoanchimuasammaymocthietbichuyendung3nam.module')
    .then(m => m.Dutoanchimuasammaymocthietbichuyendung3namModule),
  },
  {
    path:'du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/dutoanchimuasammaymocthietbichuyendung3nam/dutoanchimuasammaymocthietbichuyendung3nam.module')
    .then(m => m.Dutoanchimuasammaymocthietbichuyendung3namModule),
  },
  {
    path:'du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/dutoanchimuasammaymocthietbichuyendung3nam/dutoanchimuasammaymocthietbichuyendung3nam.module')
    .then(m => m.Dutoanchimuasammaymocthietbichuyendung3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopnhucauchingansachnhanuocgiadoan3nam/tonghopnhucauchingansachnhanuocgiadoan3nam.module')
    .then(m => m.Tonghopnhucauchingansachnhanuocgiadoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopnhucauchingansachnhanuocgiadoan3nam/tonghopnhucauchingansachnhanuocgiadoan3nam.module')
    .then(m => m.Tonghopnhucauchingansachnhanuocgiadoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopnhucauchingansachnhanuocgiadoan3nam/tonghopnhucauchingansachnhanuocgiadoan3nam.module')
    .then(m => m.Tonghopnhucauchingansachnhanuocgiadoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopnhucauchithuongxuyengiaidoan3nam/tonghopnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Tonghopnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopnhucauchithuongxuyengiaidoan3nam/tonghopnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Tonghopnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopnhucauchithuongxuyengiaidoan3nam/tonghopnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Tonghopnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/chitietnhucauchithuongxuyengiaidoan3nam/chitietnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Chitietnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/chitietnhucauchithuongxuyengiaidoan3nam/chitietnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Chitietnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/chitietnhucauchithuongxuyengiaidoan3nam/chitietnhucauchithuongxuyengiaidoan3nam.module')
    .then(m => m.Chitietnhucauchithuongxuyengiaidoan3namModule),
  },
  {
    path:'tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.module')
    .then(m => m.Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namModule),
  },
  {
    path:'tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.module')
    .then(m => m.Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namModule),
  },
  {
    path:'tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam/tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.module')
    .then(m => m.Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namModule),
  },
  {
    path:'xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi/xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.module')
    .then(m => m.XaydungphuongangiaosokiemtratranchiNSNNchocacdonviModule),
  },
  {
    path:'xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/:id',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi/xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.module')
    .then(m => m.XaydungphuongangiaosokiemtratranchiNSNNchocacdonviModule),
  },
  {
    path:'so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/sokiemtratranchiNSNNcuacacdonvi/sokiemtratranchiNSNNcuacacdonvi.module')
    .then(m => m.SokiemtratranchiNSNNcuacacdonviModule),
  },
  {
    path:'so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/:id',
    loadChildren:() => import('./Phuongangiaosokiemtratranchi/sokiemtratranchiNSNNcuacacdonvi/sokiemtratranchiNSNNcuacacdonvi.module')
    .then(m => m.SokiemtratranchiNSNNcuacacdonviModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
