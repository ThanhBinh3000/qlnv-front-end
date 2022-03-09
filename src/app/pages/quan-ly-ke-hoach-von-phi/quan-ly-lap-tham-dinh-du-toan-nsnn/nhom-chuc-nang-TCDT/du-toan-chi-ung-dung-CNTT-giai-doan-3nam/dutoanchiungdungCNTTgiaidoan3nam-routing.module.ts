import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DutoanchiungdungCNTTgiaidoan3namComponent } from './dutoanchiungdungCNTTgiaidoan3nam.component';
const routes: Routes = [
  {
    path: '',
    component: DutoanchiungdungCNTTgiaidoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DutoanchiungdungCNTTgiaidoan3namRoutingModule {}
