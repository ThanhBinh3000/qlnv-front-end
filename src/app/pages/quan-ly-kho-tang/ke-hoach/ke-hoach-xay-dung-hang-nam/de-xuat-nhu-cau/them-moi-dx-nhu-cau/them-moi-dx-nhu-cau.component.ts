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
import { KtKhXdHangNamService } from "../../../../../../services/kt-kh-xd-hang-nam.service";
import { DonviService } from "../../../../../../services/donvi.service";
import { DanhMucKho } from "../../../dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import { MESSAGE } from "../../../../../../constants/message";
import { DanhMucKhoService } from "../../../../../../services/danh-muc-kho.service";
import { QuyetDinhKhTrungHanService } from "../../../../../../services/quyet-dinh-kh-trung-han.service";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogThemMoiDxkhthComponent
} from "../../../ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component";
import {
  DialogQdXdTrungHanComponent
} from "../../../../../../components/dialog/dialog-qd-xd-trung-han/dialog-qd-xd-trung-han.component";
import dayjs from "dayjs";

@Component({
  selector: "app-them-moi-dx-nhu-cau",
  templateUrl: "./them-moi-dx-nhu-cau.component.html",
  styleUrls: ["./them-moi-dx-nhu-cau.component.scss"]
})
export class ThemMoiDxNhuCauComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  maQd: string;
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: DanhMucKho = new DanhMucKho();
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucKho } } = {};
  listQdKhTh: any[] = [];
  dataTable: any[] = [];
  dataTableRes: any[] = [];
  rowItemCha: DanhMucKho = new DanhMucKho();
  listFileDinhKem: any[] = [];
  listKhoi: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS;


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService: KtKhXdHangNamService,
    private dviService: DonviService,
    private dmKhoService: DanhMucKhoService,
    private danhMucService: DanhMucService,
    private qdTrungHanSv: QuyetDinhKhTrungHanService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      namKeHoach: [dayjs().get("year")],
      soCongVan: [''],
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
      this.getAllQdTrungHan();
      if (this.idInput) {
        await this.getDataDetail(this.idInput);
      } else {
        this.formData.patchValue({
          tenDvi: this.userInfo.TEN_DVI,
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

  async getAllQdTrungHan() {
    let res = await this.qdTrungHanSv.getListQd();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdKhTh = res.data;
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
          soQdTrunghan: data.soQdTrunghan,
          trichYeu: data.trichYeu,
          ngayDuyet: data.ngayDuyet,
          trangThai: data.trangThai,
          tenTrangThai: data.tenTrangThai
        });
      this.fileDinhKem = data.fileDinhKems;
      this.dataTableRes = data.ctiets;
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
    this.formData.controls["soQdTrunghan"].setValidators(Validators.required);
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
    body.ctiets = this.dataTableRes;
    body.tmdt = this.sumSoLuong(null, "tmdtDuKien", true);
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        let trangThai;
        switch (this.formData.value.trangThai) {
          case STATUS.DU_THAO:
          case STATUS.TU_CHOI_LDV:
          case STATUS.TU_CHOI_TP: {
            trangThai = STATUS.CHO_DUYET_TP;
            break;
          }
          case STATUS.TU_CHOI_LDC:
          case STATUS.CHO_DUYET_TP: {
            trangThai = STATUS.CHO_DUYET_LDC;
            break;
          }
        }
        if (this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.CHO_DUYET_TP) {
          this.duyet()
        } else {
          await this.approve(data.id, trangThai, "Bạn có chắc chắn muốn gửi duyệt?");
        }
      } else {
        this.idInput = data.id;
        this.formData.patchValue({
          id: data.id,
          trangThai: data.trangThai
        });
      }
    }
  }

  async duyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_CBV;
        break;
      }
    }
    await this.approve(this.formData.value.id, trangThai, "Bạn có chắc chắn muốn duyệt?");
  }

  async tuChoi() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC: {
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

  themMoiItem(data: any, type: string, idx: number, list?: any) {
    if (!this.isViewDetail) {
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
          page: "DXNC"
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
          this.expandAll();
        }
      });
    }
  }

  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
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

  openDialogToTrinh() {
    if (!this.isViewDetail) {
      const modal = this.modal.create({
        nzTitle: "Danh sách quyết định kế hoạch trung hạn",
        nzContent: DialogQdXdTrungHanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "900px",
        nzFooter: null,
        nzComponentParams: {
          type: "DXNC",
          dsPhuongAn: this.listQdKhTh
        }
      });
      modal.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soQdTrunghan: data.soQuyetDinh,
            namBatDau: data.namBatDau,
            namKetThuc: data.namKetThuc,
            loaiDuAn: data.loaiDuAn,
          });
          await this.changeSoQdTrunghan(data.id)
        }
      });
    }
  }

  convertListToTree() {
    this.dataTable = chain(this.dataTableRes).groupBy("tenKhoi")
      .map((value, key) => ({ tenKhoi: key, dataChild: value, idVirtual: uuidv4() }))
      .value();
    this.expandAll();
  }

  async changeSoQdTrunghan(id) {
    let res = await this.qdTrungHanSv.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTable = [];
      let detail = res.data;
      this.dataTableRes = detail.ctRes?.ctietList;
      if (this.dataTableRes && this.dataTableRes.length > 0) {
        this.dataTableRes = this.dataTableRes.filter(item => item.maDvi == this.userInfo.MA_DVI);
      }
      this.convertListToTree();
    }
  }

  themItemcha() {
    if (!this.rowItemCha.khoi) {
      this.notification.error(MESSAGE.ERROR, "Không được để trống danh mục khối");
      return;
    }
    if (this.checkExitsData(this.rowItemCha, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
      return;
    }
    if (!this.formData.value.soQdTrunghan) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn kế hoạch trung hạn");
      return;
    }
    this.rowItemCha.idVirtual = uuidv4();
    this.dataTable.push(this.rowItemCha);
    this.rowItemCha = new DanhMucKho();
  }

  changeKhoi(event) {
    if (event) {
      let result = this.listKhoi.filter(item => item.ma == event);
      if (result && result.length > 0) {
        this.rowItemCha.tenKhoi = result[0].giaTri
      }
    }
  }

}

