import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaoCaoTheoTtqdComponent} from "./bao-cao-theo-ttqd.component";

const routes: Routes = [
  {
    path: '',
    component: BaoCaoTheoTtqdComponent,
    /*canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'thong-tu1452013',
            pathMatch: 'full',
          },
          {
            path: 'thong-tu1452013',
            component: ThongTu1452013Component,
            canActivate: [AuthGuard],
          }
        ],*/
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaoCaoTheoTtqdRoutingModule {
}
