import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucDonViComponent } from './danh-muc-don-vi/danh-muc-don-vi.component';
import { DanhMucDungChungComponent } from './danh-muc-dung-chung/danh-muc-dung-chung.component';
import { QuanTriDanhMucComponent } from './quantridanhmuc.component';
import {DanhMucDinhMucPhiComponent} from "./danh-muc-dinh-muc-phi/danh-muc-dinh-muc-phi-component";
import {DanhMucHangHoaComponent} from "./danh-muc-hang-hoa/danh-muc-hang-hoa.component";
import {DanhMucCongCuDungCuComponent} from "./danh-muc-cong-cu-dung-cu/danh-muc-cong-cu-dung-cu.component";
import {DanhMucTaiSanComponent} from "./danh-muc-tai-san/danh-muc-tai-san.component";
import {DanhMucDviLqComponent} from "./danh-muc-dvi-lq/danh-muc-dvi-lq.component";
import {DanhMucThuKhoComponent} from "./danh-muc-thu-kho/danh-muc-thu-kho.component";
import {DanhMucDinhMucHaoHutComponent} from "./danh-muc-dinh-muc-hao-hut/danh-muc-dinh-muc-hao-hut.component";
import {DanhMucCtieuChatLuongComponent} from "./danh-muc-ctieu-chat-luong/danh-muc-ctieu-chat-luong.component";


const routes: Routes = [
  {
    path: '',
    component: QuanTriDanhMucComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'danh-muc-dung-chung',
        component: DanhMucDungChungComponent,
      },
      {
        path: 'danh-muc-don-vi',
        component: DanhMucDonViComponent,
      },
      {
        path: 'danh-muc-dinh-muc-phi',
        component: DanhMucDinhMucPhiComponent,
      },
      {
        path: 'danh-muc-hang-hoa',
        component: DanhMucHangHoaComponent,
      },
      {
        path: 'danh-muc-cong-cu-dung-cu',
        component: DanhMucCongCuDungCuComponent,
      },
      {
        path: 'danh-muc-tai-san',
        component: DanhMucTaiSanComponent,
      },
      {
        path: 'danh-muc-dvi-lien-quan',
        component: DanhMucDviLqComponent,
      },
      {
        path: 'danh-muc-thu-kho',
        component: DanhMucThuKhoComponent,
      },
      {
        path: 'danh-muc-dinh-muc-hao-hut',
        component: DanhMucDinhMucHaoHutComponent,
      },{
        path: 'danh-muc-chi-tieu-chat-luong',
        component: DanhMucCtieuChatLuongComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriDanhMucRoutingModule { }
