import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-quyetdinh-pheduyet-khmtt',
  templateUrl: './quyetdinh-pheduyet-khmtt.component.html',
  styleUrls: ['./quyetdinh-pheduyet-khmtt.component.scss']
})
export class QuyetdinhPheduyetKhmttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
  dxMttId: number = 0;
  openDxMtt = false;
  thMttId: number = 0;
  openThMtt = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachMTTService);
    this.formData = this.fb.group({
      namKh: null,
      soQd: null,
      trichYeu: null,
      trangThai: null,
      ngayQd: null,
      lastest: null,
      ngayQdTu: null,
      maDvi: null,
      ngayQdDen: null
    })
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      namKh: '',
      ptMuaTrucTiep: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userInfo.MA_DVI
      })
      await this.timKiem();
      await this.checkPriceAdjust('xuất hàng');
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    if (this.tuNgayKy || this.denNgayKy) {
      this.formData.value.ngayQdTu = this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null
      this.formData.value.ngayQdDen = this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null
    }
    if(this.userService.isCuc()){
      this.formData.value.trangThai = this.STATUS.BAN_HANH;
    }
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    await this.search();
  }

  async clearForm() {
    if(this.userService.isCuc()){
      this.formData.value.trangThai = this.STATUS.BAN_HANH;
    }
    this.tuNgayKy = null;
    this.denNgayKy = null;
    this.formData.patchValue({
      trichYeu: null,
      soQd: null,
      namKh: null,
    })
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    await this.search();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.quyetDinhPheDuyetKeHoachMTTService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, 'Danh-sach-quyet-dinh-phe-duyet-ke-hoach-mua-truc-tiep.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };

  openDxMttModal(id: number) {
    this.dxMttId = id;
    this.openDxMtt = true;
  }

  closeDxMttModal() {
    this.dxMttId = null;
    this.openDxMtt = false;
  }

  openThMttModal(id: number) {
    this.thMttId = id;
    this.openThMtt = true;
  }

  closeThMttModal() {
    this.thMttId = null;
    this.openThMtt = false;
  }

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    console.log(key, value);

    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }
  showList() {
    if(this.userService.isCuc()){
      this.formData.value.trangThai = this.STATUS.BAN_HANH;
    }
    this.isDetail = false;
    this.timKiem()
  }

  goDetail(id: number, roles?: any) {
    if (id == null && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (!this.checkPermission(roles)) {
      return
    }
    this.idSelected = id;
    this.isDetail = true;
  }

  // DELETE 1 multi
  deleteMulti(roles?) {
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (!this.checkPermission(roles)) {
      return
    }
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.service.deleteMuti({idList: dataDelete});
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }
}
