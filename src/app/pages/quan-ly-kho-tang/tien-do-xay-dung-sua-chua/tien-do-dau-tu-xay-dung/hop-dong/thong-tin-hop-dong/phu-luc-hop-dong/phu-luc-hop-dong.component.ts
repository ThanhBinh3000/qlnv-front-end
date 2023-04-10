import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-phu-luc-hop-dong',
  templateUrl: './phu-luc-hop-dong.component.html',
  styleUrls: ['./phu-luc-hop-dong.component.scss']
})
export class PhuLucHopDongComponent implements OnInit {
  @Input() id: number
  @Input() isView: boolean
  @Input() dataHdr: any
  @Input() tablePl: any
  @Output()
  goBackEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

}
