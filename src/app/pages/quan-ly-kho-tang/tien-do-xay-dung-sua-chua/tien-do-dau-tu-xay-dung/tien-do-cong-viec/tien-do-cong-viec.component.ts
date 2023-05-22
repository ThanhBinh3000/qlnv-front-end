import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../constants/message";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormGroup} from '@angular/forms';
import {HopdongService} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/hopdong.service";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {AMOUNT_NO_DECIMAL} from "../../../../../Utility/utils";
import {STATUS} from "../../../../../constants/status";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {
  DialogThemMoiDxkhthComponent
} from "../../../ke-hoach/ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component";

@Component({
  selector: 'app-tien-do-cong-viec',
  templateUrl: './tien-do-cong-viec.component.html',
  styleUrls: ['./tien-do-cong-viec.component.scss']
})
export class TienDoCongViecComponent extends Base2Component implements OnInit {
  @Input()
  itemQdPdKhLcnt: any;
  listHopDong: any[] = []
  dataTable: any[] = []
  dataTableRes: any[] = []
  formData : FormGroup;
  AMOUNT = AMOUNT_NO_DECIMAL;
  STATUS = STATUS;
  rowItemCha: TienDoXayDungCt = new TienDoXayDungCt();
  listTrangThai: any[] = [
    {ma: 'Quý I', giaTri: 'Quý I'},
    {ma: 'Quý II', giaTri: 'Quý II'},
    {ma: 'Quý III', giaTri: 'Quý III'},
    {ma: 'Quý IV', giaTri: 'Quý IV'},
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopdongService: HopdongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      tenTrangThai : ['Chưa thực hiện'],
      soQd : [null]
    })
  }

  ngOnInit(): void {
    this.loadItemDsGoiThau();
  }


  async loadItemDsGoiThau() {
    if (this.itemQdPdKhLcnt) {
      let body = {
        "namKh": this.itemQdPdKhLcnt.namKh,
        "idDuAn": this.itemQdPdKhLcnt.idDuAn,
        "idQdPdDaDtxd": this.itemQdPdKhLcnt.idQdPdDaDtxd,
        "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
      }
      let res = await this.hopdongService.detailQdPdKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let listGoiThau = res.data.listKtTdxdQuyetDinhPdKhlcntCvKh;
          if (listGoiThau && listGoiThau.length > 0) {
            listGoiThau.forEach(item => item.chuDauTu = res.data.chuDauTu);
          }
          this.listHopDong = listGoiThau;
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
      this.listHopDong.forEach(item => item.selected = false);
      data.selected = true;
      // this.itemSelected = data;
      // this.viewHopDong = true
      // this.idInput = data.idHopDong;
    }
  }

  themItemcha() {
    if (!this.rowItemCha.quy) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn quý");
      return;
    }
    if (this.checkExitsData(this.rowItemCha, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
      return;
    }
    this.rowItemCha.idVirtual = uuidv4();
    this.dataTable.push(this.rowItemCha);
    this.rowItemCha = new TienDoXayDungCt();
  }

  themMoiItem(data: any, type: string, idx: number, list?: any) {
      let modalQD = this.modal.create({
        nzTitle: type == "them" ? "Thêm mới chi tiết kế hoạch " : "Chỉnh sửa chi tiết kế hoạch",
        nzContent: DialogThemMoiDxkhthComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "1000px",
        nzStyle: { top: "200px" },
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          page : "DXNC"
        }
      });
      modalQD.afterClose.subscribe(async (detail) => {
        if (detail) {
          if (!data.dataChild) {
            data.dataChild = [];
          }
          if (!data.idVirtual) {
            data.idVirtual = uuidv4();
          }
          if (type == "them") {
            data.dataChild.push(detail);
          } else {
            if (list) {
              Object.assign(list.dataChild[idx], detail);
            }
          }
        }
      });
  }


  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.tenKhoi == item.tenKhoi) {
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
    this.dataTableRes = arr;
  }

  convertListToTree() {
    this.dataTable = chain(this.dataTableRes).groupBy("tenQuy")
      .map((value, key) => ({ tenQuy: key, dataChild: value, idVirtual : uuidv4() }))
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

}

export class TienDoXayDungCt {
  donViTinh: string;
  ghiChu: string;
  giaBoSung: number = 0;
  giaTheoHd: number = 0;
  id: number;
  klLuyKe: number = 0;
  klPhatSinh: number = 0;
  klTheoHd: number = 0;
  ktGoiThauId: number = 0;
  namKh: number = 0;
  quy: string;
  tenCongViec: string;
  idVirtual : any
}
