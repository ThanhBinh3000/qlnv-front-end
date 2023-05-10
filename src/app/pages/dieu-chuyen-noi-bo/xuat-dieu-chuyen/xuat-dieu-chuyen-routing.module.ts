import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import {XuatDieuChuyenComponent} from "./xuat-dieu-chuyen.component";

const routes: Routes = [
  {
    path: '',
    component: XuatDieuChuyenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XuatDieuChuyenRoutingModule { }
