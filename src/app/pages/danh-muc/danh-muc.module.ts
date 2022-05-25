import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { DanhMucComponent } from './danh-muc.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { DanhMucDonViComponent } from './danh-muc-don-vi/danh-muc-don-vi.component';
import { NewDonViComponent } from './danh-muc-don-vi/new-don-vi/new-don-vi.component';
import { DanhMucTieuChuanHangDtqgComponent } from './danh-muc-tieu-chuan-hang-dtqg/danh-muc-tieu-chuan-hang-dtqg.component';
import { ThongTinDmTieuChuanHangDtqgComponent } from './danh-muc-tieu-chuan-hang-dtqg/thong-tin-dm-tieu-chuan-hang-dtqg/thong-tin-dm-tieu-chuan-hang-dtqg.component';


@NgModule({
  declarations: [
    DanhMucComponent,
    DanhMucDonViComponent,
    NewDonViComponent,
    DanhMucTieuChuanHangDtqgComponent,
    ThongTinDmTieuChuanHangDtqgComponent,
  ],
  imports: [
    CommonModule,
    DanhMucRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
    NzTreeViewModule
  ],
})
export class DanhMucModule { }
