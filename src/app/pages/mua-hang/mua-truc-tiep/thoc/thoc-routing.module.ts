import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent } from './phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { ThongTinPhieuNhapKhoComponent } from './phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThocComponent } from './thoc.component';

const routes: Routes = [
  {
    path: '',
    component: ThocComponent,
    children: [
      {
        path: 'phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho',
        component: PhieuKiemTraChatLuongHangDTQGNhapKhoComponent
      },
      {
        path: 'phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/thong-tin-phieu-kiem-tra-chat-luong-hang-dtqg-nhap-kho/:id',
        component: ThongTinPhieuKiemTraChatLuongHangDTQGNhapKhoComponent
      },
      {
        path: 'phieu-nhap-kho',
        component: PhieuNhapKhoComponent
      },
      {
        path: 'phieu-nhap-kho/thong-tin-phieu-nhap-kho/:id',
        component: ThongTinPhieuNhapKhoComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThocRoutingModule { }
