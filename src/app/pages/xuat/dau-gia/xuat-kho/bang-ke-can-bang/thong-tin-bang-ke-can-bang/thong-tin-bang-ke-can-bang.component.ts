import { Component, OnInit,EventEmitter,Output,Input } from '@angular/core';

@Component({
  selector: 'app-thong-tin-bang-ke-can-bang',
  templateUrl: './thong-tin-bang-ke-can-bang.component.html',
  styleUrls: ['./thong-tin-bang-ke-can-bang.component.scss']
})
export class ThongTinBangKeCanBangComponent implements OnInit {
  @Input() statusId:string='';
  @Output() showListEvent = new EventEmitter<any>();

  redirectBangkecanbang() {
    this.showListEvent.emit();
  };

  constructor() { }

  ngOnInit(): void {
  }

}
