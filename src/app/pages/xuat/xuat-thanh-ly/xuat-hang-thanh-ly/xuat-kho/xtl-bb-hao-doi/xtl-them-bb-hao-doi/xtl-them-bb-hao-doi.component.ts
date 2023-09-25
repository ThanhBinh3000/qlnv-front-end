import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {BienBanKetThucNhapScService} from "../../../../../../../services/sua-chua/bienBanKetThucNhapSc.service";
import {QuyetDinhNhService} from "../../../../../../../services/sua-chua/quyetDinhNh.service";
import {DanhMucDungChungService} from "../../../../../../../services/danh-muc-dung-chung.service";
import {DanhSachSuaChuaService} from "../../../../../../../services/sua-chua/DanhSachSuaChua.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {STATUS} from "../../../../../../../constants/status";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-xtl-them-bb-hao-doi',
  templateUrl: './xtl-them-bb-hao-doi.component.html',
  styleUrls: ['./xtl-them-bb-hao-doi.component.scss']
})
export class XtlThemBbHaoDoiComponent extends Base3Component implements OnInit {

  dataTableDiaDiem: any[] = [];
  fileCanCu: any[] = []
  rowItem: any = {};

  dropdownLoaiDaiDien: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private bienBanKetThucNhapScService: BienBanKetThucNhapScService,

    private quyetDinhNhService: QuyetDinhNhService,
    private danhMucService: DanhMucDungChungService,
    private danhSachSuaChuaService: DanhSachSuaChuaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bienBanKetThucNhapScService);
    this.defaultURL = 'sua-chua/nhap-hang/bb-kt-nhap';
    this.previewName = 'sc_bien_ban_giao_nhan'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soBienBan: ['', [Validators.required]],
      ngayLap: [''],
      soQdNh: ['', [Validators.required]],
      idQdNh: ['', [Validators.required]],
      idScDanhSachHdr: ['', [Validators.required]],
      maDiaDiem: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      tenLoKho: ['', [Validators.required]],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      tenThuKho: [''],
      tenLanhDaoCc: [''],
      ngayKetThuc: [''],
      ngayBatDau: [''],
      ghiChu: [''],
      tongSoLuong: [''],
      lyDoTuChoi: ['']
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
    this.spinner.show();
    this.dropdownLoaiDaiDien = [];
    let resTcdd = await this.danhMucService.danhMucChungGetAll('TO_CHUC_DAI_DIEN');
    if (resTcdd.msg == MESSAGE.SUCCESS) {
      this.dropdownLoaiDaiDien = resTcdd.data;
    }
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          let data = res.children[0];
          this.rowItem = {
            donViTinh: data.donViTinh,
            tenMatHang: data.tenMatHang,
            slDaDuyet: data.slDaDuyet,
            donGiaPd: data.donGiaPd,
          }
          this.dataTable = res.children;
          this.dataTableAll = res.daiDienList;
          this.bindingDiaDiemXh(res.idQdNh)
        }
      })
    } else {
      await this.userService.getId("SC_BIEN_BAN_KT_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBienBan: res + '/' + this.formData.value.nam + '/BBNĐK',
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayLap: dayjs().format('YYYY-MM-DD'),
          ngayKetThuc: dayjs().format('YYYY-MM-DD'),
          tenThuKho: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quyetDinhNhService.getDanhSachTaoPhieuNhapKho({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayXuat = item.thoiHanNhap;
          item.ngayNhap = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ nhập hàng',
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
            this.bindingDiaDiemXh(data.id)
          }
        });
      }
    })
  }

  bindingDiaDiemXh(id) {
    this.spinner.show();
    this.quyetDinhNhService.getDetail(id).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const data = res.data
        this.formData.patchValue({
          soQdNh: data.soQd,
          idQdNh: data.id,
          ngayQdNh: data.ngayKy,
          soPhieuKtcl: data.soPhieuKtcl
        })
        this.dataTableDiaDiem = []
        data.children.forEach(item => {
          item.scDanhSachHdr.soLuongNhap = item.soLuongNhap;
          this.dataTableDiaDiem.push(item.scDanhSachHdr);
        })
      }
    });
  }

  openDialogDiaDiem() {
    if (!this.formData.value.idQdNh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ nhập hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.danhSachSuaChuaService.getDsTaoBienBanKetThuc({ idQdNh: this.formData.value.idQdNh }).then((res) => {
      this.spinner.hide();
      this.dataTableDiaDiem = res.data
      const modalQD = this.modal.create({
        nzTitle: 'Danh sách quyết định sửa chữa',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1200px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataTableDiaDiem,
          dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Tên loại', 'Tên chủng loại'],
          dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tenLoaiVthh', 'tenCloaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.spinner.show();
          this.dataTable = [];
          await this.formData.patchValue({
            idScDanhSachHdr: data.id,
            maDiaDiem: data.maDiaDiem,
            tenDiemKho: data.tenDiemKho,
            tenNhaKho: data.tenNhaKho,
            tenNganKho: data.tenNganKho,
            tenLoKho: data.tenLoKho,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.donViTinh,
          })
          this.danhSachSuaChuaService.getDetailDs({ id: data.id, idQdNh: this.formData.value.idQdNh }).then((res) => {
            this.spinner.hide();
            this.dataTable = res.data.scPhieuNhapKhoList.filter(item => item.trangThai == STATUS.DA_DUYET_LDCC);
            let dataFirst = new Date();
            this.dataTable.forEach(item => {
              item.idPhieuNhapKho = item.id;
              let dataCompare = new Date(item.ngayNhapKho);
              if (dataFirst > dataCompare) {
                dataFirst = dataCompare;
              }
            });
            this.formData.patchValue({
              ngayBatDau: dataFirst,
              tongSoLuong: this.calTongSoLuong()
            })
          })
        }
      });
    })
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_KTVBQ
      || trangThai == STATUS.TU_CHOI_KT || trangThai == STATUS.TU_CHOI_LDCC) && this.userService.isAccessPermisson('SCHDTQG_NH_BBGN_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    if (this.formData.value.tongSoLuong == null || this.formData.value.tongSoLuong <= 0) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, "Tổng số lượng xuất phải lớn hơn 0");
      return;
    }
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    body.children = this.dataTable;
    body.daiDienList = this.dataTableAll;
    console.log(body)
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
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        break;
      case STATUS.CHO_DUYET_KTVBQ:
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      case STATUS.CHO_DUYET_KT:
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_KTVBQ:
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      case STATUS.CHO_DUYET_KT:
        trangThai = STATUS.TU_CHOI_KT;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai;
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_KTVBQ
      || trangThai == STATUS.TU_CHOI_KT || trangThai == STATUS.TU_CHOI_LDCC);
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('SCHDTQG_NH_BBGN_DUYETLDCCUC'))
      || (trangThai == STATUS.CHO_DUYET_KTVBQ && this.userService.isAccessPermisson('SCHDTQG_NH_BBGN_DUYETKTVBQ'))
      || (trangThai == STATUS.CHO_DUYET_KT && this.userService.isAccessPermisson('SCHDTQG_NH_BBGN_DUYETKT'));
  }

  addRow() {
    let dataRow = cloneDeep(this.rowItem);
    this.rowItem = {};
    this.dataTableAll.push(dataRow);
  }

  deleteRow(i: number): void {
    this.dataTableAll = this.dataTableAll.filter((d, index) => index !== i);
  }

  calTongSoLuong() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.tongSoLuong);
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
