import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import * as uuid from "uuid";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";
import {
  BaoHiemKhoDangChuaHang
} from "../../de-xuat-hop-dong-chi-cuc/them-moi-de-xuat-bao-hiem-cc/them-moi-de-xuat-bao-hiem-cc.component";
import * as uuidv4 from "uuid";
import {chain, cloneDeep} from "lodash";
import printJS from "print-js";
import {saveAs} from "file-saver";
@Component({
  selector: 'app-thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc',
  templateUrl: './thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc.component.html',
  styleUrls: ['./thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-chi-cuc.component.scss']
})
export class ThongTinTongHopDeXuatNhuCauBaoHiemChiCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxChiCuc: any[] = [];
  isTongHop: boolean = false;
  rowItem: BaoHiemKhoDangChuaHang = new BaoHiemKhoDangChuaHang();
  dataEdit: { [key: string]: { edit: boolean; data: BaoHiemKhoDangChuaHang } } = {};
  formDataTongHop: FormGroup
  expandSet = new Set<number>();
  maCv: string;
  tableHangDtqgView: any[] = [];
  tableHangDtqgReq: any[] = [];
  tableGtriBHiem: any[] = [];
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  printSrc: any
  showDlgPreview = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatBaoHiemSv: DeXuatNhuCauBaoHiemService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatBaoHiemSv)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year')],
      soCv: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      trangThaiTh: [],
      giaTriDx: [null],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxBhHdtqg: [null],
      listQlDinhMucDxBhKhoChua: [null],
    });
    this.formDataTongHop = this.fb.group({
      namKeHoach: [dayjs().get('year'), Validators.required],
      ngayDxTu: [null],
      ngayDxDen: [null],
      listSoCv: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maCv = '/' + this.userInfo.DON_VI.tenVietTat + '-TCKT'
      await this.loadDsDxCc();
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

  async tongHop() {
    this.helperService.markFormGroupTouched(this.formDataTongHop);
    if (this.formDataTongHop.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let body = this.formDataTongHop.value;
    if (!body.listSoCv || body.listSoCv.length == 0) {
      let arr = this.listDxChiCuc.map(item => item.soCv);
      body.listSoCv = arr && arr.length > 0 ?  arr.toString() : [];
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.trangThai = STATUS.DADUYET_CB_CUC;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    body.maDvi = this.userInfo.MA_DVI
    let res = await this.deXuatBaoHiemSv.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucDxBhKhoChua) {
        this.formData.patchValue({
          namKeHoach: this.formDataTongHop.value.namKeHoach,
        })
        this.dataTable = detail.listQlDinhMucDxBhKhoChua;
        this.dataTable.forEach(it => {
          it.id = null
        })
        this.convertListData();
      }
      if (detail && detail.listQlDinhMucDxBhHdtqg) {
        this.tableHangDtqgView = detail.listQlDinhMucDxBhHdtqgTheoDvi;
        this.tableHangDtqgReq = detail.listQlDinhMucDxBhHdtqg;
        this.tableHangDtqgReq.forEach(it => {
          it.id = null
        })
      }
      this.tableGtriBHiem = detail.listQlDinhMucThGiaTriBaoHiem;
      this.isTongHop = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      return;
    }
  }

  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "3",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listDxChiCuc = data.content;
        if (this.listDxChiCuc) {
          this.listDxChiCuc = this.listDxChiCuc.filter(item => item.trangThai == this.STATUS.DADUYET_CB_CUC && item.trangThaiTh == STATUS.CHUA_TONG_HOP)
        }
      } else {
        this.listDxChiCuc = [];
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

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
      this.formData.patchValue({
        namKeHoach: this.formDataTongHop.value.namKeHoach,
        giaTriDx: this.sumslKho('giaTriBhDx', null, 'tong')
      })
      this.helperService.markFormGroupTouched(this.formData)
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      this.formData.value.listQlDinhMucDxBhKhoChua = this.conVertTreToList();
      this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
      this.formData.value.maDvi = this.userInfo.MA_DVI;
      this.formData.value.capDvi = this.userInfo.CAP_DVI;
      this.formData.value.soCv = this.formData.value.soCv + this.maCv
      await super.saveAndSend( this.formData.value, status, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }

  async save() {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
      giaTriDx: this.sumslKho('giaTriBhDx', null, 'tong')
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxBhKhoChua = this.conVertTreToList();
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    this.formData.value.soCv = this.formData.value.soCv + this.maCv
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
          this.isTongHop = true;
          const data = res.data;
          this.maCv =  "/" + data.soCv?.split("/")[1];
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soCv : data.soCv ?data.soCv.split("/")[0] : '',
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxBhKhoChua;
          this.tableHangDtqgView = data.listQlDinhMucDxBhHdtqgTheoDvi;
          this.tableHangDtqgReq = data.listQlDinhMucDxBhHdtqg;
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
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_CBV: {
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_CBV
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenDonVi').map((value, key) => ({
        tenDonVi: key,
        dataChild: value,
        idVirtual: uuid.v4(),
      })
      ).value()
    }
    this.expandAll()
  }

  conVertTreToList(): any[] {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
    })
    return arr;
  }
  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
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
    let arr = table.filter(it => !it.nhomCha);
    const sum = arr.reduce((prev, cur) => {
      prev += cur[row];
      return prev;
    }, 0);
    result = sum;
    return result;
  }

  disableForm() {
    let check = false;
    if (this.isView) {
      check = true
    } else {
      if (this.id > 0) {
        check = true
      } else {
        check = false;
      }
    }
    return check;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
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

  convertPreviewKho(): any[] {
    let arrResult: any[] = [];
    let arrCopy = this.conVertTreToList();
    if (arrCopy && arrCopy.length > 0) {
      let arr = [];
      let cucGt5000 = arrCopy.filter(item =>  item.khoiTich &&  item.khoiTich > 5000);
      let cuct5000 = arrCopy.filter(item => item.khoiTich &&  item.khoiTich <= 5000);
      let item = {
        tenChiCuc : arrCopy[0].tenDonViCha,
        khoiTichGt5000 : this.sumTable(cucGt5000, 'khoiTich'),
        khoiTichLt5000 : this.sumTable(cuct5000, 'khoiTich'),
        slKhoGt5000 : cucGt5000.length,
        slKhoLt5000 : cuct5000.length,
        giaTriHtGt5000 : this.sumTable(cucGt5000, 'giaTriDkKhoHt'),
        giaTriHtLt5000 : this.sumTable(cuct5000, 'giaTriDkKhoHt'),
        giaTriKhGt5000 : this.sumTable(cucGt5000, 'giaTriDkKhoKh'),
        giaTriKhLt5000 : this.sumTable(cuct5000, 'giaTriDkKhoKh'),
      }
      arrResult.push(item);
      arr = chain(arrCopy)
        .groupBy("tenDonVi")
        ?.map((value1, key1) => {
          let children1 = chain(value1)
            .groupBy("tenDiemKho")
            ?.map((value2, key2) => {
                return {
                  children: value2,
                  tenDiemKho: key2,
                  diemKho : value2 && value2.length > 0 && value2[0].nhaKho?  value2[0].nhaKho.substring(0, 10) : '',
                  khoiTich: null
                }
              }
            ).value();
          return {
            children: children1,
            tenChiCuc: key1,
            chiCuc : children1 && children1.length > 0 && children1[0].diemKho?  children1[0].diemKho.substring(0, 8) : '',
            khoiTich: null
          };
        }).value();
      arr.forEach((item, index) => {
        item.stt = index + 1;
        if (item.children && item.children.length > 0) {
          let ccGt5000 = arrCopy.filter(it =>  it.khoiTich &&  item.chiCuc &&  it.khoiTich > 5000 &&  it.diemKho.startsWith(item.chiCuc) );
          let ccLt5000 = arrCopy.filter(it =>  it.khoiTich &&  item.chiCuc &&  it.khoiTich <= 5000 &&  it.diemKho.startsWith(item.chiCuc) );
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
            let dkGt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child1.diemKho &&  item.khoiTich > 5000  && item.nhaKho.startsWith(child1.diemKho) );
            let dkLt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child1.diemKho &&  item.khoiTich <= 5000  && item.nhaKho.startsWith(child1.diemKho) );
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
  convertPreviewHang() : any[] {
    let result = [];
    if (this.tableHangDtqgView && this.tableHangDtqgView.length > 0) {
      let itemCuc = {
        tenChiCuc : this.tableHangDtqgView[0].tenDviCha,
        giaTriHtGt5000: 0,
        giaTriHtLt5000: 0,
        slKhoGt5000: 0,
        slKhoLt5000: 0
      }
      result.push(itemCuc);
      this.tableHangDtqgView.forEach((chiCuc, index) => {
        let itemChiCuc = {
          tenChiCuc : chiCuc.tenDvi,
          stt: this.convertToRoman(index + 1),
          giaTriHtGt5000: 0,
          giaTriHtLt5000: 0,
          slKhoGt5000: 0,
          slKhoLt5000: 0
        }
        result.push(itemChiCuc);
        if (chiCuc.listQlDinhMucThHangDtqgBh && chiCuc.listQlDinhMucThHangDtqgBh.length > 0) {
          chiCuc.listQlDinhMucThHangDtqgBh.forEach(child => {
            child.tenChiCuc = ""
            child.giaTriHtGt5000 = child.giaTriDkGt5000 ?  child.giaTriDkGt5000 : 0
            child.giaTriHtLt5000 = child.giaTriDkLt5000 ? child.giaTriDkLt5000  :0
            child.slKhoGt5000 = child.slDkGt5000 ? child.slDkGt5000 : 0
            child.slKhoLt5000 = child.slDkLt5000 ?  child.slDkLt5000 : 0
            result.push(child);
          })
          let sumList = chiCuc.listQlDinhMucThHangDtqgBh.filter(item => !item.nhomCha)
          itemChiCuc.giaTriHtGt5000 = this.sumTable(sumList, 'giaTriHtGt5000');
          itemChiCuc.giaTriHtLt5000 = this.sumTable(sumList, 'giaTriHtLt5000');
          itemChiCuc.slKhoGt5000 = this.sumTable(sumList, 'slKhoGt5000');
          itemChiCuc.slKhoLt5000 = this.sumTable(sumList, 'slKhoLt5000');
          //sumcuc
          itemCuc.giaTriHtGt5000 += itemChiCuc.giaTriHtGt5000;
          itemCuc.giaTriHtLt5000 += itemChiCuc.giaTriHtLt5000;
          itemCuc.slKhoGt5000 += itemChiCuc.slKhoGt5000;
          itemCuc.slKhoLt5000 += itemChiCuc.slKhoLt5000;
        }
      })
    }
    return result;
  }

  async preview() {
    try {
      this.spinner.show();
      let arr = this.convertPreviewKho();
      let body = {
        typeFile : "pdf",
        trangThai : "01",
        nam: this.formData.value.namKeHoach,
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
      this.spinner.show();
      event.stopPropagation();
      this.spinner.show();
      let arr = []
      if (loai == 1) {
        arr = this.convertPreviewKho();
      }
      if (loai == 4) {
        arr = this.convertPreviewHang();
      }
      if (loai == 3) {
        this.tableGtriBHiem.forEach(item => {
          item.giaTriHtGt5000 = item.giaTriGt5000 ?  item.giaTriGt5000 : 0
          item.giaTriHtLt5000 = item.giaTriLt5000 ? item.giaTriLt5000  :0
          item.slKhoGt5000 = item.slGt5000 ? item.slGt5000 : 0
          item.slKhoLt5000 = item.slLt5000 ?  item.slLt5000 : 0
        })
        arr = this.tableGtriBHiem;
      }
      let body = {
        typeFile: "xlsx",
        trangThai: "01",
        nam: this.formData.value.namKeHoach,
        baoHiemDxChiCucDTOS: arr,
        loai: loai
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

