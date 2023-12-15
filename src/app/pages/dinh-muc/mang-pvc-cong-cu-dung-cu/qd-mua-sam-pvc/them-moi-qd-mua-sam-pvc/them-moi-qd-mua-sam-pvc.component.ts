import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Validators } from '@angular/forms';
import { Base2Component } from '../../../../../components/base2/base2.component';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE } from '../../../../../constants/message';
import dayjs from 'dayjs';
import { STATUS } from '../../../../../constants/status';
import { saveAs } from 'file-saver';
import {
  DialogMmMuaSamComponent,
} from '../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component';
import { QdMuaSamPvcService } from '../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/qd-mua-sam-pvc.service';
import { DxChiCucPvcService } from '../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL } from '../../../../../Utility/utils';

@Component({
  selector: 'app-them-moi-qd-mua-sam-pvc',
  templateUrl: './them-moi-qd-mua-sam-pvc.component.html',
  styleUrls: ['./them-moi-qd-mua-sam-pvc.component.scss'],
})
export class ThemMoiQdMuaSamPvcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  listDxCuc: any[] = [];
  maQd: string;
  expandSet = new Set<number>();
  typeQd: string = 'TH';
  amount = AMOUNT_ONE_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatBaoHiemSv: DxChiCucPvcService,
    private qdMuaSamService: QdMuaSamPvcService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdMuaSamService);
    super.ngOnInit();
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
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucQdPvcMuaSamDtlReq: [null],
      loai: ['00'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/QĐ-TCDT';
      await this.loadDsTongHop();
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


  async loadDsTongHop() {
    this.spinner.show();
    try {
      let body = {
        'capDvi': '1',
        'paggingReq': {
          'limit': 10,
          'page': 0,
        },
      };
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && item.qdMuaSamBhId == null),
          );
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
  //         "limit": 99,
  //         "page": 0
  //       }
  //     }
  //     let res = await this.deXuatBaoHiemSv.search(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       let data = res.data;
  //       this.listDxCuc = data.content;
  //       if (this.listDxCuc) {
  //         this.listDxCuc =  this.listDxCuc.filter(
  //           (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP && item.qdMuaSamBhId == null )
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
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    if (!this.formData.value.maTh && !this.formData.value.maDx) {
      this.notification.error(MESSAGE.ERROR, 'Chọn số tổng hợp hoặc số đề xuất!');
      this.spinner.hide();
      return;
    }
    this.conVertTreToList();
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucQdPvcMuaSamDtlReq = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDTC, 'Bạn có chắc chắn muốn gửi duyệt?');
      } else {
        this.goBack();
      }
    } else {
      this.convertListData();
    }
  }

  sumSoLuong(column: string, tenCcdc: string, type?) {
    let sl = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data);
        });
      }
    });
    arr = arr.filter(item => item.tenCcdc == tenCcdc);
    if (arr && arr.length > 0) {
      if (!type) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[column];
          return prev;
        }, 0);
        sl = sum;
      } else {
        const sum = arr.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTd;
          return prev;
        }, 0);
        sl = sum;
      }
    }
    return sl;
  }

  changeSl(event: number, item: any) {
    if (event && item.slMetQuyCuon && item.maCcdc == '02.03') {
      let cuon = event / item.slMetQuyCuon;
      if (cuon.toString().includes(".")) {
        let cut = cuon.toString().split(".")
        let cuon0 = Number(cut[0])
        let check = cuon0 + 0.35
        if (check > cuon) {
          item.slCuon = cuon0
        } else {
          item.slCuon = cuon0 + 1
        }

      } else {
        item.slCuon = cuon
      }

    } else item.slCuon = undefined
  }

  changeSlQuyDoi(event: number, item: any) {
    if (event && item.soLuong && item.maCcdc == '02.03') {
      let cuon = item.soLuong / event;
      if (cuon.toString().includes(".")) {
        let cut = cuon.toString().split(".")
        let cuon0 = Number(cut[0])
        let check = cuon0 + 0.35
        if (check > cuon) {
          item.slCuon = cuon0
        } else {
          item.slCuon = cuon0 + 1
        }

      } else {
        item.slCuon = cuon
      }

    } else item.slCuon = undefined
  }

  convertListData() {
    if (this.dataTable?.length > 0) {
      this.dataTable = chain(this.dataTable)
        .groupBy('tenCcdc')
        .map((value, key) => ({
          tenCcdc: key,
          donGia: value[0].donGia || value[0].donGiaTd,
          moTaCcdc: value?.find(item => item.tenCcdc === key)?.moTaCcdc || "",
          dataChild: value,
          idVirtual: uuidv4(),
        }))
        .value();
    }
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push({ ...data, donGia: item.donGia });
        });
      }
    });
    this.dataTable = arr;
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    });
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
            soQd: this.formData.value.soQd ? this.formData.value.soQd.split('/')[0] : null,
          });
          if (this.formData.value.maTh) {
            this.typeQd = 'TH';
          } else {
            this.typeQd = 'DX';
          }
          this.dataTable = data.listQlDinhMucPvcQdMuaSamDtl;
          this.fileDinhKem = data.listFileDinhKems;
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
      case STATUS.DANG_NHAP_DU_LIEU:
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.BAN_HANH;
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?');
  }

  async changSoTh(event, type?: string) {
    let result;
    if (type == 'DX') {
      result = this.listDxCuc.filter(item => item.id = event);
    } else {
      result = [{ id: event }] //this.listTongHop.filter(item => item.id == event);
    }
    if (result && result.length > 0) {
      let detailTh = result[0];
      let res = await this.deXuatBaoHiemSv.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTable = [];
          this.dataTable = res.data.listQlDinhMucPvcDxCcdcDtl;
          console.log(this.dataTable, 'this.dataTablethis.dataTablethis.dataTable');
          if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
              item.id = null;
              item.tieuChuan = item.slTieuChuanTc;
              item.donGiaTd = item.donGia;
            });
            this.convertListData();
            this.expandAll();
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  chonMaTongHop() {
    if (!this.isView && this.typeQd == 'TH') {
      this.formData.controls['maDx'].clearValidators();
      this.formData.controls['maTh'].setValidators([Validators.required]);
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT NHU CẦU MÀNG PVC VÀ CCDC CỦA CÁC CỤC',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh: this.listTongHop,
          type: this.formData.value.loai,
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            maTh: data.id,
            maDx: null,
          });
          await this.changSoTh(data.id, 'TH');
        }
      });
    }
  }

  // chonSoDxCuc() {
  //   if (!this.isView && this.typeQd == 'DX') {
  //     this.formData.controls["maTh"].clearValidators();
  //     this.formData.controls["maDx"].setValidators([Validators.required]);
  //     let modalQD = this.modal.create({
  //       nzTitle:'DANH SÁCH ĐỀ XUẤT NHU CẦU MÀNG PVC VÀ CCDCCỦA CỤC',
  //       nzContent: DialogMmMuaSamComponent,
  //       nzMaskClosable: false,
  //       nzClosable: false,
  //       nzWidth: '700px',
  //       nzFooter: null,
  //       nzComponentParams: {
  //         listTh:  this.listDxCuc ,
  //         type : "02"
  //       },
  //     });
  //     modalQD.afterClose.subscribe(async (data) => {
  //       if (data) {
  //         this.formData.patchValue({
  //           maDx :  data.soCv,
  //           maTh :  null,
  //         })
  //         await this.changSoTh(data.id, 'DX');
  //       }
  //     })
  //   }
  // }

  protected readonly AMOUNT_NO_DECIMAL = AMOUNT_NO_DECIMAL;

  exportDataDetail() {
    if (this.dataTable.length > 0) {
      this.spinner.show();
      try {
        let arr = [];
        this.dataTable.forEach(item => {
          if (item.dataChild && item.dataChild.length > 0) {
            item.dataChild.forEach(data => {
              arr.push({ ...data, donGia: item.donGia });
            });
          }
        });
        let body = this.formData.value;
        body.listQlDinhMucPvcQdMuaSamDtl = arr;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.qdMuaSamService
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-quyet-dinh-mua-sam.xlsx'),
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
}
