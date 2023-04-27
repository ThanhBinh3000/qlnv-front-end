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
import { TongHopKhTrungHanService } from "../../../../../../services/tong-hop-kh-trung-han.service";
import { UserLogin } from "../../../../../../models/userlogin";
import { KeHoachXayDungTrungHan } from "../../../../../../models/QuyHoachVaKeHoachKhoTang";
import { STATUS } from "../../../../../../constants/status";
import { DialogTuChoiComponent } from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import { KtTongHopXdHnService } from "../../../../../../services/kt-tong-hop-xd-hn.service";

@Component({
  selector: 'app-them-moi-tong-hop-dx-nhu-cau',
  templateUrl: './them-moi-tong-hop-dx-nhu-cau.component.html',
  styleUrls: ['./them-moi-tong-hop-dx-nhu-cau.component.scss']
})
export class ThemMoiTongHopDxNhuCauComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSet = new Set<number>();
  userInfo: UserLogin;
  formData: FormGroup;
  listDx: any[] = [];
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  dataTableDx: any[] = [];
  dataTableDxAll: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: KeHoachXayDungTrungHan = new KeHoachXayDungTrungHan();
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachXayDungTrungHan } } = {};
  isTongHop: boolean = false;
  listNam: any[] = [];
  fileDinhKems: any[] = [];
  canCuPhapLys: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS;
  maTt: string;
  soQd: string;
  isEdit: string = "";

  vonDauTu: number;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxXdTh: KtTongHopXdHnService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      loaiDuAn: [null],
      namBatDau: [null],
      namKetThuc: [null],
      ngayTaoTt: [null],
      tgTongHop: [null],
      namKeHoach: [dayjs().get("year")],
      noiDung: [null],
      maToTrinh: [null],
      soQuyetDinh: [null],
      ngayKyQd: [null],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      lyDoTuChoi: []
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if(!this.idInput) {
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
      let res = await this.tongHopDxXdTh.getDetail(id);
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
        tgTongHop: data.tgTongHop
      });
      this.dataTableReq = data.ctiets;
      this.fileDinhKems = data.fileDinhKems;
      this.canCuPhapLys = data.canCuPhapLys;
      let listDx = data.listDx;
      if (listDx) {
        this.dataTableDxAll = listDx.ctietList;
        this.listDx = listDx.dtlList;
        if (this.listDx && this.listDx.length > 0) {
          this.selectRow(this.listDx[0]);
        }
      }
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }

  setValidators() {
    this.helperService.removeValidators(this.formData)
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
    body.maToTrinh =  body.maToTrinh ?   body.maToTrinh + this.maTt : this.maTt;
    body.soQuyetDinh = body.soQuyetDinh ?  body.soQuyetDinh + this.soQd : this.soQd;
    body.ctiets = this.dataTableReq;
    body.fileDinhKems = this.fileDinhKems;
    body.canCuPhapLys = this.canCuPhapLys;
    body.maDvi = this.userInfo.MA_DVI;
    let res;
    if (this.idInput > 0) {
      res = await this.tongHopDxXdTh.update(body);
    } else {
      res = await this.tongHopDxXdTh.create(body);
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
      nzContent: (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? "Bạn có chắc chắn muốn duyệt?" :  "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO : {
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
            await this.tongHopDxXdTh.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? MESSAGE.PHE_DUYET_SUCCESS :  MESSAGE.GUI_DUYET_SUCCESS);
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
          const res = await this.tongHopDxXdTh.approve(body);
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
      tgTongHop: new Date()
    });
    let body = {
      "loaiDuAn": this.formData.value.loaiDuAn,
      "namBatDau": this.formData.value.namBatDau,
      "namKeHoach": this.formData.value.namKeHoach,
      "namKetThuc": this.formData.value.namKetThuc
    };
    let res = await this.tongHopDxXdTh.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDx = [];
      this.dataTableDxAll = [];
      this.dataTableReq = [];
      this.dataTableDx = [];
      this.dataTable = [];
      let list = res.data;
      if (list && list.dtlList.length > 0) {
        this.isTongHop = true;
        this.listDx = list.dtlList;
        this.dataTableDxAll = list.ctietList;
        this.dataTableReq = cloneDeep(this.dataTableDxAll);
        if (this.listDx && this.listDx.length > 0) {
          this.selectRow(this.listDx[0]);
        }
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


  selectRow(item: any) {
    if (!item.selected) {
      this.dataTableDx = [];
      this.dataTable = [];
      this.listDx.forEach(item => {
        item.selected = false;
      });
      item.selected = true;

      // dx cuc
      if (this.dataTableDxAll && this.dataTableDxAll.length > 0) {
        let arr = this.dataTableDxAll.filter(data => data.idType == item.id);
        if (arr && arr.length > 0) {
          this.dataTableDx = arr;
          this.dataTableDx = this.convertListData(this.dataTableDx);
          this.expandAll(this.dataTableDx);
        }
      }

      // phg án tổng cục
      this.dataTable = this.dataTableReq.filter(data => data.soCv == item.soCongVan);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable = this.convertListData(this.dataTable);
        this.expandAll(this.dataTable);
      }
    }
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

  convertListData(table: any[]) {
    if (table && table.length > 0) {
      table = chain(table).groupBy("khoi").map((value, key) => ({
          khoi: key,
          dataChild: value,
          idVirtual: uuidv4()
        })
      ).value();
    }
    return table;
  }

  sumSoLuong(data: any, row: string, table: any[], type?: any) {
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
      if (table && table.length > 0) {
        let sum = 0;
        table.forEach(item => {
          sum += this.sumSoLuong(item, row, table);
        });
        sl = sum;
      }
    }
    return sl;
  }

  editRow(idx, y, item) {
    this.isEdit = idx + "-" + y;
    this.vonDauTu = item.vonDauTu;
  }

  saveEdit(item) {
    this.isEdit = "";
    let list = this.dataTableReq.filter(item => item.maDuAn == item.maDuAn);
    if (list && list.length > 0) {
      let idx = this.dataTableReq.indexOf(list[0]);
      Object.assign(this.dataTableReq[idx], item);
    }
  }

  cancelEdit(data: any) {
    data.vonDauTu = this.vonDauTu;
    this.isEdit = "";
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
            let itemSelected = this.listDx.filter(item => item.selected == true);
            if (itemSelected && itemSelected.length > 0) {
              itemSelected[0].selected = false;
              this.selectRow(itemSelected[0]);
              this.notification.success(MESSAGE.SUCCESS, "Xóa thành công");
            }
          } else {
            this.notification.error(MESSAGE.ERROR, "Xóa thất bại");
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }
}
