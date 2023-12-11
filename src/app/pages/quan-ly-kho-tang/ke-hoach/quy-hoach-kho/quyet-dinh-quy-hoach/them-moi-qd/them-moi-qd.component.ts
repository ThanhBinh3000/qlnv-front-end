import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {QuyHoachKhoService} from "../../../../../../services/quy-hoach-kho.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {chain} from 'lodash';
import {StorageService} from "../../../../../../services/storage.service";
import {
  PopUpChiTietQuyHoachKhoComponent
} from "../pop-up-chi-tiet-quy-hoach-kho/pop-up-chi-tiet-quy-hoach-kho.component";
import {NumberToRoman} from "../../../../../../shared/commonFunction";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import * as uuidv4 from "uuid";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {STATUS} from "../../../../../../constants/status";


@Component({
  selector: 'app-them-moi-qd',
  templateUrl: './them-moi-qd.component.html',
  styleUrls: ['./them-moi-qd.component.scss']
})
export class ThemMoiQdComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  @Input() type: string;
  maQd: string;
  listQdGoc: any[] = [];
  tablePhuLucI: any[] = [];
  tablePhuLucII: any[] = [];
  tablePhuLucIView: any[] = [];
  tablePhuLucIIView: any[] = [];

  constructor(
    httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyHoachKhoService: QuyHoachKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyHoachKhoService);
    this.formData = this.fb.group({
      id: [null],
      namKeHoach: [dayjs().get('year'), [Validators.required]],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      soQuyetDinh: ['', [Validators.required]],
      soQdBtc: ['', [Validators.required]],
      soQdGoc: [null],
      trichYeu: [null],
      ngayKy: [null, [Validators.required]],
      namBatDau: [null, [Validators.required]],
      namKetThuc: [null, [Validators.required]],
      moTa: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/QĐ-BTC';
    this.loadDsQdGoc(this.formData.value.namKeHoach);
    if (this.idInput > 0) {
      this.getDataDetail(this.idInput);
    }
    this.spinner.hide();
  }

  async getDataDetail(id) {
    this.spinner.show();
    try {
      let res = await this.quyHoachKhoService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQuyetDinh: this.formData.value.soQuyetDinh ? this.formData.value.soQuyetDinh.split('/')[0] : '',
            soQdBtc: this.formData.value.soQdBtc ? this.formData.value.soQdBtc.split('/')[0] : ''
          })
          this.fileDinhKem = data.fileDinhKems;
          this.canCuPhapLy = data.canCuPhapLys;
          if (data.quyetDinhQuyHoachCTiets && data.quyetDinhQuyHoachCTiets.length > 0) {
            this.tablePhuLucI = data.quyetDinhQuyHoachCTiets.filter(item => item.loai == '00');
            this.tablePhuLucII = data.quyetDinhQuyHoachCTiets.filter(item => item.loai == '01');
            this.convertTreView('00');
            this.convertTreView('01');
          }
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

  setValidators() {
    this.formData.controls["namKeHoach"].setValidators([Validators.required]);
    this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
    this.formData.controls["soQdBtc"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["namBatDau"].setValidators([Validators.required]);
    this.formData.controls["namKetThuc"].setValidators([Validators.required]);
  }

  async save() {
    this.helperService.removeValidators(this.formData);
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI;
    body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.soQdBtc = body.soQdBtc + this.maQd;
    body.fileDinhKems = this.fileDinhKem;
    body.canCuPhapLys = this.canCuPhapLy;
    body.loai = this.type;
    body.quyetDinhQuyHoachCTietReqs = [...this.tablePhuLucI, this.tablePhuLucII].flat();
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({id: data.id})
    }
  }

  async saveAndSend(status: string, message: string, sucessMessage: string) {
    this.setValidators();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;

    body.maDvi = this.userInfo.MA_DVI;
    body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.soQdBtc = body.soQdBtc + this.maQd;
    body.fileDinhKems = this.fileDinhKem;
    body.canCuPhapLys = this.canCuPhapLy;
    body.loai = this.type;
    body.quyetDinhQuyHoachCTietReqs = [...this.tablePhuLucI, this.tablePhuLucII].flat();
    if (this.formData.value.id > 0) {
      if (body) {
        await this.approve(body.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      let data = await this.createUpdate(this.formData.value);
      if (data) {
        await this.approve(data.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      }
    }
  }

  openModalCreate(idVirtual: number, type: string) {
    let idx;
    let dataInput;
    if (idVirtual) {
      if (type == '00') {
        dataInput = this.tablePhuLucI.find(item => item.idVirtual == idVirtual);
        idx = this.tablePhuLucI.indexOf(dataInput);
      }

      if (type == '01') {
        dataInput = this.tablePhuLucII.find(item => item.idVirtual == idVirtual);
        idx = this.tablePhuLucII.indexOf(dataInput);
      }

    }
    const modalCreate = this.modal.create({
      nzTitle: 'BẢNG TỔNG HỢP CÁC ĐIỂM KHO LƯƠNG THỰC, VẬT TƯ QUY HOẠCH',
      nzContent: PopUpChiTietQuyHoachKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzBodyStyle: {'overflow-y': 'auto'},
      nzStyle: {top: '100px'},
      nzWidth: '1000px',
      nzFooter: null,
      nzComponentParams: {
        type: type,
        dataInput: idVirtual ? dataInput : null
      },
    });
    modalCreate.afterClose.subscribe((data) => {
      if (data) {
        if (idVirtual) {
          if (type == '00') {
            this.tablePhuLucI[idx] = data
          }
          if (type == '01') {
            this.tablePhuLucII[idx] = data
          }
        } else {
          if (type == '00') {
            this.tablePhuLucI = [...this.tablePhuLucI, data]
          }
          if (type == '01') {
            this.tablePhuLucII = [...this.tablePhuLucII, data]
          }
        }
        this.convertTreView(type)
      }
    })
  };

  convertTreView(type: string) {
    if (type == '00') {
      this.tablePhuLucIView = chain(this.tablePhuLucI)
        .groupBy("tenVungMien")
        .map((value, key) => {
          if (value && value.length > 0) {
            value.forEach(item => {
              item.idVirtual = uuidv4.v4()
            })
          }
          return {
            tenVungMien: key,
            children: value
          };
        }).value();
    }
    if (type == '01') {
      this.tablePhuLucIIView = chain(this.tablePhuLucII)
        .groupBy("tenVungMien")
        .map((value, key) => {
          if (value && value.length > 0) {
            value.forEach(item => {
              item.idVirtual = uuidv4.v4()
            })
          }
          return {
            tenVungMien: key,
            children: value
          };
        }).value();
    }
  }

  convertToRoman(number): string {
    return NumberToRoman(number).toString();
  }

  xoaData(idx: number, type: string) {
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
          if (type = '00') {
            let index = this.tablePhuLucI.findIndex(item => item.idVirtual == idx);
            if (index) {
              this.tablePhuLucI.splice(index, 1);
            }
          }
          if (type = '01') {
            let index = this.tablePhuLucII.findIndex(item => item.idVirtual == idx);
            if (index) {
              this.tablePhuLucII.splice(index, 1);
            }
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  openModalQdGoc() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdGoc,
        dataHeader: ['Năm kế hoạch', 'Số quyết định gốc', 'Ngày ký'],
        dataColumn: ['namKeHoach', 'soQuyetDinh', 'ngayKy'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        let res = await this.quyHoachKhoService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            const data = res.data;
            this.formData.patchValue({
              soQdGoc: data.soQuyetDinh,
              trichYeu: data.trichYeu,
              ngayKy: data.ngayKy,
              namBatDau: data.namBatDau,
              namKetThuc: data.namKetThuc,
              moTa: data.moTa,
            })
            this.fileDinhKem = data.fileDinhKems;
            this.canCuPhapLy = data.canCuPhapLys;
            if (data.quyetDinhQuyHoachCTiets && data.quyetDinhQuyHoachCTiets.length > 0) {
              this.tablePhuLucI = data.quyetDinhQuyHoachCTiets.filter(item => item.loai == '00');
              this.tablePhuLucII = data.quyetDinhQuyHoachCTiets.filter(item => item.loai == '01');
              this.convertTreView('00');
              this.convertTreView('01');
            }
          }
        }
      }
    });
  }

  async loadDsQdGoc(event) {
    await this.spinner.show();
    try {
      let body = {
        paggingReq: {
          limit: 999,
          page: 0
        },
        namKeHoach: event,
        loai: '00',
        trangThai: STATUS.BAN_HANH
      }
      let res = await this.service.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listQdGoc = data.content;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  changeNamKh(event: any) {
    this.loadDsQdGoc(event);
  }
}
