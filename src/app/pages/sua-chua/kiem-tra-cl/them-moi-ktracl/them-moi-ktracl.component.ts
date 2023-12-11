import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { BangKeXuatScService } from "../../../../services/sua-chua/bangKeXuatSc.service";
import { PhieuXuatKhoScService } from "../../../../services/sua-chua/phieuXuatKhoSc.service";
import { QuyetDinhXhService } from "../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import * as moment from "moment/moment";
import {
  DialogTableSelectionComponent
} from "../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "../../../../constants/message";
import { STATUS } from "../../../../constants/status";
import { convertTienTobangChu } from "../../../../shared/commonFunction";
import { Base3Component } from "../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import { KiemTraChatLuongScService } from "../../../../services/sua-chua/kiemTraChatLuongSc";
import { DanhMucTieuChuanService } from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { KhCnQuyChuanKyThuat } from 'src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';

@Component({
  selector: 'app-them-moi-ktracl',
  templateUrl: './them-moi-ktracl.component.html',
  styleUrls: ['./them-moi-ktracl.component.scss']
})
export class ThemMoiKtraclComponent extends Base3Component implements OnInit {

  rowItem: any = {};
  optionDanhGia: any[] = ['Đạt', 'Không đạt'];
  listHinhThucBq: any[];
  symbol: string = ''

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private kiemTraChatLuongSc: KiemTraChatLuongScService,
    private phieuXuatKhoScService: PhieuXuatKhoScService,
    private quyetDinhXhService: QuyetDinhXhService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, kiemTraChatLuongSc);
    this.defaultURL = 'sua-chua/kiem-tra-cl';
    this.previewName = 'sc_kiem_tra_chat_luong'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soPhieuKtcl: ['', [Validators.required]],
      ngayLap: ['', [Validators.required]],
      tenNguoiTao: [''],
      tenTruongPhongKtbq: [''],
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      soPhieuXuatKho: ['', [Validators.required]],
      idPhieuXuatKho: ['', [Validators.required]],
      tenDiemKho: ['',],
      tenNhaKho: ['',],
      tenNganKho: ['',],
      tenLoKho: ['',],
      tenThuKho: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      dviKiemDinh: [''],
      ngayKiemDinh: ['', [Validators.required]],
      hinhThucBaoQuan: [''],
      ketQua: [''],
      dat: [''],
      nhanXet: [''],
      lyDoTuChoi: ['']
    });
    this.symbol = '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      this.spinner.show();
      await this.detail(this.id).then((res) => {
        this.spinner.hide();
        if (res) {
          this.dataTable = res.children;
          this.bindingDataQdXuatHang(res.idQdXh);
          this.bindingDataPhieuXuatKho(res.idPhieuXuatKho);
        }
      })
    } else {
      await this.userService.getId("SC_KIEM_TRA_CL_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soPhieuKtcl: res + '/' + this.formData.value.nam + this.symbol,
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayLap: dayjs().format('YYYY-MM-DD'),
          tenNguoiTao: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quyetDinhXhService.getDanhSachTaoPhieuXuatKho({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap;
          item.ngayXuat = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng', 'Trích yếu', 'Ngày ký', 'Thời hạn xuất', 'Thời hạn nhập'],
            dataColumn: ['soQd', 'trichYeu', 'ngayKy', 'ngayXuat', 'ngayNhap']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataQdXuatHang(data.id)
          }
        });
      }
    })
  }

  bindingDataQdXuatHang(id) {
    this.spinner.show();
    this.quyetDinhXhService.getDetail(id).then((res) => {
      if (res.data) {
        const data = res.data
        this.formData.patchValue({
          soQdXh: data.soQd,
          idQdXh: data.id,
          ngayQdXh: data.ngayKy
        });
      }
      this.spinner.hide();
    });
  }

  openDialogPhieuXuatKho() {
    if (!this.formData.value.idQdXh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ xuất hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.phieuXuatKhoScService.getDanhSachKiemTraCl({ idQdXh: this.formData.value.idQdXh }).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách phiếu xuất kho',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số phiếu xuất kho', 'Ghi chú'],
            dataColumn: ['soPhieuXuatKho', 'ghiChu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            console.log(data);
            this.bindingDataPhieuXuatKho(data.id)
            this.getDanhMucTieuChuan(data.cloaiVthh ? data.cloaiVthh : data.loaiVthh);
          }
        });
      }
    })
  }

  async getDanhMucTieuChuan(cloaiVthh) {
    let dmTieuChuan = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
    if (dmTieuChuan.data) {
      this.dataTable = dmTieuChuan.data;
      console.log(this.dataTable);
    }
  }

  bindingDataPhieuXuatKho(idPhieuXuatKho) {
    this.spinner.show();
    this.phieuXuatKhoScService.getDetail(idPhieuXuatKho).then((res) => {
      const data = res.data;
      this.formData.patchValue({
        soPhieuXuatKho: data.soPhieuXuatKho,
        idPhieuXuatKho: data.id,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        diaDiemKho: data.diaDiemKho,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        nguoiGiaoHang: data.nguoiGiaoHang,
        soCmt: data.soCmt,
        dviNguoiGiaoHang: data.dviNguoiGiaoHang,
        diaChi: data.diaChi,
        thoiGianGiaoNhan: data.thoiGianGiaoNhan,
        donViTinh: data.donViTinh,
        ngayXuatKho: data.ngayXuatKho
      });
      this.danhMucService.getDetail(data.cloaiVthh ? data.cloaiVthh : data.loaiVtt).then((res) => {
        this.listHinhThucBq = res.data?.loaiHinhBq;
        this.listHinhThucBq.forEach(item => item.checked = true);
      });
      this.spinner.hide();
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC) && this.userService.isAccessPermisson('SCHDTQG_KTCL_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.children = this.dataTable;
    body.dat = this.formData.value.dat == true || this.formData.value.dat == '1' ? 1 : 0;
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    let confirm
    let msg
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO:
        confirm = 'Bạn có muốn gửi duyệt ?';
        msg = 'Thao tác thành công';
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        confirm = 'Bạn có muốn phê duyệt ?'
        msg = 'Phê duyệt thành công'
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        confirm = 'Bạn có muốn phê duyệt ?'
        msg = 'Phê duyệt thành công'
        trangThai = STATUS.DA_DUYET_LDC;
        break;
    }
    this.approve(this.id, trangThai, confirm , null, msg);
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.TU_CHOI_TP;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.TU_CHOI_LDC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC);
  }

  checkDisableInputTable(data) {
    if (data.mucYeuCauNhapToiDa || data.mucYeuCauNhapToiThieu) {
      return true;
    }
    return false;
  }

  onChangeKetQua($event, data) {
    console.log(+$event, data);
    if ((+$event || +$event == 0) && (data.mucYeuCauNhapToiDa || data.mucYeuCauNhapToiThieu)) {
      if (+$event >= +data.mucYeuCauNhapToiThieu && +$event <= +data.mucYeuCauNhapToiDa) {
        data.danhGia = 'Đạt';
      } else {
        data.danhGia = 'Không đạt';
      }
    }
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('SCHDTQG_KTCL_DUYET_TP'))
      || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('SCHDTQG_KTCL_DUYET_LDCCUC'));
  }

  calTongSlThucTe() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.soLuong);
      })
      return sum;
    }
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

}
