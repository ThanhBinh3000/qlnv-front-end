import { chain, cloneDeep } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { BangCaoDieuChuyenService } from '../bao-cao.service';
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-them-moi-bao-cao',
  templateUrl: './them-moi-bao-cao.component.html',
  styleUrls: ['./them-moi-bao-cao.component.scss']
})
export class ThemMoiBaoCaoComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSetString = new Set<string>();
  dataView: any[] = [];
  TRANG_THAI: { [key: string]: string } = {
    [STATUS.DU_THAO]: "Dự thảo",
    [STATUS.CHO_DUYET_TP]: "Chờ duyệt - TP",
    [STATUS.CHO_DUYET_LDC]: "Chờ duyệt - LĐ Cục",
    [STATUS.TU_CHOI_TP]: "Từ chối - TP",
    [STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục",
    [STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục"
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCaoDieuChuyenService: BangCaoDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCaoDieuChuyenService);
    this.formData = this.fb.group({
      nam: [dayjs().get('year'), [Validators.required]],
      tenDvi: [],
      donViNhan: [],
      tenBaoCao: [],
      soBaoCao: ['', Validators.required],
      ngayBaoCao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      soQinhCuc: [],
      soQdinhTongCuc: [],
      trangThai: ['00'],
      ngayKyQdTongCuc: [],
      noiDung: [],
      fileDinhKems: [new Array()]
    })
  }

  ngOnInit(): void {
    try {
      this.spinner.show();
      this.loadDetail(this.idInput)
    } catch (error) {
      console.log('e', error)
    }
    finally {
      this.spinner.hide()
    }
  }
  async loadDetail(id: number): Promise<void> {
    if (id) {
      const res = await this.bangCaoDieuChuyenService.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS) {
        this.formData.patchValue({ ...res.data });
        this.dataTable = res.data.dataTable
      }
      else {
        this.formData.patchValue({
          maDvi: this.userInfo.MA_DVI,
          tenDvi: this.userInfo.TEN_DVI
        })
      }
    }
  }
  openModalQDCuc() {

  }
  openModalQDTongCuc() {

  }
  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  buildTableView() {
    let dataView = Array.isArray(this.dataTable) ?
      chain(this.dataTable).groupBy("soQdinh").map((rs, i) => {
        const dataSoQdinh = rs.find(f => f.soQdinh == i);
        return {
          ...dataSoQdinh,
          idVirtual: uuidv4(),
          childData: dataSoQdinh ? rs : []
        }
      }).value() : [];
    this.dataView = cloneDeep(dataView);
    this.expandAll()
  }
  async save(isGuiDuyet: boolean): Promise<void> {
    try {
      await this.spinner.show();
      this.setValidator(isGuiDuyet);
      let body = this.formData.value;
      let data = await this.createUpdate(body);
      if (!data) return;
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai })
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();

    }
  }
  async pheDuyet(): Promise<void> {
    let trangThai = '';
    let mess = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            trangThai: trangThai
          };
          let res =
            await this.bangCaoDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  async tuChoi(): Promise<void> {
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
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.bangCaoDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }
  back() {
    this.showListEvent.emit();
  }
  checkRoleReject(): boolean {
    const { trangThai } = this.formData.value;
    return this.userService.isCuc() && [STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC].includes(trangThai)
  }
  checkRoleDuyet(): boolean {
    const { trangThai } = this.formData.value;
    return this.userService.isCuc() && [STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC].includes(trangThai)
  }
  setValidator(isGuiDuyet: boolean) {

  }
  quayLai() {
    this.showListEvent.emit();
  }
}
