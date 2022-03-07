import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namComponent } from './thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.component';

const routes: Routes = [
  {
    path: '',
    component: ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namRoutingModule {}
