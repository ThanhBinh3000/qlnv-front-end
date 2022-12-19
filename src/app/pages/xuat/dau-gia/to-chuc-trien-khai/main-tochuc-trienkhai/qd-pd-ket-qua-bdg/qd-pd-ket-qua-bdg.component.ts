import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-qd-pd-ket-qua-bdg',
  templateUrl: './qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./qd-pd-ket-qua-bdg.component.scss']
})
export class QdPdKetQuaBdgComponent implements OnInit {
  @Input()
  loaiVthh: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
