import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import { Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {QdMuaSamBhService} from "../../../../../services/qd-mua-sam-bh.service";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";

@Component({
  selector: 'app-them-moi-qd-mua-sam-pvc',
  templateUrl: './them-moi-qd-mua-sam-pvc.component.html',
  styleUrls: ['./them-moi-qd-mua-sam-pvc.component.scss']
})
export class ThemMoiQdMuaSamPvcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  listDxCuc: any[] = [];
  tableHangDtqg: any[] = [];
  maQd: string
  expandSet = new Set<number>();
  typeQd : string
  tableGiaTriBh: any[] = [];
  dataHang : any[] = [];
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
      maTh: [null],
      maDx: [null],
      tongGiaTri: [null],
      soQd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucQdMuaSamDtlReq: [null],
      loai : ['00']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/QĐ-TCDT'
      await this.loadDsDxCc();
      await this.loadDxCuc();
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
          this.listTongHop =  this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDV && item.qdMuaSamBhId == null )
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

  async loadDxCuc() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "2",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxCuc = data.content;
        if (this.listDxCuc) {
          this.listDxCuc =  this.listDxCuc.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP && item.qdMuaSamBhId == null )
          )
        }
      } else {
        this.listDxCuc = [];
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
    if (this.formData.invalid ) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (!this.formData.value.maTh && ! this.formData.value.maDx) {
      this.notification.error(MESSAGE.ERROR, 'Chọn số tổng hợp hoặc số đề xuất!')
      this.spinner.hide();
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucQdMuaSamBhHdtqg = this.tableHangDtqg;
    this.formData.value.listQlDinhMucQdMuaSamBhKho = this.dataTable;
    this.formData.value.tongGiaTri = (this.tableGiaTriBh[0].gtThamGiaBh  * this.tableGiaTriBh[0].tiLePhiCoBan + this.tableGiaTriBh[2].tiLePhiCoBan * this.tableGiaTriBh[2].gtThamGiaBh + this.tableGiaTriBh[4].tiLePhiCoBan * this.tableGiaTriBh[4].gtThamGiaBh + this.tableGiaTriBh[5].tiLePhiCoBan * this.tableGiaTriBh[5].gtThamGiaBh) * 11/10
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

  sumSoLuong(column: string, tenCcdc : string) {
    let sl = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
    })

    if (arr && arr.length> 0) {
      arr = arr.filter(item => item.tenCcdc == tenCcdc)
      const sum = arr.reduce((prev, cur) => {
        prev += cur[column]
        return prev;
      }, 0)
      sl = sum
    }
    return sl
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenCcdc')
        .map((value, key) => ({tenCcdc: key, dataChild: value, idVirtual: uuidv4(),})
        ).value()
    }
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
    })
    this.dataTable = arr
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    })
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qdMuaSamService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd : this.formData.value.soQd ? this.formData.value.soQd.split('/')[0] : null
          })
          if (this.formData.value.maTh) {
            this.typeQd ='TH'
          } else {
            this.typeQd = 'DX'
          }
          this.fileDinhKem = data.listFileDinhKems;
          this.convertListData()
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

  async changSoTh(event, type? : string) {
    let result;
    if (type == 'DX') {
      result =this.listDxCuc.filter(item => item.id = event)
    } else {
      result = this.listTongHop.filter(item => item.id = event)
    }
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.deXuatBaoHiemSv.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {

        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
  }

  chonMaTongHop() {
    if (!this.isView && this.typeQd == 'TH') {
      this.formData.controls["maDx"].clearValidators();
      this.formData.controls["maTh"].setValidators([Validators.required])
      let modalQD = this.modal.create({
        nzTitle:'DANH SÁCH TỔNG HỢP ĐỀ XUẤT NHU CẦU BẢO HIỂM CỦA CÁC CỤC',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh:  this.listTongHop ,
          type :this.formData.value.loai
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            maTh :  data.id,
            maDx :  null,
          })
          await this.changSoTh(data.id, 'TH');
        }
      })
    }
  }
  chonSoDxCuc() {
    if (!this.isView && this.typeQd == 'DX') {
      this.formData.controls["maTh"].clearValidators();
      this.formData.controls["maDx"].setValidators([Validators.required]);
      let modalQD = this.modal.create({
        nzTitle:'DANH SÁCH ĐỀ XUẤT BẢO HIỂM CỦA CỤC',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh:  this.listDxCuc ,
          type : "02"
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            maDx :  data.soCv,
            maTh :  null,
          })
          await this.changSoTh(data.id, 'DX');
        }
      })
    }
  }
}
