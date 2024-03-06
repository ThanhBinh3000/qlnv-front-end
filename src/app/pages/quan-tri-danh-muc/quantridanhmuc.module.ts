import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { QuanTriDanhMucRoutingModule } from './quantridanhmuc-routing.module';
import { QuanTriDanhMucComponent } from './quantridanhmuc.component';
import { DanhMucDungChungComponent } from './danh-muc-dung-chung/danh-muc-dung-chung.component';
import { ThemDanhMucDungChungComponent } from './danh-muc-dung-chung/them-danh-muc-dung-chung/them-danh-muc-dung-chung.component';
import { DanhMucDonViComponent } from './danh-muc-don-vi/danh-muc-don-vi.component';
import { NewDonViComponent } from './danh-muc-don-vi/new-don-vi/new-don-vi.component';
import {DanhMucDinhMucPhiComponent} from "./danh-muc-dinh-muc-phi/danh-muc-dinh-muc-phi-component";
import { DanhMucHangHoaComponent } from './danh-muc-hang-hoa/danh-muc-hang-hoa.component';
import { NewHangHoaComponent } from './danh-muc-hang-hoa/new-hang-hoa/new-hang-hoa.component';
import { DanhMucCongCuDungCuComponent } from './danh-muc-cong-cu-dung-cu/danh-muc-cong-cu-dung-cu.component';
import { DanhMucTaiSanComponent } from './danh-muc-tai-san/danh-muc-tai-san.component';
import { DanhMucThuKhoComponent } from './danh-muc-thu-kho/danh-muc-thu-kho.component';
import { DanhMucDviLqComponent } from './danh-muc-dvi-lq/danh-muc-dvi-lq.component';
import { ThemMoiDmDviLqComponent } from './danh-muc-dvi-lq/them-moi-dm-dvi-lq/them-moi-dm-dvi-lq.component';
import { ThemmoiThukhoComponent } from './danh-muc-thu-kho/themmoi-thukho/themmoi-thukho.component';
import {DanhMucDinhMucHaoHutComponent} from "./danh-muc-dinh-muc-hao-hut/danh-muc-dinh-muc-hao-hut.component";
import { DanhMucCtieuChatLuongComponent } from './danh-muc-ctieu-chat-luong/danh-muc-ctieu-chat-luong.component';
import { ThemMoiDanhMucCtieuChatLuongComponent } from './danh-muc-ctieu-chat-luong/them-moi-danh-muc-ctieu-chat-luong/them-moi-danh-muc-ctieu-chat-luong.component';
import {ThemMoiDmHaoHutComponent} from "./danh-muc-dinh-muc-hao-hut/them-moi-dm-hao-hut/them-moi-dm-hao-hut.component";


@NgModule({
    declarations: [
        QuanTriDanhMucComponent,
        DanhMucDungChungComponent,
        ThemDanhMucDungChungComponent,
        DanhMucDonViComponent,
        NewDonViComponent,
        DanhMucDinhMucPhiComponent,
        DanhMucHangHoaComponent,
        NewHangHoaComponent,
        DanhMucCongCuDungCuComponent,
        DanhMucTaiSanComponent,
        DanhMucThuKhoComponent,
        DanhMucDviLqComponent,
        ThemMoiDmDviLqComponent,
        ThemmoiThukhoComponent,
        DanhMucDinhMucHaoHutComponent,
        DanhMucCtieuChatLuongComponent,
        ThemMoiDanhMucCtieuChatLuongComponent,
        ThemMoiDmHaoHutComponent
    ],
  imports: [CommonModule, QuanTriDanhMucRoutingModule, ComponentsModule, MainModule, NzTreeViewModule],

})
export class QuanTriDanhMucModule { }
