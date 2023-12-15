import {chain, cloneDeep} from "lodash";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {v4 as uuidv4} from "uuid";
import { saveAs } from 'file-saver';
import {UserLogin} from "../../../../../../models/userlogin";
import {KeHoachXayDungTrungHan} from "../../../../../../models/QuyHoachVaKeHoachKhoTang";
import {STATUS} from "../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {KtTongHopXdHnService} from "../../../../../../services/kt-tong-hop-xd-hn.service";
import {
  DialogThemMoiDxkhthComponent
} from "../../../ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component";
import {KtQdXdHangNamService} from "../../../../../../services/kt-qd-xd-hang-nam.service";

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
  dataTableList: any[] = [];
  dataTableReq: any[] = [];
  dataTableDx: any[] = [];
  dataTableDxList: any[] = [];
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
  idTongHop: number;
  quyetDinh = false;
  hidden = false;
  @Output() tabFocus = new EventEmitter<object>();
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
    private helperService: HelperService,
    private quyetDinhService: KtQdXdHangNamService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      loaiDuAn: [null],
      namBatDau: [null],
      namKetThuc: [null],
      ngayTaoTt: [dayjs().format('YYYY-MM-DD')],
      tgTongHop: [null],
      namKeHoach: [dayjs().year()],
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
      let res = await this.tongHopDxXdTh.getDetail(id);
      const data = res.data;
      this.maTt = data.maToTrinh ? "/" + data.maToTrinh.split("/")[1] : null,
        this.soQd = data.soQuyetDinh ? "/" + data.soQuyetDinh.split("/")[1] : null,
        this.formData.patchValue({
          id: data.id,
          namBatDau: data.namBatDau,
          namKeHoach: data.namKeHoach,
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
      let body = {
        maDvi: this.userInfo.MA_DVI,
        soTt : data.soQuyetDinh,
        paggingReq: {
          "limit": 999,
          "page": 0
        }
      };
      let dataQd = await this.quyetDinhService.search(body);
      if (dataQd.data.content && dataQd.data.content.length>0){
        this.hidden = !this.hidden;
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
      this.formData.controls["namKeHoach"].setValidators([Validators.required]);
    }
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) {
      this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    }
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    if (isGuiDuyet ) {
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
            case STATUS.TU_CHOI_LDV :
            case STATUS.TU_CHOI_LDTC :
            case STATUS.DU_THAO : {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV : {
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
          this.dataTableDx.forEach(item => {
            item.tgKcHt = item.tgKhoiCong + " - " + item.tgHoanThanh;
          });
          this.dataTableDxList = this.dataTableDx;
          this.dataTableDx = this.convertListData(this.dataTableDx);
          this.expandAll(this.dataTableDx);
        }
      }

      // phg án tổng cục
      this.dataTable = this.dataTableReq.filter(data => data.soCv == item.soCongVan);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => {
          item.tgKcHt = item.tgKhoiCong + " - " + item.tgHoanThanh;
        });
        this.dataTableList = this.dataTable;
        this.dataTable = this.convertListData(this.dataTable);
        this.expandAll(this.dataTable);
      }
    }
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

  convertListData(table: any[]) {
    if (table && table.length > 0) {
      table = chain(table)
        .groupBy("tenChiCuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenKhoi")
            .map((v, k) => {
                return {
                  idVirtual: uuidv4(),
                  tenKhoi: k,
                  dataChild: v
                };
              }
            ).value();
          return {
            idVirtual: uuidv4(),
            tenChiCuc: key,
            dataChild: rs
          };
        }).value();
    }
    return table;
  }


  sumSoLuong(tenChiCuc: string, row: string, khoi: string,type?: any) {
    let sl = 0;
    let sumList :any[];
    let itemSelected = this.listDx.find(item => item.selected == true);
    if (itemSelected) {
      if (type===true){
        sumList = this.dataTableList.filter(item => item.soCv == itemSelected.soCongVan)
      }else {
        sumList = this.dataTableDxList.filter(item => item.soCv == itemSelected.soCongVan)
      }
    }
    if (tenChiCuc && khoi) {
      let arr = sumList.filter(item => item.tenChiCuc == tenChiCuc && item.khoi == khoi);
      if (arr && arr.length > 0) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      const sum = sumList.reduce((prev, cur) => {
        prev += cur[row];
        return prev;
      }, 0);
      sl = sum;
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

  themMoiItem(data: any, type: string, idx: number, list?: any) {
    let modalQD = this.modal.create({
      nzTitle: "Chỉnh sửa chi tiết kế hoạch",
      nzContent: DialogThemMoiDxkhthComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1200px",
      nzStyle: {top: "200px"},
      nzFooter: null,
      nzComponentParams: {
        dataInput: data,
        type: type,
        page: "DXTH"
      }
    });
    modalQD.afterClose.subscribe(async (detail) => {
      if (detail && list) {
        Object.assign(list[idx], detail);
      }
    });
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }
  openQdPheDuyet(id, b: boolean) {
    this.idTongHop=id
    this.quyetDinh = !this.quyetDinh;
    this.emitTab({tab: "qdpd", id: this.idTongHop,quyetDinh:this.quyetDinh});
  }

  exportDetailDx($event: MouseEvent) {
    $event.stopPropagation()
    if (this.dataTableDxList.length > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.ctiets = this.dataTableDxList;
        body.title = "TỔNG HỢP PHƯƠNG ÁN ĐỀ XUẤT KẾ HOẠCH ĐẦU TƯ XÂY DỰNG KHO TÀNG DTQG HÀNG NĂM - ĐỀ XUẤT CỦA CÁC CỤC"
        this.tongHopDxXdTh
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-dx.xlsx'),
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

  exportDetail($event: MouseEvent) {
    $event.stopPropagation()
    if (this.dataTableList.length > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.ctiets = this.dataTableList;
        body.title = "TỔNG HỢP PHƯƠNG ÁN ĐỀ XUẤT KẾ HOẠCH ĐẦU TƯ XÂY DỰNG KHO TÀNG DTQG HÀNG NĂM - PHƯƠNG ÁN CỦA TỔNG CỤC"
        this.tongHopDxXdTh
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-tong-hop.xlsx'),
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
