import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bien-ban-giao-nhan',
  templateUrl: './bien-ban-giao-nhan.component.html',
  styleUrls: ['./bien-ban-giao-nhan.component.scss']
})
export class BienBanGiaoNhanComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
