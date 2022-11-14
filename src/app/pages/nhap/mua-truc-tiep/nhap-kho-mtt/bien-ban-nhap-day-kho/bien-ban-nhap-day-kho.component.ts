import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bien-ban-nhap-day-kho',
  templateUrl: './bien-ban-nhap-day-kho.component.html',
  styleUrls: ['./bien-ban-nhap-day-kho.component.scss']
})
export class BienBanNhapDayKhoComponent implements OnInit {
  @Input() typeVthh: string;
  constructor() { }

  ngOnInit(): void {
  }

}
