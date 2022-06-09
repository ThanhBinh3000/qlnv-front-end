import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyCapVonMuaBanTtTienHangDtqgComponent } from './quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.component';

const routes: Routes = [
	{
		path: '',
		component: QuanLyCapVonMuaBanTtTienHangDtqgComponent,
	},
	//danh sach
	{
		path: 'ghi-nhan-tai-tong-cuc',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-ghi-nhan-cap-von-ung-von-tu-dvct/ghi-nhan-tai-tong-cuc/ghi-nhan-tai-tong-cuc.module'
			).then((m) => m.GhiNhanTaiTongCucModule),
	},
	{
		path: 'ghi-nhan-tai-cuc-kv-chi-cuc',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-ghi-nhan-cap-von-ung-von-tu-dvct/ghi-nhan-tai-cuc-kv-chi-cuc/ghi-nhan-tai-cuc-kv-chi-cuc.module'
			).then((m) => m.GhiNhanTaiCucKvChiCucModule),
	},
	{
		path: 'danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi/danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi.module'
			).then((m) => m.DanhSachCapVonUngVonChoDonViCapDuoiModule),
	},
	{
		path: 'danh-sach-nhap-von-ban-hang',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-nhap-von-ban-hang/danh-sach-nhap-von-ban-hang.module'
			).then((m) => m.DanhSachNhapVonBanHangModule),
	},
	{
		path: 'danh-sach-ghi-nhan-von-ban-hang',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-ghi-nhan-von-ban-hang/danh-sach-ghi-nhan-von-ban-hang.module'
			).then((m) => m.DanhSachGhiNhanVonBanHangModule),
	},
	{
		path: 'danh-sach-nop-tien-thua',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-nop-tien-thua/danh-sach-nop-tien-thua.module'
			).then((m) => m.DanhSachNopTienThuaModule),
	},
	{
		path: 'danh-sach-ghi-nhan-tien-von-thua',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-ghi-nhan-tien-von-thua/danh-sach-ghi-nhan-tien-von-thua.module'
			).then((m) => m.DanhSachGhiNhanTienVonThuaModule),
	},
	{
		path: 'danh-sach-thanh-toan-cho-khach-hang',
		loadChildren: () =>
			import(
				'./danh-sach/danh-sach-thanh-toan-cho-khach-hang/danh-sach-thanh-toan-cho-khach-hang.module'
			).then((m) => m.DanhSachThanhToanChoKhachHangModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class QuanLyCapVonMuaBanTtTienHangDtqgRoutingModule { }
