import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bang-ke-nhap-vat-tu',
  templateUrl: './bang-ke-nhap-vat-tu.component.html',
  styleUrls: ['./bang-ke-nhap-vat-tu.component.scss']
})
export class BangKeNhapVatTuComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
