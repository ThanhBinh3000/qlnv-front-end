import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {TongHopGtriBaoHiemService} from "../../../../../services/tong-hop-gtri-bao-hiem.service";

@Component({
  selector: 'app-them-moi-th-gtri-bao-hiem',
  templateUrl: './them-moi-th-gtri-bao-hiem.component.html',
  styleUrls: ['./them-moi-th-gtri-bao-hiem.component.scss']
})
export class ThemMoiThGtriBaoHiemComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  tableHangDtqg: any[] = [];
  maQd: string
  expandSet = new Set<number>();
  typeQd: string
  tableGiaTriBh: any[] = [];
  dataHang: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private gtriBaoHiemService: TongHopGtriBaoHiemService
  ) {
    super(httpClient, storageService, notification, spinner, modal, gtriBaoHiemService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year'), Validators.required],
      giaTriBh: [null],
      trichYeu: [null, Validators.required],
      ngayTongHop: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.id > 0) {
        await this.detail(this.id);
      } else {
        await this.getDetailCtiet()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetailCtiet() {
    this.spinner.show()
    let res = await this.gtriBaoHiemService.getDetailCtiet()
    if (res.msg == MESSAGE.SUCCESS) {
      this.convertList(res.data)
      this.spinner.hide()
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không tìm thấy thông tin giá trị bảo hiểm!')
      this.spinner.hide();
      return;
    }
  }


  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.convertAllTreToArray()
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucThGiatriBhHdtqg = this.tableHangDtqg;
    this.formData.value.listQlDinhMucThGiatriBhKho = this.dataTable;
    this.formData.value.giaTriBh = (this.tableGiaTriBh[0].gtThamGiaBh * this.tableGiaTriBh[0].tiLePhiCoBan + this.tableGiaTriBh[2].tiLePhiCoBan * this.tableGiaTriBh[2].gtThamGiaBh + this.tableGiaTriBh[4].tiLePhiCoBan * this.tableGiaTriBh[4].gtThamGiaBh + this.tableGiaTriBh[5].tiLePhiCoBan * this.tableGiaTriBh[5].gtThamGiaBh) * 11 / 10
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    let body = this.formData.value;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, STATUS.CHO_DUYET_LDV, "Bạn có chắc chắn muốn gửi duyệt?");
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
      let res = await this.gtriBaoHiemService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          if (this.formData.value.maTh) {
            this.typeQd = 'TH'
          } else {
            this.typeQd = 'DX'
          }
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

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
      case STATUS.TU_CHOI_LDV : {
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDV : {
        trangThai = STATUS.DA_DUYET_LDV
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertList(listHh) {
    if (listHh.listQlDinhMucThGiatriBhHdtqg && listHh.listQlDinhMucThGiatriBhHdtqg.length > 0) {
      this.dataHang = listHh.listQlDinhMucThGiatriBhKho

      this.dataHang = chain(this.dataHang).groupBy('tenDonViCha').map((value, key) => ({
          tenDonViCha: key,
          idVirtual: uuid.v4(),
        })
      ).value()
      this.dataHang.forEach(item => {
        if (listHh.listQlDinhMucThGiatriBhKho
          && listHh.listQlDinhMucThGiatriBhKho
            .length > 0) {
          if (!item.dataChildKho) {
            item.dataChildKho = []
          }
          let arrKho = listHh.listQlDinhMucThGiatriBhKho

          let arrDetailKho = arrKho.filter(data => data.tenDonViCha == item.tenDonViCha)
          arrDetailKho = this.convertListData(arrDetailKho);
          if (arrDetailKho) {
            item.dataChildKho = arrDetailKho
          }
        }

        if (listHh.listQlDinhMucThGiatriBhHdtqg && listHh.listQlDinhMucThGiatriBhHdtqg.length > 0) {
          if (!item.dataChildHang) {
            item.dataChildHang = []
          }
          let arrHang = listHh.listQlDinhMucThGiatriBhHdtqg
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

  sumKho() {
    let result = 0;
    let arr = [];
    this.dataHang.forEach(item => {
      if (item.dataChildKho && item.dataChildKho.length > 0) {
        item.dataChildKho.forEach(data => {
          if (data.dataChild && data.dataChild.length > 0) {
            data.dataChild.forEach(dtl => {
              arr.push(dtl)
            })
          }
        })
      }
    })
    const sum = arr.reduce((prev, cur) => {
      prev += cur.gtBaoHiem;
      return prev;
    }, 0);
    result = sum
    if (this.tableGiaTriBh && this.tableGiaTriBh.length > 0) {
      this.tableGiaTriBh[0].gtThamGiaBh = result ? result  :0
    }
  }
}
