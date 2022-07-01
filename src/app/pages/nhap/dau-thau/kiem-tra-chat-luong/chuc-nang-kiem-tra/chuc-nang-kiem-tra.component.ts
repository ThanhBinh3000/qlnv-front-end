import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chuc-nang-kiem-tra',
  templateUrl: './chuc-nang-kiem-tra.component.html',
  styleUrls: ['./chuc-nang-kiem-tra.component.scss']
})
export class ChucNangKiemTraComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
