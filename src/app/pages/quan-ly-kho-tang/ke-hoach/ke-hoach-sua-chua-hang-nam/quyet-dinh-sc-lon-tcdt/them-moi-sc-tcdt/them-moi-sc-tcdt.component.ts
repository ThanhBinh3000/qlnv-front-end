import { cloneDeep } from "lodash";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { UserService } from "../../../../../../services/user.service";
import { Globals } from "../../../../../../shared/globals";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd/modal";
import { HelperService } from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import { MESSAGE } from "../../../../../../constants/message";
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { UserLogin } from "../../../../../../models/userlogin";
import { STATUS } from "../../../../../../constants/status";
import { DialogTuChoiComponent } from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  TongHopDxScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {
  DialogDxScLonComponent
} from "../../de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";

@Component({
  selector: "app-them-moi-sc-tcdt",
  templateUrl: "./them-moi-sc-tcdt.component.html",
  styleUrls: ["./them-moi-sc-tcdt.component.scss"]
})
export class ThemMoiScTcdtComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSet = new Set<number>();
  userInfo: UserLogin;
  formData: FormGroup;
  dataTableTren: any[] = [];
  dataTableDuoi: any[] = [];
  dataTableReq: any[] = [];
  dataTableDxReq: any[] = [];
  dataTableDxTren: any[] = [];
  dataTableDxDuoi: any[] = [];
  dataTableDxAll: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  isTongHop: boolean = false;
  listNam: any[] = [];
  fileDinhKems: any[] = [];
  canCuPhapLys: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS;
  maTt: string;
  soQd: string;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxScLon: TongHopDxScLonService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      ngayTaoTt: [null],
      tgTongHop: [null],
      namKeHoach: [null],
      noiDung: [null],
      maToTrinh: [null],
      soQuyetDinh: [null],
      ngayKyQd: [null],
      trangThai: ["78"],
      tenTrangThai: ["Đang nhập dữ liệu"],
      lyDoTuChoi: [],
      loaiTmdt: ['DUOI15TY']
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if (!this.idInput) {
      this.maTt = "/" + this.userInfo.MA_TR;
      this.soQd = "/" + this.userInfo.MA_QD;
    }
    this.loadDsNam();
    await this.getDataDetail(this.idInput);
    await this.getAllLoaiDuAn();
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.isTongHop = true;
      let res = await this.tongHopDxScLon.getDetail(id);
      const data = res.data;
      this.maTt = data.maToTrinh ? "/" + data.maToTrinh.split("/")[1] : null,
        this.soQd = data.soQuyetDinh ? "/" + data.soQuyetDinh.split("/")[1] : null,
        this.formData.patchValue({
          id: data.id,
          namBatDau: data.namBatDau,
          namKetThuc: data.namKetThuc,
          ngayTaoTt: data.ngayTaoTt,
          ngayKyQd: data.ngayKyQd,
          noiDung: data.noiDung,
          maToTrinh: data.maToTrinh ? data.maToTrinh.split("/")[0] : null,
          soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split("/")[0] : null,
          trangThai: data.trangThai,
          tenTrangThai: data.tenTrangThai,
          lyDoTuChoi: data.lyDoTuChoi,
          loaiDuAn: data.loaiDuAn,
          tgTongHop: data.tgTongHop,
          loaiTmdt : data.loaiTmdt
        });
      this.fileDinhKems = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;

      this.dataTableReq = data.chiTiets;
      let resultDx = data.chiTietDxs
      if (resultDx && resultDx.length > 0) {
        this.dataTableDxDuoi = this.convertListData(resultDx?.filter(item => item.tmdt <= 15000000000));
        this.dataTableDxTren = this.convertListData(resultDx?.filter(item => item.tmdt > 15000000000));
      }
      this.dataTableTren = this.convertListData(this.dataTableReq?.filter(item => item.tmdt > 15000000000));
      this.dataTableDuoi= this.convertListData(this.dataTableReq?.filter(item => item.tmdt <= 15000000000));
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }

  setValidators() {
    this.helperService.removeValidators(this.formData);
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV) {
      this.formData.controls["maToTrinh"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoTt"].setValidators([Validators.required]);
    }
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) {
      this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    }
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    if (isGuiDuyet && this.idInput > 0) {
      this.setValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.tgTongHop = body.tgTongHop ? dayjs(body.tgTongHop) : null;
    body.maToTrinh = body.maToTrinh ? body.maToTrinh + this.maTt : this.maTt;
    body.soQuyetDinh = body.soQuyetDinh ? body.soQuyetDinh + this.soQd : this.soQd;
    body.ctiets = this.dataTableReq;
    body.ctietsDx = this.dataTableDxReq;
    body.fileDinhKems = this.fileDinhKems;
    body.canCuPhapLys = this.canCuPhapLys;
    body.maDvi = this.userInfo.MA_DVI;
    let res;
    if (this.idInput > 0) {
      res = await this.tongHopDxScLon.update(body);
    } else {
      res = await this.tongHopDxScLon.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        });
        this.guiDuyet();
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


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? "Bạn có chắc chắn muốn duyệt?" : "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DANG_NHAP_DU_LIEU : {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.TU_CHOI_LDV : {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV : {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.TU_CHOI_LDTC : {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.CHO_DUYET_LDTC : {
              trangThai = STATUS.DA_DUYET_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.tongHopDxScLon.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? MESSAGE.PHE_DUYET_SUCCESS : MESSAGE.GUI_DUYET_SUCCESS);
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


  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "Từ chối",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.TU_CHOI_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: trangThai
          };
          const res = await this.tongHopDxScLon.approve(body);
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

  async tongHop() {
    this.spinner.show();
    this.formData.patchValue({
      tgTongHop: new Date(),
      loaiTmdt: this.formData.value.loaiTmdt ? this.formData.value.loaiTmdt : "ALL"
    });
    let body = {
      "namKeHoach": this.formData.value.namKeHoach,
      "loaiTmdt": this.formData.value.loaiTmdt
    };
    let res = await this.tongHopDxScLon.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTableReq = [];
      this.dataTableTren = [];
      this.dataTableDuoi = [];
      this.dataTableDxTren = [];
      this.dataTableDxDuoi = [];
      let list = res.data;
      if (list && list.listDxCuc.length > 0) {
        this.isTongHop = true;
        this.dataTableReq = list.listDxCuc;
        this.dataTableDxReq = cloneDeep(this.dataTableReq);
        this.dataTableDxDuoi = this.convertListData(this.dataTableReq?.filter(item => item.tmdt <= 15000000000));
        this.dataTableDxTren = this.convertListData(this.dataTableReq?.filter(item => item.tmdt > 15000000000));
        this.dataTableTren = cloneDeep(this.dataTableDxTren);
        this.dataTableDuoi= cloneDeep(this.dataTableDxDuoi);
      } else {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu!");
        this.isTongHop = false;
        this.spinner.hide();
        return;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
          });
        }
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

  convertListData(table: any[]): any[] {
    let arr = [];
    if (table && table.length > 0) {
      arr = chain(table)
        .groupBy("tenCuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenChiCuc")
            .map((v, k) => {
              let rs1 = chain(v)
                .groupBy("tenKhoi")
                .map((v1, k1) => {
                    return {
                      idVirtual: uuidv4(),
                      tenKhoi: k1,
                      dataChild: v1
                    };
                  }
                ).value();
              return {
                idVirtual: uuidv4(),
                tenChiCuc: k,
                dataChild: rs1
              };
            }).value();
          return {
            idVirtual: uuidv4(),
            tenCuc: key,
            dataChild: rs
          };
        }).value();
    }
    return arr;
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
      if (this.dataTableTren && this.dataTableTren.length > 0) {
        let sum = 0;
        this.dataTableTren.forEach(item => {
          sum += this.sumSoLuong(item, row);
        });
        sl = sum;
      }
    }
    return sl;
  }

  deleteRow(item: any) {
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
          let result = this.dataTableReq.filter(data => data.id == item.id);
          if (result && result.length > 0) {
            let idx = this.dataTableReq.indexOf(result[0]);
            this.dataTableReq.splice(idx, 1);
            this.notification.success(MESSAGE.SUCCESS, "Xóa thành công");
          } else {
            this.notification.error(MESSAGE.ERROR, "Xóa thất bại");
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  themMoiItem(data: any, tmdt: string, type: string, idx: number, list?: any) {
      let modalQD = this.modal.create({
        nzTitle: "CHI TIẾT DANH MỤC SỬA CHỮA LỚN",
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
        }
      });
  }
  deleteItem(index: any, y: any, table : any[]) {
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
          if (table && table.length > 0 && table[index]) {
            if (table[index] && table[index].dataChild && table[index].dataChild[y]) {
              table[index].dataChild.splice(y, 1);
            }
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

}
