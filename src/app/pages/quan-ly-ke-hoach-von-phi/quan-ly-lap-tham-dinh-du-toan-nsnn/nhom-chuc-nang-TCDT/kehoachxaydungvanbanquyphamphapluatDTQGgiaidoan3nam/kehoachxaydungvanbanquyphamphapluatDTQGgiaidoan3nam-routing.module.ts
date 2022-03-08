import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namComponent } from './kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.component';

const routes: Routes = [
  {
    path: '',
    component: KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namRoutingModule {}
