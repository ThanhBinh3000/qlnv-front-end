import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-chuc-nang-xuat-kho',
  templateUrl: './chuc-nang-xuat-kho.component.html',
  styleUrls: ['./chuc-nang-xuat-kho.component.scss']
})
export class ChucNangXuatKhoComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit(): void {
  }

}
