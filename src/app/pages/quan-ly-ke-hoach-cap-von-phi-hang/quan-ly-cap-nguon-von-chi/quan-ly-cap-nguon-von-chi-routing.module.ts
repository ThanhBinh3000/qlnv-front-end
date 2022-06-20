import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';

const routes: Routes = [
	{
		path: '',
		component: QuanLyCapNguonVonChiNSNNComponent,
	},
	//tim kiem danh sach
	{
		path: 'tim-kiem/:loai',
		loadChildren: () =>
			import(
				'./tim-kiem/tim-kiem.module'
			).then((m) => m.TimKiemModule),
	},
	{
		path: 'danh-sach-de-nghi-tu-cuc-khu-cuc',
		loadChildren: () =>
			import(
				'./danh-sach-de-nghi-tu-cuc-khu-cuc/danh-sach-de-nghi-tu-cuc-khu-cuc.module'
			).then((m) => m.DanhSachDeNghiTuCucKhuVucModule),
	},
	{
		path: 'tong-hop-tu-cuc-khu-vuc/:loai/:id',
		loadChildren: () =>
			import(
				'./tong-hop-tu-cuc-khu-vuc/tong-hop-tu-cuc-khu-vuc.module'
			).then((m) => m.TongHopTuCucKhuVucModule),
	},
	{
		path: 'tong-hop-tu-cuc-khu-vuc',
		loadChildren: () =>
			import(
				'./tong-hop-tu-cuc-khu-vuc/tong-hop-tu-cuc-khu-vuc.module'
			).then((m) => m.TongHopTuCucKhuVucModule),
	},
	{
		path: 'tong-hop-tai-tong-cuc/:loai/:id',
		loadChildren: () =>
			import(
				'./tong-hop-tai-tong-cuc/tong-hop-tai-tong-cuc.module'
			).then((m) => m.TongHopTaiTongCucModule),
	},
	{
		path: 'tong-hop-tai-tong-cuc',
		loadChildren: () =>
			import(
				'./tong-hop-tai-tong-cuc/tong-hop-tai-tong-cuc.module'
			).then((m) => m.TongHopTaiTongCucModule),
	},
	{
		path: 'tong-hop/:loai',
		loadChildren: () =>
			import(
				'./tong-hop/tong-hop.module'
			).then((m) => m.TonghopModule),
	},
	{
		path: 'de-nghi-theo-quyet-dinh-trung-thau',
		loadChildren: () =>
			import(
				'./de-nghi-theo-quyet-dinh-trung-thau/de-nghi-theo-quyet-dinh-trung-thau.module'
			).then((m) => m.DeNghiTheoQuyetDinhTrungThauModule),
	},
	{
		path: 'de-nghi-theo-quyet-dinh-trung-thau/:loai/:id',
		loadChildren: () =>
			import(
				'./de-nghi-theo-quyet-dinh-trung-thau/de-nghi-theo-quyet-dinh-trung-thau.module'
			).then((m) => m.DeNghiTheoQuyetDinhTrungThauModule),
	},
	{
		path: 'de-nghi-theo-quyet-dinh-trung-thau/:id',
		loadChildren: () =>
			import(
				'./de-nghi-theo-quyet-dinh-trung-thau/de-nghi-theo-quyet-dinh-trung-thau.module'
			).then((m) => m.DeNghiTheoQuyetDinhTrungThauModule),
	},
	{
		path: 'de-nghi-theo-quyet-dinh-don-gia-mua',
		loadChildren: () =>
			import(
				'./de-nghi-theo-quyet-dinh-don-gia-mua/de-nghi-theo-quyet-dinh-don-gia-mua.module'
			).then((m) => m.DeNghiTheoQuyetDinhDonGiaMuaModule),
	},
	{
		path: 'de-nghi-theo-quyet-dinh-don-gia-mua/:loai/:id',
		loadChildren: () =>
			import(
				'./de-nghi-theo-quyet-dinh-don-gia-mua/de-nghi-theo-quyet-dinh-don-gia-mua.module'
			).then((m) => m.DeNghiTheoQuyetDinhDonGiaMuaModule),
	},
	{
		path: 'de-nghi-theo-quyet-dinh-don-gia-mua/:id',
		loadChildren: () =>
			import(
				'./de-nghi-theo-quyet-dinh-don-gia-mua/de-nghi-theo-quyet-dinh-don-gia-mua.module'
			).then((m) => m.DeNghiTheoQuyetDinhDonGiaMuaModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
}) 
export class QuanLyCapNguonVonChiNSNNRoutingModule { }
