import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {
  MmThongTinNcChiCuc
} from "../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import { saveAs } from 'file-saver';
import {STATUS} from "../../../../../constants/status";
import {QuyetDinhMuaSamService} from "../../../../../services/quyet-dinh-mua-sam.service";
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";

@Component({
  selector: 'app-mm-them-moi-qd-mua-sam',
  templateUrl: './mm-them-moi-qd-mua-sam.component.html',
  styleUrls: ['./mm-them-moi-qd-mua-sam.component.scss']
})
export class MmThemMoiQdMuaSamComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  listDxCuc: any[] = [];
  maQd: string
  rowItem: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  dataEdit: { [key: string]: { edit: boolean; data: MmThongTinNcChiCuc } } = {};
  expandSet = new Set<number>();
  typeQd: string = "TH";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
    private qdMuaSamService: QuyetDinhMuaSamService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdMuaSamService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year'), Validators.required],
      maTh: [null, Validators.required],
      maDx: [null],
      soQd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucQdMuaSamDtlReq: [null],
      loai: ['00'],
      ghiChu: [null],
      noiDung: [null]
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
      let res = await this.dxChiCucService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && !item.qdMuaSamId)
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
  //     let res = await this.dxChiCucService.search(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       let data = res.data;
  //       this.listDxCuc = data.content;
  //       if (this.listDxCuc) {
  //         this.listDxCuc = this.listDxCuc.filter(
  //           (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && !item.qdMuaSamId && item.trangThaiTh == STATUS.CHUA_TONG_HOP)
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
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.conVertTreToList();
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucQdMuaSamDtlReq = this.dataTable;
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
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: this.formData.value.soQd ? this.formData.value.soQd.split('/')[0] : null
          })
          if (this.formData.value.maTh) {
            this.typeQd = 'TH'
          } else {
            this.typeQd = 'DX'
          }
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucQdMuaSamDtl;
          if (this.userService.isCuc()) {
            this.dataTable = this.dataTable.filter(item => item.maDvi = this.userInfo.MA_DVI)
          }
          this.dataTable.forEach(item => {
            this.loadSlThuaThieu(item)
          })
          this.convertListData()
          this.expandAll();
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
      case STATUS.DANG_NHAP_DU_LIEU :
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

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenTaiSan').map((value, key) => ({
          tenTaiSan: key,
          dataChild: value,
          idVirtual: uuidv4(),
        })
      ).value()
    }
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            item.donViTinh = data.donViTinh
            item.donGiaTd = data.donGiaTd
          })
        }
      })
    }
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          data.thanhTienNc = data.donGiaTd * data.soLuong
          arr.push(data)
        })
      }
    })
    this.dataTable = arr
    console.log(this.dataTable)
  }

  sumSoLuong(data: any) {
    let sl = 0;
    if (data && data.dataChild && data.dataChild.length > 0) {
      data.dataChild.forEach(item => {
        sl = sl + item.soLuongTc
      })
    }
    return sl
  }


  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      })
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async changSoTh(event, type?: string) {
    let result;
    if (type == 'DX') {
      result = this.listDxCuc.filter(item => item.id = event)
    } else {
      result = this.listTongHop.filter(item => item.id = event)
    }
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.dxChiCucService.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTable = []
          const data = res.data;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
              this.loadSlThuaThieu(item)
              item.id = null;
              item.ghiChu = null;
              item.soLuong = item.soLuongTc
              item.slTieuChuan = item.slTieuChuanTc
            })
            this.convertListData()
            this.expandAll();
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
  }

  chonMaTongHop() {
    if (!this.isView && this.typeQd == 'TH') {
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT NHU CẦU CỦA CÁC CỤC',
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
          await this.changSoTh(data.id, 'TH');
        }
      })
    }
  }

  // chonSoDxCuc() {
  //   if (!this.isView && this.typeQd == 'DX') {
  //     let modalQD = this.modal.create({
  //       nzTitle: 'DANH SÁCH ĐỀ XUẤT CỦA CỤC',
  //       nzContent: DialogMmMuaSamComponent,
  //       nzMaskClosable: false,
  //       nzClosable: false,
  //       nzWidth: '700px',
  //       nzFooter: null,
  //       nzComponentParams: {
  //         listTh: this.listDxCuc,
  //         type: "02"
  //       },
  //     });
  //     modalQD.afterClose.subscribe(async (data) => {
  //       if (data) {
  //         this.formData.patchValue({
  //           maDx: data.soCv,
  //           maTh: null,
  //         })
  //         await this.changSoTh(data.id, 'DX');
  //       }
  //     })
  //   }
  // }

  async loadSlThuaThieu(item: MmThongTinNcChiCuc) {
    if ((item.slTieuChuan - item.slNhapThem - item.slHienCo) >= 0) {
      item.chenhLechThieu = item.slTieuChuan - item.slNhapThem - item.slHienCo
    } else {
      item.chenhLechThieu = 0
    }
    if ((item.slNhapThem + item.slHienCo - item.slTieuChuan) >= 0) {
      item.chenhLechThua = item.slNhapThem + item.slHienCo - item.slTieuChuan
    } else {
      item.chenhLechThua = 0
    }
  }

  exportDataDetail() {
    if (this.dataTable.length > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.listQlDinhMucQdMuaSamDtl = this.dataTable;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.qdMuaSamService
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-tong-hop-nhu-cau-mmtb-va-ccdc.xlsx'),
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

