import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzAffixModule} from 'ng-zorro-antd/affix';
import {ComponentsModule} from 'src/app/components/components.module';
import {MainModule} from 'src/app/layout/main/main.module';
import {DirectivesModule} from './../../directives/directives.module';
import {DinhMucPhiComponent} from './dinh-muc-phi-bao-quan/dinh-muc-phi.component';
import {DinhMucRoutingModule} from './dinh-muc-routing.module';
import {DinhMucComponent} from './dinh-muc.component';
import {
  DinhMucPhiNhapXuatBaoQuanComponent
} from "./dinh-muc-phi-bao-quan/dinh-muc-phi-nhap-xuat-bao-quan/dinh-muc-phi-nhap-xuat-bao-quan.component";
import {
  ThongTinDinhMucPhiNhapXuatBaoQuanComponent
} from "./dinh-muc-phi-bao-quan/dinh-muc-phi-nhap-xuat-bao-quan/thong-tin-dinh-muc-phi-nhap-xuat-bao-quan/thong-tin-dinh-muc-phi-nhap-xuat-bao-quan.component";
import { DinhMucTrangBiCongCuDungCuComponent } from './dinh-muc-trang-bi-cong-cu-dung-cu/dinh-muc-trang-bi-cong-cu-dung-cu.component';
import { ThongTinDinhMucTrangBiCongCuDungCuComponent } from './dinh-muc-trang-bi-cong-cu-dung-cu/thong-tin-dinh-muc-trang-bi-cong-cu-dung-cu/thong-tin-dinh-muc-trang-bi-cong-cu-dung-cu.component';


@NgModule({
  declarations: [
    DinhMucComponent,
    DinhMucPhiComponent,
    DinhMucPhiNhapXuatBaoQuanComponent,
    ThongTinDinhMucPhiNhapXuatBaoQuanComponent,
    DinhMucTrangBiCongCuDungCuComponent,
    ThongTinDinhMucTrangBiCongCuDungCuComponent
  ],
  imports: [
    CommonModule,
    DinhMucRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
    DirectivesModule,
  ],
})
export class DinhMucModule {

}
