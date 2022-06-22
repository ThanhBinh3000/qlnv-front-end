import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ho-so-ky-thuat',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
export class HoSoKyThuatComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
