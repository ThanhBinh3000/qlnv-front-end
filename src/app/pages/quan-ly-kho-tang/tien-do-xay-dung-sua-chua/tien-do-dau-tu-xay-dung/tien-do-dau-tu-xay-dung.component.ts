import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetduandtxd.service";
import {KtQdXdHangNamService} from "../../../../services/kt-qd-xd-hang-nam.service";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../services/donvi.service";
import {MESSAGE} from "../../../../constants/message";
import {
  QuyetdinhpheduyetTktcTdtService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetTktcTdt.service";
import {STATUS} from "../../../../constants/status";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKhlcnt.service";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKqLcnt.service";
import {HopdongService} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/hopdong.service";
import {Router} from "@angular/router";
import {
  BienBanNghiemThuDtxdService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/bien-ban-nghiem-thu-dtxd.service";

@Component({
  selector: 'app-tien-do-dau-tu-xay-dung',
  templateUrl: './tien-do-dau-tu-xay-dung.component.html',
  styleUrls: ['./tien-do-dau-tu-xay-dung.component.scss']
})
export class TienDoDauTuXayDungComponent extends Base2Component implements OnInit {
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];
  danhSachChiCuc: any[] = [];
  dataTable: any[] = [];
  dataTableRaw: any[] = [];
  itemSelected: any;
  tabSelected: string = "01";
  itemQdPdDaDtxd: any;
  itemQdPdTktcTdt: any;
  itemQdPdKhLcnt: any;
  itemTtdt: any;
  itemHopDong: any[] = [];

  //trangthai qd pd kết quả lcnt
  trangThaiQdPdKqLcnt: boolean = false;
  //trang thái hợp đồng, nếu có 1 hd đã ký thì icon success màu xanh
  trangThaiHopDong: boolean = false;
  //trang thái tiến độ công việc -- hỏi lại cách tính trạng thái của tab này.
  trangThaiTienDoCv: boolean = false;
  trangThaiBb: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private ktQdXdHangNamService: KtQdXdHangNamService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService,
    private quyetdinhpheduyetTktcTdtService: QuyetdinhpheduyetTktcTdtService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService,
    private hopdongService: HopdongService,
    private router: Router,
    private bienBanSv: BienBanNghiemThuDtxdService
  ) {
    super(httpClient, storageService, notification, spinner, modal, ktQdXdHangNamService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_TDXDSCKT_TDDTXD')) {
      this.router.navigateByUrl('/error/401')
    }
    this.formData = this.fb.group({
      namKeHoach: [''],
      tenDuAn: [''],
      maDvi: [this.userInfo.MA_DVI],
      capDvi: [this.userInfo.CAP_DVI],
      soQuyetDinh: [''],
      trangThai: [''],
      ngayKy: [''],
    });
    if (this.userService.isCuc()) {
      await this.loadDanhSachChiCuc();
    }
    this.filter();
  }

  async filter() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
        this.formData.value.ngayKyTu = this.formData.value.ngayKy[0];
        this.formData.value.ngayKyDen = this.formData.value.ngayKy[1];
      }
      let body = this.formData.value
      let res = await this.ktQdXdHangNamService.getDanhSachDmDuAn(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataTable = this.convertListData(res.data);
        this.dataTableRaw = res.data;
        if (this.dataTableRaw && this.dataTableRaw.length > 0) {
          this.selectRow(this.dataTableRaw[0]);
        }
        this.expandAll(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
    // this.itemSelected = null;
  }

  clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      capDvi: this.userInfo.CAP_DVI
    })
    this.filter();
  }

  receivedData(data: any, tab: string) {
    switch (tab) {
      case '01':
        this.itemQdPdDaDtxd = data;
        break;
      case '02':
        this.itemQdPdTktcTdt = data;
        break;
      case '03':
        this.itemQdPdKhLcnt = data;
        break;
      case '04':
        this.itemTtdt = data;
        break;
      case '05':
        this.trangThaiQdPdKqLcnt = data;
        break;
      case '06':
        this.trangThaiHopDong = data;
        break;
    }
  }

  async loadDanhSachChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.danhSachChiCuc = this.danhSachChiCuc.filter(item => item.type != "PB")
  }


  async loadQdPdDaDtxdByDuAn(item) {
    this.itemQdPdTktcTdt = null;
    this.itemQdPdDaDtxd = null;
    this.itemQdPdKhLcnt = null;
    this.itemTtdt = null;
    this.trangThaiQdPdKqLcnt = false;
    this.trangThaiTienDoCv = false;
    this.trangThaiHopDong = false;
    this.spinner.show();
    try {
      let body = {
        "idDuAn": item.id,
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.quyetdinhpheduyetduandtxdService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.itemQdPdDaDtxd = res.data.content && res.data.content.length > 0 ? res.data.content[0] : null;
        console.log(this.itemQdPdDaDtxd,"this.itemQdPdDaDtxd")
        //Check tiếp quyết định phê duyệt bản vẽ
        if (this.itemQdPdDaDtxd) {
          await this.loadItemQdPdTktcTdt(this.itemQdPdDaDtxd);
          await this.loadItemQdPdKhLcnt(this.itemQdPdTktcTdt);
          await this.loadListItemQdPdKqLcnt(this.itemTtdt);
          await this.loadItemHopDong();
          await this.loadItemDsGoiThau();
          await this.loadBbNghiemThu();
        } else {
          this.notification.warning(MESSAGE.WARNING, "Dự án chưa tạo quyết định phê duyệt dự án đầu tư xây dựng hoặc quyết định chưa ban hành.");
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadItemQdPdTktcTdt(itemQdPdDaDtxd) {
    if (itemQdPdDaDtxd && itemQdPdDaDtxd.trangThai == STATUS.BAN_HANH) {
      let body = {
        "idQdPdDaDtxd": this.itemQdPdDaDtxd.id,
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.quyetdinhpheduyetTktcTdtService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.itemQdPdTktcTdt = res.data.content && res.data.content.length > 0 ? res.data.content[0] : null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadItemQdPdKhLcnt(itemQdPdTktcTdt) {
    if (itemQdPdTktcTdt && itemQdPdTktcTdt.trangThai == STATUS.BAN_HANH) {
      let body = {
        "idQdPdDaDtxd": this.itemQdPdDaDtxd.id,
        "idQdPdTktcTdt": itemQdPdTktcTdt.id,
        "idDuAn": this.itemQdPdDaDtxd.idDuAn,
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.quyetdinhpheduyetKhlcntService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.itemQdPdKhLcnt = res.data.content && res.data.content.length > 0 ? res.data.content[0] : null;
        this.itemTtdt = this.itemQdPdKhLcnt;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadItemHopDong() {
    if (this.itemQdPdKhLcnt) {
      let res = await this.hopdongService.danhSachHdTheoKhlcnt(this.itemQdPdKhLcnt.id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          this.itemHopDong = res.data;
          if (res.data.filter(item => item.trangThai == STATUS.DA_KY).length > 0) {
            this.trangThaiHopDong = true;
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadListItemQdPdKqLcnt(itemTtdt) {
    if (itemTtdt && itemTtdt.trangThaiDt == STATUS.HOAN_THANH_CAP_NHAT) {
      let body = {
        "namKh": itemTtdt.namKh,
        "soQdPdKhlcnt": itemTtdt.soQd,
        "idQdPdKhlcnt": itemTtdt.id,
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.quyetdinhpheduyetKqLcntService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.content && res.data.content.length > 0) {
          let totalSoGcTheoQdKqLcnt = res.data.content.reduce((accumulator, object) => {
            return accumulator + object.soGoiThau;
          }, 0);
          // nếu số gói thầu của qd pd kh lcnt bằng với số gói thầu của qd pd kqlcnt thì tức là đã hoàn thành nhập quyết định
          if (itemTtdt.soGoiThau == totalSoGcTheoQdKqLcnt) {
            this.trangThaiQdPdKqLcnt = true;
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadItemDsGoiThau() {
    if (this.itemHopDong.length > 0) {
      let body = {
        "namKh": this.itemSelected &&  this.itemSelected.namKeHoach ? this.itemSelected.namKeHoach : null,
        "idDuAn": this.itemSelected && this.itemSelected.id ? this.itemSelected.id : null,
        "idQdPdKhLcnt": this.itemQdPdKhLcnt &&  this.itemQdPdKhLcnt.id ? this.itemQdPdKhLcnt.id : null,
        "idQdPdDaDtxd": this.itemQdPdDaDtxd &&  this.itemQdPdDaDtxd.id ? this.itemQdPdDaDtxd.id : null,
      }
      let res = await this.hopdongService.detailQdPdKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let listGoiThau = res.data.listKtTdxdQuyetDinhPdKhlcntCvKh;
          if (listGoiThau && listGoiThau.length > 0) {
            listGoiThau.forEach(item => {
              if (item.trangThaiTd == STATUS.DA_HOAN_THANH) {
                this.trangThaiTienDoCv = true;
              }
            });
          }
        } else {
          this.notification.warning(MESSAGE.WARNING, "Không tìm thấy thông tin gói thầu cho dự án này, vui lòng kiểm tra lại.");
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  async loadBbNghiemThu() {
    if (this.itemHopDong.length > 0) {
      let body = {
        namKh: this.itemSelected&&  this.itemSelected.namKeHoach ? this.itemSelected.namKeHoach : null,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
        idDuAn: this.idSelected && this.itemSelected.id ? this.itemSelected.id : null,
        loai : "00",
        paggingReq : {
          limit: 999,
          page: 0
        }
      }
      let res = await this.bienBanSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data.content;
        if (data && data.length > 0) {
          if (data.length == this.itemHopDong.length) {
            this.trangThaiBb = true;
            data.forEach(item => {
              if (item.trangThai != STATUS.DA_KY) {
                this.trangThaiBb = false;
              }
            })
          }
        }
      }
    }
  }

  convertListData(dataTable: any[]) {
    if (dataTable && dataTable.length > 0) {
      dataTable = chain(dataTable)
        .groupBy("tenKhoi")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("namKeHoach")
            .map((v, k) => {
                let rs1 = chain(v)
                  .groupBy("tenChiCuc")
                  .map((v1, k1) => {
                      return {
                        idVirtual: uuidv4(),
                        tenChiCuc: k1,
                        dataChild: v1
                      };
                    }
                  ).value();
                return {
                  idVirtual: uuidv4(),
                  namKeHoach: k,
                  dataChild: rs1
                };
              }
            ).value();
          return {
            idVirtual: uuidv4(),
            khoi: key,
            dataChild: rs
          };
        }).value();
    }
    return dataTable;
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
            if (item.dataChild && item.dataChild.length > 0) {
              item.dataChild.forEach(item1 => {
                this.expandSet.add(item1.idVirtual);
              });
            }
          });
        }
      });
    }
  }

  async selectRow(data) {
    this.itemSelected = data;
    if (this.itemSelected) {
      this.tabSelected = null;
      this.itemSelected = null;
      this.dataTable.forEach(itemKhoi => {
        if (itemKhoi.dataChild && itemKhoi.dataChild.length > 0) {
          itemKhoi.dataChild.forEach(itemNam => {
            if (itemNam.dataChild && itemNam.dataChild.length > 0) {
              itemNam.dataChild.forEach(itemChiCuc => {
                if (itemChiCuc.dataChild && itemChiCuc.dataChild.length > 0) {
                  itemChiCuc.dataChild.forEach(itemDetail => {
                    itemDetail.selected = false;
                  });
                }
              });
            }
          });
        }
      });
    }
    data.selected = true;
    this.itemSelected = data;
    await this.loadQdPdDaDtxdByDuAn(data);
    this.selectTab("01");
  }

  async selectTab(tab) {
    if (tab != '01' && (!this.itemQdPdDaDtxd || this.itemQdPdDaDtxd.trangThai != STATUS.BAN_HANH)) {
      this.notification.warning(MESSAGE.WARNING, "Quyết định phê duyệt dự án đầu tư xây dựng chưa được tạo hoặc chưa ban hành.");
      return;
    }
    this.tabSelected = tab;
  }

}
