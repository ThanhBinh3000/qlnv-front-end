import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-cuc',
  templateUrl: './main-cuc.component.html',
  styleUrls: ['./main-cuc.component.scss']
})
export class MainCucComponent implements OnInit {

  @Input() loaiVthh: string;
  constructor() { }

  ngOnInit(): void {
  }

}
