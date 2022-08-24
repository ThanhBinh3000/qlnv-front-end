import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogDanhSachChiTietNganKhoComponent } from 'src/app/components/dialog/dialog-danh-sach-chi-tiet-ngan-kho/dialog-danh-sach-chi-tiet-ngan-kho.component';

@Component({
  selector: 'them-quyet-dinh-giao-nhiem-vu-nhap-hang',
  templateUrl: './them-quyet-dinh-giao-nhiem-vu-nhap-hang.component.html',
  styleUrls: ['./them-quyet-dinh-giao-nhiem-vu-nhap-hang.component.scss'],
})
export class ThemQuyetDinhGiaoNhiemVuNhapHangComponent implements OnInit {
  data: any;
  dataDetail: any;
  public formInput: FormGroup;
  listloaivanban: any = [];
  constructor(private modal: NzModalService) {}

  ngOnInit(): void {}
  themNganKho() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Danh sách chi tiết ngăn kho',
      nzContent: DialogDanhSachChiTietNganKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }
  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
      }
    });
  }
}
