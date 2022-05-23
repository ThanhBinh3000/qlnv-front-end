import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-html-tong-hop-khlcnt-tongcuc-themmoi',
  templateUrl: './html-tong-hop-khlcnt-tongcuc-themmoi.component.html',
  styleUrls: ['./html-tong-hop-khlcnt-tongcuc-themmoi.component.scss']
})
export class TongHopKhlcntTcComponent implements OnInit {
  index = 0;
  Date = new Date();
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
