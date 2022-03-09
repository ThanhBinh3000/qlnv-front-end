import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namRoutingModule } from './thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam-routing.module';
import { ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namComponent } from './thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namComponent,
  ],
  imports: [
    CommonModule,
    ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namRoutingModule,
    ComponentsModule,
  ],
})

export class ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule {}
