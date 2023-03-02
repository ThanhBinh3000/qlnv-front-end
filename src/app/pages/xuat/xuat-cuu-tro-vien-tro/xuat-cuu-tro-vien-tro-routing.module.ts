import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { XuatCuuTroVienTroComponent } from "./xuat-cuu-tro-vien-tro.component";

const routes: Routes = [
  {
    path: '',
    component: XuatCuuTroVienTroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XuatCuuTroVienTroRoutingModule { }
