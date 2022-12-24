import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bang-ke-can-hang',
  templateUrl: './bang-ke-can-hang.component.html',
  styleUrls: ['./bang-ke-can-hang.component.scss']
})
export class BangKeCanHangComponent implements OnInit {
  @Input() loaiVthh: string;
  constructor() { }

  ngOnInit(): void {
  }

}
