import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {
  VtTbCoThoihanLuukhoConSauThangModule
} from "./vt-tb-co-thoihan-luukho-con-sau-thang/vt-tb-co-thoihan-luukho-con-sau-thang.module";
import {
  VtTbCoThoihanLuukhoLonHonMuoihaiThangModule
} from "./vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang/vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang.module";
import {
  VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent
} from "./vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang/vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang.component";
import {
  VtTbCoThoihanLuukhoConSauThangComponent
} from "./vt-tb-co-thoihan-luukho-con-sau-thang/vt-tb-co-thoihan-luukho-con-sau-thang.component";
import {NzAffixModule} from "ng-zorro-antd/affix";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzTransitionPatchModule} from "ng-zorro-antd/core/transition-patch/transition-patch.module";
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
  declarations: [VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent, VtTbCoThoihanLuukhoConSauThangComponent],
  imports: [
    CommonModule,
    VtTbCoThoihanLuukhoConSauThangModule,
    VtTbCoThoihanLuukhoLonHonMuoihaiThangModule,
    NzMenuModule,
    ComponentsModule,
  ],
  exports: [
    VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent, VtTbCoThoihanLuukhoConSauThangComponent
  ],
  providers: [DatePipe]
})
export class KiemtraChatluongVtTbTruockhiHethanLuukhoModule {
}
