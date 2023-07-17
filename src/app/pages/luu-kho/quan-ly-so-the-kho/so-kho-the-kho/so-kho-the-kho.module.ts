import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoKhoTheKhoComponent } from './so-kho-the-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemSoKhoTheKhoComponent } from './them-so-kho-the-kho/them-so-kho-the-kho.component';
import {HopDongModule} from "../../../nhap/dau-thau/hop-dong/hop-dong.module";

@NgModule({
  declarations: [SoKhoTheKhoComponent, ThemSoKhoTheKhoComponent],
    imports: [CommonModule, ComponentsModule, HopDongModule],
  exports: [SoKhoTheKhoComponent],
})
export class SoKhoTheKhoModule { }
