import {Component, Input, OnInit} from "@angular/core";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {KtKhXdHangNamService} from "../../../../../../services/kt-kh-xd-hang-nam.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucKho} from "../../../dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucKhoService} from "../../../../../../services/danh-muc-kho.service";
import {QuyetDinhKhTrungHanService} from "../../../../../../services/quyet-dinh-kh-trung-han.service";
import {STATUS} from "../../../../../../constants/status";
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
  dataTableReq: any[] = [];
  listFileDinhKem: any[] = [];
  listKhoi: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS;
  listSoDx: any;


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

  // async getAllQdTrungHan() {
  //   let res = await this.qdTrungHanSv.getListQd();
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.listQdKhTh = res.data;
  //   }
  // }
  async getAllSoDeXuat() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
    }
    let res = await this.dexuatService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoDx = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async getAllQdTrungHan() {
    let body = {
      "namKeHoach": this.formData.value.namKeHoach,
      "maDvi": this.userInfo.MA_DVI,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
    }
    let res = await this.qdTrungHanSv.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content.filter(f => f.trangThai = STATUS.BAN_HANH);
      let QuyetDinh = [
        ...data.filter((e) => {
          return !this.listSoDx.some((dx) => {
            return e.soQuyetDinh === dx.soQdTrunghan;
          });
        }),
      ];
      this.listQdKhTh = QuyetDinh;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
          ngayDuyet: data.trangThai == STATUS.CHO_DUYET_LDC ? dayjs().format('YYYY-MM-DDTHH:mm:ss') : data.ngayDuyet,
          trangThai: data.trangThai,
          tenTrangThai: data.tenTrangThai
        });
      this.fileDinhKem = data.fileDinhKems;
      this.dataTableReq = data.ctiets;
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


  async save(isOther: boolean, trangThai?) {
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
    body.ctiets = this.dataTableReq;
    body.tmdt = this.sumSoLuong(null, "tmdtDuKien", true);
    if (isOther) {
      await super.saveAndSend(body, trangThai, 'Bạn có muốn gửi duyệt đề xuất này ?', 'Thao tác thành công.');
    } else {
      await this.createUpdate(body);
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_CBV:
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_CBV;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg, null, trangThai==STATUS.DA_DUYET_LDC || trangThai==STATUS.DA_DUYET_CBV
      ?"Thao tác thành công!":"Bạn đã lưu và gửi duyệt thành công!");
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_CBV;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
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

  checkExitsData(item: any, table: any[]): boolean {
    let rs = false;
    if (table && table.length > 0) {
      table.forEach(it => {
        if (it.maDuAn == item.maDuAn) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  themMoiItem(type: string, data?: any) {
    if (!this.isViewDetail) {
      let modalQD = this.modal.create({
        nzTitle: type == "them" ? "Thêm mới chi tiết kế hoạch " : "Chỉnh sửa chi tiết kế hoạch",
        nzContent: DialogThemMoiDxkhthComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "1000px",
        nzStyle: {top: "200px"},
        nzFooter: null,
        nzComponentParams: {
          dataInput: data,
          type: type,
          namKh: this.formData.value.namKeHoach,
          page: "DXNC"
        }
      });
      modalQD.afterClose.subscribe(async (detail) => {
        if (detail) {
          if (type == "them") {
            if (this.checkExitsData(detail, this.dataTableReq)) {
              this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục dự án");
              this.spinner.hide();
              return;
            }
            detail.idVirtual = uuidv4();
            this.dataTableReq = [...this.dataTableReq, detail];
          } else {
            if (data) {
              const idx = this.dataTableReq.findIndex(item => item.maDuAn = data.maDuAn);
              if (idx > -1) {
                Object.assign(this.dataTableReq[idx], detail);
              }
            }
          }
          await this.convertListToTree();
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

  deleteItem(data) {
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
          const idx = this.dataTableReq.findIndex(item => item.maDuAn == data.maDuAn);
          if (idx > -1) {
            this.dataTableReq.splice(idx, 1);
            this.convertListToTree();
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  async openDialogToTrinh() {
    await this.getAllSoDeXuat();
    await this.getAllQdTrungHan();
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
    this.dataTableReq.forEach(item => {
      item.tgKcHt = item.tgKhoiCong + " - " + item.tgHoanThanh;
    });
    this.dataTable = chain(this.dataTableReq).groupBy("tenKhoi")
      .map((value, key) => ({tenKhoi: key, dataChild: value, idVirtual: uuidv4()}))
      .value();
    this.expandAll();
  }

  async changeSoQdTrunghan(id) {
    let res = await this.qdTrungHanSv.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTable = [];
      let detail = res.data;
      this.dataTableReq = detail.ctRes?.ctietList;
      if (this.dataTableReq && this.dataTableReq.length > 0) {
        this.dataTableReq = this.dataTableReq.filter(item => item.maDvi == this.userInfo.MA_DVI);
      }
      this.convertListToTree();
    }
  }

  checkCbVu() {
    if(this.formData.value.trangThai == STATUS.DA_DUYET_LDC && this.userService.isCuc()){
      return true;
    }
    return false;
  }
}

