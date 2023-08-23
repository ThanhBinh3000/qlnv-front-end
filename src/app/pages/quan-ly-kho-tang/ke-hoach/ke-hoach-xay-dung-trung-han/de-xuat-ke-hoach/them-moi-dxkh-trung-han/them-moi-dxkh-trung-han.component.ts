import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {UserLogin} from "../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../constants/message";
import {DxXdTrungHanService} from "../../../../../../services/dx-xd-trung-han.service";
import {STATUS} from "../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {DanhMucKhoService} from "../../../../../../services/danh-muc-kho.service";
import {DanhMucKho} from "../../../dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import {DialogThemMoiDxkhthComponent} from "./dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component";

@Component({
  selector: "app-them-moi-dxkh-trung-han",
  templateUrl: "./them-moi-dxkh-trung-han.component.html",
  styleUrls: ["./them-moi-dxkh-trung-han.component.scss"]
})
export class ThemMoiDxkhTrungHanComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  userInfo: UserLogin;
  maQd: string;
  expandSet = new Set<number>();

  STATUS = STATUS;
  dataTable: any[] = [];
  dataTableRes: any[] = [];
  rowItem: DanhMucKho = new DanhMucKho();
  rowItemCha: DanhMucKho = new DanhMucKho();
  listNam: any[] = [];
  listFileDinhKem: any[] = [];
  listKhoi: any[] = [];


  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private dmKhoService: DanhMucKhoService,
    private dxTrungHanService: DxXdTrungHanService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      maDvi: [null],
      namKeHoach: [dayjs().get("year"), [Validators.required]],
      tenDvi: [null],
      soCongVan: ['', [Validators.required]],
      ngayTaoDx: [null],
      ngayDuyet: [null],
      namBatDau: [null],
      namKetThuc: [null],
      trichYeu: [null],
      lyDo: [null]
    });

  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if (!this.idInput) {
      this.maQd = "/" + this.userInfo.DON_VI.tenVietTat + "-TCKT";
    }
    this.loadDsNam();
    await this.getDsKhoi();
    if (this.idInput > 0) {
      await this.getDataDetail(this.idInput);
    } else {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_DVI
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

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
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

  quayLai() {
    this.showListEvent.emit();
  }

  xoaItem(index: number) {
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
          this.dataTable.splice(index, 1);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  setValidators() {
    this.formData.controls["trichYeu"].setValidators(Validators.required);
    this.formData.controls["namBatDau"].setValidators(Validators.required);
    this.formData.controls["namKetThuc"].setValidators(Validators.required);
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      this.formData.controls["ngayTaoDx"].setValidators(Validators.required);
    }
    if (this.formData.value.trangThai == STATUS.DA_DUYET_LDC) {
      this.formData.controls["ngayDuyet"].setValidators(Validators.required);
    }
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    this.formData.controls["soCongVan"].setValidators(Validators.required);
    if (isGuiDuyet || this.idInput > 0) {
      this.setValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    this.conVertTreToList();
    let body = this.formData.value;
    body.soCongVan = body.soCongVan ? body.soCongVan + this.maQd : this.maQd;
    body.chiTietsReq = this.dataTableRes;
    body.maDvi = this.userService.isCuc() ? this.userInfo.MA_DVI : this.formData.value.maDvi;
    body.tmdt = this.sumSoLuong(null, "tmdtDuKien", true);
    body.fileDinhKems = this.listFileDinhKem;
    let res;
    if (this.idInput > 0) {
      res = await this.dxTrungHanService.update(body);
    } else {
      res = await this.dxTrungHanService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        });
        if (this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.CHO_DUYET_TP) {
          this.duyet()
        } else {
          this.guiDuyet();
        }
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.idInput = res.data.id;
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai
          });
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "Từ chối",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1000px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
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
          let body = {
            id: this.formData.value.id,
            lyDo: text,
            trangThai: trangThai
          };
          const res = await this.dxTrungHanService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  duyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
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
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.dxTrungHanService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO :
            case STATUS.TU_CHOI_TP :
            case STATUS.TU_CHOI_CBV : {
              trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.TU_CHOI_LDC : {
              trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.dxTrungHanService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.GUI_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.dxTrungHanService.getDetail(id);
      const data = res.data;
      this.maQd = data.soCongVan ? "/" + data.soCongVan.split("/")[1] : "",
        this.formData.patchValue({
          id: data.id,
          maDvi: data.maDvi,
          tenDvi: data.tenDvi,
          trangThai: data.trangThai,
          trichYeu: data.trichYeu,
          tenTrangThai: data.tenTrangThai,
          soCongVan: data.soCongVan ? data.soCongVan.split("/")[0] : "",
          ngayTaoDx: data.ngayTaoDx,
          ngayDuyet: data.ngayDuyet,
          namBatDau: data.namBatDau,
          namKetThuc: data.namKetThuc,
          lyDo: data.lyDoTuChoi
        });
      this.listFileDinhKem = data.fileDinhKems;
      this.dataTable = data.chiTiets;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => {
          item.tgKcHt = item.tgKhoiCong + " - " + item.tgHoanThanh;
        });
      }
      this.convertListData();
    }
  }

  async getDsKhoi() {
    let res = await this.danhMucService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }


  themMoiItem(data: any, type: string, idx: number, list?: any) {
      let modalQD = this.modal.create({
        nzTitle: type == "them" ? "Thêm mới chi tiết kế hoạch " : "Chỉnh sửa chi tiết kế hoạch",
        nzContent: DialogThemMoiDxkhthComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "1200px",
        nzStyle: {top: "200px"},
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          page: "DXTH"
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

  themItemcha() {
    if (!this.rowItemCha.khoi) {
      this.notification.error(MESSAGE.ERROR, "Không được để trống danh mục khối");
      return;
    }
    if (this.checkExitsData(this.rowItemCha, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
      return;
    }
    this.rowItemCha.idVirtual = uuidv4();
    this.dataTable.push(this.rowItemCha);
    this.rowItemCha = new DanhMucKho();
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

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy("tenKhoi").map((value, key) => ({
          tenKhoi: key,
          dataChild: value,
          idVirtual: uuidv4()
        })
      ).value();
    }
    this.expandAll();
  }

  changeKhoi(event) {
    if (event) {
      let result = this.listKhoi.filter(item => item.ma == event);
      if (result && result.length > 0) {
        this.rowItemCha.tenKhoi =  result[0].giaTri
      }
    }
  }

}
