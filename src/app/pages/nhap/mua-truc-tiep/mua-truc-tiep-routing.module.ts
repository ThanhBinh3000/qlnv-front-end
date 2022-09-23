import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { MuaTrucTiepComponent } from './mua-truc-tiep.component';

const routes: Routes = [
  {
    path: '',
    component: MuaTrucTiepComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuaTrucTiepRoutingModule { }
