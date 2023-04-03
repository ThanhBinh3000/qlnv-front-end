import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {STATUS} from "../../../../../../../constants/status";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  CongViec
} from "../../../quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt.component";

@Component({
  selector: 'app-cap-nhat-thong-tin-dau-thau',
  templateUrl: './cap-nhat-thong-tin-dau-thau.component.html',
  styleUrls: ['./cap-nhat-thong-tin-dau-thau.component.scss']
})
export class CapNhatThongTinDauThauComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  STATUS = STATUS;
  listGoiThau: any[] = []
  listNthauNopHs: any[] = [];
  idGoiThau: number = 0;
  rowItemNtNopHs: any = {};
  listStatusNhaThau: any[] = [{
    value: STATUS.TRUNG_THAU,
    text: 'Trúng thầu'
  }, {
    value: STATUS.HUY_THAU,
    text: 'Hủy thầu'
  }, {
    value: STATUS.TRUOT_THAU,
    text: 'Trượt thầu'
  }];
  giaGoiThau: number = 0;
  dataNhaThauGuiHsEdit: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKhlcntService)
    super.ngOnInit()
    this.formData = this.fb.group({
      soQdPdKhlcnt: [],
      tenDuAn: [],
      chuDauTu: [],
      trangThaiDt: [],
      tongMucDt: [],
      tongSoGt: [],
      tongSoGtTc: [],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        await this.detail(this.idInput)
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetKhlcntService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.formData.patchValue({
            soQdPdKhlcnt: data.soQd,
            tenDuAn: data.tenDuAn,
            chuDauTu: data.chuDauTu,
            tongMucDt: data.tongTien,
            tongSoGt: data.soGoiThau ? data.soGoiThau : 0,
            tongSoGtTc: data.soGoiThauTc ? data.soGoiThauTc : 0,
          })
          this.listGoiThau = data.listKtXdscQuyetDinhPdKhlcntCvKh ? data.listKtXdscQuyetDinhPdKhlcntCvKh : [];
          // this.dataCongViecDaTh = data.listKtXdscQuyetDinhPdKhlcntCvDaTh ? data.listKtXdscQuyetDinhPdKhlcntCvDaTh : [];
          // this.dataCongViecKad = data.listKtXdscQuyetDinhPdKhlcntCvKad ? data.listKtXdscQuyetDinhPdKhlcntCvKad : [];
          // this.dataCongViecKh = data.listKtXdscQuyetDinhPdKhlcntCvKh ? data.listKtXdscQuyetDinhPdKhlcntCvKh : [];
          // this.updateEditCongViecDaThCache();
          // this.updateEditCongViecKadCache();
          // this.updateEditCongViecKhCache();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async banHanh(id) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
    this.approve(id, trangThai, mesg);
  }

  async showDetail($event, dataGoiThau: any) {
    await this.spinner.show();
    if ($event.type == 'click') {
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    }
    this.listNthauNopHs = [];
    this.idGoiThau = dataGoiThau.id;
    this.giaGoiThau = dataGoiThau.giaTri ? dataGoiThau.giaTri : 0;
    this.rowItemNtNopHs.idGoiThau = dataGoiThau.id;
    // let res = await this.thongTinDauThauService.getDetailThongTin(this.idGoiThau, this.loaiVthh);
    // if (res.msg == MESSAGE.SUCCESS) {
    //   this.itemRow.soLuong = dataGoiThau.soLuong;
    //   this.listNthauNopHs = res.data;
    //   this.listNthauNopHs.forEach(item => {
    //     item.edit = false;
    //   })
    // } else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
    await this.spinner.hide();
  }

  refreshItemNopHs() {
    this.rowItemNtNopHs = {};
  }

  editDataNhaThauGuiHs(index) {
    this.dataNhaThauGuiHsEdit[index].edit = true;
  }

  sumSoGoiThauTable(key) {
    if (this.listGoiThau.length > 0) {
      return this.listGoiThau.reduce((a, b) => a + (b[key] || 0), 0);
    }
  }

  saveEditNhaThauNopHs(idx) {
    Object.assign(this.listNthauNopHs[idx], this.dataNhaThauGuiHsEdit[idx].data);
    this.dataNhaThauGuiHsEdit[idx].edit = false;
  }

  cancelEditNhaThauNopHs(idx) {
    this.dataNhaThauGuiHsEdit[idx] = {
      data: {...this.listNthauNopHs[idx]},
      edit: false
    };
  }

  addRow(): void {
    if (this.validateItemNhaThauNopHs(this.rowItemNtNopHs)) {
      this.listNthauNopHs = [
        ...this.listNthauNopHs,
        this.rowItemNtNopHs
      ];
      this.rowItemNtNopHs = {};
    }
  }

  updateDataNhaThauNopHsCache(): void {
    if (this.listNthauNopHs) {
      this.listNthauNopHs.forEach((item, index) => {
        this.dataNhaThauGuiHsEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  validateItemNhaThauNopHs(data, index?): boolean {
    if (data.tenNhaThau && data.maSoThue && data.diaChi && data.soDienThoai && data.giaDuThau && data.trangThai && data.giaDuThau) {
      if (data.trangThai == STATUS.TRUNG_THAU) {
        if (data.giaDuThau > this.giaGoiThau) {
          this.notification.error(MESSAGE.ERROR, "Đơn giá nhà thầu không được lớn hơn giá của gói thầu.")
          return false;
        }
        let filter = this.listNthauNopHs.filter(item => item.trangThai == STATUS.TRUNG_THAU);
        if (filter.length > 0) {
          if (index) {
            let indexFilter = this.listNthauNopHs.indexOf(filter[0]);
            if (index != indexFilter) {
              this.notification.error(MESSAGE.ERROR, "Trạng thái trúng thầu đã tồn tại, xin vui lòng thay đổi trạng thái bản ghi")
              return false
            }
            return true
          } else {
            this.notification.error(MESSAGE.ERROR, "Trạng thái trúng thầu đã tồn tại, xin vui lòng thay đổi trạng thái bản ghi")
            return false
          }
        }
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Xin vui lòng điền đủ thông tin");
      return false;
    }
  }

  deleteRowItem(index) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.listNthauNopHs.splice(index, 1);
          // this.updateEditCongViecKhCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  changeTrangThai($event) {
    let trangThai = this.listStatusNhaThau.filter(item => item.value == $event);
    this.rowItemNtNopHs.tenTrangThai = trangThai[0].text;
    // this.itemRowUpdate.tenTrangThai = trangThai[0].text;
  }
}
