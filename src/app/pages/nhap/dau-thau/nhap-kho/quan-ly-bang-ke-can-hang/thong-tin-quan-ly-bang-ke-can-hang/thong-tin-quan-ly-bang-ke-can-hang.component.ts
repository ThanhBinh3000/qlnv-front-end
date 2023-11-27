import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';
import {
  QuanLyPhieuNhapKhoService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import {
  QuyetDinhGiaoNhapHangService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { isEmpty } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  QuanLyNghiemThuKeLotService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service";
import {cloneDeep} from 'lodash';
import {PREVIEW} from "../../../../../../constants/fileType";
@Component({
  selector: 'thong-tin-quan-ly-bang-ke-can-hang',
  templateUrl: './thong-tin-quan-ly-bang-ke-can-hang.component.html',
  styleUrls: ['./thong-tin-quan-ly-bang-ke-can-hang.component.scss'],
})
export class ThongTinQuanLyBangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;


  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  rowItem: any = {};
  listFileDinhKem: any[] = [];
  rowItemEdit: any[] = [];
  templateName = "9.C85-HD_Bảng kê cân hàng_nhập_LT";
  dataDdNhap: any;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private quanLyBangKeCanHangService: QuanLyBangKeCanHangService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    public globals: Globals,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyBangKeCanHangService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],
      soBangKe: [''],
      soPhieuNhapKho: [],
      ngayNhapKho: [],
      soLuongNhapKho: [],

      soQdGiaoNvNh: [],
      idQdGiaoNvNh: [],

      soHd: [''],
      ngayHd: [null,],

      idDdiemGiaoNvNh: [, [Validators.required]],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],

      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenNguoiTao: [''],
      tenNguoiPduyet: [''],
      keToanTruong: [''],
      nguoiGiaoHang: [''],
      cmtNguoiGiaoHang: [''],
      donViGiaoHang: [''],
      diaChiNguoiGiao: [''],
      thoiGianGiaoNhan: [''],
      ghiChu: [''],

      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      tenNganLoKho: [],
      dvt: ['kg'],
      nguoiGiamSat: [],
      ngayTao: [],
      diaDiemKho: [],
      lhKho: [],
      trongLuongBaoBi: [],
    })
  }


  async ngOnInit() {
    await this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      await this.spinner.show();

      let res = await this.quanLyBangKeCanHangService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data
          this.listFileDinhKem = data.listFileDinhKem;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          await this.bindingDataQd(data.idQdGiaoNvNh);
          this.dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
          this.bindingDataDdNhap(this.dataDdNhap);
          if (data.soPhieuNhapKho) {
            this.bindingDataPhieuNhapKho(data.soPhieuNhapKho.split("/")[0]);
          }
          this.dataTable = data.chiTiets;
        }
      }
      await this.spinner.hide();
    }
  }

  async initForm() {
    let maBb = 'BKCH-' + this.userInfo.DON_VI.tenVietTat;
    let res = await this.userService.getId("BANG_KE_CAN_HANG_LT_SEQ");
    this.formData.patchValue({
      soBangKe: `${res}/${this.formData.get('nam').value}/${maBb}`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao: this.userInfo.sub
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong.ngayKy,
      donGiaHd: data.hopDong.donGia
    });
    let dataChiCuc;
    if (this.userService.isChiCuc()) {
      dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
      if (dataChiCuc.length > 0) {
        this.listDiaDiemNhap = dataChiCuc[0].children;
      }
    } else {
      dataChiCuc = data.dtlList.filter(item => item.maDvi == this.formData.value.maDvi);
      if (dataChiCuc.length > 0) {
        this.listDiaDiemNhap = dataChiCuc[0].children;
      }
    }
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataDdNhap(data, true);
      }
    });
  }

  async bindingDataDdNhap(data, isDetail?) {
    this.dataTable = [];
    await this.getNganKho(data.maLoKho ? data.maLoKho : data.maNganKho);
    this.formData.patchValue({
      idDdiemGiaoNvNh: data.id,
      maDiemKho: data.maDiemKho,
      tenDiemKho: data.tenDiemKho,
      maNhaKho: data.maNhaKho,
      tenNhaKho: data.tenNhaKho,
      maNganKho: data.maNganKho,
      tenNganKho: data.tenNganKho,
      maLoKho: data.maLoKho,
      tenLoKho: data.tenLoKho,
      tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
    });
    if (isDetail) {
      this.formData.patchValue({
        soPhieuNhapKho: null,
        ngayNhapKho: null,
        nguoiGiaoHang: null,
        cmtNguoiGiaoHang: null,
        donViGiaoHang: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
      });
    }
    this.listSoPhieuNhapKho = data.listPhieuNhapKho.filter(item => (item.trangThai == STATUS.DU_THAO && isEmpty(item.bangKeCanHang)));
  }

  async getNganKho(maDvi: any) {
    if (maDvi) {
      let res = await this.quanLyNghiemThuKeLotService.getDataKho(maDvi);
      this.formData.patchValue({
        lhKho: res.data.lhKho
      });
    }
  }
  openDialogSoPhieuNhapKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số phiếu nhập kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoPhieuNhapKho,
        dataHeader: ['Số phiếu nhập kho', 'Số phiếu kiểm tra chất lượng'],
        dataColumn: ['soPhieuNhapKho', 'soPhieuKtraCl']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataPhieuNhapKho(data.id);
      }
    });
  }

  async bindingDataPhieuNhapKho(id) {
    let res = await this.quanLyPhieuNhapKhoService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        soPhieuNhapKho: data.soPhieuNhapKho,
        ngayNhapKho: data.ngayTao,
        nguoiGiaoHang: data.nguoiGiaoHang,
        cmtNguoiGiaoHang: data.cmtNguoiGiaoHang,
        donViGiaoHang: data.donViGiaoHang,
        diaChiNguoiGiao: data.diaChiNguoiGiao,
        thoiGianGiaoNhan: data.thoiGianGiaoNhan,
        soLuongNhapKho: data.hangHoaList[0].soLuongThucNhap
      });
    }
  }


  isDisableField() {
    // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(i: any) {
    this.dataTable.splice(i, 1)
  }

  editRow(i: number) {
    this.dataTable[i].edit = true;
    this.rowItemEdit[i] = cloneDeep(this.dataTable[i])
  }

  addRow() {
    // if (this.validateDataRow()) {
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = {};
    // }
  }

  validateDataRow() {
    if (this.rowItem.maCan && this.rowItem.trongLuongBaoBi && this.rowItem.trongLuongCaBaoBi) {
      let tongTrongLuong = this.calcTong('trongLuongCaBaoBi');
      if (tongTrongLuong + this.rowItem.trongLuongCaBaoBi > this.formData.value.soLuongNhapKho) {
        this.notification.error(MESSAGE.ERROR, "Trọng lượng bao bì không được vượt quá số lượng nhập kho");
        return false
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      return false
    }
  }

  cancelEdit(i: number): void {
    this.dataTable[i].edit = false;
  }

  saveEdit(i: number): void {
    this.dataTable[i] = cloneDeep(this.rowItemEdit[i])
    this.dataTable[i].edit = false;
  }

  clearItemRow() {
    this.rowItem = {};
  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 500,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          let res =
            await this.quanLyBangKeCanHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.quanLyBangKeCanHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet: boolean) {
      this.spinner.show();
      try {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          await this.spinner.hide();
          return;
        }
        let body = this.formData.value;
        body.chiTiets = this.dataTable;
        body.fileDinhKems = this.listFileDinhKem;
        let res;
        if (isGuiDuyet && !this.validateSave()) {
          return;
        }
        if (this.formData.get('id').value > 0) {
          res = await this.quanLyBangKeCanHangService.update(body);
        } else {
          res = await this.quanLyBangKeCanHangService.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            await this.spinner.hide();
            this.id = res.data.id;
            this.pheDuyet();
          } else {
            if (this.formData.get('id').value) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.id = res.data.id;
              this.formData.get('id').setValue(res.data.id);
            }
            await this.spinner.hide();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
          await this.spinner.hide();
        }
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
  }

  validateSave() {
    let tongTrongLuong = this.calcTong('trongLuongCaBaoBi') - this.formData.value.trongLuongBaoBi;
    if (tongTrongLuong != this.formData.value.soLuongNhapKho) {
      this.notification.error(MESSAGE.ERROR, "Tổng trọng lượng bao bì của bảng kê đang không đủ số lượng nhập kho")
      return false;
    }
    return true;
  }

  print() {

  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }


  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  async xemTruocBk(id, tenBaoCao) {
    await this.service.preview({
      tenBaoCao: tenBaoCao + '.docx',
      id: id,
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }
}
