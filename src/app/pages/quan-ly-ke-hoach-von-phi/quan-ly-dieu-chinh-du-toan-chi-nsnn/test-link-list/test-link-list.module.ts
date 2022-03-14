import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestLinkListRoutingModule } from './test-link-list-routing.module';
import { TestLinkListComponent } from './test-link-list.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    TestLinkListComponent,
  ],
  imports: [
    CommonModule,
    TestLinkListRoutingModule,
    ComponentsModule,
  ],
})

export class TestLinkListModule {}
