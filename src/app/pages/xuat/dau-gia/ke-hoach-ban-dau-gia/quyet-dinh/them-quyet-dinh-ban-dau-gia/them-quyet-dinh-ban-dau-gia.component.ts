import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from "../../../../../../constants/status";
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-them-quyet-dinh-ban-dau-gia',
  templateUrl: './them-quyet-dinh-ban-dau-gia.component.html',
  styleUrls: ['./them-quyet-dinh-ban-dau-gia.component.scss']
})

export class ThemQuyetDinhBanDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  @Output() removeDataInit: EventEmitter<any> = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  templateNameVt = "Quyết định phê duyệt kế hoạch bán đấu giá vật tư";
  templateNameLt = "Quyết định phê duyệt kế hoạch bán đấu giá lương thực";
  maHauTo: any;
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  danhsachDx: any[] = [];
  danhsachDxCaChe: any[] = [];
  dataInput: any;
  dataInputCache: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      id: [null],
      nam: [],
      soQdPd: ['',],
      ngayKyQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      soTrHdr: [''],
      idTrHdr: [''],
      trichYeu: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      trangThai: [''],
      tenTrangThai: [''],
      phanLoai: [''],
      soQdCc: [''],
      slDviTsan: [],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      type: [''],
      chotDcGia: [''],
      quyetDinhDcGia: [''],
      quyetDinhDc: [''],
      ngayQuyetDinhDieuBDG: [''],
      soQuyetDinhDieuBDG: [''],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.loadDetail(this.idInput)
      } else {
        await this.initForm();
      }
      if (Object.keys(this.dataInit).length > 0) {
        await this.bindingTongHop(this.dataInit)
      }
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async bindingTongHop(dataTongHop) {
    if (dataTongHop.id && !dataTongHop.idQdPd) {
      await this.onChangeIdThHdr(dataTongHop.id);
    } else if (dataTongHop.idQdPd) {
      await this.loadDetail(dataTongHop.idQdPd)
      this.isView = true
    }
  }

  async onChangeNamKh(event) {
    this.formData.patchValue({
      nam: event
    })
  }

  async initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      trangThai: STATUS.DANG_NHAP_DU_LIEU,
      tenTrangThai: 'Đang nhập dữ liệu',
      phanLoai: 'TH',
      type: 'QDKH',
    })
  }

  quayLai() {
    this.showListEvent.emit();
    this.removeDataInit.emit();
  }

  async saveAndBrowse(action: string, trangThai?: string, msg?: string, msgSuccess?: string) {
    try {
      if (this.checkPrice && this.checkPrice.boolean) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
        return;
      }
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        soQdPd: this.formData.value.soQdPd ? this.formData.value.soQdPd + this.maHauTo : null,
        children: this.danhsachDx,
        canCuPhapLy: this.canCuPhapLy,
        fileDinhKem: this.fileDinhKem,
      };
      switch (action) {
        case "createUpdate":
          this.setValidator();
          await this.createUpdate(body);
          break;
        case "saveAndSend":
          if (!(await this.validateBanHanhQd(this.dataTable))) {
            return;
          }
          this.setValidForm();
          await this.saveAndSend(body, trangThai, msg, msgSuccess);
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

  async validateBanHanhQd(data) {
    const invalidItems = data.filter(item =>
      item.children.some(child =>
        child.children.some(s => s.donGiaDuocDuyet === null || s.donGiaDuocDuyet === 0 || typeof s.donGiaDuocDuyet === 'undefined'
        )
      )
    );
    if (invalidItems.length > 0) {
      const soDxuatString = invalidItems.map(item => item.soDxuat).join(',  ');
      this.notification.error(
        MESSAGE.WARNING,
        `Hiện chưa có giá bán cụ thể được duyệt cho số tờ trình ${soDxuatString} !`
      );
      return false;
    }
    return true;
  }

  async loadDetail(id: number) {
    if (!id) {
      return;
    }
    const data = await this.detail(id);
    this.formData.patchValue({
      soQdPd: data.soQdPd?.split('/')[0] || null,
      soQuyetDinhDieuBDG: data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.soQuyetDinhDieuKHLCNT ?? null,
      ngayQuyetDinhDieuBDG: data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.ngayQuyetDinhDieuKHLCNT ?? null,
      chotDcGia: !!data.qthtChotGiaInfoRes?.qthtChotDieuChinhGia.length,
      quyetDinhDcGia: !!data.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia.length,
      quyetDinhDc: !!(data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.soQuyetDinhDieuKHLCNT && data.qthtChotGiaInfoRes?.qthtDieuChinhKHLCNT?.ngayQuyetDinhDieuKHLCNT),
    });
    this.canCuPhapLy = data.canCuPhapLy;
    this.fileDinhKem = data.fileDinhKem;
    this.danhsachDx = this.userService.isCuc() ? data.children.filter(item => item.maDvi === this.userInfo.MA_DVI) : data.children;
    this.dataTable = this.danhsachDx;
    if (data.phanLoai === "TH") {
      let res = await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(data.idThHdr);
      if (res.msg === MESSAGE.SUCCESS && res.data && res.data.xhDxKhBanDauGia && res.data.xhDxKhBanDauGia.length > 0) {
        this.danhsachDxCaChe = cloneDeep(res.data.xhDxKhBanDauGia);
      }
    }
    if (data.phanLoai === "TTr") {
      let res = await this.deXuatKhBanDauGiaService.getDetail(data.idTrHdr);
      if (res.msg === MESSAGE.SUCCESS && res.data) {
        this.danhsachDxCaChe.push(res.data);
      }
    }
    await this.selectRow(this.danhsachDx[0]);
  }

  async openDialogTh() {
    if (this.formData.value.phanLoai !== 'TH') {
      return;
    }
    try {
      await this.spinner.show();
      const body = {
        trangThai: STATUS.CHUA_TAO_QD,
        namKh: this.formData.value.nam,
        loaiVthh: this.loaiVthh,
      }
      const res = await this.tongHopDeXuatKeHoachBanDauGiaService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.listDanhSachTongHop = res.data.content;
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listDanhSachTongHop,
          dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
          dataColumn: ['id', 'noiDungThop'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeIdThHdr(data.id)
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeIdThHdr(idTh) {
    if (idTh <= 0) {
      return;
    }
    this.danhsachDx = [];
    this.danhsachDxCaChe = [];
    try {
      await this.spinner.show();
      const res = await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(idTh);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const soLuongDviTsan = data.children.reduce((total, item) => total + item.slDviTsan, 0);
      this.formData.patchValue({
        nam: data.namKh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        slDviTsan: soLuongDviTsan,
        idThHdr: data.id,
        phanLoai: 'TH',
        idTrHdr: null,
        soTrHdr: null,
      });
      await this.getDataChiTieu();
      if (data.xhDxKhBanDauGia && data.xhDxKhBanDauGia.length > 0) {
        this.formData.patchValue({
          tchuanCluong: data.xhDxKhBanDauGia[0].tchuanCluong,
          loaiHinhNx: data.xhDxKhBanDauGia[0].loaiHinhNx,
          tenLoaiHinhNx: data.xhDxKhBanDauGia[0].tenLoaiHinhNx,
          kieuNx: data.xhDxKhBanDauGia[0].kieuNx,
          tenKieuNx: data.xhDxKhBanDauGia[0].tenKieuNx,
        });
        this.danhsachDx = cloneDeep(data.xhDxKhBanDauGia);
        this.dataTable = cloneDeep(data.xhDxKhBanDauGia);
        this.danhsachDxCaChe = cloneDeep(data.xhDxKhBanDauGia);
        const updatedDanhsachDx = this.danhsachDx.map(item => {
          return {...item, idDxHdr: item.id};
        });
        this.danhsachDx = updatedDanhsachDx;
        await this.selectRow(this.danhsachDx[0]);
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getDataChiTieu() {
    const namValue = +this.formData.get('nam').value;
    const res = await this.chiTieuKeHoachNamCapTongCucService.canCuCucQd(namValue);
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      this.formData.patchValue({soQdCc: null,});
      return;
    }
    this.formData.patchValue({
      soQdCc: res.data.soQuyetDinh
    });
  }

  async openDialogTr() {
    if (this.formData.value.phanLoai !== 'TTr') {
      return;
    }
    try {
      await this.spinner.show();
      let body = {
        trangThai: STATUS.DA_DUYET_CBV,
        trangThaiTh: STATUS.CHUA_TONG_HOP,
        namKh: this.formData.value.nam,
        loaiVthh: this.loaiVthh,
      }
      let res = await this.deXuatKhBanDauGiaService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.listToTrinh = res.data.content;
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH ĐỀ XUẤT KẾ HOẠCH BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listToTrinh,
          dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
          dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeIdTrHdr(data.id);
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeIdTrHdr(idDx) {
    if (idDx <= 0) {
      return;
    }
    this.danhsachDx = [];
    this.danhsachDxCaChe = []
    try {
      await this.spinner.show();
      const res = await this.deXuatKhBanDauGiaService.getDetail(idDx);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      data.idDxHdr = data.id;
      this.formData.patchValue({
        nam: data.namKh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tchuanCluong: data.tchuanCluong,
        moTaHangHoa: data.moTaHangHoa,
        tgianDkienTu: data.tgianDkienTu,
        tgianDkienDen: data.tgianDkienDen,
        tgianTtoan: data.tgianTtoan,
        tgianTtoanGhiChu: data.tgianTtoanGhiChu,
        pthucTtoan: data.pthucTtoan,
        tgianGnhan: data.tgianGnhan,
        tgianGnhanGhiChu: data.tgianGnhanGhiChu,
        pthucGnhan: data.pthucGnhan,
        thongBaoKh: data.thongBaoKh,
        slDviTsan: data.slDviTsan,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        idTrHdr: data.id,
        soTrHdr: data.soDxuat,
        idThHdr: null,
      });
      await this.getDataChiTieu();
      this.danhsachDx.push(data);
      this.dataTable.push(data);
      this.danhsachDxCaChe.push(data);
      await this.selectRow(this.danhsachDx[0]);
    } catch (error) {
      console.error('error:', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  index = 0;

  async selectRow(data: any) {
    if (!data.selected) {
      this.danhsachDx.forEach(item => item.selected = false);
      data.selected = true;
      const findndex = this.danhsachDx.findIndex(child => child.soDxuat == data.soDxuat);
      const findndexCache = this.danhsachDxCaChe.findIndex(child => child.soDxuat == data.soDxuat);
      this.index = findndex
      this.dataInput = this.danhsachDx[findndex];
      this.dataInputCache = this.danhsachDxCaChe[findndexCache];
    }
  }

  receiveDataFromChild(data: any) {
    if (this.danhsachDx[this.index]) {
      if (data.hasOwnProperty('tongSoLuong')) {
        this.danhsachDx[this.index].tongSoLuong = data.tongSoLuong;
      }
      if (data.hasOwnProperty('tongTienKhoiDiemDx')) {
        this.danhsachDx[this.index].tongTienKhoiDiemDx = data.tongTienKhoiDiemDx;
      }
      if (data.hasOwnProperty('tongTienDuocDuyet')) {
        this.danhsachDx[this.index].tongTienDuocDuyet = data.tongTienDuocDuyet;
      }
      if (data.hasOwnProperty('tongTienDatTruocDx')) {
        this.danhsachDx[this.index].tongTienDatTruocDx = data.tongTienDatTruocDx;
      }
      if (data.hasOwnProperty('tongKtienDtruocDduyet')) {
        this.danhsachDx[this.index].tongKtienDtruocDduyet = data.tongKtienDtruocDduyet;
      }
      if (data.hasOwnProperty('tgianDkienTu')) {
        this.danhsachDx[this.index].tgianDkienTu = data.tgianDkienTu;
      }
      if (data.hasOwnProperty('tgianDkienDen')) {
        this.danhsachDx[this.index].tgianDkienDen = data.tgianDkienDen;
      }
    }
  }

  setValidator() {
    const thHdrValidators = this.formData.get('phanLoai').value === 'TH' ? [Validators.required] : [];
    const trHdrValidators = this.formData.get('phanLoai').value === 'TTr' ? [Validators.required] : [];
    this.formData.controls["idThHdr"].setValidators(thHdrValidators);
    this.formData.controls["idThHdr"].updateValueAndValidity();
    this.formData.controls["idTrHdr"].setValidators(trHdrValidators);
    this.formData.controls["idTrHdr"].updateValueAndValidity();
    this.formData.controls["soTrHdr"].setValidators(trHdrValidators);
    this.formData.controls["soTrHdr"].updateValueAndValidity();
  }

  setValidForm() {
    const requiredFields = [
      "nam",
      "soQdPd",
      "ngayKyQd",
      "ngayHluc",
      "trichYeu",
      "soQdCc",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "tchuanCluong",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
