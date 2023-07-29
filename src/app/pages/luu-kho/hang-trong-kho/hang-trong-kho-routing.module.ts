import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HangTrongKhoComponent} from "./hang-trong-kho.component";
import {TatCaComponent} from "./tat-ca/tat-ca.component";
import {TableDanhMucBpxlComponent} from "./table-danh-muc-bpxl/table-danh-muc-bpxl.component";
import {TableSapHhBhComponent} from "./table-sap-hh-bh/table-sap-hh-bh.component";
import {TableHhLkComponent} from "./table-hh-lk/table-hh-lk.component";
import {TableDaHhBhComponent} from "./table-da-hh-bh/table-da-hh-bh.component";

const routes: Routes = [
  {
    path: '',
    component: HangTrongKhoComponent,
    children: [
      {
        path: '',
        redirectTo: 'tat-ca',
        pathMatch: 'full',
      },
      //Region tất cả
      {
        path: 'tat-ca',
        component: TatCaComponent
      },
      //Region
      // Thanh lý,
      // Tiêu hủy,
      // Hỏng hóc giảm cl do nn bất khả kháng,
      // Bị hỏng cần bảo hành,
      // Bị hỏng cần sửa chữa,
      {
        path: 'thanh-ly',
        component: TableDanhMucBpxlComponent
      },
      {
        path: 'tieu-huy',
        component: TableDanhMucBpxlComponent
      },
      {
        path: 'hong-hoc-giam-cl',
        component: TableDanhMucBpxlComponent
      },
      {
        path: 'hong-hoc-bao-hanh',
        component: TableDanhMucBpxlComponent
      },
      {
        path: 'hong-hoc-sua-chua',
        component: TableDanhMucBpxlComponent
      },
      // Sắp hết hạn bảo hành
      {
        path: 'sap-het-han-bao-hanh',
        component: TableSapHhBhComponent
      },
      // Sắp hết hạn lưu kho
      {
        path: 'het-han-luu-kho',
        component: TableHhLkComponent
      },
      // Đã hết hạn bảo hành, chưa hết hạn lưu kho
      {
        path: 'da-het-han',
        component: TableDaHhBhComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HangTrongKhoRoutingModule { }
