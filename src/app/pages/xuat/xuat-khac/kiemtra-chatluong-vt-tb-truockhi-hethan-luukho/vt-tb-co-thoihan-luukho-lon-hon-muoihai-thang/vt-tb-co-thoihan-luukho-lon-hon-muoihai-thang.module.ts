import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToanBoDanhSachComponent } from './toan-bo-danh-sach/toan-bo-danh-sach.component';
import { TongHopDanhSachComponent } from './tong-hop-danh-sach/tong-hop-danh-sach.component';
import { KeHoachXuatHangCuaCucComponent } from './ke-hoach-xuat-hang-cua-cuc/ke-hoach-xuat-hang-cua-cuc.component';
import { TongHopKeHoachXuatHangComponent } from './tong-hop-ke-hoach-xuat-hang/tong-hop-ke-hoach-xuat-hang.component';
import { KeHoachXuatHangCuaTongCucComponent } from './ke-hoach-xuat-hang-cua-tong-cuc/ke-hoach-xuat-hang-cua-tong-cuc.component';



@NgModule({
  declarations: [
    ToanBoDanhSachComponent,
    TongHopDanhSachComponent,
    KeHoachXuatHangCuaCucComponent,
    TongHopKeHoachXuatHangComponent,
    KeHoachXuatHangCuaTongCucComponent
  ],
  exports: [
    ToanBoDanhSachComponent,
    TongHopDanhSachComponent,
    KeHoachXuatHangCuaCucComponent,
    TongHopKeHoachXuatHangComponent,
    KeHoachXuatHangCuaTongCucComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VtTbCoThoihanLuukhoLonHonMuoihaiThangModule { }
