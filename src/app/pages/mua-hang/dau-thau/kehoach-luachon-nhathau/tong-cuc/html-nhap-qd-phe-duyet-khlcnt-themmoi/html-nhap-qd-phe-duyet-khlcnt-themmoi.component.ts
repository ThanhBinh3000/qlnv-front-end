import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-html-nhap-qd-phe-duyet-khlcnt-themmoi',
  templateUrl: './html-nhap-qd-phe-duyet-khlcnt-themmoi.component.html',
  styleUrls: ['./html-nhap-qd-phe-duyet-khlcnt-themmoi.component.scss']
})
export class NhapQdPheduyetKhlcntThemmoiComponent implements OnInit {
  index = 0;
  Date = new Date();
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
