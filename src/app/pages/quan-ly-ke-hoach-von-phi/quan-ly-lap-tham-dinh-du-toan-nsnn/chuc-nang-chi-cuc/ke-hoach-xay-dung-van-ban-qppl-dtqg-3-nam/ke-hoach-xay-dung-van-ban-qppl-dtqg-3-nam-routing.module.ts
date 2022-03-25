import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachXayDungVanBanQpplDtqg3NamComponent } from './ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachXayDungVanBanQpplDtqg3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachXayDungVanBanQpplDtqg3NamRoutingModule {}
