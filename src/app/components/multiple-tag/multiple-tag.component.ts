import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output()
  selectDataEvent = new EventEmitter<any>();

  @Output()
  removeDataEvent = new EventEmitter<any>();
  nameFile: string;
  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
  }

  removeData(item: any) {
    this.removeDataEvent.emit(item);
  }

  selectData() {
    if (this.type == 'file') {
      return;
    }
    this.selectDataEvent.emit();
  }
  getNameFile(event?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectDataEvent.emit(fileList[0].name);
    }
  }
}
