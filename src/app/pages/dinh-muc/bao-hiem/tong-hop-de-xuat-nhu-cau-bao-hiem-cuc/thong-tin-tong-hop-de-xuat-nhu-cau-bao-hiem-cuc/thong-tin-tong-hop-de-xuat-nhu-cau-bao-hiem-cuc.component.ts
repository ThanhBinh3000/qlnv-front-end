import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";
import * as uuidv4 from "uuid";
import {chain, cloneDeep} from "lodash";
import printJS from "print-js";
import {saveAs} from "file-saver";
@Component({
  selector: 'app-thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc',
  templateUrl: './thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component.html',
  styleUrls: ['./thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component.scss']
})
export class ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxCuc: any[] = [];
  isTongHop: boolean = false;
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
      capDvi: [null],
      namKeHoach: [dayjs().get('year')],
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
      ngayDx: [null],
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
    this.spinner.show()
    this.helperService.markFormGroupTouched(this.formDataTongHop);
    if (this.formDataTongHop.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide()
      return;
    }
    let body = this.formDataTongHop.value;
    if (!body.listSoCv || body.listSoCv.length == 0) {
      let arr = this.listDxCuc.map(item => item.soCv);
      body.listSoCv = arr && arr.length > 0 ?  arr.toString() : [];
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null
    body.trangThai = STATUS.DA_DUYET_CBV;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    body.maDvi = this.userInfo.MA_DVI;
    let res = await this.deXuatBaoHiemSv.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.isTongHop = true;
      let detail = res.data;
      this.formData.patchValue({
        namKeHoach: this.formDataTongHop.value.namKeHoach,
      })
      if (detail && detail.listQlDinhMucDxBhKhoChua) {
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
      this.spinner.hide()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      this.spinner.hide()
      return;
    }
    this.spinner.hide()
  }

  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "capDvi": 2,
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
          this.listDxCuc = this.listDxCuc.filter(item => item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP)
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
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxBhKhoChua =  this.conVertTreToList();
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqgReq;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let data = await this.createUpdate(this.formData.value)
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
      let res = await this.deXuatBaoHiemSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.isTongHop = true;
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
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

  async tuChoi() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDTC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
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

  conVertTreToList(): any[]{
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
    return arr
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
        let list = arr.filter(item => (item.tenDonVi == tenDvi || item.tenDonViCha == tenDvi))
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
        if (s.children && s.children.length > 0) {
          s.children.forEach(it => {
            this.expandSet.add(it.idVirtual);
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

  convertPreviewKho(): any[] {
    let arrResult: any[] = [];
    let arrCopy = this.conVertTreToList();
    if (arrCopy && arrCopy.length > 0) {
      let arr = [];
      let tcGt5000 = arrCopy.filter(item =>  item.khoiTich &&  item.khoiTich > 5000);
      let tct5000 = arrCopy.filter(item => item.khoiTich &&  item.khoiTich <= 5000);
      let item = {
        tenChiCuc : 'Tổng cộng',
        khoiTichGt5000 : this.sumTable(tcGt5000, 'khoiTich'),
        khoiTichLt5000 : this.sumTable(tct5000, 'khoiTich'),
        slKhoGt5000 : tcGt5000.length,
        slKhoLt5000 : tct5000.length,
        giaTriHtGt5000 : this.sumTable(tcGt5000, 'giaTriDkKhoHt'),
        giaTriHtLt5000 : this.sumTable(tct5000, 'giaTriDkKhoHt'),
        giaTriKhGt5000 : this.sumTable(tcGt5000, 'giaTriDkKhoKh'),
        giaTriKhLt5000 : this.sumTable(tct5000, 'giaTriDkKhoKh'),
      }
      arrResult.push(item);
      arr = chain(arrCopy)
        .groupBy("tenDonViCha")
        ?.map((value1, key1) => {
          let children1 = chain(value1)
            .groupBy("tenDonVi")
            ?.map((value2, key2) => {
              let children2 = chain(value2)
                .groupBy("tenDiemKho")
                ?.map((value3, key3) => {
                    return {
                      children: value3,
                      tenDiemKho: key3,
                      diemKho : value3 && value3.length > 0 && value3[0].nhaKho?  value3[0].nhaKho.substring(0, 10) : ''
                    }
                  }
                ).value();
              return {
                children: children2,
                tenChiCuc: key2,
                chiCuc : children2 && children2.length > 0 && children2[0].diemKho?  children2[0].diemKho.substring(0, 8) : ''
              };
              }
            ).value();
          return {
            children: children1,
            tenChiCuc: key1,
            cuc : children1 && children1.length > 0 && children1[0].chiCuc?  children1[0].chiCuc.substring(0, 6) : ''
          };
        }).value();
      arr.forEach((item, index) => {
        item.stt = this.convertToRoman(index + 1);
        if (item.children && item.children.length > 0) {
          let cucGt5000 = arrCopy.filter(it =>  it.khoiTich &&  item.cuc &&  it.khoiTich > 5000 &&  it.nhaKho.startsWith(item.cuc) );
          let cucLt5000 = arrCopy.filter(it =>  it.khoiTich &&  item.cuc &&  it.khoiTich <= 5000 &&  it.nhaKho.startsWith(item.cuc) );
          item.khoiTichGt5000 = this.sumTable(cucGt5000, 'khoiTich');
          item.khoiTichLt5000 = this.sumTable(cucLt5000, 'khoiTich');
          item.slKhoGt5000 = cucGt5000.length;
          item.slKhoLt5000 = cucLt5000.length;
          item.giaTriHtGt5000 = this.sumTable(cucGt5000, 'giaTriDkKhoHt');
          item.giaTriHtLt5000 = this.sumTable(cucLt5000, 'giaTriDkKhoHt');
          item.giaTriKhGt5000 = this.sumTable(cucGt5000, 'giaTriDkKhoKh');
          item.giaTriKhLt5000 = this.sumTable(cucLt5000, 'giaTriDkKhoKh');
          arrResult.push(item);
          item.children.forEach((child1, index) => {
            child1.stt = index + 1;
            let ccGt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child1.chiCuc &&  item.khoiTich > 5000  && item.nhaKho.startsWith(child1.chiCuc) );
            let ccLt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child1.chiCuc &&  item.khoiTich <= 5000  && item.nhaKho.startsWith(child1.chiCuc) );
            child1.khoiTichGt5000 = this.sumTable(ccGt5000, 'khoiTich');
            child1.khoiTichLt5000 = this.sumTable(ccLt5000, 'khoiTich');
            child1.slKhoGt5000 = ccGt5000.length;
            child1.slKhoLt5000 = ccLt5000.length;
            child1.giaTriHtGt5000 = this.sumTable(ccGt5000, 'giaTriDkKhoHt');
            child1.giaTriHtLt5000 = this.sumTable(ccLt5000, 'giaTriDkKhoHt');
            child1.giaTriKhGt5000 = this.sumTable(ccGt5000, 'giaTriDkKhoKh');
            child1.giaTriKhLt5000 = this.sumTable(ccLt5000, 'giaTriDkKhoKh');
            arrResult.push(child1);
            child1.children.forEach(child2 => {
              let dkGt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child2.diemKho &&  item.khoiTich > 5000  && item.nhaKho.startsWith(child2.diemKho) );
              let dkLt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child2.diemKho &&  item.khoiTich <= 5000  && item.nhaKho.startsWith(child2.diemKho) );
              child2.khoiTichGt5000 = this.sumTable(dkGt5000, 'khoiTich');
              child2.khoiTichLt5000 = this.sumTable(dkLt5000, 'khoiTich');
              child2.slKhoGt5000 = dkGt5000.length;
              child2.slKhoLt5000 = dkLt5000.length;
              child2.giaTriHtGt5000 = this.sumTable(dkGt5000, 'giaTriDkKhoHt');
              child2.giaTriHtLt5000 = this.sumTable(dkLt5000, 'giaTriDkKhoHt');
              child2.giaTriKhGt5000 = this.sumTable(dkGt5000, 'giaTriDkKhoKh');
              child2.giaTriKhLt5000 = this.sumTable(dkLt5000, 'giaTriDkKhoKh');
              arrResult.push(child2);
              child2.children.forEach(child3 => {
                child3.tenDiemKho = '';
                child3.khoiTichGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? child3.khoiTich : 0
                child3.khoiTichLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? child3.khoiTich : 0
                child3.slKhoGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? 1 : 0
                child3.slKhoLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? 1 : 0
                child3.giaTriHtGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? child3.giaTriDkKhoHt : 0
                child3.giaTriHtLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? child3.giaTriDkKhoHt : 0
                child3.giaTriKhGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? child3.giaTriDkKhoKh : 0
                child3.giaTriKhLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? child3.giaTriDkKhoKh : 0
                arrResult.push(child3);
              })
            })
          })
        }
      });
    }
    return arrResult;
  }

  // async preview() {
  //   try {
  //     this.spinner.show();
  //     let arr = this.convertDataPreview();
  //     let body = {
  //       typeFile : "pdf",
  //       trangThai : "01",
  //       nam: this.formData.value.namKeHoach,
  //       baoHiemDxChiCucDTOS: arr
  //     }
  //     await this.deXuatBaoHiemSv.previewDx(body).then(async s => {
  //       this.printSrc = s;
  //       this.pdfBlob = s;
  //       this.pdfSrc = await new Response(s).arrayBuffer();
  //     });
  //     this.showDlgPreview = true;
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     this.spinner.hide();
  //   }
  // }

  convertPreviewHang() : any[] {
    let result = [];
    if (this.tableHangDtqgView && this.tableHangDtqgView.length > 0) {
      let tongCuc = {
        tenChiCuc : "Tổng cộng",
        giaTriHtGt5000: 0,
        giaTriHtLt5000: 0,
        slKhoGt5000: 0,
        slKhoLt5000: 0
      }
      result.push(tongCuc);
      this.tableHangDtqgView.forEach((cuc, index) => {
        let itemCuc = {
          tenChiCuc : cuc.tenDvi,
          stt: this.convertToRoman(index + 1),
          giaTriHtGt5000: 0,
          giaTriHtLt5000: 0,
          slKhoGt5000: 0,
          slKhoLt5000: 0
        }
        result.push(itemCuc);
        if (cuc.listQlDinhMucThHangDtqgBh && cuc.listQlDinhMucThHangDtqgBh.length > 0) {
          cuc.listQlDinhMucThHangDtqgBh.forEach(child => {
            child.tenChiCuc = ""
            child.giaTriHtGt5000 = child.giaTriDkGt5000 ?  child.giaTriDkGt5000 : 0
            child.giaTriHtLt5000 = child.giaTriDkLt5000 ? child.giaTriDkLt5000  :0
            child.slKhoGt5000 = child.slDkGt5000 ? child.slDkGt5000 : 0
            child.slKhoLt5000 = child.slDkLt5000 ?  child.slDkLt5000 : 0
            result.push(child);
          })
          let sumList = cuc.listQlDinhMucThHangDtqgBh.filter(item => !item.nhomCha)
          itemCuc.giaTriHtGt5000 = this.sumTable(sumList, 'giaTriHtGt5000');
          itemCuc.giaTriHtLt5000 = this.sumTable(sumList, 'giaTriHtLt5000');
          itemCuc.slKhoGt5000 = this.sumTable(sumList, 'slKhoGt5000');
          itemCuc.slKhoLt5000 = this.sumTable(sumList, 'slKhoLt5000');
          //sumcuc
          tongCuc.giaTriHtGt5000 += itemCuc.giaTriHtGt5000;
          tongCuc.giaTriHtLt5000 += itemCuc.giaTriHtLt5000;
          tongCuc.slKhoGt5000 += itemCuc.slKhoGt5000;
          tongCuc.slKhoLt5000 += itemCuc.slKhoLt5000;
        }
      })
    }
    return result;
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
