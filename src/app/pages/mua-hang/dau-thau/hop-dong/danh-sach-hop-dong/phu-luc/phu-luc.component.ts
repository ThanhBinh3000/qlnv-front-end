import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogThongTinPhuLucHopDongMuaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';

@Component({
  selector: 'app-phu-luc',
  templateUrl: './phu-luc.component.html',
  styleUrls: ['./phu-luc.component.scss']
})
export class PhuLucComponent implements OnInit {
  @Input() idPhuLuc: number;
  @Input() isViewPhuLuc: boolean;
  @Input() typeVthh: string;
  @Output()
  showChiTietEvent = new EventEmitter<any>();

  constructor(private modal: NzModalService) { }

  ngOnInit() {
  }

  thongTinPhuLuc() {
    const modal = this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucHopDongMuaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => { });
  }

  back() {
    this.showChiTietEvent.emit();
  }
}
