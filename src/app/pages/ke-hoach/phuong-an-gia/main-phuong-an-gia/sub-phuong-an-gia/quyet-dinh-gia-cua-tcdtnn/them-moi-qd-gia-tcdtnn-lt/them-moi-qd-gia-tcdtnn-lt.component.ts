import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from "src/app/constants/status";
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {
  TongHopPhuongAnGiaService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import { chain } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { DonviService } from "../../../../../../../services/donvi.service";
import { DialogPagQdTcdtnnComponent } from "../dialog-pag-qd-tcdtnn/dialog-pag-qd-tcdtnn.component";

@Component({
  selector: 'app-them-moi-qd-gia-tcdtnn-lt',
  templateUrl: './them-moi-qd-gia-tcdtnn-lt.component.html',
  styleUrls: ['./them-moi-qd-gia-tcdtnn-lt.component.scss']
})
export class ThemMoiQdGiaTcdtnnLtComponent implements OnInit {
  @Input("type") type: string;
  @Input("pagType") pagType: string;
  @Input("isView") isView: boolean;
  @Input() idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;
  dsNam: any[] = [];
  userInfo: UserLogin;
  maQd: string;
  dataTable: any[] = [];
  dataTableView: any[] = [];
  fileDinhKem: any[] = [];
  STATUS = STATUS;
  expandSet = new Set<number>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public donViService: DonviService,
    public globals: Globals,
    private helperService: HelperService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private danhMucService: DanhMucService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get("year"), [Validators.required]],
        soQd: [, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        ngayHieuLuc: [null, [Validators.required]],
        soToTrinh: [null],
        soQdCanDc: [null],
        loaiVthh: [null],
        tenLoaiVthh: [null],
        loaiDeXuat: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        loaiGia: [null],
        tenLoaiGia: [null],
        tchuanCluong: [null],
        trichYeu: [null],
        trangThai: ["00"],
        ghiChu: [null],
        thongTinGia: [null]
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.loadDsNam();
    this.maQd = "/QĐ-TCDT"
    this.getDataDetail(this.idInput)
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaTCDTNNService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd ? data.soQd.split("/")[0] : '',
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        tenLoaiGia: data.tenLoaiGia,
        tchuanCluong: data.tchuanCluong,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.noiDung,
        soToTrinh: data.soToTrinh,
        loaiDeXuat: data.loaiDeXuat,
      });
      this.dataTable = data.thongTinGiaLt;
      this.buildTreePagCt();
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
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
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
          };
          let res =
            await this.quyetDinhGiaTCDTNNService.approve(
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
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  setValidator(isGuiDuyet) {
    this.formData.controls["namKeHoach"].setValidators([Validators.required]);
    this.formData.controls["soQd"].setValidators([Validators.required]);
    this.formData.controls["soToTrinh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiGia"].setValidators([Validators.required]);
    if (isGuiDuyet) {
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["ngayHieuLuc"].setValidators([Validators.required]);
    }
  }

  async save(isBanHanh?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    this.setValidator(isBanHanh);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    this.convertTreeToList();
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.pagType = this.pagType;
    body.thongTinGiaLt = this.dataTable;
    body.fileDinhKemReq = this.fileDinhKem;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhGiaTCDTNNService.update(body);
    } else {
      res = await this.quyetDinhGiaTCDTNNService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
      }
      if (!isBanHanh) {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  buildTreePagCt() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTableView = chain(this.dataTable)
        .groupBy("maDvi")
        .map((value, key) => {
          return {
            idVirtual: uuidv4(),
            tenVungMien: value && value[0] && value[0].tenVungMien ? value[0].tenVungMien : null,
            tenDvi: value && value[0] && value[0].tenDvi ? value[0].tenDvi : null,
            soDx: value && value[0] && value[0].soDx ? value[0].soDx : null,
            children: value,
            apDungTatCa: value && value[0] && value[0].apDungTatCa ? value[0].apDungTatCa : null,
            vat: value && value[0] && value[0].vat ? value[0].vat : null,
            giaQdBtc: value && value[0] && value[0].giaQdBtc ? value[0].giaQdBtc : null,
            giaQdTcdt: value && value[0] && value[0].giaQdTcdt ? value[0].giaQdTcdt : null,
          };
        }).value();
    }
    this.expandAll()
  }

  convertTreeToList() {
    if (this.dataTableView && this.dataTableView.length > 0) {
      this.dataTable = [];
      this.dataTableView.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            if (child.apDungTatCa) {
              child.giaQdTcdt = item.giaQdTcdt;
              if (child.vat && (this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03')) {
                child.giaQdTcdtVat = child.giaQdTcdt + child.giaQdTcdt * child.vat
              }
            }
            this.dataTable.push(child);
          })
        }
      })
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandAll() {
    if (this.dataTableView && this.dataTableView.length > 0) {
      this.dataTableView.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  openDialogToTrinh() {
    if (!this.isView) {
      let modalQD = this.modal.create({
        nzTitle: 'CHỌN SỐ TỜ TRÌNH HỒ SƠ PHƯƠNG ÁN GIÁ HOẶC SỐ TỜ TRÌNH ĐỀ XUẤT ĐIỀU CHỈNH GIÁ',
        nzContent: DialogPagQdTcdtnnComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1200px',
        nzFooter: null,
        nzComponentParams: {
          type: this.type,
          namKeHoach: this.formData.value.namKeHoach,
          pagType: this.pagType,
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          let chiTietToTrinh = data.data;
          if (data.formData && data.formData.loaiQd == '00') {
            if (chiTietToTrinh) {
              this.formData.patchValue({
                loaiDeXuat: data.formData.loaiQd,
                loaiVthh: chiTietToTrinh.loaiVthh ? chiTietToTrinh.loaiVthh : null,
                cloaiVthh: chiTietToTrinh.cloaiVthh ? chiTietToTrinh.cloaiVthh : null,
                tenLoaiVthh: chiTietToTrinh.tenLoaiVthh ? chiTietToTrinh.tenLoaiVthh : null,
                tenCloaiVthh: chiTietToTrinh.tenCloaiVthh ? chiTietToTrinh.tenCloaiVthh : null,
                loaiGia: chiTietToTrinh.loaiGia ? chiTietToTrinh.loaiGia : null,
                tenLoaiGia: chiTietToTrinh.tenLoaiGia ? chiTietToTrinh.tenLoaiGia : null,
                soToTrinh: chiTietToTrinh.soToTrinh ? chiTietToTrinh.soToTrinh : null,
                tchuanCluong: chiTietToTrinh.tchuanCluong ? chiTietToTrinh.tchuanCluong : null,
              })
              this.dataTable = chiTietToTrinh && chiTietToTrinh.pagChiTiets ? chiTietToTrinh.pagChiTiets : [];
            }
            this.buildTreePagCt();
          } else {
            let thRes = data.listDx;
            let body = {
              namTongHop: this.formData.value.namKeHoach,
              loaiVthh: data.formData.loaiVthh ? data.formData.loaiVthh : null,
              cloaiVthh: data.formData.cloaiVthh ? data.formData.cloaiVthh : null,
              loaiGia: data.formData.loaiGia ? data.formData.loaiGia : null,
              listIdPag: thRes && thRes.length > 0 ? thRes.map(item => item.id) : [],
              loai: "01"
            }
            this.tongHopData(body);
          }
        }
      });
    }
  }

  async tongHopData(body) {
    try {
      this.spinner.show();
      let res = await this.tongHopPhuongAnGiaService.tongHop(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let pagTh = res.data;
        if (pagTh) {
          this.formData.patchValue({
            loaiVthh: pagTh.loaiVthh ? pagTh.loaiVthh : null,
            cloaiVthh: pagTh.cloaiVthh ? pagTh.cloaiVthh : null,
            tenLoaiVthh: pagTh.tenLoaiVthh ? pagTh.tenLoaiVthh : null,
            tenCloaiVthh: pagTh.tenCloaiVthh ? pagTh.tenCloaiVthh : null,
            loaiGia: pagTh.loaiGia ? pagTh.loaiGia : null,
            tenLoaiGia: pagTh.tenLoaiGia ? pagTh.tenLoaiGia : null
          })
          this.dataTable = res.data?.pagChiTiets;
          this.buildTreePagCt();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }



}
