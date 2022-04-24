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
  @Input() data: any[] = [];

  @Output()
  selectDataEvent = new EventEmitter<any>();

  @Output()
  removeDataEvent = new EventEmitter<any>();

  constructor(
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  removeData(item: any) {
    this.removeDataEvent.emit(item)
  }

  selectData() {
    this.selectDataEvent.emit();
  }
}
