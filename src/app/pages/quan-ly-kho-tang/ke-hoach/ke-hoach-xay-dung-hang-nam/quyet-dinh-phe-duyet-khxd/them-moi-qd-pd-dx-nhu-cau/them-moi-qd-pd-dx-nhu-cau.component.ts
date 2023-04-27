import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThongTinQuyetDinh } from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { UserService } from "../../../../../../services/user.service";
import { Globals } from "../../../../../../shared/globals";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { HelperService } from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  DialogQdXdTrungHanComponent
} from "../../../../../../components/dialog/dialog-qd-xd-trung-han/dialog-qd-xd-trung-han.component";
import { QuyetDinhKhTrungHanService } from "../../../../../../services/quyet-dinh-kh-trung-han.service";
import { MESSAGE } from "../../../../../../constants/message";
import { STATUS } from "../../../../../../constants/status";
import { UserLogin } from "../../../../../../models/userlogin";
import { TongHopKhTrungHanService } from "../../../../../../services/tong-hop-kh-trung-han.service";
import { KtQdXdHangNamService } from "../../../../../../services/kt-qd-xd-hang-nam.service";
import { KtTongHopXdHnService } from "../../../../../../services/kt-tong-hop-xd-hn.service";


@Component({
  selector: 'app-them-moi-qd-pd-dx-nhu-cau',
  templateUrl: './them-moi-qd-pd-dx-nhu-cau.component.html',
  styleUrls: ['./them-moi-qd-pd-dx-nhu-cau.component.scss']
})
export class ThemMoiQdPdDxNhuCauComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  maQd: string;
  listDx: any[] = [];
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  expandSet = new Set<number>();
  listToTrinh: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  fileDinhKems: any[] = [];
  canCuPhapLys: any[] = [];
  listNam: any[] = [];
  userInfo: UserLogin;

  STATUS = STATUS;
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
    private quyetDinhService:    KtQdXdHangNamService,
  private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKeHoach: [dayjs().get("year")],
      soQuyetDinh: [null],
      ngayTrinhBtc: [null],
      ngayKyBtc: [null],
      ngayHieuLuc: [null],
      phuongAnTc: [null, Validators.required],
      namBatDau: [null],
      namKetThuc: [null],
      loaiDuAn: [null],
      trichYeu: [null],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"]
    });
  }

  async getListTt() {
    let result = await this.quyetDinhService.getListToTrinh();
    if (result.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = result.data;
    }
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/QĐ-BTC";
    this.loadDsNam();
    await this.getDetail(this.idInput);
  }

  async getDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        phuongAnTc: data.phuongAnTc,
        soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split("/")[0] : null,
        ngayTrinhBtc: data.ngayTrinhBtc,
        ngayKyBtc: data.ngayKyBtc,
        ngayHieuLuc: data.ngayKyBtc,
        trichYeu: data.trichYeu,
        namBatDau: data.namBatDau,
        namKetThuc: data.namKetThuc,
        loaiDuAn: data.loaiDuAn,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai
      });
      this.fileDinhKems = data.fileDinhKems;
      let listDx = data.ctRes;
      if (listDx) {
        this.dataTableReq = listDx.ctietList;
        this.listDx = listDx.dtlList;
        if (this.listDx && this.listDx.length > 0) {
          this.selectRow(this.listDx[0]);
        }
      }
    }
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
    this.formData.controls["phuongAnTc"].setValidators([Validators.required]);
    if (isGuiDuyet || this.idInput > 0) {
      this.setValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.ctiets = this.dataTableReq;
    body.fileDinhKems = this.fileDinhKems;
    body.canCuPhapLys = this.canCuPhapLys;
    body.maDvi = this.userInfo.MA_DVI;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhService.update(body);
    } else {
      res = await this.quyetDinhService.create(body);
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
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai
          });
          this.idInput = res.data.id;
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  setValidators() {
    this.formData.controls["ngayKyBtc"].setValidators([Validators.required]);
    this.formData.controls["namKeHoach"].setValidators([Validators.required]);
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn ban hành?",
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
              trangThai = STATUS.BAN_HANH;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.quyetDinhService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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

  async openDialogToTrinh() {
    if (!this.isViewDetail) {
      await this.getListTt();
      const modal = this.modal.create({
        nzTitle: "Danh sách Phương án của Tổng cục",
        nzContent: DialogQdXdTrungHanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "900px",
        nzFooter: null,
        nzComponentParams: {
          type: "QDTH",
          dsPhuongAn: this.listToTrinh
        }
      });
      modal.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            phuongAnTc: data.soQuyetDinh,
          });
          await this.loadDsChiTiet(data.id);
        }
      });
    }
  }

  async loadDsChiTiet(id: number) {
    let res = await this.tongHopDxXdTh.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      let detailTh = res.data;
      this.listDx = detailTh.listDx.dtlList;
      this.dataTableReq = detailTh.listDx.ctietList;
      if (this.listDx.length > 0) {
        this.selectRow(this.listDx[0]);
      }
    }
  }

  selectRow(item: any) {
    if (!item.selected) {
      this.dataTable = [];
      this.listDx.forEach(item => {
        item.selected = false;
      });
      item.selected = true;

      // phg án tổng cục
      this.dataTable = this.dataTableReq.filter(data => data.soCv == item.soCongVan);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable = this.convertListData(this.dataTable);
        this.expandAll(this.dataTable);
      }
    }
  }

  convertListData(table: any[]) {
    if (table && table.length > 0) {
      table = chain(table)
        .groupBy("tenChiCuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("khoi")
            .map((v, k) => {
                return {
                  idVirtual: uuidv4(),
                  khoi: k,
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

  sumSoLuong(tenChiCuc: string, row: string, khoi: string) {
    let sl = 0;
    if (tenChiCuc && khoi) {
      let arr = this.dataTableReq.filter(item => item.tenChiCuc == tenChiCuc && item.khoi == khoi);
      if (arr && arr.length > 0) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      const sum = this.dataTableReq.reduce((prev, cur) => {
        prev += cur[row];
        return prev;
      }, 0);
      sl = sum;
    }
    return sl;
  }

  editRow(idx, y, y1, item) {
    this.isEdit = idx + "-" + y + "-" + y1;
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



