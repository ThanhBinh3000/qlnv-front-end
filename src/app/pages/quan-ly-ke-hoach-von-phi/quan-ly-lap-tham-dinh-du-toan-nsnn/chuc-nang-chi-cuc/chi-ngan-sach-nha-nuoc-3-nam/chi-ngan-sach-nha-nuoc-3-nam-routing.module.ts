import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiNganSachNhaNuoc3NamComponent } from './chi-ngan-sach-nha-nuoc-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: ChiNganSachNhaNuoc3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChiNganSachNhaNuoc3NamRoutingModule {}
