import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from "src/app/components/base2/base2.component";
import _ from 'lodash';
import {chain} from 'lodash'
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  PhieuXuatKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import {
  BangKeCanService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BangKeCan.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {convertTienTobangChu} from "../../../../../../shared/commonFunction";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {AMOUNT_NO_DECIMAL, AMOUNT_THREE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-bdg-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  dataTableChange = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  templateNameVt = "Bảng kê cân hàng bán đấu giá vật tư";
  templateNameLt = "Bảng kê cân hàng bán đấu giá lương thực";
  amount = {...AMOUNT_NO_DECIMAL};
  amount1 = {...AMOUNT_THREE_DECIMAL}
  amountLeft = {...AMOUNT_THREE_DECIMAL, align: "left"};
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  dataQuyetDinh: any[] = [];
  listPhieuXuatKho: any[] = [];
  listDiaDiemXuat: any[] = [];
  loadDanhSachBangKeCan: any[] = [];
  rowItemCGD: any = {};
  rowItemKQC: any = {};
  listPhuongPhapCan: Array<{ label: string, value: string }> = [{
    label: 'Cân giám định',
    value: 'can_giam_dinh'
  }, {label: 'Cân toàn bộ', value: 'can_toan_bo'}]

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bangKeCanService: BangKeCanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year'), [Validators.required]],
        maDvi: [''],
        maQhNs: [''],
        soBangKeHang: [''],
        ngayLapBangKe: [''],
        idQdNv: [],
        soQdNv: [''],
        ngayKyQdNv: [''],
        idQdNvDtl: [],
        idHopDong: [],
        soHopDong: [''],
        ngayKyHopDong: [''],
        idKho: [],
        maDiemKho: [''],
        diaDiemKho: [''],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        loaiHinhKho: [''],
        nguoiGiamSat: [''],
        idThuKho: [],
        idLanhDaoChiCuc: [],
        idPhieuXuatKho: [],
        soPhieuXuatKho: [''],
        ngayXuatKho: [''],
        idPhieuKiemNghiem: [],
        soPhieuKiemNghiem: [''],
        ngayKiemNghiemMau: [''],
        tenNguoiGiao: [''],
        cmtNguoiGiao: [''],
        congTyNguoiGiao: [''],
        diaChiNguoiGiao: [''],
        thoiGianGiaoNhan: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenHangHoa: [''],
        donViTinh: [''],
        tongTrongLuongBi: [],
        tongTrongLuongCaBi: [],
        tongTrongTruBi: [],
        loaiHinhNx: [''],
        kieuNhapXuat: [''],
        soLuong: [''],
        donGia: [''],
        trangThai: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],
        tenThuKho: [''],
        tenLanhDaoChiCuc: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenLoaiHinhNx: [''],
        tenKieuNhapXuat: [''],
        tenTrangThai: [''],
        phuongPhapCan: [''],
        trongLuongMotBao: [],
        trongLuongBaoKcan: [],
        tongSlBaoBi: [],
        fileDinhKem: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/BKCH-' + this.userInfo.DON_VI.tenVietTat;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.maTuSinh = await this.userService.getId('XH_DG_BANG_KE_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBangKeHang: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapBangKe: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      tongTrongLuongCaBi: 0,
      phuongPhapCan: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? 'can_toan_bo' : 'can_giam_dinh',
    })
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soBangKeHang: `${this.maTuSinh}/${event}${this.maHauTo}`,
      });
    }
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    this.maTuSinh = this.idInput;
    this.dataTableAll = data.children;
    this.dataTable = chain(this.dataTableAll).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
    if (data.phuongPhapCan) {
      this.formData.patchValue({
        phuongPhapCan: data.phuongPhapCan.toString()
      });
    }
    if (!this.isView) {
      await this.onChange(data.idQdNv)
    }
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.dataQuyetDinh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataQuyetDinh,
          dataHeader: ['Số quyết định giao nhiệm vụ', 'Ngày ký', 'Loại hàng hóa'],
          dataColumn: ['soQdNv', 'ngayKy', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChange(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        idQdNvDtl: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idKho: null,
        maDiemKho: null,
        tenDiemKho: null,
        diaDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        soLuong: null,
        donGia: null,
      });
      this.dataTable = [];
    }
  }

  async onChange(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        nam: data.nam,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKy,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        loaiHinhNx: data.loaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
      });
      await this.loadBangKeCanHang(data.soQdNv)
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      if (dataChiCuc && dataChiCuc.children && dataChiCuc.children.length > 0) {
        this.listDiaDiemXuat = dataChiCuc.children
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadBangKeCanHang(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bangKeCanService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachBangKeCan = data;
  }

  async openDialogKho() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXuat,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idKho: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          diaDiemKho: data.diaDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho
        });
      }
    });
  }

  async changeKho(event) {
    if (this.flagInit && event && event !== this.formData.value.maLoKho && this.formData.value.maNganKho) {
      this.formData.patchValue({
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        soLuong: null,
        donGia: null,
      })
      this.dataTable = [];
    }
  }

  async openDialogPhieuXuatKho() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.DU_THAO,
        soQdNv: this.formData.value.soQdNv,
      }
      const res = await this.phieuXuatKhoService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const phieuXuatKhoSet = new Set(this.loadDanhSachBangKeCan.map(item => item.soPhieuXuatKho));
        this.listPhieuXuatKho = res.data.content.filter(item => !phieuXuatKhoSet.has(item.soPhieuXuatKho))
      }
      const formattedDataPhieuXuatKho = this.listPhieuXuatKho.map(item => ({
        soLuongXuat: item.thucXuat ? item.thucXuat.toLocaleString() : null,
        ...item
      }))
      const modalQD = this.modal.create({
        nzTitle: 'PHIẾU XUẤT KHO HÀNG DTQG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: formattedDataPhieuXuatKho.filter(item => item.idKho === this.formData.value.idKho),
          dataHeader: ['Số Phiếu xuất kho', 'Ngày Lập Phiếu', 'Loại hàng hóa', 'Số lượng xuất kho'],
          dataColumn: ['soPhieuXuatKho', 'ngayLapPhieu', 'tenLoaiVthh', 'soLuongXuat']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangePhieuXuatKho(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changePhieuXuatKho(event) {
    if (this.flagInit && event && event !== this.formData.value.soPhieuXuatKho) {
      this.formData.patchValue({
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        soLuong: null,
        donGia: null,
      })
      this.dataTable = [];
    }
  }

  async onChangePhieuXuatKho(id) {
    if (id <= 0) {
      return;
    }
    try {
      const res = await this.phieuXuatKhoService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data
      this.formData.patchValue({
        idQdNvDtl: data.idQdNvDtl,
        idPhieuXuatKho: data.id,
        soPhieuXuatKho: data.soPhieuXuatKho,
        ngayXuatKho: data.ngayLapPhieu,
        tenNguoiGiao: data.tenNguoiGiao,
        cmtNguoiGiao: data.cmtNguoiGiao,
        congTyNguoiGiao: data.congTyNguoiGiao,
        diaChiNguoiGiao: data.diaChiNguoiGiao,
        thoiGianGiaoNhan: data.thoiGianGiaoNhan,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        soLuong: data.thucXuat,
        donGia: data.donGia,
        donViTinh: data.donViTinh,
        idPhieuKiemNghiem: data.idPhieuKiemNghiem,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
        loaiHinhKho: data.loaiHinhKho,
      })
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  addRow(item, name) {
    if (this.validateThongTin(item, name)) {
      const data = {...item, loai: name, idVirtual: new Date().getTime()};
      this.dataTableAll.push(data);
      this.dataTable = _.chain(this.dataTableAll)
        .groupBy('loai').map((value, key) => ({loai: key, dataChild: value})).value();
      const resetItems = {
        CGD: 'rowItemCGD',
        KQC: 'rowItemKQC',
      };
      if (resetItems[name]) {
        this[resetItems[name]] = {};
      }
      this.calculatorTable();
    }
  }

  findTableName(name) {
    if (!this.dataTable) {
      return null;
    }
    return this.dataTable.find(({loai}) => loai === name) || null;
  }

  validateThongTin(data, name) {
    const requirements = {
      CGD: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? {
        fields: ['maCan', 'trongLuongCaBi'],
        errorMessage: "Vui lòng điền đủ thông tin"
      } : {fields: ['maCan', 'soBaoBi', 'trongLuongCaBi'], errorMessage: "Vui lòng điền đủ thông tin"},
      KQC: {fields: ['maCan', 'soBaoBi'], errorMessage: "Vui lòng điền đủ thông tin"},
    };
    const requirement = requirements[name];
    if (!requirement) {
      return false;
    }
    for (const field of requirement.fields) {
      if (!data[field]) {
        this.notification.error(MESSAGE.ERROR, requirement.errorMessage);
        return false;
      }
    }
    return true;
  }

  clearRow(name) {
    const resetItems = {
      CGD: 'rowItemCGD',
      KQC: 'rowItemKQC',
    };
    const resetItem = resetItems[name];
    if (resetItem) {
      this[resetItem] = {};
    }
  }

  editRow(data: any) {
    this.dataTableAll.forEach(s => s.isEdit = false);
    let currentRow = this.dataTableAll.find(s => s.idVirtual == data.idVirtual);
    currentRow.isEdit = true;
    this.dataTable = _.chain(this.dataTableAll).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
    this.calculatorTable();
  }

  deleteRow(idVirtual) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTableAll = this.dataTableAll.filter(item => item.idVirtual != idVirtual);
          this.dataTable = _.chain(this.dataTableAll)
            .groupBy('loai').map((value, key) => ({loai: key, dataChild: value})).value();
          this.calculatorTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveRow(data: any, index: number) {
    this.updateEditState(data, index, false);
  }

  cancelEdit(data: any, index: number) {
    this.updateEditState(data, index, false);
  }

  updateEditState(data: any, index: number, isEdit: boolean) {
    const rows = this.dataTableAll.filter(s => s.loai == data.loai);
    if (rows[index]) {
      rows[index].isEdit = isEdit;
    }
    this.calculatorTable();
  }

  calcTong(columnName, name) {
    const data = this.dataTable.filter(({loai}) => loai === name);
    console.log(data, 999);
    if (data.length > 0) {
      return data.reduce((sum, item) => {
        return sum + item.dataChild.reduce((acc, cur) => acc + (cur[columnName] || 0), 0);
      }, 0);
    }
    return 0;
  }

  changeTinh(event, columnName, name) {
    const sum = this.calcTong(columnName, name);
    let patchData = {};
    if (name === 'KQC') {
      patchData['trongLuongBaoKcan'] = event * sum || 0;
    } else if (name === 'CGD') {
      patchData['tongTrongTruBi'] = (sum - event) || 0;
    }
    this.formData.patchValue(patchData);
  }

  calculatorTable() {
    const tongTrongLuongCaBi = this.dataTableAll ?
      this.dataTableAll
        .filter(item => item.loai === 'CGD')
        .reduce((prev, cur) => prev + (cur.trongLuongCaBi || 0), 0)
      : 0;
    this.formData.patchValue({
      tongSlBaoBi: this.dataTableAll.reduce((prev, cur) => prev + cur.soBaoBi, 0),
      tongTrongLuongCaBi: tongTrongLuongCaBi
    });
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  async saveAndApproveAndReject(action: string, trangThai?: string, msg?: string, msgSuccess?: string) {
    try {
      if (this.checkPrice && this.checkPrice.boolean) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
        return;
      }
      if (this.checkPrice && this.checkPrice.booleanNhapXuat) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
        return;
      }
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        children: this.dataTableAll,
      };
      switch (action) {
        case "createUpdate":
          this.formData.controls["soQdNv"].setValidators([Validators.required]);
          this.formData.controls["soPhieuXuatKho"].setValidators([Validators.required]);
          await this.createUpdate(body);
          break;
        case "saveAndSend":
          this.setValidForm();
          await this.saveAndSend(body, trangThai, msg, msgSuccess);
          break;
        case "approve":
          await this.approve(this.idInput, trangThai, msg);
          break;
        case "reject":
          await this.reject(this.idInput, trangThai);
          break;
        default:
          console.error("Invalid action: ", action);
          break;
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  setValidForm() {
    const requiredFields = [
      "nam",
      "ngayLapBangKe",
      "soQdNv",
      "diaDiemKho",
      "nguoiGiamSat",
      "soPhieuXuatKho",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
