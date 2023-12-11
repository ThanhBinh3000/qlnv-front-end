import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {KiemTraChatLuongScService} from "../../../../../../../services/sua-chua/kiemTraChatLuongSc";
import {PhieuXuatKhoScService} from "../../../../../../../services/sua-chua/phieuXuatKhoSc.service";
import {QuyetDinhXhService} from "../../../../../../../services/sua-chua/quyetDinhXh.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import {
  PhieuKtraClThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuKtraClThanhLy.service";
import {
  BienBanLayMauThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BienBanLayMauThanhLy.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";

@Component({
  selector: 'app-xtl-them-phieu-ktra-cl',
  templateUrl: './xtl-them-phieu-ktra-cl.component.html',
  styleUrls: ['./xtl-them-phieu-ktra-cl.component.scss']
})
export class XtlThemPhieuKtraClComponent extends Base3Component implements OnInit {
  rowItem: any = {};
  optionDanhGia: any[] = ['Đạt', 'Không đạt'];
  listHinhThucBq: any[];
  symbol: string = ''
  phanLoai : string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: PhieuKtraClThanhLyService,
    private bienBanLayMauThanhLyService: BienBanLayMauThanhLyService,
    private quyetDinhXhService: QuyetDinhXhService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private quyetDinhGiaoNhiemVuThanhLyService : QuyetDinhGiaoNhiemVuThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
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
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      ngayQdXh : [''],
      soBbLayMau: ['', [Validators.required]],
      idBbLayMau: ['', [Validators.required]],
      ngayLayMau : [''],
      ngayKnghiem: ['', [Validators.required]],
      idDsHdr: ['', [Validators.required]],
      maDiaDiem: ['', [Validators.required]],
      tenDiemKho: ['',],
      tenNhaKho: ['',],
      tenNganKho: ['',],
      tenLoKho: ['',],
      tenThuKho: [''],
      loaiVthh: ['',[Validators.required]],
      tenLoaiVthh: ['',[Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      tenNguoiKnghiem: [''],
      tenTruongPhongKtbq: [''],
      tenLdc: [''],
      dviTinh : [''],
      hinhThucBaoQuan: [''],
      ketQua: [''],
      nhanXet: [''],
      lyDoTuChoi: ['']
    });
    this.symbol = '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.phanLoai = urlList[4] == 'kiem-tra-lt' ? 'LT' : 'VT'
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-phieu-ktra-cl';
    })
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
          this.danhMucService.getDetail(res.cloaiVthh ? res.cloaiVthh : res.loaiVthh).then((res) => {
            this.listHinhThucBq = res.data?.loaiHinhBq;
            this.listHinhThucBq.forEach(item => item.checked = true);
          });
        }
      })
    } else {
      await this.userService.getId("XH_TL_KTRA_CL_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soPhieuKtcl: res + '/' + this.formData.value.nam + this.symbol,
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayLap: dayjs().format('YYYY-MM-DD'),
          ngayKnghiem : dayjs().format('YYYY-MM-DD'),
          tenNguoiKnghiem: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  openDialogQdGiaoNvxh() {
    if (this.disabled()) {
      return;
    }
    let body = {
      trangThai : STATUS.BAN_HANH,
      nam : this.formData.value.nam,
      phanLoai : this.phanLoai
    }
    this.spinner.show();
    this.quyetDinhGiaoNhiemVuThanhLyService.getAll(body).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng'],
            dataColumn: ['soBbQd']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.formData.patchValue({
              idQdXh : data.id,
              soQdXh : data.soBbQd,
              ngayQdXh: data.ngayKy
            })
          }
        });
      }
    })
  }

  openDialogBienBanLm() {
    if (!this.formData.value.idQdXh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ xuất hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    let body = {
      idQdXh: this.formData.value.idQdXh,
      trangThai : STATUS.DA_DUYET_LDCC,
      phanLoai : this.phanLoai
    }
    this.bienBanLayMauThanhLyService.getDsTaoPhieuKnghiemCl(body).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách biên bản lấy mẫu',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số biên bản lấy mẫu', 'Ngày lấy mẫu','Ghi chú'],
            dataColumn: ['soBienBan', 'ngayLayMau','ghiChu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            console.log(data);
            this.bindingDataBbLm(data.id)
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
    }
  }

  bindingDataBbLm(idPhieuXuatKho) {
    this.spinner.show();
    this.bienBanLayMauThanhLyService.getDetail(idPhieuXuatKho).then((res) => {
      const data = res.data;
      this.formData.patchValue({
        soBbLayMau: data.soBienBan,
        idBbLayMau: data.id,
        ngayLayMau : data.ngayLayMau,
        maDiaDiem : data.maDiaDiem,
        idDsHdr : data.idDsHdr,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        loaiVthh : data.loaiVthh,
        cloaiVthh : data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        dviTinh : data.dviTinh,
        donViTinh: data.donViTinh,
      });
      this.danhMucService.getDetail(data.cloaiVthh ? data.cloaiVthh : data.loaiVthh).then((res) => {
        this.listHinhThucBq = res.data?.loaiHinhBq;
        this.listHinhThucBq.forEach(item => item.checked = true);
      });
      this.spinner.hide();
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC);
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
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.DA_DUYET_LDC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
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
      console.log('ádoasdasd');
      if (+$event >= +data.mucYeuCauNhapToiThieu && +$event <= +data.mucYeuCauNhapToiDa) {
        data.danhGia = 'Đạt';
      } else {
        data.danhGia = 'Không đạt';
      }
    }
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.CHO_DUYET_TP )
      || (trangThai == STATUS.CHO_DUYET_LDC);
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
