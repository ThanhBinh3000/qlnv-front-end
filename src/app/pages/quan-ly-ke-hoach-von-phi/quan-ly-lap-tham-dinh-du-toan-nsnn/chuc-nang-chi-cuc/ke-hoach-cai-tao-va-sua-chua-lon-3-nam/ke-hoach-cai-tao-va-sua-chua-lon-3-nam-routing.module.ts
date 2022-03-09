import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachCaiTaoVaSuaChuaLon3NamComponent } from './ke-hoach-cai-tao-va-sua-chua-lon-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachCaiTaoVaSuaChuaLon3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachCaiTaoVaSuaChuaLon3NamRoutingModule {}
