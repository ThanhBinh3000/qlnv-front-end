import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-html-qd-dieu-chinh-khlcnt-timkiem',
  templateUrl: './html-qd-dieu-chinh-khlcnt-timkiem.component.html',
  styleUrls: ['./html-qd-dieu-chinh-khlcnt-timkiem.component.scss']
})
export class QdDieuchinhKhlcntTimkiemComponent implements OnInit {
  index = 0;
  Date = new Date();
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
