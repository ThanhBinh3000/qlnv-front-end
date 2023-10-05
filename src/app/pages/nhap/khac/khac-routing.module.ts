import { RouterModule, Routes } from "@angular/router";
import { KhacComponent } from "./khac.component";
import { AuthGuard } from "../../../guard/auth.guard";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: KhacComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KhacRoutingModule{}