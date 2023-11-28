import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import * as uuidv4 from "uuid";
import {chain} from "lodash";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {QdMuaSamBhService} from "../../../../../services/qd-mua-sam-bh.service";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";

@Component({
  selector: 'app-them-moi-bao-hiem-qd-mua-sam',
  templateUrl: './them-moi-bao-hiem-qd-mua-sam.component.html',
  styleUrls: ['./them-moi-bao-hiem-qd-mua-sam.component.scss']
})
export class ThemMoiBaoHiemQdMuaSamComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  maQd: string
  expandSet = new Set<number>();
  STATUS = STATUS;
  tableHangDtqgView: any[] = [];
  tableHangDtqgReq: any[] = [];
  tableGtriBHiem: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatBaoHiemSv: DeXuatNhuCauBaoHiemService,
    private qdMuaSamService: QdMuaSamBhService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdMuaSamService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year'), Validators.required],
      maTh: [null, Validators.required],
      maDx: [null],
      tongGiaTri: [null],
      soQd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      loai: ['00']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/QĐ-TCDT'
      await this.loadDsDxCc();
      // await this.loadDxCuc();
      if (this.id > 0) {
        await this.detail(this.id);
      }
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
        "capDvi": "1",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && !item.qdMuaSamBhId)
          )
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

  // async loadDxCuc() {
  //   this.spinner.show();
  //   try {
  //     let body = {
  //       "capDvi": "2",
  //       "paggingReq": {
  //         "limit": 10,
  //         "page": 0
  //       }
  //     }
  //     let res = await this.deXuatBaoHiemSv.search(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       let data = res.data;
  //       this.listDxCuc = data.content;
  //       if (this.listDxCuc) {
  //         this.listDxCuc = this.listDxCuc.filter(
  //           (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP && item.qdMuaSamBhId == null)
  //         )
  //       }
  //     } else {
  //       this.listDxCuc = [];
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //     this.spinner.hide();
  //   } catch (e) {
  //     this.spinner.hide();
  //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //   } finally {
  //     this.spinner.hide();
  //   }
  // }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (!this.formData.value.maTh) {
      this.notification.warning(MESSAGE.WARNING, 'Chọn số tổng hợp hoặc số đề xuất!')
      this.spinner.hide();
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.conVertTreToList();
    this.formData.value.listQlDinhMucQdMuaSamBhHdtqg = this.tableHangDtqgReq;
    this.formData.value.listQlDinhMucQdMuaSamBhKho = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDTC, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qdMuaSamService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.maQd = data.soQd ?  data.soQd.split('/')[1] : ''
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: this.formData.value.soQd ? this.formData.value.soQd.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucQdMuaSamBhKho;
          this.tableHangDtqgView = data.listQlDinhMucDxBhHdtqgTheoDvi;
          this.tableHangDtqgReq = data.listQlDinhMucQdMuaSamBhHdtqg;
          this.tableGtriBHiem = data.listQlDinhMucThGiaTriBaoHiem;
          this.convertListData();
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
        trangThai = STATUS.BAN_HANH
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  chonMaTongHop() {
    if (!this.isView) {
      this.formData.controls["maDx"].clearValidators();
      this.formData.controls["maTh"].setValidators([Validators.required])
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT NHU CẦU BẢO HIỂM CỦA CÁC CỤC',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh: this.listTongHop,
          type: this.formData.value.loai
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            maTh: data.id,
            maDx: null,
          })
          await this.changSoTh(data.id);
        }
      })
    }
  }

  async changSoTh(event) {
    let result = this.listTongHop.filter(item => item.id = event)
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.deXuatBaoHiemSv.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        let detail = res.data;
        if (detail) {
          this.dataTable = detail.listQlDinhMucDxBhKhoChua;
            this.dataTable.forEach(it => {
                it.id = null
            })
          this.tableHangDtqgView = detail.listQlDinhMucDxBhHdtqgTheoDvi;
          this.tableHangDtqgReq = detail.listQlDinhMucDxBhHdtqg;
            this.tableHangDtqgReq.forEach(it => {
                it.id = null
            })
          this.tableGtriBHiem = detail.listQlDinhMucThGiaTriBaoHiem;
          this.convertListData();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
  }

  convertListData() {
    this.dataTable = chain(this.dataTable)
      .groupBy("tenDonViCha")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("tenDonVi")
          ?.map((value2, key2) => {
              return {
                idVirtual: uuidv4.v4(),
                children: value2,
                tenDonVi : key2
              }
            }
          ).value();
        return {
          idVirtual: uuidv4.v4(),
          children: children1,
          tenDonVi: key1
        };
      }).value();
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children.forEach(data => {
          if (data.children && data.children.length > 0) {
            data.children.forEach(it => {
              arr.push(it)
            })
          }
        })
      }
      this.dataTable = arr
    })
  }

  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children.forEach(data => {
          if (data.children && data.children.length > 0) {
            data.children.forEach(it => {
              arr.push(it)
            })
          }
        })
      }
    })
    if (arr && arr.length > 0) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[column];
          return prev;
        }, 0);
        result = sum
      } else {
        let list = arr.filter(item => item.tenDonVi == tenDvi)
        if (list && list.length > 0) {
          const sum = list.reduce((prev, cur) => {
            prev += cur[column];
            return prev;
          }, 0);
          result = sum
        }
      }
    }
    return result;
  }

  sumSlHang(row: string, table : any[]) : number {
    let result = 0;
    let arr = table.filter(it => it.nhomCha);
    const sum = arr.reduce((prev, cur) => {
      prev += cur[row];
      return prev;
    }, 0);
    result = sum;
    return result;
  }
  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.children && s.children.length > 0) {
          s.children.forEach(it => {
            this.expandSet.add(it.idVirtual);
          })
        }
      });
    }
  }



}
