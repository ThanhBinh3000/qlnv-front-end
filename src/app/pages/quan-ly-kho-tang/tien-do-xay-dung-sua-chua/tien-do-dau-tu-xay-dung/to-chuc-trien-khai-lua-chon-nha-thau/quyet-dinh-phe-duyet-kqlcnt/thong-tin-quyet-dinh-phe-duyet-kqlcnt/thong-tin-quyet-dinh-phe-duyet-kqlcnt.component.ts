import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {STATUS} from "../../../../../../../constants/status";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKqLcnt.service";
import {
  DialogMmMuaSamComponent
} from "../../../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {
  DialogQdPdKhlcntComponent
} from "../../../../../../../components/dialog/ql-kho-tang/dialog-qd-pd-khlcnt/dialog-qd-pd-khlcnt.component";
import {FILETYPE} from "../../../../../../../constants/fileType";

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
  STATUS = STATUS;
  maQd = "/" + this.userInfo.MA_QD;
  listQdPdKhlcnt: any[] = [];
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listGoiThau: any[] = [];
  listFile: any[] = []

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
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      ngayHieuLuc: [null, Validators.required],
      soQdPdKhlcnt: [null, Validators.required],
      idQdPdKhlcnt: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenDuAn: [],
      chuDauTu: [],
      ghiChu: [],
      tongMucDt: [0],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      ccPhapLy: [],
      listKtXdscQuyetDinhPdKqlcntDsgt: [[]]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadQdPdKhlcnt(),
      ]);
      if (this.idInput) {
        await this.detail(this.idInput)
      }
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
          this.listGoiThau = data.listKtXdscQuyetDinhPdKqlcntDsgt;
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

  chonQdPdKhlcnt() {
    let modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH THÔNG TIN ĐẤU THẦU',
      nzContent: DialogQdPdKhlcntComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '700px',
      nzFooter: null,
      nzComponentParams: {
        listQdPdKhlcnt: this.listQdPdKhlcnt,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.listGoiThau = [];
        this.formData.patchValue({
          idQdPdKhlcnt: data.id,
          soQdPdKhlcnt: data.soQd,
          chuDauTu: data.chuDauTu,
          tenDuAn: data.tenDuAn,
          tongMucDt: data.tongTien
        })
        //get danh sách gói thầu.
        let res = await this.quyetdinhpheduyetKhlcntService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.listGoiThau = res.data.listKtXdscQuyetDinhPdKhlcntCvKh;
        }
      }
    })
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

  async loadQdPdKhlcnt() {
    this.spinner.show();
    try {
      let body = {
        "trangThaiGt": "1",
        "paggingReq": {
          "limit": 5000,
          "page": this.page - 1
        },
      };
      let res = await this.quyetdinhpheduyetKhlcntService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listQdPdKhlcnt = res.data.content;
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

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    if (this.listGoiThau && this.listGoiThau.length > 0) {
      this.listGoiThau.forEach(item => {
        item.id = null
      })
      this.formData.value.listKtXdscQuyetDinhPdKqlcntDsgt = this.listGoiThau;
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
    let res = await this.createUpdate(this.formData.value)
    // if (res) {
    //   this.goBack()
    // }
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
  //       //     // this.dataCongViecDaTh = res.data.listKtXdscQuyetDinhPdKhlcntCvDaTh;
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
