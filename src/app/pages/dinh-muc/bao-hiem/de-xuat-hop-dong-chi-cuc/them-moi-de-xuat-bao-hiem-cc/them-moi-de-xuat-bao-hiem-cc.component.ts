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
import {STATUS} from "../../../../../constants/status";
import {DonviService} from "../../../../../services/donvi.service";
import {OldResponseData} from "../../../../../interfaces/response";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";
import {AMOUNT_NO_DECIMAL} from '../../../../../Utility/utils';
import * as uuidv4 from "uuid";
import {chain, cloneDeep} from "lodash";
import printJS from "print-js";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-them-moi-de-xuat-bao-hiem-cc',
  templateUrl: './them-moi-de-xuat-bao-hiem-cc.component.html',
  styleUrls: ['./them-moi-de-xuat-bao-hiem-cc.component.scss']
})
export class ThemMoiDeXuatBaoHiemCcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  isViewModal: boolean;

  maCv: string
  rowItemKho: BaoHiemKhoDangChuaHang = new BaoHiemKhoDangChuaHang();
  dataEditKho: { [key: string]: { edit: boolean; data: BaoHiemKhoDangChuaHang } } = {};
  rowItemHh: BaoHiemHangDtqg = new BaoHiemHangDtqg();
  dsDiemKho: any[] = [];
  dsNhaKho: any[] = [];
  tableHangDtqgView: any[] = [];
  tableHangDtqgReq: any[] = [];
  tableTongHop: any[] = [];
  listHangHoa: any[] = [];
  amount = AMOUNT_NO_DECIMAL;
  expandSetString = new Set<string>();
  isThemMoi: boolean = false;
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  printSrc: any
  showDlgPreview = false;
  loai: number;

  onExpandStringChange(idVirtual: string, isExpanded: boolean): void {
    if (isExpanded) {
      this.expandSetString.add(idVirtual);
    } else {
      this.expandSetString.delete(idVirtual);
    }
  }

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
      this.loadAllDsDiemKho()
      this.loadDsHangHoa()
      if (this.id) {
        await this.detail(this.id)
      } else {
        this.maCv = '/' + this.userInfo.DON_VI.tenVietTat + '-TCKT'
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async themMoiKhoChua() {
    let msgRequired = this.required(this.rowItemKho);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      return;
    }
    if (this.checkExitsData(this.rowItemKho, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập nhà kho khác!!!");
      return;
    }
    let body = {
      maDvi: this.rowItemKho.nhaKho,
      capDvi: 5
    }
    await this.mangLuoiKhoService.getDetailByMa(body).then(async (res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.object) {
          let detail = res.data.object
          let arrHangHoa = detail.ctietHhTrongKho;
          if (arrHangHoa && arrHangHoa.length > 0) {
            const groupedData: { [key: string]: any } = {};
            arrHangHoa.forEach(item => {
              const key = item.tenLoaiVthh || "";
              if (!groupedData[key]) {
                groupedData[key] = {
                  tenLoaiVthh: item.tenLoaiVthh || "",
                  tenNhaKho: item.tenNhaKho || "",
                  tenDiemKho: item.tenDiemKho || "",
                  loaiVthh: item.loaiVthh || "",
                  tenDonViTinh: item.tenDonViTinh || "",
                  slHienThoi: 0,
                  thanhTien: 0,
                  maDonVi: item.maDonVi ? item.maDonVi.substr(0, 12) : ''
                };
              }
              groupedData[key].slHienThoi += item.slHienThoi;
              groupedData[key].thanhTien += item.thanhTien;
            });
            const result: any[] = Object.values(groupedData);
            for (const item of result) {
              if (item.slHienThoi > 0) {
                let data = new BaoHiemHangDtqg();
                data.tenNhaKho = item.tenNhaKho;
                data.tenDiemKho = item.tenDiemKho;
                data.maHangHoa = item.loaiVthh;
                data.tenHangHoa = item.tenLoaiVthh;
                data.donViTinh = item.tenDonViTinh;
                data.soLuongHt = item.slHienThoi;
                data.giaTriHt = item.thanhTien;
                data.maKhoChua = item.maDonVi;
                data.maDvi = this.userInfo.MA_DVI;
                data.khoiTich = this.rowItemKho.khoiTich
                if (item.loaiVthh) {
                  let detailHH = await this.danhMucSv.getDetail(item.loaiVthh);
                  if (detailHH.msg == MESSAGE.SUCCESS) {
                    if (detailHH.data && detailHH.data.nhomHhBaoHiem) {
                      this.tableHangDtqgReq.push(data)
                    }
                  }
                }
              }
            }
            this.buildTableView(this.tableHangDtqgReq);
          }
        }
      }
    })
    this.rowItemKho.maDvi = this.userInfo.MA_DVI;
    this.rowItemKho.giaTriHtTc = this.rowItemKho.giaTriHtKhoHt + this.rowItemKho.giaTriHtKhoKh;
    this.rowItemKho.giaTriDkTc = this.rowItemKho.giaTriDkKhoHt + this.rowItemKho.giaTriDkKhoKh;
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
    if (!item.diemKho || !item.nhaKho || (!item.giaTriHtKhoHt && !item.giaTriHtKhoKh) || (!item.giaTriDkKhoKh && !item.giaTriDkKhoHt)) {
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

  async saveKhoChua(idx: number) {
    let msgRequired = this.required(this.dataEditKho[idx].data)
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      return;
    }
    this.dataEditKho[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEditKho[idx].data);
    this.updateEditCache();
  }

  deleteItemKho(index: any) {
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
          this.tableHangDtqgReq = this.tableHangDtqgReq.filter(t => !t.maKhoChua.startsWith(this.dataTable[index].nhaKho));
          this.dataTable.splice(index, 1);
          this.buildTableView(this.tableHangDtqgReq);
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
      case STATUS.DA_DUYET_LDCC : {
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
      // this.formData.value.giaTriDx = this.sumTable(this.dataTable, 'giaTriBhDx') + this.sumTable(this.tableHangDtqgReq, 'giaTriBhDx')
      this.formData.value.soCv = this.formData.value.soCv + this.maCv
      this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
      this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      this.formData.value.capDvi = this.userInfo.CAP_DVI;
      await super.saveAndSend(this.formData.value, status, msg, msgSuccess);
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
    this.formData.value.giaTriDx = this.sumTable(this.dataTable, 'giaTriBhDx') + this.sumTable(this.tableHangDtqgReq, 'giaTriBhDx')
    this.formData.value.soCv = this.formData.value.soCv + this.maCv
    this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
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
          this.maCv = this.formData.value.soCv ? '/' + this.formData.value.soCv.split('/')[1] : null
          this.formData.patchValue({
            soCv: this.formData.value.soCv ? this.formData.value.soCv.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxBhKhoChua;
          this.tableHangDtqgReq = data.listQlDinhMucDxBhHdtqg;
          this.tableTongHop = data.listQlDinhMucThGiaTriBaoHiem;
          this.updateEditCache();
          this.buildTableView(this.tableHangDtqgReq);
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
              type.tichLuong = detail.tichLuongTkLt && detail.tichLuongTkVt ? detail.tichLuongTkLt + detail.tichLuongTkVt : 0
              type.khoiTich = detail.khoiTich ? detail.khoiTich : 0
            } else {
              this.rowItemKho.dienTich = detail.dienTichDat ? detail.dienTichDat : 0
              this.rowItemKho.tichLuong = detail.tichLuongTkLt && detail.tichLuongTkVt ? detail.tichLuongTkLt + detail.tichLuongTkVt : 0
              this.rowItemKho.khoiTich = detail.khoiTich ? detail.khoiTich : 0
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

  requiredHh(item: BaoHiemHangDtqg) {
    let msgRequired = ''
    if (!item.giaTriDk || !item.soLuongDk) {
      msgRequired = 'Vui lòng nhập đầy đủ thông tin!'
    }
    return msgRequired;
  }

  buildTableView(data: any[]) {
    if (data && data.length > 0) {
      this.tableHangDtqgView = chain(data)
        .groupBy("tenDiemKho")
        ?.map((value1, key1) => {
          let children1 = chain(value1)
            .groupBy("tenNhaKho")
            ?.map((value2, key2) => {
                if (value2 && value2.length > 0) {
                  value2.forEach(vl2 => vl2.idVirtual = uuidv4.v4())
                }
                return {
                  idVirtual: uuidv4.v4(),
                  children: value2,
                  tenNhaKho: key2,
                  tenDiemKho: key1,
                  khoiTich: value2 && value2.length > 0 ? value2[0].khoiTich : 0,
                }
              }
            ).value();
          return {
            idVirtual: uuidv4.v4(),
            children: children1,
            tenDiemKho: key1
          };
        }).value();
    } else {
      this.tableHangDtqgView = [];
    }
    this.expandAll();
  }

  expandAll() {
    if (this.tableHangDtqgView && this.tableHangDtqgView.length > 0) {
      this.tableHangDtqgView.forEach(s => {
        this.expandSetString.add(s.idVirtual);
        if (s.children && s.children.length > 0) {
          s.children.forEach(child => {
            this.expandSetString.add(child.idVirtual);
          })
        }
      });
    }
  }

  sumTable(array: any[], column: string, tenDiemKho?: string): number {
    let table = cloneDeep(array);
    if (tenDiemKho) {
      table = table.filter(item => item.tenDiemKho == tenDiemKho);
    }
    let result = 0;
    const sum = table.reduce((prev, cur) => {
      prev += cur[column];
      return prev;
    }, 0);
    result = sum
    return result;
  }

  closeModal() {
    this.isViewModal = false;
    this.rowItemHh = new BaoHiemHangDtqg();
  }

  openModal(isThemMoi: boolean, item: any) {
    this.isThemMoi = isThemMoi;
    if (isThemMoi) {
      let kho = this.dataTable.find(it => it.tenNhaKho == item.tenNhaKho);
      this.rowItemHh.tenDiemKho = item.tenDiemKho;
      this.rowItemHh.tenNhaKho = item.tenNhaKho;
      this.rowItemHh.maKhoChua = kho ? kho.nhaKho : null;
      this.rowItemHh.maDvi = this.userInfo.MA_DVI;
      this.rowItemHh.khoiTich = kho ? kho.khoiTich : null;
    } else {
      this.rowItemHh = cloneDeep(item);
    }
    this.isViewModal = true;
  }

  saveDataHh() {
    let msgRequired = this.requiredHh(this.rowItemHh);
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      return;
    }
    if (!this.isThemMoi) {
      let idx = this.tableHangDtqgReq.findIndex(item => item.idVirtual == this.rowItemHh.idVirtual);
      Object.assign(this.tableHangDtqgReq[idx], this.rowItemHh);
    } else {
      this.tableHangDtqgReq = [...this.tableHangDtqgReq, this.rowItemHh]
    }
    this.buildTableView(this.tableHangDtqgReq);
    this.isViewModal = false;
    this.rowItemHh = new BaoHiemHangDtqg();
  }

  async changHangHoa(event: any) {
    if (event) {
      let result = this.listHangHoa.filter(item => item.ma == event)
      if (result && result.length > 0) {
        this.rowItemHh.tenHangHoa = result[0].ten;
        this.rowItemHh.donViTinh = result[0].maDviTinh;
        let resp = await this.danhMucSv.getDetail(event);
        if (resp.msg == MESSAGE.SUCCESS) {
          this.rowItemHh.maNhomBh = resp.data.nhomHhBaoHiem
        }
      }
    }
  }

  deleteHangHoa(item) {
    let idx = this.tableHangDtqgReq.findIndex(dt => dt.idVirtual == item.idVirtual);
    this.tableHangDtqgReq.splice(idx, 1);
    this.buildTableView(this.tableHangDtqgReq);
  }

  convertPreviewKho(): any[] {
    let arrResult: any[] = [];
    let arrCopy = cloneDeep(this.dataTable);
    if (arrCopy && arrCopy.length > 0) {
      let arr = [];
      arr = chain(arrCopy)
        .groupBy("tenDonVi")
        ?.map((value1, key1) => {
          let children1 = chain(value1)
            .groupBy("tenDiemKho")
            ?.map((value2, key2) => {
                return {
                  children: value2,
                  tenDiemKho: key2,
                  diemKho: value2 && value2.length > 0 && value2[0].nhaKho ? value2[0].nhaKho.substring(0, 10) : '',
                  khoiTich: null
                }
              }
            ).value();
          return {
            children: children1,
            tenChiCuc: key1,
            chiCuc: children1 && children1.length > 0 && children1[0].diemKho ? children1[0].diemKho.substring(0, 8) : '',
            khoiTich: null
          };
        }).value();
      arr.forEach((item, index) => {
        item.stt = index + 1;
        if (item.children && item.children.length > 0) {
          let ccGt5000 = this.dataTable.filter(item => item.khoiTich && item.khoiTich > 5000);
          let ccLt5000 = this.dataTable.filter(item => item.khoiTich && item.khoiTich <= 5000);
          item.khoiTichGt5000 = this.sumTable(ccGt5000, 'khoiTich');
          item.khoiTichLt5000 = this.sumTable(ccLt5000, 'khoiTich');
          item.slKhoGt5000 = ccGt5000.length;
          item.slKhoLt5000 = ccLt5000.length;
          item.giaTriHtGt5000 = this.sumTable(ccGt5000, 'giaTriDkKhoHt');
          item.giaTriHtLt5000 = this.sumTable(ccLt5000, 'giaTriDkKhoHt');
          item.giaTriKhGt5000 = this.sumTable(ccGt5000, 'giaTriDkKhoKh');
          item.giaTriKhLt5000 = this.sumTable(ccLt5000, 'giaTriDkKhoKh');
          arrResult.push(item)
          item.children.forEach(child1 => {
            let dkGt5000 = this.dataTable.filter(item => item.khoiTich && child1.diemKho && item.khoiTich > 5000 && item.nhaKho.startsWith(child1.diemKho));
            let dkLt5000 = this.dataTable.filter(item => item.khoiTich && child1.diemKho && item.khoiTich <= 5000 && item.nhaKho.startsWith(child1.diemKho));
            child1.khoiTichGt5000 = this.sumTable(dkGt5000, 'khoiTich');
            child1.khoiTichLt5000 = this.sumTable(dkLt5000, 'khoiTich');
            child1.slKhoGt5000 = dkGt5000.length;
            child1.slKhoLt5000 = dkLt5000.length;
            child1.giaTriHtGt5000 = this.sumTable(dkGt5000, 'giaTriDkKhoHt');
            child1.giaTriHtLt5000 = this.sumTable(dkLt5000, 'giaTriDkKhoHt');
            child1.giaTriKhGt5000 = this.sumTable(dkGt5000, 'giaTriDkKhoKh');
            child1.giaTriKhLt5000 = this.sumTable(dkLt5000, 'giaTriDkKhoKh');
            arrResult.push(child1);
            child1.children.forEach(child2 => {
              child2.tenDiemKho = '';
              child2.khoiTichGt5000 = child2.khoiTich && child2.khoiTich > 5000 ? child2.khoiTich : 0
              child2.khoiTichLt5000 = child2.khoiTich && child2.khoiTich <= 5000 ? child2.khoiTich : 0
              child2.slKhoGt5000 = child2.khoiTich && child2.khoiTich > 5000 ? 1 : 0
              child2.slKhoLt5000 = child2.khoiTich && child2.khoiTich <= 5000 ? 1 : 0
              child2.giaTriHtGt5000 = child2.khoiTich && child2.khoiTich > 5000 ? child2.giaTriDkKhoHt : 0
              child2.giaTriHtLt5000 = child2.khoiTich && child2.khoiTich <= 5000 ? child2.giaTriDkKhoHt : 0
              child2.giaTriKhGt5000 = child2.khoiTich && child2.khoiTich > 5000 ? child2.giaTriDkKhoKh : 0
              child2.giaTriKhLt5000 = child2.khoiTich && child2.khoiTich <= 5000 ? child2.giaTriDkKhoKh : 0
              arrResult.push(child2);
            })
          })
        }
      });
    }
    return arrResult;
  }

  convertPreviewHang(): any[] {
    let arrResult: any[] = [];
    let arrCopy = cloneDeep(this.tableHangDtqgReq);
    if (arrCopy && arrCopy.length > 0) {
      let arr = [];
      arr = chain(arrCopy)
        .groupBy("tenDonVi")
        ?.map((value1, key1) => {
          let children1 = chain(value1)
            .groupBy("tenDiemKho")
            ?.map((value2, key2) => {
                let children2 = chain(value2)
                  .groupBy("tenNhaKho")
                  ?.map((value3, key3) => {
                      return {
                        children: value3,
                        nhaKho: value3 && value3.length > 0 && value3[0].maKhoChua ? value3[0].maKhoChua : '',
                        tenNhaKho : key3,
                        khoiTich: value3 && value3.length > 0 && value3[0].khoiTich ? value3[0].khoiTich : ''
                      }
                    }
                  ).value();
                return {
                  children: children2,
                  tenDiemKho: key2,
                  diemKho: children2 && children2.length > 0 && children2[0].nhaKho ? children2[0].nhaKho.substring(0, 10) : '',
                }
              }
            ).value();
          return {
            children: children1,
            tenChiCuc: key1,
            chiCuc: children1 && children1.length > 0 && children1[0].diemKho ? children1[0].diemKho.substring(0, 8) : '',
          };
        }).value();
      arr.forEach((item, index) => {
        item.stt = index + 1;
        if (item.children && item.children.length > 0) {
          item.giaTriDk = this.sumTable(this.tableHangDtqgReq, 'giaTriDk');
          arrResult.push(item)
          item.children.forEach(child1 => {
            let dkList = this.tableHangDtqgReq.filter(it => child1.diemKho && it.maKhoChua.startsWith(child1.diemKho));
            child1.giaTriDk = this.sumTable(dkList, 'giaTriDk');
            arrResult.push(child1);
            child1.children.forEach(child2 => {
              let nkList = this.tableHangDtqgReq.filter(it => child2.nhaKho && it.maKhoChua.startsWith(child2.nhaKho));
              child2.giaTriDk = this.sumTable(nkList, 'giaTriDk');
              arrResult.push(child2)
              child2.children.forEach(child3 => {
                child3.tenChiCuc = null;
                child3.tenDiemKho = null;
                child3.tenNhaKho = null;
                child3.khoiTich = null;
                arrResult.push(child3);
              })
            })
          })
        }
      });
    }
    return arrResult;
  }

  async previewBh(loai: number, event: any) {
    event.stopPropagation();
    try {
      this.spinner.show();
      this.loai = loai;
      let arr = []
      if (loai == 1) {
        arr = this.convertPreviewKho();
      }
      if (loai == 2) {
        arr = this.convertPreviewHang();
      }
      if (loai == 3) {
        this.tableTongHop.forEach(item => {
          item.giaTriHtGt5000 = item.giaTriGt5000 ?  item.giaTriGt5000 : 0
          item.giaTriHtLt5000 = item.giaTriLt5000 ? item.giaTriLt5000  :0
          item.slKhoGt5000 = item.slGt5000 ? item.slGt5000 : 0
          item.slKhoLt5000 = item.slLt5000 ?  item.slLt5000 : 0
        })
        arr = this.tableTongHop;
      }
      let body = {
        typeFile: "pdf",
        trangThai: "01",
        nam: this.formData.value.namKeHoach,
        baoHiemDxChiCucDTOS: arr,
        loai: loai
      }
      await this.deXuatBaoHiemSv.previewDx(body).then(async s => {
        this.printSrc = s;
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async downloadPdf() {
    saveAs(this.pdfBlob, 'de-xuat-bao-hiem.pdf');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    const blobUrl = URL.createObjectURL(this.pdfBlob);
    printJS({
      printable: blobUrl,
      type: 'pdf',
      base64: false
    })
  }

  async downloadExcel(loai: number, event: any) {
    try {
      event.stopPropagation();
      this.spinner.show();
      this.loai = loai;
      let arr = []
      if (loai == 1) {
        arr = this.convertPreviewKho();
      }
      if (loai == 2) {
        arr = this.convertPreviewHang();
      }
      if (loai == 3) {
        this.tableTongHop.forEach(item => {
          item.giaTriHtGt5000 = item.giaTriGt5000 ?  item.giaTriGt5000 : 0
          item.giaTriHtLt5000 = item.giaTriLt5000 ? item.giaTriLt5000  :0
          item.slKhoGt5000 = item.slGt5000 ? item.slGt5000 : 0
          item.slKhoLt5000 = item.slLt5000 ?  item.slLt5000 : 0
        })
        arr = this.tableTongHop;
      }
      let body = {
        typeFile: "xlsx",
        trangThai: "01",
        nam: this.formData.value.namKeHoach,
        baoHiemDxChiCucDTOS: arr,
        loai: this.loai
      }
      await this.deXuatBaoHiemSv.previewDx(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "de-xuat-bao-hiem.xlsx");
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
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
  khoiTich: string;
  giaTriBhDx: number;
  giaTriDk: number;
  giaTriHt: number;
  tichLuong: number;
  giaTriTc: number;
  //theo thiết ke mới
  giaTriHtKhoHt: number = 0;
  giaTriHtKhoKh: number = 0;
  giaTriHtTc: number = 0;
  giaTriDkKhoHt: number = 0;
  giaTriDkKhoKh: number = 0;
  giaTriDkTc: number = 0;
}


export class BaoHiemHangDtqg {
  id: number;
  maDvi: string;
  maKhoChua: string;
  tenDiemKho: string;
  tenNhaKho: string;
  bhHdrId: number;
  donViTinh: string;
  maHangHoa: string;
  tenHangHoa: string;
  khoiTich: string;
  giaTriBhDx: number;
  giaTriDk: number;
  giaTriHt: number;
  soLuongHt: number;
  soLuongDk: number;
  giaTriTc: number;
  idVirtual: any;
  maNhomBh: string;
}

