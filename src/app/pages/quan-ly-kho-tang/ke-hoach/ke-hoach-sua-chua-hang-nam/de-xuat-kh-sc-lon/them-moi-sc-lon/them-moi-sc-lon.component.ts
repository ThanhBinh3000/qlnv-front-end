import { Component, Input, OnInit } from "@angular/core";
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { DanhMucKho } from "../../../dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import { MESSAGE } from "../../../../../../constants/message";
import { STATUS } from "../../../../../../constants/status";
import dayjs from "dayjs";
import { DialogDxScLonComponent } from "./dialog-dx-sc-lon/dialog-dx-sc-lon.component";
import {
  DeXuatScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";

@Component({
  selector: "app-them-moi-sc-lon",
  templateUrl: "./them-moi-sc-lon.component.html",
  styleUrls: ["./them-moi-sc-lon.component.scss"]
})
export class ThemMoiScLonComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  maQd: string;
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: DanhMucKho = new DanhMucKho();
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucKho } } = {};
  dataTableDm: any[] = [];
  dataTableRes: any[] = [];
  tableTren: any[] = [];
  tableDuoi: any[] = [];
  rowItemChaDuoi: DanhMucKho = new DanhMucKho();
  rowItemChaTren: DanhMucKho = new DanhMucKho();
  listFileDinhKem: any[] = [];
  listKhoi: any[] = [];
  listLoaiDuAn: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService: DeXuatScLonService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      namKeHoach: [dayjs().get("year")],
      soCongVan: [""],
      soQdTrunghan: [null, Validators.required],
      trichYeu: [null],
      ngayTaoDx: [null],
      ngayDuyet: [null],
      namBatDau: [null],
      namKetThuc: [null],
      loaiDuAn: [null],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      lyDoTuChoi: [null]
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (!this.idInput) {
        this.maQd = "/" + this.userInfo.MA_TCKT;
      }
      this.getDsKhoi();
      if (this.idInput) {
        await this.getDataDetail(this.idInput);
      } else {
        this.formData.patchValue({
          tenDvi: this.userInfo.TEN_DVI
        });
      }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async getDsKhoi() {
    let res = await this.danhMucService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }


  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.dexuatService.getDetail(id);
      const data = res.data;
      this.maQd = data.soCongVan ? "/" + data.soCongVan.split("/")[1] : "",
        this.formData.patchValue({
          id: data.id,
          maDvi: data.maDvi,
          tenDvi: data.tenDvi,
          soCongVan: data.soCongVan ? data.soCongVan.split("/")[0] : "",
          namKeHoach: data.namKeHoach,
          namBatDau: data.namBatDau,
          namKetThuc: data.namKetThuc,
          ngayTaoDx: data.ngayTaoDx,
          loaiDuAn: data.loaiDuAn,
          trichYeu: data.trichYeu,
          ngayDuyet: data.ngayDuyet,
          trangThai: data.trangThai,
          tenTrangThai: data.tenTrangThai
        });
      this.fileDinhKem = data.fileDinhKems;
      this.dataTableRes = data.chiTiets;
      this.dataTableDm = data.listDanhMuc;
      await this.convertListToTree();
    }
  }

  setValidators() {
    this.formData.controls["trichYeu"].setValidators(Validators.required);
    this.formData.controls["namKeHoach"].setValidators(Validators.required);
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      this.formData.controls["ngayTaoDx"].setValidators(Validators.required);
    }
    if (this.formData.value.trangThai == STATUS.DA_DUYET_LDC) {
      this.formData.controls["ngayDuyet"].setValidators(Validators.required);
    }
  }


  async save(isOther: boolean) {
    this.helperService.removeValidators(this.formData);
    this.formData.controls["soCongVan"].setValidators(Validators.required);
    if (isOther || this.idInput > 0) {
      this.setValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userService.isCuc() ? this.userInfo.MA_DVI : this.formData.value.maDvi;
    body.soCongVan = body.soCongVan ? body.soCongVan + this.maQd : this.maQd;
    body.fileDinhKems = this.fileDinhKem;
    this.conVertTreToList();
    body.chiTiets = this.dataTableRes;
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id,
      });
      if (isOther) {
        let trangThai;
        switch (this.formData.value.trangThai) {
          case STATUS.DU_THAO :
          case STATUS.TU_CHOI_LDV:
          case STATUS.TU_CHOI_TP : {
            trangThai = STATUS.CHO_DUYET_TP;
            break;
          }
          case STATUS.TU_CHOI_LDC:
          case STATUS.CHO_DUYET_TP : {
            trangThai = STATUS.CHO_DUYET_LDC;
            break;
          }
        }
        if (this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.CHO_DUYET_TP) {
          this.duyet();
        } else {
          await this.approve(data.id, trangThai, "Bạn có chắc chắn muốn gửi duyệt?");
        }
      }
    }
  }

  async duyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP : {
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      }
      case STATUS.CHO_DUYET_LDC : {
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC : {
        trangThai = STATUS.DA_DUYET_CBV;
        break;
      }
    }
    await this.approve(this.formData.value.id, trangThai, "Bạn có chắc chắn muốn duyệt?");
  }

  async tuChoi() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP : {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC : {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC : {
        trangThai = STATUS.TU_CHOI_CBV;
        break;
      }
    }
    await this.reject(this.formData.value.id, trangThai, "Bạn có chắc chắn muốn từ chối?");
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
      if(type == 'duoi') {
        if (this.dataTable && this.dataTable.length > 0) {
          let sum = 0;
          this.dataTable.forEach(item => {
            sum += this.sumSoLuong(item, row);
          });
          sl = sum;
        }

      }
    }
    return sl;
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.khoi == item.khoi) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  themMoiItem(data: any, tmdt: string, type: string, idx: number, list?: any) {
      let modalQD = this.modal.create({
        nzTitle: "ĐỀ XUẤT KẾ HOẠCH SỬA CHỮA LỚN HÀNG NĂM",
        nzContent: DialogDxScLonComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "1200px",
        nzStyle: { top: "100px" },
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          page: tmdt
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
          this.expandAll(this.tableDuoi);
          this.expandAll(this.tableTren);
        }
      });
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  deleteItemCha(idx, table : any[]) {
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
          table.splice(idx, 1);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  deleteItem(y: any, table : any[]) {
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
          table.splice(y, 1);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  conVertTreToList() {
    let arr = [];
    if (this.tableTren && this.tableTren.length > 0) {
      this.tableTren.forEach(item => {
        if (item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            arr.push(data);
          });
        }
      });
    }
    if (this.tableDuoi && this.tableDuoi.length > 0) {
      this.tableDuoi.forEach(item => {
        if (item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            arr.push(data);
          });
        }
      });
    }
    this.dataTableRes = arr;
  }


  convertListToTree() {
    this.tableTren = this.dataTableRes.filter(item => item.tmdt > 15000000000);
    this.tableDuoi = this.dataTableRes.filter(item => item.tmdt <= 15000000000);
    if (this.tableTren && this.tableTren.length > 0) {
      this.tableTren = chain(this.tableTren).groupBy("tenKhoi")
        .map((value, key) => ({ tenKhoi: key, dataChild: value, idVirtual: uuidv4() }))
        .value();
    }
    if (this.tableDuoi && this.tableDuoi.length > 0) {
      this.tableDuoi = chain(this.tableDuoi).groupBy("tenKhoi")
        .map((value, key) => ({ tenKhoi: key, dataChild: value, idVirtual: uuidv4() }))
        .value();
    }
    this.expandAll(this.tableTren);
    this.expandAll(this.tableDuoi);
  }

  themItemcha(type: string) {
    if (type == "duoi") {
      if (!this.rowItemChaDuoi.khoi) {
        this.notification.error(MESSAGE.ERROR, "Không được để trống danh mục khối");
        return;
      }
      if (this.checkExitsData(this.rowItemChaDuoi, this.tableDuoi)) {
        this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
        return;
      }
      this.rowItemChaDuoi.idVirtual = uuidv4();
      this.tableDuoi.push(this.rowItemChaDuoi);
      this.rowItemChaDuoi = new DanhMucKho();
    } else {
      if (!this.rowItemChaTren.khoi) {
        this.notification.error(MESSAGE.ERROR, "Không được để trống danh mục khối");
        return;
      }
      if (this.checkExitsData(this.rowItemChaTren, this.tableTren)) {
        this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
        return;
      }
      this.rowItemChaTren.idVirtual = uuidv4();
      this.tableTren.push(this.rowItemChaTren);
      this.rowItemChaTren = new DanhMucKho();
    }
  }

  changeKhoi(event, type: string) {
    if (event) {
      let result = this.listKhoi.filter(item => item.ma == event);
      if (result && result.length > 0) {
        if (type == "tren") {
          this.rowItemChaTren.tenKhoi = result[0].giaTri;
        } else {
          this.rowItemChaDuoi.tenKhoi = result[0].giaTri;
        }
      }
    }
  }


}
