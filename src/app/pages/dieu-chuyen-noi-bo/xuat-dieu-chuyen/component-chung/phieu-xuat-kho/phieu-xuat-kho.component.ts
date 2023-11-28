import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { v4 as uuidv4 } from 'uuid';
import { chain, groupBy } from 'lodash';
import { PhieuXuatKhoDieuChuyenService } from '../services/dcnb-xuat-kho.service';

export interface PassDataXK {
  soQddc: string, qddcId: number, soPhieuKnChatLuong: string, phieuKnChatLuongHdrId: number, maDiemKho: string, maNganKho: string, maNhaKho: string, maLoKho: string
  tenDiemKho: string, tenNganKho: string, tenNhaKho: string, tenLoKho: string, loaiVthh: string, cloaiVthh: string, tenLoaiVthh: string, tenCloaiVthh: string, soLuongCanDc: number, donViTinh: string,
  keHoachDcDtlId: number
}
@Component({
  selector: 'app-xuat-dcnb-phieu-xuat-kho',
  templateUrl: './phieu-xuat-kho.component.html',
  styleUrls: ['./phieu-xuat-kho.component.scss']
})
export class PhieuXuatKhoDCNBComponent extends Base2Component implements OnInit {
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() typeQd: string;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdinhDcc: number = 0;
  isViewQddc: boolean;
  dataView: any = [];
  expandSetString = new Set<string>();
  idPhieu: number = 0;
  isViewPhieu: boolean = false;
  idPhieuKNCL: number;
  isViewPhieuKNCL: boolean;
  passData: PassDataXK;

  LIST_TRANG_THAI: { [key: string]: string } = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [this.STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [this.STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    // private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoDieuChuyenService);
    this.formData = this.fb.group({
      namKh: [null],
      soQdinhDcc: [''],
      soPhieuXuatKho: [''],
      tuNgay: [null],
      denNgay: [null],
      isVatTu: [false],
      loaiDc: [''],
      thayDoiThuKho: [''],
      type: [''],
      typeQd: [],
      trangThai: ['']
    })

    this.filterTable = {
      soQd: '',
      namKh: '',
      ngayTao: '',
      soHd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGnhan: '',
      trichYeu: '',
      bbTinhKho: '',
      bbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        isVatTu: this.isVatTu,
        loaiDc: this.loaiDc,
        thayDoiThuKho: this.thayDoiThuKho,
        type: this.type,
        typeQd: this.typeQd
        // maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null
      })
      await this.timKiem();
    } catch (e) {
      console.log('e', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
  async timKiem(): Promise<void> {
    try {
      const data = this.formData.value;
      const dataTrim = this.trimStringData(data);
      this.formData.patchValue({ ...dataTrim })
      await this.search();
      this.buildTableView()
    } catch (error) {
      console.log("error", error)
    }
  }
  trimStringData(obj: any) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' || value instanceof String) {
        obj[key] = value.trim();
      }
    };
    return obj
  }
  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.phieuXuatKhoDieuChuyenService.delete(body).then(async () => {
            // await this.search();
            await this.timKiem()
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
    this.buildTableView();
  }

  resetForm() {
    this.formData.reset();
    this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd })
  }
  clearFilter() {
    this.resetForm();
    // this.search();
    this.timKiem();
  }
  buildTableView() {
    const newData = this.dataTable.map(f => ({ ...f, maNganLoKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho }))
    let dataView = chain(newData)
      .groupBy("soQdinh")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            let rsx = chain(v).groupBy("maNganLoKho").map((x, ix) => {
              const rowLv3 = x.find(f => f.maNganLoKho == ix);
              return {
                ...rowLv3,
                idVirtual: uuidv4(),
                childData: rowLv3 ? x.filter(f => !!f.id) : []
              }
            }).value();
            return {
              ...rowLv2,
              idVirtual: uuidv4(),
              childData: rsx
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQdinh === key);
        return {
          ...rowLv1,
          idVirtual: uuidv4(),
          childData: rs
        };
      }).value();
    this.dataView = dataView;
    this.expandAll()
  }

  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  disabledTuNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgay) {
      return startValue.getTime() > this.formData.value.denNgay.getTime();
    }
    return false;
  };

  disabledDenNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tuNgay) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgay.getTime();
  };
  redirectToChiTiet(lv2: any, isView: boolean, id) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    // this.idQdinhDcc = idQdinhDcc;
    this.passData = {
      soQddc: lv2.soQdinh, qddcId: lv2.qdinhDccId, soPhieuKnChatLuong: lv2.soPhieuKiemNghiemCl, phieuKnChatLuongHdrId: lv2.phieuKiemNghiemId, maDiemKho: lv2.maDiemKho,
      maNhaKho: lv2.maNhaKho, maNganKho: lv2.maNganKho, maLoKho: lv2.maLoKho, tenDiemKho: lv2.tenDiemKho, tenNhaKho: lv2.tenNhaKho, tenNganKho: lv2.tenNganKho, tenLoKho: lv2.tenLoKho,
      loaiVthh: lv2.maHangHoa, cloaiVthh: lv2.maChLoaiHangHoa, tenLoaiVthh: lv2.tenHangHoa, tenCloaiVthh: lv2.tenChLoaiHangHoa, soLuongCanDc: lv2.slDienChuyen, donViTinh: lv2.donViTinh,
      keHoachDcDtlId: lv2.keHoachDcDtlId
    }
  }

  checkRoleView(trangThai: string): boolean {
    if (trangThai && !this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai)) {
      return true
    }
    return false
  }
  checkRoleEdit(trangThai: string): boolean {
    if (this.userService.isChiCuc() && (trangThai == this.STATUS.DU_THAO || trangThai == this.STATUS.TU_CHOI_LDCC)) {
      return true
    }
    return false
  }
  checkRoleApprove(trangThai: string): boolean {
    if (this.userService.isChiCuc() && (trangThai == this.STATUS.CHO_DUYET_LDCC)) {
      return true
    }
    return false
  }
  checkRoleDelete(trangThai: string): boolean {
    if (this.userService.isChiCuc() && (trangThai == this.STATUS.DU_THAO)) {
      return true
    }
    return false
  }
  openModalPhieuXuatKho(id: number) {
    this.idPhieu = id;
    this.isViewPhieu = true;
  }
  openModalQddc(id: number) {
    this.idQdinhDcc = id;
    this.isViewQddc = true
  }
  closeModalPhieuXuatKho() {
    this.idPhieu = null;
    this.isViewPhieu = false;
  }
  openModalPhieuKNCL(id: number) {
    this.idPhieuKNCL = id;
    this.isViewPhieuKNCL = true
  }
  closeModalPhieuKNCL() {
    this.idPhieuKNCL = null;
    this.isViewPhieuKNCL = false;
  }
  closeModalQddc() {
    this.idQdinhDcc = null;
    this.isViewQddc = false;
  }
}

