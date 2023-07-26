import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";

@Component({
  selector: 'app-thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc',
  templateUrl: './thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component.html',
  styleUrls: ['./thong-tin-tong-hop-de-xuat-nhu-cau-bao-hiem-cuc.component.scss']
})
export class ThongTinTongHopDeXuatNhuCauBaoHiemCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxChiCuc: any[] = [];
  isTongHop: boolean = false;
  formDataTongHop: FormGroup
  expandSet = new Set<number>();
  maCv: string;
  tableHangDtqg: any[] = [];
  dataHang: any[] = [];
  tableGiaTriBh: any[] = [];

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

  convertList(listHh) {
    if (listHh.listQlDinhMucDxBhHdtqg && listHh.listQlDinhMucDxBhHdtqg.length > 0) {
      this.dataHang = listHh.listQlDinhMucDxBhKhoChua
      this.dataHang = chain(this.dataHang).groupBy('tenDonViCha').map((value, key) => ({
          tenDonViCha: key,
          idVirtual: uuid.v4(),
        })
      ).value()
      this.dataHang.forEach(item => {
        if (listHh.listQlDinhMucDxBhKhoChua && listHh.listQlDinhMucDxBhKhoChua.length > 0) {
          if (!item.dataChildKho) {
            item.dataChildKho = []
          }
          let arrKho = listHh.listQlDinhMucDxBhKhoChua
          let arrDetailKho = arrKho.filter(data => data.tenDonViCha == item.tenDonViCha)
          arrDetailKho = this.convertListData(arrDetailKho);
          if (arrDetailKho) {
            item.dataChildKho = arrDetailKho
          }
        }

        if (listHh.listQlDinhMucDxBhHdtqg && listHh.listQlDinhMucDxBhHdtqg.length > 0) {
          if (!item.dataChildHang) {
            item.dataChildHang = []
          }
          let arrHang = listHh.listQlDinhMucDxBhHdtqg
          let detailArrHang = arrHang.filter(data => data.tenDonViCha == item.tenDonViCha)
          detailArrHang = this.buildDiaDiemTc(detailArrHang);
          if (detailArrHang) {
            item.dataChildHang = detailArrHang
          }
        }
      })
    }
    if (listHh.listQlDinhMucThGiaTriBaoHiem && listHh.listQlDinhMucThGiaTriBaoHiem.length > 0) {
      this.tableGiaTriBh = listHh.listQlDinhMucThGiaTriBaoHiem
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
      let arr = []
      if (this.listDxChiCuc && this.listDxChiCuc.length > 0) {
        this.listDxChiCuc.forEach(item => {
          arr.push(item.soCv)
        })
      }
      body.listSoCv = arr.toString();
    } else {
      body.listSoCv = body.listSoCv.toString();
    }
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null
    body.trangThai = STATUS.DA_DUYET_CBV;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    let res = await this.deXuatBaoHiemSv.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.isTongHop = true;
      let detail = res.data;
      this.convertList(detail)
      this.spinner.hide()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      this.spinner.hide()
      return;
    }
    console.log(this.dataHang)
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
        this.listDxChiCuc = data.content;
        if (this.listDxChiCuc) {
          this.listDxChiCuc = this.listDxChiCuc.filter(item => item.trangThai == this.STATUS.DA_DUYET_CBV && item.trangThaiTh == STATUS.CHUA_TONG_HOP)
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

  async save(isOther: boolean) {
    this.formData.patchValue({
      namKeHoach: this.formDataTongHop.value.namKeHoach,
    })
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.convertAllTreToArray()
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxBhKhoChua = this.dataTable;
    this.formData.value.listQlDinhMucDxBhHdtqg = this.tableHangDtqg;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    this.formData.value.giaTriDx = (this.tableGiaTriBh[0].gtThamGiaBh  * this.tableGiaTriBh[0].tiLePhiCoBan + this.tableGiaTriBh[2].tiLePhiCoBan * this.tableGiaTriBh[2].gtThamGiaBh + this.tableGiaTriBh[4].tiLePhiCoBan * this.tableGiaTriBh[4].gtThamGiaBh + this.tableGiaTriBh[5].tiLePhiCoBan * this.tableGiaTriBh[5].gtThamGiaBh) * 11/10
    let data = await this.createUpdate(this.formData.value)
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDTC, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
    }
  }

  convertAllTreToArray() {
    this.dataTable = [];
    this.tableHangDtqg = []
    if (this.dataHang && this.dataHang.length > 0) {
      this.dataHang.forEach(item => {
        if (item.dataChildHang && item.dataChildHang.length > 0) {
          let arr = this.conVertArrayHang(item.dataChildHang);
          if (arr && arr.length > 0) {
            arr.forEach(dtl => {
              dtl.id = null
              this.tableHangDtqg = [...this.tableHangDtqg, dtl]
            })
          }
        }
        if (item.dataChildKho && item.dataChildKho.length > 0) {
          let arr = this.conVertTreToList(item.dataChildKho);
          if (arr && arr.length > 0) {
            arr.forEach(dtl => {
              dtl.id = null
              this.dataTable = [...this.dataTable, dtl]
            })
          }
        }
      })
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
          this.convertList(res.data)
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
      case STATUS.CHO_DUYET_LDV : {
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDTC : {
        trangThai = STATUS.CHO_DUYET_LDTC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData(table: any): any[] {
    if (table && table.length > 0) {
      table = chain(table).groupBy('tenDonVi').map((value, key) => ({
          tenDonVi: key,
          dataChild: value,
          idVirtual: uuid.v4(),
        })
      ).value()
    }
    return table
  }

  conVertTreToList(table: any[]): any[] {
    let arr = [];
    if (table && table.length > 0) {
      table.forEach(item => {
        if (item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            arr.push(data)
          })
        }
      })
    }
    return arr
  }

  conVertArrayHang(talbe: any[]): any[] {
    let arr = [];
    if (talbe && talbe.length > 0) {
      talbe.forEach(item => {
        if (item.childData && item.childData.length > 0) {
          item.childData.forEach(data => {
            if (data.childData && data.childData.length > 0) {
              data.childData.forEach(dtl => {
                if (dtl.childData && dtl.childData.length > 0) {
                  dtl.childData.forEach(dtl1 => {
                    arr.push(dtl1)
                  })
                }
              })
            }
          })
        }
      })
    }
    return arr;
  }

  buildDiaDiemTc(table: any[]): any[] {
    if (table && table.length > 0) {
      table = chain(table)
        .groupBy("tenLoaiVthh")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenNhomTiLeBaoHiem")
            .map((v, k) => {
                let res = chain(v)
                  .groupBy("tenHangHoa")
                  .map((v1, k1) => {
                    return {
                      idVirtual: uuid.v4(),
                      tenHangHoa: k1,
                      childData: v1
                    }
                  }).value();
                return {
                  idVirtual: uuid.v4(),
                  tenNhomTiLeBaoHiem: k,
                  childData: res
                };
              }
            ).value();
          return {
            idVirtual: uuid.v4(),
            tenLoaiVthh: key,
            childData: rs
          };
        }).value();
    }
    return table;
  }

  sumSoLuongHang(table: any[], column?: string, tenLoaiVthh?: string, tenNhomTiLeBaoHiem?: string, tenHangHoa?: string, type?: string): number {
    let array = this.conVertArrayHang(table);
    let result = 0;
    if (array && array.length > 0) {
      switch (type) {
        case 'tenHangHoa' : {
          if (array) {
            let arr = array.filter(item => item.tenHangHoa == tenHangHoa)
            if (arr && arr.length > 0) {
              const sum = arr.reduce((prev, cur) => {
                prev += cur[column];
                return prev;
              }, 0);
              result = sum
            }
          }
          break;
        }
        case 'tenNhomTiLeBaoHiem' : {
          if (array) {
            let arr = array.filter(item => item.tenNhomTiLeBaoHiem == tenNhomTiLeBaoHiem)
            const sum = arr.reduce((prev, cur) => {
              prev += cur[column];
              return prev;
            }, 0);
            result = sum
          }
          break;
        }
        case 'tenLoaiVthh' : {
          if (array) {
            let arr = array.filter(item => item.tenLoaiVthh == tenLoaiVthh)
            const sum = arr.reduce((prev, cur) => {
              prev += cur[column];
              return prev;
            }, 0);
            result = sum
          }
          break;
        }
        case 'tong' : {
          if (array) {
            const sum = array.reduce((prev, cur) => {
              prev += cur[column];
              return prev;
            }, 0);
            result = sum
          }
          break;
        }
      }
    }
    return result;
  }

  sumslKho(table: any[], column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    table.forEach(item => {
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
}
