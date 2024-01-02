import {Component, OnInit} from '@angular/core';
import {Base2Component} from '../../../components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../../../services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {cloneDeep} from 'lodash';
import {DanhMucService} from '../../../services/danhmuc.service';
import {DanhMucCongCuDungCu} from '../../../models/DeXuatKeHoachuaChonNhaThau';
import {MESSAGE} from '../../../constants/message';
import {DanhMucCongCuDungCuService} from '../../../services/danh-muc-cong-cu-dung-cu.service';
import {FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-danh-muc-cong-cu-dung-cu',
  templateUrl: './danh-muc-cong-cu-dung-cu.component.html',
  styleUrls: ['./danh-muc-cong-cu-dung-cu.component.scss'],
})
export class DanhMucCongCuDungCuComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  formDataChinhSua: FormGroup;
  isVisible = false;
  isVisibleEdit = false;
  yeuCauKt: string;
  yeuCauKtEdit: string;
  sttEdit: number = 0;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucCongCuDungCuService: DanhMucCongCuDungCuService,
    private router: Router,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucCongCuDungCuService);
    super.ngOnInit();
    this.formData = this.fb.group({
      maCcdc: ['', [Validators.required]],
      tenCcdc: ['', [Validators.required]],
      moTa: [''],
      yeuCauKt: ['', [Validators.required]],
      donViTinh: ['', [Validators.required]],
      nhomCcdc: ['', [Validators.required]],
      trangThai: ['', [Validators.required]],
    });
    this.formDataChinhSua = this.fb.group({
      id: ['', [Validators.required]],
      maCcdc: ['', [Validators.required]],
      tenCcdc: ['', [Validators.required]],
      moTa: [''],
      yeuCauKt: ['', [Validators.required]],
      donViTinh: ['', [Validators.required]],
      nhomCcdc: ['', [Validators.required]],
      trangThai: ['', [Validators.required]],
    });
  }

  dataEdit: { [key: string]: { edit: boolean; data: DanhMucCongCuDungCu } } = {};
  listNhomCcdc: any[] = [];
  dataTable: any[] = [];
  pageSize: number = 50;
  searchForm = {
    tenCcdc: null,
    nhomCcdc: null,
    trangThai: null,
    moTa: null,
  };

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_CONGCU_DUNGCU')) {
      this.router.navigateByUrl('/error/401')
    }
    await this.filter();
    this.updateEditCache();
    this.getListNhomCcdc();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.filter();
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
      this.filter();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async filter() {
    this.spinner.show();
    try {
      let body = {
        'tenCcdc': this.searchForm.tenCcdc ? this.searchForm.tenCcdc : null,
        'nhomCcdc': this.searchForm.nhomCcdc ? [this.searchForm.nhomCcdc] : null,
        'trangThai': this.searchForm.trangThai ? this.searchForm.trangThai : null,
        'moTa': this.searchForm.moTa ? this.searchForm.moTa : null,
        'paggingReq': {
          limit: this.pageSize,
          page: this.page - 1,
        },
      };
      let res = await this.danhMucCongCuDungCuService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getListNhomCcdc() {
    this.listNhomCcdc = [];
    let res = await this.danhMucService.danhMucChungGetAll('NHOM_CCDC');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNhomCcdc = res.data;
    }
  }

  resetFilter() {
    this.searchForm = {
      tenCcdc: null,
      nhomCcdc: [],
      trangThai: null,
      moTa: null,
    };
    this.search();
  }

  startEdit(i: number) {
    this.updateEditCache();
    this.sttEdit = i;
    this.dataEdit[i].edit = true;
  }

  inputYcKyThuat() {
    this.isVisible = true;
  }

  inputYcKyThuatEdit(data) {
    this.isVisibleEdit = true;
    this.yeuCauKtEdit = data.yeuCauKt;
  }


  xoaItem(item: any) {
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
          this.danhMucCongCuDungCuService.delete(item.id).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.search();
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

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
    this.sttEdit = 0;
  }

  async saveDmCc(data?, idInput?) {
    if (idInput && data) {
      this.formDataChinhSua.patchValue({
        id: idInput,
        maCcdc: data.maCcdc,
        tenCcdc: data.tenCcdc,
        donViTinh: data.donViTinh,
        nhomCcdc: data.nhomCcdc,
        yeuCauKt: data.yeuCauKt,
        moTa: data.moTa,
        trangThai: data.trangThai,
      });
      this.helperService.markFormGroupTouched(this.formDataChinhSua);
      if (this.formDataChinhSua.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        return;
      }
    } else {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        return;
      }
    }
    let body = this.formData.value;
    let res;
    if (idInput) {
      let body = this.formDataChinhSua.value;
      res = await this.danhMucCongCuDungCuService.update(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.formData.reset();
        await this.search();
        this.updateEditCache();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } else {
      res = await this.danhMucCongCuDungCuService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.formData.reset();
        await this.search();
        this.updateEditCache();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  handleCancelEdit(): void {
    this.isVisibleEdit = false;
  }

  handleOk(): void {
    this.formData.patchValue({
      yeuCauKt: this.yeuCauKt,
    });
    this.isVisible = false;
  }

  handleOkEdit(): void {
    this.dataEdit[this.sttEdit].data.yeuCauKt = this.yeuCauKtEdit;
    this.isVisibleEdit = false;
  }
}
