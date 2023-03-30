import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {KtQdXdHangNamService} from "../../../../../../services/kt-qd-xd-hang-nam.service";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {KeHoachVonPhiBNCT} from "../../../../../../models/KeHoachVonPhiBNCT";
import {DanhMucService} from "../../../../../../services/danhmuc.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-khlcnt',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-khlcnt.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-khlcnt.component.scss']
})
export class ThongTinQuyetDinhPheDuyetKhlcntComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
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


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKhlcntService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdPdDaDtxd: [null, Validators.required],
      idQdPdDaDtxd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenDuAn: [null, Validators.required],
      idDuAn: [null, Validators.required],
      tienCvDaTh: [0],
      tienCvKad: [0],
      tienCvKhlcnt: [0],
      tienCvChuaDdk: [0],
      tongTien: [0],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      listKtXdscQuyetDinhPdKhlcntCvDaTh: null,
      listKtXdscQuyetDinhPdKhlcntCvKad: null,
      listKtXdscQuyetDinhPdKhlcntCvKh: null
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadQdPdDaĐtxd(),
        this.loadNguonVon(),
        this.loadPhuongThucLcnt(),
        this.loadHinhThucLcnt(),
        this.loadLoaiHd()
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

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    this.formData.value.listKtXdscQuyetDinhPdKhlcntCvDaTh = this.dataCongViecDaTh;
    this.formData.value.listKtXdscQuyetDinhPdKhlcntCvKad = this.dataCongViecKad;
    this.formData.value.listKtXdscQuyetDinhPdKhlcntCvKh = this.dataCongViecKh;
    this.formData.value.tienCvChuaDdk = this.formData.value.tongTien - (this.formData.value.tienCvKhlcnt + this.formData.value.tienCvKad + this.formData.value.tienCvDaTh);
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack()
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetKhlcntService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null,
          })
          this.fileDinhKem = data.fileDinhKems;
          this.dataCongViecDaTh = data.listKtXdscQuyetDinhPdKhlcntCvDaTh;
          this.dataCongViecKad = data.listKtXdscQuyetDinhPdKhlcntCvKad;
          this.dataCongViecKh = data.listKtXdscQuyetDinhPdKhlcntCvKh;
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

  async loadQdPdDaĐtxd() {
    this.spinner.show();
    try {
      let body = {
        "maDvi": this.userInfo.MA_DVI,
        "paggingReq": {
          "limit": 10,
          "page": this.page - 1
        },
      };
      let res = await this.quyetdinhpheduyetduandtxdService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listQdPdDaDtxd = res.data.content;
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

  async changeSoQdPdDaDtxd(event) {
    if (event) {
      let item = this.listQdPdDaDtxd.filter(item => item.soQd == event)[0];
      if (item) {
        this.formData.patchValue({
          idQdPdDaDtxd: item.id,
          tenDuAn: item.tenDuAn,
          idDuAn: item.idDuAn,
          tongTien: item.tongMucDt
        });
        let body = {
          "soQdPdDaDtxd": event,
          "paggingReq": {
            "limit": 10,
            "page": this.page - 1
          },
        };
        let res = await this.quyetdinhpheduyetKhlcntService.getLastRecordBySoQdPdDaDtxd(body);
        if (res.msg == MESSAGE.SUCCESS && res.data) {
          this.dataCongViecDaTh = res.data.listKtXdscQuyetDinhPdKhlcntCvDaTh;
          this.updateEditCongViecDaThCache();
        } else {
          this.dataCongViecDaTh = [];
        }
      } else
        this.formData.patchValue({
          idQdPdDaDtxd: null,
          tenDuAn: null,
          idDuAn: null,
          tongTien: 0
        });
    }
  }

  addAddCongViecDaTh() {
    this.rowItemCongViecDaTh.loai = '00';
    this.dataCongViecDaTh = [...this.dataCongViecDaTh, this.rowItemCongViecDaTh];
    this.rowItemCongViecDaTh = new CongViec();
    this.updateEditCongViecDaThCache();
    this.formData.patchValue({
      tienCvDaTh: this.sumCT1('giaTri')
    })
  }

  addAddCongViecKad() {
    this.rowItemCongViecKad.loai = '01';
    this.dataCongViecKad = [...this.dataCongViecKad, this.rowItemCongViecKad];
    this.rowItemCongViecKad = new CongViec();
    this.updateEditCongViecKadCache();
    this.formData.patchValue({
      tienCvKad: this.sumCT2('giaTri')
    })
  }

  addAddCongViecKh() {
    this.rowItemCongViecKh.loai = '02';
    this.dataCongViecKh = [...this.dataCongViecKh, this.rowItemCongViecKh];
    this.rowItemCongViecKh = new CongViec();
    this.updateEditCongViecKhCache();
    this.formData.patchValue({
      tienCvKhlcnt: this.sumCT3('giaGoiThau')
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
          this.formData.patchValue({
            tienCvDaTh: this.sumCT1('giaTri')
          })
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
          this.formData.patchValue({
            tienCvKad: this.sumCT2('giaTri')
          })
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
          this.formData.patchValue({
            tienCvKhlcnt: this.sumCT3('giaTri')
          })
          this.updateEditCongViecKhCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEditCongViecDaTh(idx) {
    Object.assign(this.dataCongViecDaTh[idx], this.dataCongViecDaThEdit[idx].data);
    this.formData.patchValue({
      tienCvDaTh: this.sumCT1('giaTri')
    })
    this.dataCongViecDaThEdit[idx].edit = false;
  }

  saveEditCongViecKad(idx) {
    Object.assign(this.dataCongViecKad[idx], this.dataCongViecKadEdit[idx].data);
    this.formData.patchValue({
      tienCvKad: this.sumCT2('giaTri')
    })
    this.dataCongViecKadEdit[idx].edit = false;
  }

  saveEditCongViecKh(idx) {
    Object.assign(this.dataCongViecKh[idx], this.dataCongViecKhEdit[idx].data);
    this.formData.patchValue({
      tienCvKhlcnt: this.sumCT3('giaTri')
    })
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
    return this.dataCongViecDaTh.reduce((a, b) => a + (b[key] || 0), 0);
  }

  sumCT2(key) {
    return this.dataCongViecKad.reduce((a, b) => a + (b[key] || 0), 0);
  }

  sumCT3(key) {
    return this.dataCongViecKh.reduce((a, b) => a + (b[key] || 0), 0);
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


