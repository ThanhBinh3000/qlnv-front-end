import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-tong-hop-hang-sua-chua-dtqg',
  templateUrl: './dialog-tong-hop-hang-sua-chua-dtqg.component.html',
  styleUrls: ['./dialog-tong-hop-hang-sua-chua-dtqg.component.scss']
})
export class DialogTongHopHangSuaChuaDtqgComponent implements OnInit {
  maTt: any;

  constructor() { }

  ngOnInit(): void {
    this.maTt = "/CCDTNT-KT"
  }

}
