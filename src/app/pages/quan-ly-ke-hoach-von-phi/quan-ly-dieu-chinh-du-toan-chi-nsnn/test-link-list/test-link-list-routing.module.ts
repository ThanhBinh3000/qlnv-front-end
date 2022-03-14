import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestLinkListComponent } from './test-link-list.component';

const routes: Routes = [
  {
    path: '',
    component: TestLinkListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestLinkListRoutingModule {}
