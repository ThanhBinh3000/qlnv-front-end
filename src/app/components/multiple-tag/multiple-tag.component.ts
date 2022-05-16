import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';

@Component({
  selector: 'multiple-tag',
  templateUrl: './multiple-tag.component.html',
  styleUrls: ['./multiple-tag.component.scss'],
})
export class MultipleTagComponent implements OnInit {
  @Input() buttonName: string;
  @Input() icon: string;
  @Input() placeHolder: string;
  @Input() data: any[] = [];
  @Input() type: string;
  @Input() trangThai: string;

  @Output()
  selectDataEvent = new EventEmitter<any>();

  @Output()
  removeDataEvent = new EventEmitter<any>();
  nameFile: string;
  constructor(public globals: Globals) {}

  ngOnInit(): void {}

  removeData(item: any) {
    this.removeDataEvent.emit(item);
  }

  selectData() {
    if (
      this.type == 'file' ||
      this.trangThai === this.globals.prop.BAN_HANH ||
      this.trangThai === this.globals.prop.LANH_DAO_DUYET ||
      this.trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return;
    }
    this.selectDataEvent.emit();
  }
  getNameFile(event?: any) {
    if (
      this.trangThai === this.globals.prop.BAN_HANH ||
      this.trangThai === this.globals.prop.LANH_DAO_DUYET ||
      this.trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return;
    }
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.selectDataEvent.emit(itemFile);
    }
  }
}
