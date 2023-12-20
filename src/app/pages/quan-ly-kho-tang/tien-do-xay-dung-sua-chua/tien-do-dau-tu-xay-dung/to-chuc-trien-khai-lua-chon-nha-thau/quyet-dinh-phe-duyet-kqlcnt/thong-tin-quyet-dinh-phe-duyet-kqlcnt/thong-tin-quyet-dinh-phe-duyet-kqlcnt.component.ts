import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "../../../../../../../components/base2/base2.component";
import { STATUS } from "../../../../../../../constants/status";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetduandtxd.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKhlcnt.service";
import { MESSAGE } from "../../../../../../../constants/message";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKqLcnt.service";
import {
  DialogMmMuaSamComponent
} from "../../../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {
  DialogQdPdKhlcntComponent
} from "../../../../../../../components/dialog/ql-kho-tang/dialog-qd-pd-khlcnt/dialog-qd-pd-khlcnt.component";
import { FILETYPE } from "../../../../../../../constants/fileType";
import { CurrencyMaskInputMode } from "ngx-currency";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-kqlcnt',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-kqlcnt.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-kqlcnt.component.scss']
})
export class ThongTinQuyetDinhPheDuyetKqlcntComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  @Input()
  itemQdPdKhLcnt: any;
  STATUS = STATUS;
  maQd = "/" + this.userInfo.MA_QD;
  trangThaiTtdt: boolean = true;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listGoiThau: any[] = [];
  listFile: any[] = []
  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 0,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKqLcntService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      namKh: [null],
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      ngayHieuLuc: [null, Validators.required],
      soQdPdKhlcnt: [null, Validators.required],
      idQdPdKhlcnt: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenDuAn: [null],
      chuDauTu: [null],
      diaChi: [null],
      maSoThue: [null],
      ghiChu: [null],
      tongMucDt: [0],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["ĐANG NHẬP DỮ LIỆU"],
      fileDinhKems: [null],
      ccPhapLy: [],
      listKtTdxdQuyetDinhPdKqlcntDsgt: [[]]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.idInput) {
        await this.detail(this.idInput)
      } else {
        this.bindingData();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async bindingData() {
    if (this.itemQdPdKhLcnt) {
      this.formData.patchValue({
        namKh: this.itemQdPdKhLcnt.namKh,
        idQdPdKhlcnt: this.itemQdPdKhLcnt.id,
        soQdPdKhlcnt: this.itemQdPdKhLcnt.soQd,
        chuDauTu: this.itemQdPdKhLcnt.chuDauTu,
        diaChi: this.itemQdPdKhLcnt.diaChi,
        maSoThue: this.itemQdPdKhLcnt.maSoThue,
        tenDuAn: this.itemQdPdKhLcnt.tenDuAn,
        idDuAn: this.itemQdPdKhLcnt.idDuAn,
        tongMucDt: this.itemQdPdKhLcnt.tongMucDt,
      });
      let res = await this.quyetdinhpheduyetKhlcntService.getDetail(this.itemQdPdKhLcnt.id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listGoiThau = res.data.listKtTdxdQuyetDinhPdKhlcntCvKh.filter(item => !item.soQdPdKqlcnt && !item.idQdPdKqlcnt);
      }
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetKqLcntService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null,
          })
          data.fileDinhKems.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.listFileDinhKem.push(item)
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.listCcPhapLy.push(item)
            }
          })
          this.listGoiThau = data.listKtTdxdQuyetDinhPdKqlcntDsgt;
          this.listFile = data.fileDinhKems;
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

  xoaGoiThau(id) {
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
          this.listGoiThau = this.listGoiThau.filter(obj => obj.id != id);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save(isBanHanh?) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    if (this.listGoiThau && this.listGoiThau.length > 0) {
      this.formData.value.listKtTdxdQuyetDinhPdKqlcntDsgt = this.listGoiThau;
      if (!this.formData.value.id) {
        this.formData.value.listKtTdxdQuyetDinhPdKqlcntDsgt.forEach(item => {
          item.idGoiThau = item.id;
          item.id = null
        })
      }
    } else {
      this.notification.success(MESSAGE.ERROR, "Kết quả lựa chọn nhà thầu không được để trống.");
      return;
    }
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    if (isBanHanh) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Ban hành quyết định",
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.createUpdate(this.formData.value);
            if (res) {
              let body = {
                id: res.id,
                trangThai: STATUS.BAN_HANH,
              }
              let res1 = await this.quyetdinhpheduyetKqLcntService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.NOTIFICATION, "Ban hành quyết định thành công");
                this.formData.patchValue({
                  trangThai: STATUS.BAN_HANH,
                  tenTrangThai: "Ban hành",
                })
                this.isViewDetail = true;
                this.spinner.hide();
              } else {
                this.notification.error(MESSAGE.ERROR, res1.msg);
                this.spinner.hide();
              }
            }
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      await this.createUpdate(this.formData.value)
    }
  }

  // async changeSoQdPdKhlcnt(event) {
  //   if (event) {
  //     let item = this.listQdPdKhlcnt.filter(item => item.soQd == event)[0];
  //     if (item) {
  //       this.formData.patchValue({
  //         idQdPdKhlcnt: item.id,
  //         tenDuAn: item.tenDuAn,
  //         chuDauTu: item.chuDauTu,
  //         idDuAn: item.idDuAn,
  //         tongTien: item.tongMucDt
  //       });
  //       let body = {
  //         "soQdPdDaDtxd": event,
  //         "paggingReq": {
  //           "limit": 10,
  //           "page": this.page - 1
  //         },
  //       };
  //       // if (!this.idInput) {
  //       //   let res = await this.quyetdinhpheduyetKqLcntService.getLastRecordBySoQdPdDaDtxd(body);
  //       //   if (res.msg == MESSAGE.SUCCESS && res.data) {
  //       //     // this.dataCongViecDaTh = res.data.listKtTdxdQuyetDinhPdKhlcntCvDaTh;
  //       //     // this.updateEditCongViecDaThCache();
  //       //   } else {
  //       //     // this.dataCongViecDaTh = [];
  //       //   }
  //       // }
  //     } else
  //       this.formData.patchValue({
  //         idQdPdDaDtxd: null,
  //         tenDuAn: null,
  //         idDuAn: null,
  //         tongTien: 0
  //       });
  //   }
  // }

}
