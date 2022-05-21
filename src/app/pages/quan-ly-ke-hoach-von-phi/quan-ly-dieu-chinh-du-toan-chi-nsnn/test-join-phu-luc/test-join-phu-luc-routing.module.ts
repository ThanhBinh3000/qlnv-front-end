import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestJoinPhuLucComponent } from './test-join-phu-luc.component';

const routes: Routes = [
  {
    path: '',
    component: TestJoinPhuLucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestJoinPhuLucRoutingModule {}
