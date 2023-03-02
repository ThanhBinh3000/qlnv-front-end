import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { XuatCapComponent } from "./xuat-cap.component";

const routes: Routes = [
  {
    path: "",
    component: XuatCapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatCapRoutingModule {
}
