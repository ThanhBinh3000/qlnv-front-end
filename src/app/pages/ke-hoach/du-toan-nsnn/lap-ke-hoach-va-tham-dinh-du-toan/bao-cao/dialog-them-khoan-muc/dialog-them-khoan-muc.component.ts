import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-them-khoan-muc',
  templateUrl: './dialog-them-khoan-muc.component.html',
  // styleUrls: ['./dialog-them-khoan-muc.component.scss'],
})
export class DialogThemKhoanMucComponent implements OnInit {
  @Input() obj: any;

  maKhoanMuc: any;
  lstKhoanMuc: any[] = [];
  lstParent: any[] = [];
  lstChild: any[] = [];
  maVtu: any;
  loaiDmuc: any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {
    this.maKhoanMuc = this.obj.maKhoanMuc;
    this.obj.lstKhoanMuc.forEach(item => {
      this.lstKhoanMuc.push({
        ...item,
        status: false,
      })
    })
    this.lstKhoanMuc = this.obj.lstKhoanMuc;
    if (!this.maKhoanMuc) {
      this.maKhoanMuc = this.lstKhoanMuc.find(e => e.level == 0).maVtu;
      this.loaiDmuc = this.lstKhoanMuc.find(e => e.level == 0).loaiDmuc;
      // this.maVtu = this.lstKhoanMuc.find(e => e.level == 0).maVtu;
      this.lstParent = this.lstKhoanMuc.filter(e => e.level == 0);
    } else {
      var idCha: number = this.lstKhoanMuc.find(e => e.id == this.maKhoanMuc).maCha;
      this.lstParent = this.lstKhoanMuc.filter(e => e.maCha == idCha);
    }
    this.changeModel();
  }

  changeModel() {
    this.lstChild = this.lstKhoanMuc.filter(e => e.maCha == this.maKhoanMuc);
  }

  handleOk() {
    let data: any = {
      maKhoanMuc: this.maKhoanMuc,
      maVtu: this.maKhoanMuc,
      loaiDmuc: this.loaiDmuc,
      lstKhoanMuc: this.lstChild.filter(e => e.status == true),
    }
    this._modalRef.close(data);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]