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
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {QdMuaSamBhService} from "../../../../../services/qd-mua-sam-bh.service";
import {
  DeXuatNhuCauBaoHiemService
} from "../../../../../services/dinhmuc-maymoc-baohiem/de-xuat-nhu-cau-bao-hiem.service";

@Component({
  selector: 'app-them-moi-bao-hiem-qd-mua-sam',
  templateUrl: './them-moi-bao-hiem-qd-mua-sam.component.html',
  styleUrls: ['./them-moi-bao-hiem-qd-mua-sam.component.scss']
})
export class ThemMoiBaoHiemQdMuaSamComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  listDxCuc: any[] = [];
  tableHangDtqg: any[] = [];
  maQd: string
  expandSet = new Set<number>();
  typeQd: string = "TH";
  STATUS = STATUS;
  tableGiaTriBh: any[] = [];
  dataHang: any[] = [];
  checkNhomTiLe: boolean = false;

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
      listQlDinhMucQdMuaSamDtlReq: [null],
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
            (item) => (item.trangThai == this.STATUS.DA_DUYET_LDTC && item.qdMuaSamBhId == null)
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
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (!this.formData.value.maTh && !this.formData.value.maDx) {
      this.notification.error(MESSAGE.ERROR, 'Chọn số tổng hợp hoặc số đề xuất!')
      this.spinner.hide();
      return;
    }
    this.convertAllTreToArray()
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucQdMuaSamBhHdtqg = this.tableHangDtqg;
    this.formData.value.listQlDinhMucQdMuaSamBhKho = this.dataTable;
    this.formData.value.tongGiaTri = (this.tableGiaTriBh[0].gtThamGiaBh * this.tableGiaTriBh[0].tiLePhiCoBan + this.tableGiaTriBh[2].tiLePhiCoBan * this.tableGiaTriBh[2].gtThamGiaBh + this.tableGiaTriBh[4].tiLePhiCoBan * this.tableGiaTriBh[4].gtThamGiaBh + this.tableGiaTriBh[5].tiLePhiCoBan * this.tableGiaTriBh[5].gtThamGiaBh) * 11 / 10
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
      let res = await this.qdMuaSamService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: this.formData.value.soQd ? this.formData.value.soQd.split('/')[0] : null
          })
          if (this.formData.value.maTh) {
            this.typeQd = 'TH'
          } else {
            this.typeQd = 'DX'
          }
          this.fileDinhKem = data.listFileDinhKems;
          this.convertListDetail(res.data)
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

  convertList(listHh) {
    if (listHh.listQlDinhMucDxBhHdtqg && listHh.listQlDinhMucDxBhHdtqg.length > 0) {
      listHh.listQlDinhMucDxBhHdtqg.forEach(item => {
        if (!item.tenNhomTiLeBaoHiem) {
          this.checkNhomTiLe = true;
        }
      })
      if (this.checkNhomTiLe == true) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng thêm nhóm tỉ lệ bảo hiểm của loại hàng hóa!");
        return;
      }
      this.dataHang = []
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
      this.tableGiaTriBh = []
      this.tableGiaTriBh = listHh.listQlDinhMucThGiaTriBaoHiem
    }
  }

  convertListDetail(listHh) {
    if (listHh.listQlDinhMucQdMuaSamBhHdtqg && listHh.listQlDinhMucQdMuaSamBhHdtqg.length > 0) {
      this.dataHang = listHh.listQlDinhMucQdMuaSamBhKho
      this.dataHang = chain(this.dataHang).groupBy('tenDonViCha').map((value, key) => ({
          tenDonViCha: key,
          idVirtual: uuid.v4(),
        })
      ).value()
      this.dataHang.forEach(item => {
        if (listHh.listQlDinhMucQdMuaSamBhKho && listHh.listQlDinhMucQdMuaSamBhKho.length > 0) {
          if (!item.dataChildKho) {
            item.dataChildKho = []
          }
          let arrKho = listHh.listQlDinhMucQdMuaSamBhKho
          let arrDetailKho = arrKho.filter(data => data.tenDonViCha == item.tenDonViCha)
          arrDetailKho = this.convertListData(arrDetailKho);
          if (arrDetailKho) {
            item.dataChildKho = arrDetailKho
          }
        }

        if (listHh.listQlDinhMucQdMuaSamBhHdtqg && listHh.listQlDinhMucQdMuaSamBhHdtqg.length > 0) {
          if (!item.dataChildHang) {
            item.dataChildHang = []
          }
          let arrHang = listHh.listQlDinhMucQdMuaSamBhHdtqg
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


  async changSoTh(event, type?: string) {
    let result;
    this.checkNhomTiLe = false;
    if (type == 'DX') {
      result = this.listDxCuc.filter(item => item.id = event)
    } else {
      result = this.listTongHop.filter(item => item.id = event)
    }
    if (result && result.length > 0) {
      let detailTh = result[0]
      let res = await this.deXuatBaoHiemSv.getDetail(detailTh.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.convertList(res.data)
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
  }

  chonMaTongHop() {
    if (!this.isView && this.typeQd == 'TH') {
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
          await this.changSoTh(data.id, 'TH');
        }
      })
    }
  }

  chonSoDxCuc() {
    if (!this.isView && this.typeQd == 'DX') {
      this.formData.controls["maTh"].clearValidators();
      this.formData.controls["maDx"].setValidators([Validators.required]);
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH ĐỀ XUẤT BẢO HIỂM CỦA CỤC',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh: this.listDxCuc,
          type: "02"
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            maDx: data.soCv,
            maTh: null,
          })
          await this.changSoTh(data.id, 'DX');
        }
      })
    }
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

}
