import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-html-de-xuat-ke-hoach-lua-chon-nha-thau-cuc-themmoi',
  templateUrl: './html-de-xuat-ke-hoach-lua-chon-nha-thau-cuc-themmoi.component.html',
  styleUrls: ['./html-de-xuat-ke-hoach-lua-chon-nha-thau-cuc-themmoi.component.scss']
})
export class DexuatKhlcntCucThemmoiComponent implements OnInit {
  index = 0;
  constructor() {}
  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
