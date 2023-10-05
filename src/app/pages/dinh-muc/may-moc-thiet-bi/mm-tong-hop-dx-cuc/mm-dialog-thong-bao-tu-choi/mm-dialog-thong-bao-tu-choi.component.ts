import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../constants/status";
import dayjs from "dayjs";
import {MmThongBaoTuChoiService} from "../../../../../services/dinhmuc-maymoc-baohiem/mm-thong-bao-tu-choi.service";
import {MESSAGE} from "../../../../../constants/message";

@Component({
  selector: 'app-mm-dialog-thong-bao-tu-choi',
  templateUrl: './mm-dialog-thong-bao-tu-choi.component.html',
  styleUrls: ['./mm-dialog-thong-bao-tu-choi.component.scss']
})
export class MmDialogThongBaoTuChoiComponent extends Base2Component implements OnInit {
  @Input() idHdr: number;
  isDetail: boolean = false;
  id: number;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private mmThongBaoTuChoiService: MmThongBaoTuChoiService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, mmThongBaoTuChoiService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year')],
      soThongBao: [null, Validators.required],
      ngayKy: [null, Validators.required],
      lyDoTuChoi: [null, Validators.required],
      idHdr: [null],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
    });
    this.filterTable = {};
  }

  ngOnInit(): void {
    this.getDetail(this.idHdr);
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.mmThongBaoTuChoiService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        if (data && data.id) {
          this.id = data.id;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          if (data.trangThai == STATUS.DA_KY) {
            this.isDetail = true;
          }
          this.fileDinhKem = data.listFileDinhKems
        } else {
          this.id = null;
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async save(isKy?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    body.idHdr = this.idHdr
    let res;
    if (this.id > 0) {
      res = await this.mmThongBaoTuChoiService.update(body);
    } else {
      res = await this.mmThongBaoTuChoiService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isKy) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        });
          await this.approve(this.formData.value.id,STATUS.DA_KY, 'Bạn có chắc chắn muốn ký?');
      } else {
        if (this.id > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.id = res.data.id;
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai
          });
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
      this._modalRef.close(true);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  deleteItem(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: id
          };
          this.mmThongBaoTuChoiService.delete(body).then(async () => {
            this._modalRef.close(true);
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  quayLai() {
    this._modalRef.close();
  }
}
