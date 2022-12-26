import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TheoDoiBaoQuanComponent} from "./theo-doi-bao-quan.component";

const routes: Routes = [
  {
    path: '',
    component: TheoDoiBaoQuanComponent,
    children: [
      {
        path: 'theo-doi-bao-quan',
        loadChildren: () =>
          import(
            '../../luu-kho/theo-doi-bao-quan/theo-doi-bao-quan.module'
            ).then((m) => m.TheoDoiBaoQuanModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheoDoiBaoQuanRoutingModule {
}
