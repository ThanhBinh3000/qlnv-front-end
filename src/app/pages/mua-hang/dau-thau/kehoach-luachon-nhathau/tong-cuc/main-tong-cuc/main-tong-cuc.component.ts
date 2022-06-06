import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-tong-cuc',
  templateUrl: './main-tong-cuc.component.html',
  styleUrls: ['./main-tong-cuc.component.scss']
})
export class MainTongCucComponent implements OnInit {

  @Input() loaiVthh: string;

  constructor() { }

  ngOnInit(): void {
  }

}
