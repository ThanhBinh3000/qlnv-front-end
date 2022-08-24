import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG',
  templateUrl: './dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component.html',
  styleUrls: ['./dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component.scss'],
})
export class DialogChonThemBieuMauBaoCaoComponent implements OnInit {
  @Input() ChonThemBieuMauBaoCao:any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {
  
  }

  handleOk() {
    this._modalRef.close(this.ChonThemBieuMauBaoCao);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]