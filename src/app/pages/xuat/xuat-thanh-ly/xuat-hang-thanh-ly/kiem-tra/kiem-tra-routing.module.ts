import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemTraComponent} from "./kiem-tra.component";

const routes: Routes = [
  {
    path: '',
    component: KiemTraComponent,
    children: [
      {
        path: '',
        redirectTo: 'bien-ban-lay-mau',
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiemTraRoutingModule { }
