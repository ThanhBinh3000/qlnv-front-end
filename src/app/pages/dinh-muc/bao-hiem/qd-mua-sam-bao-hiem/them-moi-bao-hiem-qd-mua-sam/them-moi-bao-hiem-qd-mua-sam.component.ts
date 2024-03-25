import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {QdMuaSamBhService} from "../../../../../services/qd-mua-sam-bh.service";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";
import * as uuidv4 from "uuid";
import {chain, cloneDeep} from "lodash";
import printJS from "print-js";
import {saveAs} from "file-saver";
@Component({
  selector: 'app-them-moi-bao-hiem-qd-mua-sam',
  templateUrl: './them-moi-bao-hiem-qd-mua-sam.component.html',
  styleUrls: ['./them-moi-bao-hiem-qd-mua-sam.component.scss']
})
export class ThemMoiBaoHiemQdMuaSamComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  maQd: string
  expandSet = new Set<number>();
  STATUS = STATUS;
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
    private deXuatBaoHiemSv: DeXuatNhuCauBaoHiemService,
    private qdMuaSamService: QdMuaSamBhService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdMuaSamService)
    super.ngOnInit()
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
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      loai: ['00']
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
      let res = await this.deXuatBaoHiemSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && !item.qdMuaSamBhId)
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
  //     let res = await this.deXuatBaoHiemSv.search(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       let data = res.data;
  //       this.listDxCuc = data.content;
  //       if (this.listDxCuc) {
  //         this.listDxCuc = this.listDxCuc.filter(
  //           (item) => (item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP && item.qdMuaSamBhId == null)
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
      this.notification.warning(MESSAGE.WARNING, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (!this.formData.value.maTh) {
      this.notification.warning(MESSAGE.WARNING, 'Chọn số tổng hợp hoặc số đề xuất!')
      this.spinner.hide();
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucQdMuaSamBhHdtqg = this.tableHangDtqgReq;
    this.formData.value.listQlDinhMucQdMuaSamBhKho =  this.conVertTreToList();;
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
          this.maQd = data.soQd ?  data.soQd.split('/')[1] : ''
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: this.formData.value.soQd ? this.formData.value.soQd.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucQdMuaSamBhKho;
          this.tableHangDtqgView = data.listQlDinhMucDxBhHdtqgTheoDvi;
          this.tableHangDtqgReq = data.listQlDinhMucQdMuaSamBhHdtqg;
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

  chonMaTongHop() {
    if (!this.isView) {
      this.formData.controls["maDx"].clearValidators();
      this.formData.controls["maTh"].setValidators([Validators.required])
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT NHU CẦU BẢO HIỂM CỦA CÁC CỤC',
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
          await this.changSoTh(data.id);
        }
      })
    }
  }

  async changSoTh(event) {
    let result = this.listTongHop.filter(item => item.id = event)
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.deXuatBaoHiemSv.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        let detail = res.data;
        if (detail) {
          this.dataTable = detail.listQlDinhMucDxBhKhoChua;
            this.dataTable.forEach(it => {
                it.id = null
            })
          this.tableHangDtqgView = detail.listQlDinhMucDxBhHdtqgTheoDvi;
          this.tableHangDtqgReq = detail.listQlDinhMucDxBhHdtqg;
            this.tableHangDtqgReq.forEach(it => {
                it.id = null
            })
          this.tableGtriBHiem = detail.listQlDinhMucThGiaTriBaoHiem;
          this.convertListData();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
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

  convertDataPreview(): any[] {
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
        giaTriHtGt5000 : this.sumTable(tcGt5000, 'giaTriHtKhoHt'),
        giaTriHtLt5000 : this.sumTable(tct5000, 'giaTriHtKhoHt'),
        giaTriKhGt5000 : this.sumTable(tcGt5000, 'giaTriHtKhoKh'),
        giaTriKhLt5000 : this.sumTable(tct5000, 'giaTriHtKhoKh'),
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
          item.giaTriHtGt5000 = this.sumTable(cucGt5000, 'giaTriHtKhoHt');
          item.giaTriHtLt5000 = this.sumTable(cucLt5000, 'giaTriHtKhoHt');
          item.giaTriKhGt5000 = this.sumTable(cucGt5000, 'giaTriHtKhoKh');
          item.giaTriKhLt5000 = this.sumTable(cucLt5000, 'giaTriHtKhoKh');
          arrResult.push(item);
          item.children.forEach((child1, index) => {
            child1.stt = index + 1;
            let ccGt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child1.chiCuc &&  item.khoiTich > 5000  && item.nhaKho.startsWith(child1.chiCuc) );
            let ccLt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child1.chiCuc &&  item.khoiTich <= 5000  && item.nhaKho.startsWith(child1.chiCuc) );
            child1.khoiTichGt5000 = this.sumTable(ccGt5000, 'khoiTich');
            child1.khoiTichLt5000 = this.sumTable(ccLt5000, 'khoiTich');
            child1.slKhoGt5000 = ccGt5000.length;
            child1.slKhoLt5000 = ccLt5000.length;
            child1.giaTriHtGt5000 = this.sumTable(ccGt5000, 'giaTriHtKhoHt');
            child1.giaTriHtLt5000 = this.sumTable(ccLt5000, 'giaTriHtKhoHt');
            child1.giaTriKhGt5000 = this.sumTable(ccGt5000, 'giaTriHtKhoKh');
            child1.giaTriKhLt5000 = this.sumTable(ccLt5000, 'giaTriHtKhoKh');
            arrResult.push(child1);
            child1.children.forEach(child2 => {
              let dkGt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child2.diemKho &&  item.khoiTich > 5000  && item.nhaKho.startsWith(child2.diemKho) );
              let dkLt5000 = arrCopy.filter(item =>  item.khoiTich  &&  child2.diemKho &&  item.khoiTich <= 5000  && item.nhaKho.startsWith(child2.diemKho) );
              child2.khoiTichGt5000 = this.sumTable(dkGt5000, 'khoiTich');
              child2.khoiTichLt5000 = this.sumTable(dkLt5000, 'khoiTich');
              child2.slKhoGt5000 = dkGt5000.length;
              child2.slKhoLt5000 = dkLt5000.length;
              child2.giaTriHtGt5000 = this.sumTable(dkGt5000, 'giaTriHtKhoHt');
              child2.giaTriHtLt5000 = this.sumTable(dkLt5000, 'giaTriHtKhoHt');
              child2.giaTriKhGt5000 = this.sumTable(dkGt5000, 'giaTriHtKhoKh');
              child2.giaTriKhLt5000 = this.sumTable(dkLt5000, 'giaTriHtKhoKh');
              arrResult.push(child2);
              child2.children.forEach(child3 => {
                child3.tenDiemKho = '';
                child3.khoiTichGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? child3.khoiTich : 0
                child3.khoiTichLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? child3.khoiTich : 0
                child3.slKhoGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? 1 : 0
                child3.slKhoLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? 1 : 0
                child3.giaTriHtGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? child3.giaTriHtKhoHt : 0
                child3.giaTriHtLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? child3.giaTriHtKhoHt : 0
                child3.giaTriKhGt5000 = child3.khoiTich && child3.khoiTich > 5000 ? child3.giaTriHtKhoKh : 0
                child3.giaTriKhLt5000 = child3.khoiTich && child3.khoiTich <= 5000 ? child3.giaTriHtKhoKh : 0
                arrResult.push(child3);
              })
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

  async downloadExcel() {
    try {
      this.spinner.show();
      let arr = this.convertDataPreview();
      let body = {
        typeFile : "xlsx",
        trangThai : "01",
        nam: this.formData.value.namKeHoach,
        baoHiemDxChiCucDTOS: arr
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
