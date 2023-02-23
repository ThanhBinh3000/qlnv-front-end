import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {MESSAGE} from "../../../../../constants/message";
import {STATUS} from "../../../../../constants/status";
import dayjs from "dayjs";
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {QuyetDinhMuaSamService} from "../../../../../services/quyet-dinh-mua-sam.service";
import {
  MmThongTinPhanBoCtComponent
} from "../../mm-tt-phan-bo/mm-them-moi-tt-phan-bo/mm-thong-tin-phan-bo-ct/mm-thong-tin-phan-bo-ct.component";

@Component({
  selector: 'app-mm-thong-tin-hop-dong',
  templateUrl: './mm-thong-tin-hop-dong.component.html',
  styleUrls: ['./mm-thong-tin-hop-dong.component.scss']
})
export class MmThongTinHopDongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  idPhuLuc  : number;
  isViewPl : boolean
  isViewHd : boolean = false;
  listTongHop : any[] = [];
  maQd  : string
  rowItem: MmHopDongCt = new MmHopDongCt();
  dataEdit: { [key: string]: { edit: boolean; data: MmHopDongCt } } = {};
  expandSet = new Set<number>();
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
    private qdMuaSamService: QuyetDinhMuaSamService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id : [null],
      maDvi : [null],
      namKeHoach : [dayjs().get('year'), Validators.required],
      soQdMs : [null, Validators.required],
      soHd : [null, Validators.required],
      tenHd : [null, Validators.required],
      ngayKy : [null, Validators.required],
      loaiHd : [null, Validators.required],
      tgThucHien : [null, Validators.required],
      giaTri : [null, Validators.required],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      fileDinhKems : [null],
      lyDoTuChoi : [null],
      listQlDinhMucDxTbmmTbcdDtl : [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/QĐ-TCDT'
      await this.loadDsDxCc();
      // if (this.id > 0) {
      //   await this.detail(this.id);
      // }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "loai": "00",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.qdMuaSamService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(item => item.trangThai == this.STATUS.BAN_HANH )
        }
      } else {
        this.listTongHop = [];
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

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let body = this.formData.value;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDV, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.dxChiCucService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
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

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
      case STATUS.TU_CHOI_LDTC : {
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      }
      case STATUS.CHO_DUYET_LDTC : {
        trangThai = STATUS.DA_DUYET_LDTC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new MmHopDongCt();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maTaiSan == item.maTaiSan) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: MmHopDongCt) {
    let msgRequired = '';
    //validator
    if (!item.maTaiSan) {
      msgRequired = "Loại tài sản không được để trống";
    } else if (!item.donGiaTd) {
      msgRequired = "Đơn giá gồm thuế không được để trống";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  refresh() {
    this.rowItem = new MmHopDongCt();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].data.thanhTien = this.dataEdit[idx].data.donGiaTd * this.dataEdit[idx].data.soLuong
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  chonMaTongHop() {
    if (!this.isView) {
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH MUA SẮM',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh: this.listTongHop,
          type : "01"
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soQdMs : data.soQd
          })
          await this.changSoTh(data.id);
        }
      })
    }
  }
  async changSoTh(event) {
    if (this.listTongHop && this.listTongHop.length > 0) {
      let result = this.listTongHop.filter(item => item.id = event)
      if (result && result.length > 0) {
        let detailTh = result[0]
        let res = await this.qdMuaSamService.getDetail(detailTh.id);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            const data = res.data;
            this.dataTable = data.listQlDinhMucQdMuaSamDtl
            this.updateEditCache()
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
      }
    }
  }
  redirectToPhuLuc(isView: boolean, id: number) {
    this.idPhuLuc = id;
    this.isViewHd = true;
    this.isViewPl = isView;
  }
}

export class MmHopDongCt {
  id : number;
  maTaiSan : string;
  tenTaiSan : string;
  soLuong : number = 0;
  donViTinh : string;
  donGiaTd : number = 0;
  thanhTien : number = 0;
}
