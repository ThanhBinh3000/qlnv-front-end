import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namComponent } from './tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.component';
const routes: Routes = [
  {
    path: '',
    component: Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namRoutingModule {}
