import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chi-tiet-qd-pd-ket-qua-bdg',
  templateUrl: './chi-tiet-qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./chi-tiet-qd-pd-ket-qua-bdg.component.scss']
})
export class ChiTietQdPdKetQuaBdgComponent implements OnInit {
  @Input() id: number;
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
