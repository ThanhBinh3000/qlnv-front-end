import { Router } from '@angular/router';
import { DialogThemMoiCtbbChuanBiKhoTruocKhiNhapComponent } from '../../../../../../components/dialog/dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap/dialog-them-moi-ctbb-chuan-bi-kho-truoc-khi-nhap.component';
import { DialogDanhSachHangHoaComponent } from '../../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThemThongTinVatTuTrongNamComponent } from '../../../../../../components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import { MESSAGE } from '../../../../../../constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PAGE_SIZE_DEFAULT } from '../../../../../../constants/config';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogDanhSachChiTietNganKhoComponent } from 'src/app/components/dialog/dialog-danh-sach-chi-tiet-ngan-kho/dialog-danh-sach-chi-tiet-ngan-kho.component';

@Component({
  selector: 'them-phieu-nhap-kho-tam-gui',
  templateUrl: './them-phieu-nhap-kho-tam-gui.component.html',
  styleUrls: ['./them-phieu-nhap-kho-tam-gui.component.scss'],
})
export class ThemPhieuNhapKhoTamGuiComponent implements OnInit {
  data: any;
  dataDetail: any;
  public formInput: FormGroup;
  listloaivanban: any = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private router: Router,
  ) {}

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
  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  selectHangHoa() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
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
  selectMaNganKho() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách chi tiết ngăn kho',
      nzContent: DialogDanhSachChiTietNganKhoComponent,
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
  themMoiCtbbChuanBiKhoTruocKhiNhapHang() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Thông tin chi tiết',
      nzContent: DialogThemMoiCtbbChuanBiKhoTruocKhiNhapComponent,
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
  back() {
    this.router.navigate(['nhap/dau-thau/vat-tu/phieu-nhap-kho-tam-gui']);
  }
}
