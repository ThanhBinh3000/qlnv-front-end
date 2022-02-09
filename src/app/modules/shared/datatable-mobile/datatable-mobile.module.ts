import { NgModule } from '@angular/core';
import { DatatableMobileComponent } from './datatable-mobile.component';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [DatatableMobileComponent],
    imports: [MaterialModule],
    exports: [DatatableMobileComponent],
})
export class DataTableMobileModule {}
