import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {Validators} from "@angular/forms";
import dayjs from "dayjs";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {STATUS} from "../../../../../constants/status";
import {DonviService} from "../../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {OldResponseData} from "../../../../../interfaces/response";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";

@Component({
  selector: 'app-them-moi-de-xuat-bao-hiem-cc',
  templateUrl: './them-moi-de-xuat-bao-hiem-cc.component.html',
  styleUrls: ['./them-moi-de-xuat-bao-hiem-cc.component.scss']
})
export class ThemMoiDeXuatBaoHiemCcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;

  maCv: string
  rowItemKho: BaoHiemKhoDangChuaHang = new BaoHiemKhoDangChuaHang();
  dataEditKho: { [key: string]: { edit: boolean; data: BaoHiemKhoDangChuaHang } } = {};
  rowItemHh: BaoHiemHangDtqg = new BaoHiemHangDtqg();
  dataEditHh: { [key: string]: { edit: boolean; data: BaoHiemHangDtqg } } = {};
  dsDiemKho: any[] = [];
  dsNhaKho: any[] = [];
  tableHangDtqg: any[] = [];
  listHangHoa: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatBaoHiemSv: DeXuatNhuCauBaoHiemService,
    private donViService: DonviService,
    private danhMucSv: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatBaoHiemSv)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      idTh: [null],
      maDvi: [null],
      capDvi: [null],
      soCv: [null, Validators.required],
      ngayKy: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      giaTriDx: [null,],
      trichYeu: [null,],
      trangThai: ['00'],
      trangThaiTh: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxBhKhoChua: [null],
      listQlDinhMucDxBhHdtqg: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maCv = '/' + this.userInfo.DON_VI.tenVietTat + '-TCKT'
      this.loadAllDsDiemKho()
      this.loadDsHangHoa()
      if (this.id) {
        this.detail(this.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItemKho);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      return;
    }
    if (this.checkExitsData(this.rowItemKho, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập nhà kho khác!!!");
      return;
    }
    this.rowItemKho.maDvi = this.userInfo.MA_DVI
    this.dataTable = [...this.dataTable, this.rowItemKho];
    this.rowItemKho = new BaoHiemKhoDangChuaHang();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.nhaKho == item.nhaKho) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: BaoHiemKhoDangChuaHang) {
    let msgRequired = ''
    if (!item.diemKho || !item.nhaKho || !item.giaTriBhDx || !item.giaTriDk || !item.giaTriHt) {
      msgRequired = 'Vui lòng nhập đầy đủ thông tin!'
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEditKho[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  refresh() {
    this.rowItemKho = new BaoHiemKhoDangChuaHang();
  }

  editRow(stt: number) {
    this.dataEditKho[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEditKho[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEditKho[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      return;
    }
    this.dataEditKho[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEditKho[idx].data);
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

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DA_KY : {
        trangThai = STATUS.DADUYET_CB_CUC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
      if (this.dataTable.length <= 0) {
        this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết đề xuất");
        return;
      }
      this.helperService.markFormGroupTouched(this.formData)
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      this.formData.value.giaTriDx = this.sumTable(this.dataTable, 'giaTriBhDx') + this.sumTable(this.tableHangDtqg, 'giaTriBhDx')
      this.formData.value.soCv = this.formData.value.soCv + this.maCv
      this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
      this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqg;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      this.formData.value.capDvi = this.userInfo.CAP_DVI;
      await super.saveAndSend( this.formData.value, status, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }

  async save() {
    if (this.dataTable.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết đề xuất");
      return;
    }
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.giaTriDx = this.sumTable(this.dataTable, 'giaTriBhDx') + this.sumTable(this.tableHangDtqg, 'giaTriBhDx')
    this.formData.value.soCv = this.formData.value.soCv + this.maCv
    this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqg;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack();
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.deXuatBaoHiemSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soCv: this.formData.value.soCv ? this.formData.value.soCv.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxBhKhoChua;
          this.tableHangDtqg = data.listQlDinhMucDxBhHdtqg;
          this.updateEditCache();
          this.updateEditCacheHh();
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

  async loadAllDsDiemKho() {
      let res = await this.donViService.layTatCaDonViByLevel(4);
      if (res && res.data) {
        this.dsDiemKho = res.data
        this.dsDiemKho = this.dsDiemKho.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI));
      }
  }

  async changDiemKho(event, type?: any) {
    if (event) {
      const dsTong = await this.donViService.layTatCaDonViByLevel(5);
      this.dsNhaKho = dsTong.data
      this.dsNhaKho = this.dsNhaKho.filter(item => item.maDvi.startsWith(event) && item.type != 'PB')
      let list = this.dsDiemKho.filter(item => item.maDvi == event)
      if (list && list.length > 0) {
        if (type) {
          type.nhaKho = null
          type.tenDiemKho = list[0].tenDvi
        } else {
          this.rowItemKho.nhaKho = null
          this.rowItemKho.tenDiemKho = list[0].tenDvi
        }
      }
    }
  }

  async changeNhaKho(event: any, type?: any) {
    let list = this.dsNhaKho.filter(item => item.maDvi == event)
    if (list && list.length > 0) {
      if (type) {
        type.tenNhaKho = list[0].tenDvi
      } else {
        this.rowItemKho.tenNhaKho = list[0].tenDvi
      }
      let body = {
        maDvi: list[0].maDvi,
        capDvi: list[0].capDvi
      }
      await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data && res.data.object) {
            let detail = res.data.object
            if (type) {
              type.dienTich = detail.dienTichDat ? detail.dienTichDat : 0
              type.tichLuong = detail.tichLuongThietKe ? detail.tichLuongThietKe : 0
            } else {
              this.rowItemKho.dienTich = detail.dienTichDat ? detail.dienTichDat : 0
              this.rowItemKho.tichLuong = detail.tichLuongTk ? detail.tichLuongTk : 0
            }
          }
        }
      })
    }
  }

  async loadDsHangHoa() {
    let res = await this.danhMucSv.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listHangHoa = res.data
      }
    }
  }

  async themMoiCtietHh() {
    let msgRequired = this.requiredHh(this.rowItemHh);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      return;
    }
    if (this.checkExitsDataHh(this.rowItemHh, this.tableHangDtqg)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập nhà kho khác!!!");
      return;
    }
    this.rowItemHh.maDvi = this.userInfo.MA_DVI
    this.tableHangDtqg = [...this.tableHangDtqg, this.rowItemHh];
    this.rowItemHh = new BaoHiemHangDtqg();
    this.updateEditCacheHh();
  }

  checkExitsDataHh(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maHangHoa == item.maHangHoa) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  requiredHh(item: BaoHiemHangDtqg) {
    let msgRequired = ''
    if (!item.maHangHoa || !item.soLuongDk || !item.giaTriDk || !item.giaTriBhDx) {
      msgRequired = 'Vui lòng nhập đầy đủ thông tin!'
    }
    return msgRequired;
  }

  updateEditCacheHh() {
    if (this.tableHangDtqg) {
      this.tableHangDtqg.forEach((item, index) => {
        this.dataEditHh[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  refreshHh() {
    this.rowItemHh = new BaoHiemHangDtqg();
  }

  editRowHh(stt: number) {
    this.dataEditHh[stt].edit = true;
  }

  cancelEditHh(stt: number): void {
    this.dataEditHh[stt] = {
      data: {...this.tableHangDtqg[stt]},
      edit: false
    };
  }

  async saveEditHh(idx: number) {
    let msgRequired = this.requiredHh(this.dataEditHh[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      return;
    }
    this.dataEditHh[idx].edit = false;
    Object.assign(this.tableHangDtqg[idx], this.dataEditHh[idx].data);
    this.updateEditCacheHh();
  }

  deleteItemHh(index: any) {
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
          this.tableHangDtqg.splice(index, 1);
          this.updateEditCacheHh();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async changHangHoa(event, type?: any) {
    let list = this.listHangHoa.filter(item => item.ma == event)
    if (list && list.length > 0) {
      if (type) {
        type.donViTinh = list[0].maDviTinh
        type.tenHangHoa = list[0].ten
      } else {
        this.rowItemHh.donViTinh = list[0].maDviTinh
        this.rowItemHh.tenHangHoa = list[0].ten
      }
      let body = {
        maDvi: this.userInfo.MA_DVI,
        maVthh: event
      }
      let res = await this.deXuatBaoHiemSv.trangThaiHt(body);
      if (res && res.data && res.data.length > 0) {
        let listHh = res.data.filter(item => item.maVthh == event)
        if (listHh) {
          const sum = listHh.reduce((prev, cur) => {
            prev += cur.slHienThoi;
            return prev;
          }, 0);
          if (type) {
            type.soLuongHt = sum ? sum : 0
          } else {
            this.rowItemHh.soLuongHt = sum ? sum : 0
          }
        }
      }
    }
  }

  sumTable(talbe?: any[], column?: string): number {
    let result = 0;
    const sum = talbe.reduce((prev, cur) => {
      prev += cur[column];
      return prev;
    }, 0);
    result = sum
    return result;
  }
}

export class BaoHiemKhoDangChuaHang {
  id: number;
  bhHdrId: number;
  maDvi: string;
  diemKho: string;
  nhaKho: string;
  tenDiemKho: string;
  tenNhaKho: string;
  dienTich: string;
  giaTriBhDx: number;
  giaTriDk: number;
  giaTriHt: number;
  tichLuong: number;
  giaTriTc: number;
}


export class BaoHiemHangDtqg {
  id: number;
  maDvi: string;
  bhHdrId: number;
  donViTinh: string;
  maHangHoa: string;
  tenHangHoa: string;
  giaTriBhDx: number;
  giaTriDk: number;
  giaTriHt: number;
  soLuongHt: number;
  soLuongDk: number;
  giaTriTc: number;
}

