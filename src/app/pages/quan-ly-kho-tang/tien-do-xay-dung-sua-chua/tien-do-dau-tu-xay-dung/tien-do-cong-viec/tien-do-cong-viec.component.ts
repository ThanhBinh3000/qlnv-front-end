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
import { cloneDeep } from 'lodash';
import {
  TienDoCongViecService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/tien-do-cong-viec.service";
import {ThongTinTienDoCongViecComponent} from "./thong-tin-tien-do-cong-viec/thong-tin-tien-do-cong-viec.component";
import { saveAs } from 'file-saver';
import {FileDinhKem} from "../../../../../models/FileDinhKem";
@Component({
  selector: 'app-tien-do-cong-viec',
  templateUrl: './tien-do-cong-viec.component.html',
  styleUrls: ['./tien-do-cong-viec.component.scss']
})
export class TienDoCongViecComponent extends Base2Component implements OnInit {
  @Input() itemQdPdKhLcnt: any;
  @Input() itemQdPdDaDtxd: any;
  @Input() itemQdPdTktcTdt: any;
  listHopDong: any[] = [];
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  dataKlcv: any[] = [];
  formData : FormGroup;
  AMOUNT = AMOUNT_NO_DECIMAL;
  STATUS = STATUS;
  rowItemCha: TienDoXayDungCt = new TienDoXayDungCt();
  itemHopDong : any;
  listTrangThai: any[] = [
    {ma: 'Quý I', giaTri: 'Quý I'},
    {ma: 'Quý II', giaTri: 'Quý II'},
    {ma: 'Quý III', giaTri: 'Quý III'},
    {ma: 'Quý IV', giaTri: 'Quý IV'},
  ];
  fileDinhKems: any[]=[];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopdongService: HopdongService,
    private tienDoCongViecService: TienDoCongViecService,
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
          this.dataKlcv = data.listKtTdxdHopDongKlcv && data.listKtTdxdHopDongKlcv.length > 0 ? data.listKtTdxdHopDongKlcv : [];
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
          const data = res.data;
          this.dataTableReq = cloneDeep(data);
          this.fileDinhKems= Array.isArray(data.fileDinhKems)? cloneDeep(data.fileDinhKems): [];
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
    if (!this.rowItemCha.quy) {
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
        nzContent: ThongTinTienDoCongViecComponent,
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
        if (it.quy == item.quy) {
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
    this.dataTable = chain(this.dataTableReq).groupBy("quy")
      .map((value, key) => ({ quy: key, dataChild: value, idVirtual : uuidv4() }))
      .value();
    console.log(this.dataTable,"this.dataTable")
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
      nzContent: 'Bạn có chắc chắn muốn hoàn thành Tiến độ công việc?',
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
            listKtTdxdTiendoCongviec: this.dataTableReq,
            fileDinhKems: this.fileDinhKems
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
  editRow(index: number) {
    this.dataTable.forEach(f=>{
      f.dataChild[index].edit= true
    })
  }
  cancelEdit(index: number): void {
    this.dataTable.forEach(f=>{
      f.dataChild[index].edit= false
    })
  }

  saveEdit(index: number): void {
    this.dataTable.forEach(f=>{
      f.dataChild[index].edit= false
    })
  }

  deleteRow(data: any) {
    this.dataTable.forEach(f=>{
      f.dataChild=f.dataChild.filter(x => x.id != data.id);
    })
  }
  exportData(fileName?: string) {
    if (this.itemHopDong) {
      this.spinner.show();
      try {
        let body={
          "idGoiThau":this.itemHopDong.id
        }
        this.service
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
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
  thang: string;
  tenCongViec: string;
  idVirtual : any;
  loai : string;
}
