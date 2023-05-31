import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LapBaoCaoBoNganhComponent } from "./lap-bao-cao-bo-nganh.component";

const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoBoNganhComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoBoNganhRoutingModule {}