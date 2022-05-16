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


@NgModule({
  declarations: [
    DanhMucComponent,
    DanhMucDonViComponent,
    NewDonViComponent
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
export class DanhMucModule {}
