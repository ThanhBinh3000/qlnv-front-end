import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  HopDongBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service";

@Component({
  selector: 'app-chi-tiet-dieu-chinh-ban-truc-tiep',
  templateUrl: './chi-tiet-dieu-chinh-ban-truc-tiep.component.html',
  styleUrls: ['./chi-tiet-dieu-chinh-ban-truc-tiep.component.scss']
})
export class ChiTietDieuChinhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isView: boolean;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  maConVan: any;
  maHauTo: any;
  danhSachQdPdKeHoach: any[] = [];
  selected: boolean = false;
  dataInput: any[] = [];
  dataInputCache: any[] = [];
  danhSachDieuChinh: any[] = [];
  fileDinhKemDc: any[] = [];
  listDataHopDong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private hopDongBttService: HopDongBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);
    this.formData = this.fb.group({
      id: [],
      namKh: [],
      maDvi: [''],
      idGoc: [],
      soQdPd: [''],
      ngayKyQd: [''],
      ngayHluc: [''],
      trichYeu: [''],
      soQdCc: [''],
      noiDungToTrinh: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      tchuanCluong: [''],
      slDviTsan: [''],
      phanLoai: [''],
      slHdongDaKy: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      soCongVan: [''],
      ngayTaoCongVan: [''],
      lanDieuChinh: [''],
      soQdCanDc: [''],
      soQdDc: [''],
      ngayKyDc: [''],
      ngayHlucDc: [''],
      trichYeuDieuChinh: [''],
      noiDungDieuChinh: [''],
      type: [''],
      idQdPd: [],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenTrangThai: [''],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      this.maConVan = '/' + this.userInfo.MA_TR;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput)
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initForm() {
    this.formData.patchValue({
      namKh: dayjs().get('year'),
      trangThai: STATUS.DA_LAP,
      tenTrangThai: 'Đã lập',
      phanLoai: 'TH',
      type: 'QDDC',
    })
  }

  async getDetail(id: number) {
    if (!id) {
      return;
    }
    const data = await this.detail(id)
    const {soCongVan, soQdDc, children} = data;
    this.formData.patchValue({
      soCongVan: soCongVan?.split('/')[0] || null,
      soQdDc: soQdDc?.split('/')[0] || null,
    })
    this.canCuPhapLy = data.canCuPhapLy;
    this.fileDinhKem = data.fileDinhKem;
    this.fileDinhKemDc = data.fileDinhKemDc;
    this.dataTable = this.userService.isCuc() ? children.filter(item => item.maDvi === this.userInfo.MA_DVI) : children;
    if (data.idGoc > 0) {
      let res = await this.quyetDinhPdKhBanTrucTiepService.getDetail(data.idGoc);
      if (res.msg === MESSAGE.SUCCESS && res.data) {
        this.dataTableAll = res.data.children;
      }
    }
    await this.selectRow(this.dataTable[0]);
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namKh,
        trangThai: STATUS.BAN_HANH,
        lastest: 1,
      }
      await this.loadDanhSachDieuChinh();
      await this.loadHopDong();
      const res = await this.quyetDinhPdKhBanTrucTiepService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQdPdKeHoach = res.data.content.map(item => ({
          soQd: item.soQdDc || item.soQdPd,
          ngayKy: item.ngayKyDc || item.ngayKyQd,
          trangThaiGia: item.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia.length > 0 ? 'Dừng thực hiện để điều chỉnh giá' : '',
          loai: item.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia.length > 0 ? 'Điều chỉnh giá' : '',
          ...item
        }));
        const idGocSet = new Set(this.danhSachDieuChinh.map(item => item.idGoc));
        this.danhSachQdPdKeHoach = this.danhSachQdPdKeHoach.filter(item => !idGocSet.has(item.id))
        if (this.listDataHopDong.length > 0) {
          this.validateHopDong();
        }
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH PHÊ DUYỆT KẾ HOẠCH BÁN TRỰC TIẾP',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachQdPdKeHoach.filter(item => item.children.length > 0),
          dataHeader: ['Số QĐ cần điều chỉnh', 'Ngày ký QĐ', 'Loại hàng hóa', 'Trạng thái', 'Loại'],
          dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh', 'trangThaiGia', 'loai']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChange(data);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChange(datasearch) {
    if (datasearch.id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.quyetDinhPdKhBanTrucTiepService.getDetail(datasearch.id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data
      this.formData.patchValue({
        idGoc: data.id,
        idQdPd: data.type === 'QDDC' ? data.idQdPd : data.id,
        soQdCanDc: data.type === 'QDDC' ? data.soQdDc : data.soQdPd,
        soQdPd: data.soQdPd,
        ngayKyQd: data.ngayKyQd,
        soQdCc: data.soQdCc,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        tchuanCluong: data.tchuanCluong,
      });
      if (this.listDataHopDong.length > 0) {
        this.validateHopDong(data);
      }
      data.children.forEach(item => {
        item.id = null;
        item.children = item.children.filter(child => child.children && child.children.length > 0)
        item.children.forEach(child => {
          child.id = null;
          child.children.forEach(s => s.id = null);
        });
      });
      this.dataTable = data.children
      this.dataTableAll = data.children
      if (this.dataTable && this.dataTable.length > 0) {
        await this.selectRow(this.dataTable[0]);
      }
      this.danhSachDieuChinh = this.danhSachDieuChinh.filter(item => item.soQdPd === data.soQdPd);
      this.formData.patchValue({
        lanDieuChinh: this.danhSachDieuChinh.length + 1
      });
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadHopDong() {
    try {
      let body = {
        namHd: this.formData.value.namKh,
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.DA_KY,
      }
      const res = await this.hopDongBttService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS && res.data.content) {
        this.listDataHopDong = res.data.content.filter(item => item.idHd === null);
      }
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  validateHopDong(data?) {
    const filterChildren = (children) => {
      const soLuongArray = children.map(item => ({
        idDtl: item.id,
        soLuong: this.listDataHopDong
          .filter(s => s.idChaoGia === item.id)
          .reduce((prev, cur) => prev + cur.soLuong, 0)
      }));
      return children.filter(child => {
        const correspondingSoLuong = soLuongArray.find(item => item.idDtl === child.id);
        return correspondingSoLuong && child.tongSoLuong > correspondingSoLuong.soLuong;
      });
    };
    if (data) {
      this.listDataHopDong = this.listDataHopDong.filter(item => item.soQdPd === data.soQdPd);
      data.children = filterChildren(data.children);
      data.children.forEach(item => {
        const element = this.listDataHopDong.filter(hopDong => hopDong.idChaoGia === item.id);
        element.forEach(element1 => {
          if (element1.children && element1.children.length > 0) {
            element1.children.forEach(element2 => {
              element2.children.forEach(element3 => {
                item.children.forEach(child => {
                  child.children = child.children.filter(s => s.maDviTsan !== element3.maDviTsan
                    && s.maDiemKho !== element3.maDiemKho
                    && s.maNhaKho !== element3.maNhaKho
                    && s.maNganKho !== element3.maNganKho
                    && s.maLoKho !== element3.maLoKho)
                })
              })
            })
          }
          if (element1.xhHopDongBttDviList && element1.xhHopDongBttDviList.length > 0) {
            element1.xhHopDongBttDviList.forEach(element2 => {
              item.children.forEach(child => {
                child.children = child.children.filter(s => s.maDviTsan !== element2.maDviTsan
                  && s.maDiemKho !== element2.maDiemKho
                  && s.maNhaKho !== element2.maNhaKho
                  && s.maNganKho !== element2.maNganKho
                  && s.maLoKho !== element2.maLoKho)
              })
            })
          }
        })
      })
    } else {
      this.danhSachQdPdKeHoach.forEach(element => {
        element.children = filterChildren(element.children);
      });
    }
  }

  async loadDanhSachDieuChinh() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
      type: 'QDDC',
    }
    const res = await this.quyetDinhPdKhBanTrucTiepService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.danhSachDieuChinh = data
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soQdCanDc"].setValidators([Validators.required]);
      const soCongVan = this.formData.value.soCongVan;
      const soQdDc = this.formData.value.soQdDc;
      const body = {
        ...this.formData.value,
        soCongVan: soCongVan ? soCongVan + this.maConVan : null,
        soQdDc: soQdDc ? soQdDc + this.maHauTo : null,
        children: this.dataTable,
        canCuPhapLy: this.canCuPhapLy,
        fileDinhKem: this.fileDinhKem,
        fileDinhKemDc: this.fileDinhKemDc,
      };
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      if (trangThai === STATUS.BAN_HANH) {
        this.setValidForm();
      }
      const soCongVan = this.formData.value.soCongVan;
      const soQdDc = this.formData.value.soQdDc;
      const body = {
        ...this.formData.value,
        soCongVan: soCongVan ? soCongVan + this.maConVan : null,
        soQdDc: soQdDc ? soQdDc + this.maHauTo : null,
        children: this.dataTable,
        canCuPhapLy: this.canCuPhapLy,
        fileDinhKem: this.fileDinhKem,
        fileDinhKemDc: this.fileDinhKemDc,
      }
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi duyệt:", error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  index = 0;

  async selectRow(data: any) {
    if (!data.selected) {
      this.dataTable.forEach(item => item.selected = false);
      data.selected = true;
      const findndex = this.dataTable.findIndex(child => child.soDxuat == data.soDxuat);
      const findndexCache = this.dataTableAll.findIndex(child => child.soDxuat == data.soDxuat);
      this.index = findndex
      this.dataInput = this.dataTable[findndex];
      this.dataTableAll[findndexCache].children = this.dataTableAll[findndexCache].children
        .filter(child => this.dataTable[findndex].children.some(selectedChild => selectedChild.maDvi === child.maDvi));
      let soLuongCuc = this.dataTableAll[findndexCache].children.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0);
      this.dataTableAll[findndexCache].tongSoLuong = soLuongCuc || 0;
      this.dataInputCache = this.dataTableAll[findndexCache];
    }
  }

  async receiveDataFromChild(data: any) {
    if (this.dataTable[this.index]) {
      if (data.hasOwnProperty('tongSoLuong')) {
        this.dataTable[this.index].tongSoLuong = data.tongSoLuong;
      }
      if (data.hasOwnProperty('thanhTien')) {
        this.dataTable[this.index].tienDeXuat = data.thanhTien;
      }
      if (data.hasOwnProperty('thanhTienDuocDuyet')) {
        this.dataTable[this.index].thanhTienDuocDuyet = data.thanhTienDuocDuyet;
      }
      if (data.hasOwnProperty('tgianDkienTu')) {
        this.dataTable[this.index].tgianDkienTu = data.tgianDkienTu;
      }
      if (data.hasOwnProperty('tgianDkienDen')) {
        this.dataTable[this.index].tgianDkienDen = data.tgianDkienDen;
      }
    }
  }

  setValidForm() {
    const requiredFields = [
      "namKh",
      "soCongVan",
      "ngayTaoCongVan",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "tchuanCluong",
      "soQdDc",
      "ngayKyDc",
      "ngayHlucDc"
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
