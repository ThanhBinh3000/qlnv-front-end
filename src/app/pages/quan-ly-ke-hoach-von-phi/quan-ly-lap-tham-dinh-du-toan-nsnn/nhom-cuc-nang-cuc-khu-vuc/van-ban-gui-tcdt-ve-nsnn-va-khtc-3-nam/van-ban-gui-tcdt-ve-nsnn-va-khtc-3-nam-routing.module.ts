import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VanBanGuiTcdtVeNsnnVaKhtc3NamComponent } from './van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: VanBanGuiTcdtVeNsnnVaKhtc3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VanBanGuiTcdtVeNsnnVaKhtc3NamRoutingModule {}
