import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-tong-hop-khlcnt',
  templateUrl: './tong-hop-khlcnt.component.html',
  styleUrls: ['./tong-hop-khlcnt.component.scss']
})
export class TongHopKhlcntComponent implements OnInit {
  index = 0;
  Date = new Date();
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
