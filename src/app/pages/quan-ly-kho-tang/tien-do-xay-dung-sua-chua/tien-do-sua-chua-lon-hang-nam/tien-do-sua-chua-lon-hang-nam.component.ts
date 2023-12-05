import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../services/donvi.service";
import {MESSAGE} from "../../../../constants/message";
import {STATUS} from "../../../../constants/status";
import {
  KtKhSuaChuaBtcService
} from "../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import {
  QdPheDuyetBaoCaoKtktService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-bao-cao-ktkt.service";
import {
  QdPheDuyetKhlcntTdsclService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-khlcnt-tdscl.service";
import {
  QuyetdinhpheduyetKqLcntSclService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qdPdKqLcntScl.service";
import {HopdongTdscService} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/hopdongTdsc.service";
import {
  BienBanNghiemThuTdscServiceService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/bien-ban-nghiem-thu-tdsc.service";

@Component({
  selector: 'app-tien-do-sua-chua-lon-hang-nam',
  templateUrl: './tien-do-sua-chua-lon-hang-nam.component.html',
  styleUrls: ['./tien-do-sua-chua-lon-hang-nam.component.scss']
})
export class TienDoSuaChuaLonHangNamComponent extends Base2Component implements OnInit {
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
  itemQdPdKtkt: any;
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
    private ktQdXdHangNamService: KtKhSuaChuaBtcService,
    private qdPheDuyetBaoCaoKtktService: QdPheDuyetBaoCaoKtktService,
    private quyetdinhpheduyetKhlcntService: QdPheDuyetKhlcntTdsclService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntSclService,
    private hopdongService: HopdongTdscService,
    private bienBanSv: BienBanNghiemThuTdscServiceService
  ) {
    super(httpClient, storageService, notification, spinner, modal, ktQdXdHangNamService)
    super.ngOnInit();
    this.formData = this.fb.group({
      namKeHoach: [''],
      tenDuAn: [''],
      maDvi: [null],
      capDvi: [null],
      soQuyetDinh: [''],
      trangThai: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      loai : [null]
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.spinner.show();
    if (this.userService.isCuc()) {
      await this.loadDanhSachChiCuc();
    }
    this.filter();
    this.spinner.hide();
  }

  async filter() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        // loai : 'QDTCDT'
      })
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
    this.filter();
  }

  receivedData(data: any, tab: string) {
    switch (tab) {
      case '01':
        this.itemQdPdKtkt = data;
        break;
      case '02':
        this.itemQdPdKhLcnt = data;
        break;
      case '03':
        this.itemTtdt = data;
        break;
      case '04':
        this.trangThaiQdPdKqLcnt = data;
        break;
      case '05':
        this.trangThaiHopDong = data;
        break;
      case '07':
       this.loadBbNghiemThu()
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
    this.itemQdPdKtkt = null;
    this.itemQdPdKhLcnt = null;
    this.itemTtdt = null;
    this.trangThaiQdPdKqLcnt = false;
    this.trangThaiTienDoCv = false;
    this.trangThaiHopDong = false;
    this.spinner.show();
    try {
      let body = {
        "namKh": item.namKh,
        "soQdPdKhScl": item.soQdPdTcdt,
        "loai" : "00",
        "tenCongTrinh" : item.tenCongTrinh,
        "idDuAn" : item.id,
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.qdPheDuyetBaoCaoKtktService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.itemQdPdKtkt = res.data.content && res.data.content.length > 0 ? res.data.content[0] : null;
        // //Check tiếp quyết định phê duyệt bản vẽ
        if (this.itemQdPdKtkt) {
          await this.loadItemQdPdKhLcnt(this.itemQdPdKtkt);
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

  async loadItemQdPdKhLcnt(itemQdPdTktcTdt) {
    if (itemQdPdTktcTdt && itemQdPdTktcTdt.trangThai == STATUS.BAN_HANH) {
      let body = {
        "soQdPdBcKtkt": this.itemQdPdKtkt.soQd,
        "idQdPdBcKtkt": this.itemQdPdKtkt.id,
        "loai" : "00",
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
      let body = {
        idQdPdKhlcnt : this.itemQdPdKhLcnt.id,
        loai: "00"
      }
      let res = await this.hopdongService.danhSachHdTheoKhlcnt(body);
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
        "namKh": this.itemSelected.namKh,
        "idDuAn": this.itemSelected.id,
        "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
        "idQdPdKtkt": this.itemQdPdKtkt.id,
        "loai": "00"
      }
      let res = await this.hopdongService.detailQdPdKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let listGoiThau = res.data.listKtTdscQuyetDinhPdKhlcntCvKh;
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
        namKh: this.itemSelected.namKh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
        idDuAn: this.itemSelected.id,
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
            .groupBy("namKh")
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
                  namKh: k,
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
    this.trangThaiHopDong = false;
    this.trangThaiTienDoCv = false;
    this.trangThaiBb = false;
    this.itemSelected = data;
    if (this.itemSelected) {
      this.tabSelected = null;
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
    if (tab != '01' && (!this.itemQdPdKtkt || this.itemQdPdKtkt.trangThai != STATUS.BAN_HANH)) {
      this.notification.warning(MESSAGE.WARNING, "Quyết định phê duyệt báo cáo KTKT chưa được tạo hoặc chưa ban hành.");
      return;
    }
    this.tabSelected = tab;
  }
}
