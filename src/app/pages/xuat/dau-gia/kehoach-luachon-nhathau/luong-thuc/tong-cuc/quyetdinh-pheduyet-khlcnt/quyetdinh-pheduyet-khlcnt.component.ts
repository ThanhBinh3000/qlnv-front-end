import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-quyetdinh-pheduyet-khlcnt',
  templateUrl: './quyetdinh-pheduyet-khlcnt.component.html',
  styleUrls: ['./quyetdinh-pheduyet-khlcnt.component.scss']
})
export class QuyetdinhPheduyetKhlcntComponent implements OnInit {
  index = 0;
  Date = new Date();
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
