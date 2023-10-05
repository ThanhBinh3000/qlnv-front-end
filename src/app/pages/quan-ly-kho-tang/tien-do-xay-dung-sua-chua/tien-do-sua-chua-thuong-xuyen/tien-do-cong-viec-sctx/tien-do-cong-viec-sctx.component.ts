import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../constants/message";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup} from '@angular/forms';
import {chain, cloneDeep} from "lodash";
import {v4 as uuidv4} from "uuid";
import {AMOUNT_NO_DECIMAL} from "../../../../../Utility/utils";
import {STATUS} from "../../../../../constants/status";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {TienDoXayDungCt} from "../../tien-do-dau-tu-xay-dung/tien-do-cong-viec/tien-do-cong-viec.component";
import {
  TienDoCongViecTdscService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/tien-do-cong-viec.service";
import {HopdongTdscService} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/hopdongTdsc.service";
import {
  ThongTinTienDoCongViecSctxComponent
} from "./thong-tin-tien-do-cong-viec-sctx/thong-tin-tien-do-cong-viec-sctx.component";

@Component({
  selector: 'app-tien-do-cong-viec-sctx',
  templateUrl: './tien-do-cong-viec-sctx.component.html',
  styleUrls: ['./tien-do-cong-viec-sctx.component.scss']
})
export class TienDoCongViecSctxComponent extends Base2Component implements OnInit {
  @Input() itemQdPdKhLcnt: any;
  @Input() itemQdPdKtkt: any;
  @Input() itemDuAn: any;
  listHopDong: any[] = [];
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  dataKlcv: any[] = [];
  formData : FormGroup;
  AMOUNT = AMOUNT_NO_DECIMAL;
  STATUS = STATUS;
  rowItemCha: TienDoXayDungCt = new TienDoXayDungCt();
  itemHopDong : any;
  listThang: any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopdongService: HopdongTdscService,
    private tienDoCongViecService: TienDoCongViecTdscService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tienDoCongViecService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      tenTrangThai : ['Chưa thực hiện'],
      soQd : [null]
    })
  }

  ngOnInit(): void {
    this.loadDsThang()
    this.loadItemDsGoiThau();
  }

  loadDsThang() {
    for (let i = 1; i <= 12; i++) {
      let item = {
        ma: 'Tháng ' + i,
        giaTri: 'Tháng ' + i
      }
      this.listThang = [...this.listThang, item].flat();
    }
  }


  async loadItemDsGoiThau() {
    if (this.itemQdPdKhLcnt) {
      let body = {
        "namKh": this.itemQdPdKhLcnt.namKh,
        "idDuAn": this.itemQdPdKhLcnt.idDuAn,
        "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
        "idQdPdKtkt": this.itemQdPdKtkt.id,
        "loai": "01"
      }
      let res = await this.hopdongService.detailQdPdKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let listGoiThau = res.data.listKtTdscQuyetDinhPdKhlcntCvKh;
          if (listGoiThau && listGoiThau.length > 0) {
            listGoiThau.forEach(item => item.chuDauTu = res.data.chuDauTu);
          }
          this.listHopDong = listGoiThau.filter(item => item.hopDong && item.hopDong.soHd);
          if (this.listHopDong && this.listHopDong.length > 0) {
            this.selectRow(this.listHopDong[0]);
          }
          console.log(this.listHopDong, 'itemQdPdKhLcnt...');
        } else {
          this.notification.warning(MESSAGE.WARNING, "Không tìm thấy thông tin gói thầu cho dự án này, vui lòng kiểm tra lại.");
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async selectRow(data) {
    if (data) {
      this.itemHopDong = data;
      this.listHopDong.forEach(item => item.selected = false);
      data.selected = true;
      this.loadCtCvHopDong(data.hopDong?.id);
      this.getDetailTienDo(data.id);
    }
  }

  async loadCtCvHopDong(id : number) {
    this.spinner.show();
    try {
      let res = await this.hopdongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.dataKlcv = data.listKtTdscHopDongKlcv && data.listKtTdscHopDongKlcv.length > 0 ? data.listKtTdscHopDongKlcv : [];
          this.expandAll();
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

  async getDetailTienDo(id : number) {
    this.spinner.show();
    try {
      let res = await this.tienDoCongViecService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          console.log(res.data,2222)
          const data = res.data;
          this.dataTableReq = cloneDeep(data);
          this.convertListToTree()
          this.expandAll();
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

  themItemcha() {
    if (!this.rowItemCha.thang) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn quý");
      return;
    }
    if (this.checkExitsData(this.rowItemCha, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng quý");
      return;
    }
    this.rowItemCha.idVirtual = uuidv4();
    this.dataTable.push(this.rowItemCha);
    this.rowItemCha = new TienDoXayDungCt();
  }

  themMoiItem(data: any, idx: number, list?: any) {
    let modalQD = this.modal.create({
      nzTitle: "THÊM TÊN CÔNG TÁC/HẠNG MỤC CÔNG VIỆC",
      nzContent: ThongTinTienDoCongViecSctxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1000px",
      nzStyle: { top: "200px" },
      nzFooter: null,
      nzComponentParams: {
        dataTable: list.dataChild && list.dataChild.length > 0 ? list.dataChild : this.dataKlcv,
        dataInput: data,
      }
    });
    modalQD.afterClose.subscribe(async (listData) => {
      if (listData && listData.length > 0) {
        if (!data.dataChild) {
          data.dataChild = [];
        }
        if (!data.idVirtual) {
          data.idVirtual = uuidv4();
        }
        data.dataChild = [...data.dataChild, listData].flat();
        this.expandAll();
      }
    })
  }


  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.thang == item.thang) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  deleteItemCha(idx) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(idx, 1);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  deleteItem(index: any, y: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          if (this.dataTable && this.dataTable.length > 0 && this.dataTable[index]) {
            if (this.dataTable[index] && this.dataTable[index].dataChild && this.dataTable[index].dataChild[y]) {
              this.dataTable[index].dataChild.splice(y, 1);
            }
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data);
        });
      }
    });
    this.dataTableReq = arr;
  }

  convertListToTree() {
    this.dataTable = chain(this.dataTableReq).groupBy("thang")
      .map((value, key) => ({ thang: key, dataChild: value, idVirtual : uuidv4() }))
      .value();
  }

  sumSoLuong(data: any, row: string, type?: any) {
    let sl = 0;
    if (!type) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        const sum = data.dataChild.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        let sum = 0;
        this.dataTable.forEach(item => {
          sum += this.sumSoLuong(item, row);
        });
        sl = sum;
      }
    }
    return sl;
  }

  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành hợp đồng?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let itemGoiThau = this.listHopDong.filter(item => item.selected == true)
          let body = {
            id: itemGoiThau[0]?.id,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          let res =
            await this.tienDoCongViecService.hoanThanh(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.loadItemDsGoiThau()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }


  save() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn lưu?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          this.conVertTreToList()
          let itemGoiThau = this.listHopDong.filter(item => item.selected == true)
          let body = {
            idGoiThau: itemGoiThau[0]?.id,
            listKtTdscTiendoCongviec: this.dataTableReq
          };
          let res = await this.tienDoCongViecService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }
}
