import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LuuKhoComponent } from './luu-kho.component';
import { QuyetDinhComponent } from "../sua-chua/quyet-dinh/quyet-dinh.component";
import { ThemMoiQdComponent } from "../sua-chua/quyet-dinh/them-moi-qd/them-moi-qd.component";
import { TheoDoiBaoQuanComponent } from "./theo-doi-bao-quan/theo-doi-bao-quan.component";
import {
  ThemMoiSoTheoDoiBqComponent
} from "./theo-doi-bao-quan/them-moi-so-theo-doi-bq/them-moi-so-theo-doi-bq.component";
import { SoKhoTheKhoComponent } from './so-kho-the-kho/so-kho-the-kho.component';

const routes: Routes = [
  {
    path: '',
    component: LuuKhoComponent,
    children: [
      {
        path: '',
        redirectTo: 'quan-ly-so-kho-the-kho',
        pathMatch: 'full'
      },
      {
        path: 'quan-ly-so-kho-the-kho',
        component: SoKhoTheKhoComponent
      },
      // Region Quyết định
      {
        path: 'theo-doi-bao-quan',
        component: TheoDoiBaoQuanComponent
      },
      {
        path: 'theo-doi-bao-quan/them-moi',
        component: ThemMoiSoTheoDoiBqComponent
      },
      {
        path: 'theo-doi-bao-quan/chi-tiet/:id',
        component: ThemMoiSoTheoDoiBqComponent
      },
      {
        path: 'hang-trong-kho',
        loadChildren: () =>
          import(
            '../luu-kho/hang-trong-kho/hang-trong-kho.module'
          ).then((m) => m.HangTrongKhoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LuuKhoRoutingModule { }
