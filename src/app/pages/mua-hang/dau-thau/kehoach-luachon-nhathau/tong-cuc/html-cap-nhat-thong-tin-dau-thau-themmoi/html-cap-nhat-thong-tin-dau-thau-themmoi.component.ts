import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-html-cap-nhat-thong-tin-dau-thau-themmoi',
  templateUrl: './html-cap-nhat-thong-tin-dau-thau-themmoi.component.html',
  styleUrls: ['./html-cap-nhat-thong-tin-dau-thau-themmoi.component.scss']
})
export class CapnhatThongtindauthauThemmoiComponent implements OnInit {
  index = 0;
  Date = new Date();
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
