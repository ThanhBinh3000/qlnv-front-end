import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-phuongan-khlcnht-tc-themmoi',
  templateUrl: './phuong-an-khlcnht-cua-tong-cuc-them-moi.component.html',
  styleUrls: ['./phuong-an-khlcnht-cua-tong-cuc-them-moi.component.scss']
})
export class PhuonganKhlcnhtTcThemmoi implements OnInit {
  isVisible = false;
  constructor() { 
  }

  ngOnInit(): void {
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
