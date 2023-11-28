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
                  maDonVi : item.maDonVi ? item.maDonVi.substr(0,12)  :''
                };
              }
              groupedData[key].slHienThoi += item.slHienThoi;
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
                data.maKhoChua = item.maDonVi;
                data.maDvi = this.userInfo.MA_DVI;
                data.khoiTich = this.rowItemKho.khoiTich
                this.tableHangDtqgReq.push(data)
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
    if (!item.diemKho || !item.nhaKho || !item.giaTriHtKhoHt || !item.giaTriHtKhoKh || !item.giaTriDkKhoHt || !item.giaTriDkKhoKh) {
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
          this.maCv = this.formData.value.soCv ? this.formData.value.soCv.split('/')[1] : null
          this.formData.patchValue({
            soCv: this.formData.value.soCv ? this.formData.value.soCv.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxBhKhoChua;
          this.tableHangDtqgReq = data.listQlDinhMucDxBhHdtqg;
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
              type.khoiTich = detail.theTichTkLt && detail.theTichTkVt ? detail.theTichTkLt + detail.theTichTkVt : 0
            } else {
              this.rowItemKho.dienTich = detail.dienTichDat ? detail.dienTichDat : 0
              this.rowItemKho.tichLuong = detail.tichLuongTkLt && detail.tichLuongTkVt ? detail.tichLuongTkLt + detail.tichLuongTkVt : 0
              this.rowItemKho.khoiTich = detail.theTichTkLt && detail.theTichTkVt ? detail.theTichTkLt + detail.theTichTkVt : 0
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

  convertDataPreview(): any[] {
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
                        khoiTich: null
                      }
                    }
                ).value();
            return {
              children: children1,
              tenChiCuc: key1,
              khoiTich: null
            };
          }).value();
      arr.forEach((item, index) => {
        item.stt = index + 1;
        if (item.children && item.children.length > 0) {
          arrResult.push(item)
          item.children.forEach(child1 => {
            arrResult.push(child1);
            child1.children.forEach(child2 => {
              child2.tenDiemKho = '';
              arrResult.push(child2);
            })
          })
        }
      });
    }
    return arrResult;
  }

  async preview() {
    try {
      this.spinner.show();
      let arr = this.convertDataPreview();
      let body = {
        typeFile : "pdf",
        trangThai : "01",
        nam: 2023,
        baoHiemDxChiCucDTOS: arr
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
    saveAs(this.pdfBlob, 'quyet_dinh_gia_btc.pdf');
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

  downloadExcel() {

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
  giaTriHtKhoHt: number;
  giaTriHtKhoKh: number;
  giaTriHtTc: number;
  giaTriDkKhoHt: number;
  giaTriDkKhoKh: number;
  giaTriDkTc: number;
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

