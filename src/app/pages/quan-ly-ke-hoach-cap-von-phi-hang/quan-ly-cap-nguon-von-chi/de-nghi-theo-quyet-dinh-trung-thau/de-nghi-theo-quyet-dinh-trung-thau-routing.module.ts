import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeNghiTheoQuyetDinhTrungThauComponent } from './de-nghi-theo-quyet-dinh-trung-thau.component';

const routes: Routes = [
  {
    path: '',
    component: DeNghiTheoQuyetDinhTrungThauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class DeNghiTheoQuyetDinhTrungThauRoutingModule {}
