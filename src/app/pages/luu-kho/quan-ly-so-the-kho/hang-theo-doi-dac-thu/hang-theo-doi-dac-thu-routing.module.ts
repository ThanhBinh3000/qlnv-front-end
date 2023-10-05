import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangTheoDoiDacThuComponent } from './hang-theo-doi-dac-thu.component';

const routes: Routes = [
  {
    path: '',
    component: HangTheoDoiDacThuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HangTheoDoiDacThuRoutingModule {}
