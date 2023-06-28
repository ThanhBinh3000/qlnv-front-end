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


@NgModule({
  declarations: [VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent, VtTbCoThoihanLuukhoConSauThangComponent],
  imports: [
    CommonModule,
    VtTbCoThoihanLuukhoConSauThangModule,
    VtTbCoThoihanLuukhoLonHonMuoihaiThangModule
  ],
  exports: [
    VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent, VtTbCoThoihanLuukhoConSauThangComponent
  ],
  providers: [DatePipe]
})
export class KiemtraChatluongVtTbTruockhiHethanLuukhoModule {
}
