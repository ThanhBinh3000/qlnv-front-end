import { NgModule } from '@angular/core';
import { DatatableComponent } from './datatable.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [DatatableComponent],
    imports: [MaterialModule, FormsModule],
    exports: [DatatableComponent],
})
export class DataTableModule {}
