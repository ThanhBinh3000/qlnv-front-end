import {Component, OnInit} from '@angular/core';
import {Globals} from "../../../../shared/globals";
import {UserService} from "../../../../services/user.service";
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {cloneDeep} from "lodash";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {KtQdXdHangNamService} from "../../../../services/kt-qd-xd-hang-nam.service";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../services/donvi.service";
import {MESSAGE} from "../../../../constants/message";
import {
  QuyetdinhpheduyetTktcTdtService
} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetTktcTdt.service";
import {STATUS} from "../../../../constants/status";

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
  itemQdPdKhlcnt: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private ktQdXdHangNamService: KtQdXdHangNamService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService,
    private quyetdinhpheduyetTktcTdtService: QuyetdinhpheduyetTktcTdtService
  ) {
    super(httpClient, storageService, notification, spinner, modal, ktQdXdHangNamService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData = this.fb.group({
      namKeHoach: [''],
      tenDuAn: [''],
      maDvi: [''],
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
    this.itemSelected = null;
  }

  clearForm() {
    this.formData.reset();
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
        this.itemQdPdKhlcnt = data;
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
        //Check tiếp quyết định phê duyệt bản vẽ
        if (this.itemQdPdDaDtxd && this.itemQdPdDaDtxd.trangThai == STATUS.BAN_HANH) {
          let body = {
            "idQdPdDtxd": this.itemQdPdDaDtxd.id,
            "paggingReq": {
              "limit": 10,
              "page": 0
            }
          }
          let res1 = await this.quyetdinhpheduyetTktcTdtService.search(body);
          if (res1.msg == MESSAGE.SUCCESS) {
            this.itemQdPdTktcTdt = res1.data.content && res1.data.content.length > 0 ? res1.data.content[0] : null;
          } else {
            this.notification.error(MESSAGE.ERROR, res1.msg);
          }
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
    await this.loadQdPdDaDtxdByDuAn(data);
    data.selected = true;
    this.itemSelected = data;
    this.selectTab("01");
  }

  async selectTab(tab) {
    if (tab != '01' && (!this.itemQdPdDaDtxd || this.itemQdPdDaDtxd.trangThai != STATUS.BAN_HANH)) {
      this.notification.warning(MESSAGE.WARNING, "Quyết định phê duyệt dự án đầu tư xây dựng chưa được tạo hoặc chưa ban hành.");
      return;
    }
    // if (tab == '02' && (this.itemQdPdTktcTdt && this.itemQdPdTktcTdt.trangThai == STATUS.BAN_HANH)) {
    //   let body = {
    //     "idQdPdDtxd": this.itemQdPdDaDtxd.id,
    //     "paggingReq": {
    //       "limit": 10,
    //       "page": 0
    //     }
    //   }
    //   let res = await this.quyetdinhpheduyetTktcTdtService.search(body);
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     this.itemQdPdTktcTdt = res.data.content && res.data.content.length > 0 ? res.data.content[0] : null;
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.msg);
    //   }
    // }
    this.tabSelected = tab;
  }

}
