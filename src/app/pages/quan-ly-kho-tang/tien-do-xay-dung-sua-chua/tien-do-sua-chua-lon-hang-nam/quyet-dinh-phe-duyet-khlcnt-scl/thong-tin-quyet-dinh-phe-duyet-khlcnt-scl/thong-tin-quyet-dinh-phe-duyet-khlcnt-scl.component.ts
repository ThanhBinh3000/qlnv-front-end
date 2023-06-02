import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {AMOUNT_NO_DECIMAL} from "../../../../../../Utility/utils";
import {FILETYPE} from "../../../../../../constants/fileType";
import {
  QdPheDuyetKhlcntTdsclService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-khlcnt-tdscl.service";
import {
  QdPheDuyetBaoCaoKtktService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-bao-cao-ktkt.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-khlcnt-scl',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-khlcnt-scl.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-khlcnt-scl.component.scss']
})
export class ThongTinQuyetDinhPheDuyetKhlcntSclComponent extends  Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  @Input('itemQdPdBcKtkt') itemQdPdBcKtkt: any;
  @Input('itemDuAn') itemDuAn: any;
  @Output() dataItemKhLcnt = new EventEmitter<object>();
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listQdPdDaDtxd: any[] = []
  listNguonVon: any[] = []
  listHinhThucLcnt: any[] = []
  listPhuongThucLcnt: any[] = []
  listHinhThucHopDong: any[] = []

  dataCongViecDaTh: any[] = [];
  rowItemCongViecDaTh: CongViec = new CongViec();
  dataCongViecDaThEdit: { [key: string]: { edit: boolean; data: CongViec } } = {};
  dataCongViecKad: any[] = [];
  rowItemCongViecKad: CongViec = new CongViec();
  dataCongViecKadEdit: { [key: string]: { edit: boolean; data: CongViec } } = {};
  dataCongViecKh: any[] = [];
  rowItemCongViecKh: CongViec = new CongViec();
  dataCongViecKhEdit: { [key: string]: { edit: boolean; data: CongViec } } = {};
  AMOUNT = AMOUNT_NO_DECIMAL;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdPheDuyetBaoCaoKtktService: QdPheDuyetBaoCaoKtktService,
    private quyetdinhpheduyetKhlcntService: QdPheDuyetKhlcntTdsclService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKhlcntService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      namKh: [],
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdPdBcKtkt: [null],
      idQdPdBcKtkt: [null],
      trichYeu: [null, Validators.required],
      chuDauTu: [null],
      tenCongTrinh: [null],
      tenLoaiCongTrinh: [null],
      diaDiem: [null],
      idDuAn: [null],
      tongMucDt: [0],
      nguonVonDt: [0],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      listKtTdscQuyetDinhPdKhlcntCvDaTh: null,
      listKtTdscQuyetDinhPdKhlcntCvKad: null,
      listKtTdscQuyetDinhPdKhlcntCvKh: null,
      khoi: [null],
      loaiCapCt: [null],
      loai : ['01']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        // this.loadQdPdDaĐtxd(),
        this.loadNguonVon(),
        this.loadPhuongThucLcnt(),
        this.loadHinhThucLcnt(),
        this.loadLoaiHd()
      ]);
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


  bindingData() {
    if (this.itemDuAn && this.itemQdPdBcKtkt) {
      this.formData.patchValue({
        namKh: this.itemDuAn.namKh,
        tenCongTrinh: this.itemDuAn.tenCongTrinh,
        idDuAn: this.itemDuAn.id,
        soQdPdBcKtkt: this.itemQdPdBcKtkt.soQd,
        idQdPdBcKtkt: this.itemQdPdBcKtkt.id,
        tenLoaiCongTrinh: this.itemQdPdBcKtkt.tenLoaiCongTrinh,
        tongMucDt: this.itemQdPdBcKtkt.giaTriDt,
        nguonVonDt: this.itemQdPdBcKtkt.nguonVonDt,
        chuDauTu: this.itemQdPdBcKtkt.chuDauTu,
        diaDiem: this.itemQdPdBcKtkt.diaDiem,
      })
    }
  }

  async loadNguonVon() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
  }

  async loadHinhThucLcnt() {
    // List hinh thức lcnt
    this.listHinhThucLcnt = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listHinhThucLcnt = resNv.data;
    }
  }

  async loadPhuongThucLcnt() {
    // List phương thức lcnt
    this.listPhuongThucLcnt = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucLcnt = resNv.data;
    }
  }

  async loadLoaiHd() {
    // List loại hợp đồng
    this.listHinhThucHopDong = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listHinhThucHopDong = resNv.data;
    }
  }

  async banHanh(id) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
    this.approve(id, trangThai, mesg);
  }


  async save(isBanHanh?) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
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
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    this.formData.value.listKtTdscQuyetDinhPdKhlcntCvDaTh = this.dataCongViecDaTh;
    this.formData.value.listKtTdscQuyetDinhPdKhlcntCvKad = this.dataCongViecKad;
    this.formData.value.listKtTdscQuyetDinhPdKhlcntCvKh = this.dataCongViecKh;
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
              let res1 = await this.quyetdinhpheduyetKhlcntService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.NOTIFICATION, "Ban hành quyết định thành công");
                this.formData.patchValue({
                  trangThai: STATUS.BAN_HANH,
                  tenTrangThai: "Ban hành",
                })
                this.emitDataKhLcnt(res1.data);
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
      let res = await this.createUpdate(this.formData.value)
      if (res) {
        this.formData.patchValue({
          id: res.id,
        });
        this.idInput = res.id;
      }
    }
  }
  emitDataKhLcnt(data) {
    this.dataItemKhLcnt.emit(data);
  }
  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetKhlcntService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKems;
          this.dataCongViecDaTh = data.listKtTdscQuyetDinhPdKhlcntCvDaTh ? data.listKtTdscQuyetDinhPdKhlcntCvDaTh : [];
          this.dataCongViecKad = data.listKtTdscQuyetDinhPdKhlcntCvKad ? data.listKtTdscQuyetDinhPdKhlcntCvKad : [];
          this.dataCongViecKh = data.listKtTdscQuyetDinhPdKhlcntCvKh ? data.listKtTdscQuyetDinhPdKhlcntCvKh : [];
          this.updateEditCongViecDaThCache();
          this.updateEditCongViecKadCache();
          this.updateEditCongViecKhCache();
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

  // async loadQdPdDaĐtxd() {
  //   this.spinner.show();
  //   try {
  //     let body = {
  //       "maDvi": this.userInfo.MA_DVI,
  //       "idQdPdKhScl" : this.itemDuAn.id,
  //       "soQdPdKhScl" : this.itemDuAn.soQdPdTcdt,
  //       "namKh" : this.itemDuAn.namKh,
  //       "loai" : '01',
  //       "paggingReq": {
  //         "limit": 10,
  //         "page": this.page - 1
  //       },
  //     };
  //     let res = await this.qdPheDuyetBaoCaoKtktService.search(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       if (res.data) {
  //         this.listQdPdDaDtxd = res.data.content;
  //       }
  //     } else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //       this.spinner.hide();
  //     }
  //   } catch (e) {
  //     this.notification.error(MESSAGE.ERROR, e);
  //     this.spinner.hide();
  //   } finally {
  //     this.spinner.hide();
  //   }
  // }

  // async changeSoQdPdDaDtxd(event) {
  //   if (event) {
  //     let item = this.listQdPdDaDtxd.filter(item => item.soQd == event)[0];
  //     if (item) {
  //       this.formData.patchValue({
  //         idQdPdDaDtxd: item.id,
  //         tenDuAn: item.tenDuAn,
  //         chuDauTu: item.chuDauTu,
  //         diaChi: item.diaChi,
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
  //       if (!this.idInput) {
  //         let res = await this.quyetdinhpheduyetKhlcntService.getLastRecordBySoQdPdDaDtxd(body);
  //         if (res.msg == MESSAGE.SUCCESS && res.data) {
  //           this.dataCongViecDaTh = res.data.listKtTdxdQuyetDinhPdKhlcntCvDaTh;
  //           this.updateEditCongViecDaThCache();
  //         } else {
  //           this.dataCongViecDaTh = [];
  //         }
  //       }
  //     } else
  //       this.formData.patchValue({
  //         idQdPdDaDtxd: null,
  //         tenDuAn: null,
  //         idDuAn: null,
  //         tongTien: 0
  //       });
  //   }
  // }

  addAddCongViecDaTh() {
    this.rowItemCongViecDaTh.loai = '00';
    this.dataCongViecDaTh = [...this.dataCongViecDaTh, this.rowItemCongViecDaTh];
    this.rowItemCongViecDaTh = new CongViec();
    this.updateEditCongViecDaThCache();
    this.calCulateTien();
  }

  addCongViecKad() {
    this.rowItemCongViecKad.loai = '01';
    this.dataCongViecKad = [...this.dataCongViecKad, this.rowItemCongViecKad];
    this.rowItemCongViecKad = new CongViec();
    this.updateEditCongViecKadCache();
    this.calCulateTien();
  }

  addAddCongViecKh() {
    this.rowItemCongViecKh.loai = '02';
    this.dataCongViecKh = [...this.dataCongViecKh, this.rowItemCongViecKh];
    this.rowItemCongViecKh = new CongViec();
    this.updateEditCongViecKhCache();
    this.calCulateTien();
  }

  calCulateTien() {
    let tien1 = this.sumCT1('giaTri');
    let tien2 = this.sumCT2('giaTri');
    let tien3 = this.sumCT3('giaTri');
    let tongTien = tien1 + tien2 + tien3;
    let tien4 = (this.formData.value.tongMucDt - tongTien);
    this.formData.patchValue({
      tienCvDaTh: tien1,
      tienCvKad: tien2,
      tienCvKhlcnt: tien3,
      tongTien: tongTien,
      tienCvChuaDdk: tien4 <= 0 ? 0 : tien4
    })
  }

  updateEditCongViecDaThCache(): void {
    if (this.dataCongViecDaTh) {
      this.dataCongViecDaTh.forEach((item, index) => {
        this.dataCongViecDaThEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  updateEditCongViecKadCache(): void {
    if (this.dataCongViecKad) {
      this.dataCongViecKad.forEach((item, index) => {
        this.dataCongViecKadEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  updateEditCongViecKhCache(): void {
    if (this.dataCongViecKh) {
      this.dataCongViecKh.forEach((item, index) => {
        this.dataCongViecKhEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }


  editDataCongViecDaTh(index) {
    this.dataCongViecDaThEdit[index].edit = true;
  }

  editDataCongViecKad(index) {
    this.dataCongViecKadEdit[index].edit = true;
  }

  editDataCongViecKh(index) {
    this.dataCongViecKhEdit[index].edit = true;
  }

  refreshCongViecDaTh() {
    this.rowItemCongViecDaTh = new CongViec();
  }

  refreshCongViecKad() {
    this.rowItemCongViecKad = new CongViec();
  }

  refreshCongViecKh() {
    this.rowItemCongViecKh = new CongViec();
  }

  deleteCongViecDaTh(index) {
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
          this.dataCongViecDaTh.splice(index, 1);
          this.calCulateTien();
          this.updateEditCongViecDaThCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  deleteCongViecKad(index) {
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
          this.dataCongViecKad.splice(index, 1);
          this.calCulateTien();
          this.updateEditCongViecKadCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  deleteCongViecKh(index) {
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
          this.dataCongViecKh.splice(index, 1);
          this.calCulateTien();
          this.updateEditCongViecKhCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEditCongViecDaTh(idx) {
    Object.assign(this.dataCongViecDaTh[idx], this.dataCongViecDaThEdit[idx].data);
    this.calCulateTien();
    this.dataCongViecDaThEdit[idx].edit = false;
  }

  saveEditCongViecKad(idx) {
    Object.assign(this.dataCongViecKad[idx], this.dataCongViecKadEdit[idx].data);
    this.calCulateTien();
    this.dataCongViecKadEdit[idx].edit = false;
  }

  saveEditCongViecKh(idx) {
    Object.assign(this.dataCongViecKh[idx], this.dataCongViecKhEdit[idx].data);
    this.calCulateTien();
    this.dataCongViecKhEdit[idx].edit = false;
  }

  cancelEditCongViecDaTh(idx) {
    this.dataCongViecDaThEdit[idx] = {
      data: {...this.dataCongViecDaTh[idx]},
      edit: false
    };
  }

  cancelEditCongViecKad(idx) {
    this.dataCongViecKadEdit[idx] = {
      data: {...this.dataCongViecKad[idx]},
      edit: false
    };
  }

  cancelEditCongViecKh(idx) {
    this.dataCongViecKhEdit[idx] = {
      data: {...this.dataCongViecKh[idx]},
      edit: false
    };
  }

  sumCT1(key) {
    let value = 0;
    if (this.dataCongViecDaTh.length > 0) {
      value = this.dataCongViecDaTh.reduce((a, b) => a + (b[key] || 0), 0);
    }
    return value;
  }

  sumCT2(key) {
    let value = 0;
    if (this.dataCongViecKad.length > 0) {
      value = this.dataCongViecKad.reduce((a, b) => a + (b[key] || 0), 0);
    }
    return value;
  }

  sumCT3(key) {
    let value = 0;
    if (this.dataCongViecKh.length > 0) {
      value = this.dataCongViecKh.reduce((a, b) => a + (b[key] || 0), 0);
    }
    return value;
  }

  changeValueSelect(key, action?, idx?) {
    if (key == 'nguonVon') {
      if (action == 'edit') {
        this.dataCongViecKhEdit[idx].data.tenNguonVon = this.listNguonVon.find(item => item.ma == this.dataCongViecKhEdit[idx].data.nguonVon).giaTri;
      } else {
        this.rowItemCongViecKh.tenNguonVon = this.listNguonVon.find(item => item.ma == this.rowItemCongViecKh.nguonVon).giaTri;
      }
    }
    if (key == 'hinhThucLcnt') {
      if (action == 'edit') {
        this.dataCongViecKhEdit[idx].data.tenHinhThucLcnt = this.listHinhThucLcnt.find(item => item.ma == this.dataCongViecKhEdit[idx].data.hinhThucLcnt).giaTri;
      } else {
        this.rowItemCongViecKh.tenHinhThucLcnt = this.listHinhThucLcnt.find(item => item.ma == this.rowItemCongViecKh.hinhThucLcnt).giaTri;
      }
    }
    if (key == 'phuongThucLcnt') {
      if (action == 'edit') {
        this.dataCongViecKhEdit[idx].data.tenPhuongThucLcnt = this.listPhuongThucLcnt.find(item => item.ma == this.dataCongViecKhEdit[idx].data.phuongThucLcnt).giaTri;
      } else {
        this.rowItemCongViecKh.tenPhuongThucLcnt = this.listPhuongThucLcnt.find(item => item.ma == this.rowItemCongViecKh.phuongThucLcnt).giaTri;
      }
    }
    if (key == 'loaiHopDong') {
      if (action == 'edit') {
        this.dataCongViecKhEdit[idx].data.tenLoaiHopDong = this.listHinhThucHopDong.find(item => item.ma == this.dataCongViecKhEdit[idx].data.loaiHopDong).giaTri;
      } else {
        this.rowItemCongViecKh.tenLoaiHopDong = this.listHinhThucHopDong.find(item => item.ma == this.rowItemCongViecKh.loaiHopDong).giaTri;
      }
    }
  }
}

export class CongViec {
  idVirtual: string;
  id: number;
  noiDung: string;
  donViTh: string;
  giaTri: number;
  loai: string;
  vanBanPd: string;
  nguonVon: string;
  tenNguonVon: string;
  hinhThucLcnt: string;
  tenHinhThucLcnt: string;
  phuongThucLcnt: string;
  tenPhuongThucLcnt: string;
  thoiGian: string;
  loaiHopDong: string;
  tenLoaiHopDong: string;
  thoiGianThHd: number;
}
