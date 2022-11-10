import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-de-xuat',
  templateUrl: './de-xuat.component.html',
  styleUrls: ['./de-xuat.component.scss']
})
export class DeXuatComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
