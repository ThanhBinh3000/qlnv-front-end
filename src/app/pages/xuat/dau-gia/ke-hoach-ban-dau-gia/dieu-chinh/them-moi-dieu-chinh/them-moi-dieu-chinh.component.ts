import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhPdKhBdgService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-them-moi-dieu-chinh',
  templateUrl: './them-moi-dieu-chinh.component.html',
  styleUrls: ['./them-moi-dieu-chinh.component.scss']
})
export class ThemMoiDieuChinhComponent extends Base2Component implements OnInit {
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
  fileDinhKemDc: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      id: [],
      nam: [],
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
      trangThai: [''],
      lyDoTuChoi: [''],
      ngayTao: [''],
      nguoiTaoId: [''],
      ngaySua: [''],
      nguoiSuaId: [''],
      ngayGuiDuyet: [''],
      nguoiGuiDuyetId: [''],
      ngayPduyet: [''],
      nguoiPduyetId: [''],
      soCongVan: [''],
      ngayTaoCongVan: [''],
      lanDieuChinh: [],
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
      nam: dayjs().get('year'),
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
      let res = await this.quyetDinhPdKhBdgService.getDetail(data.idGoc);
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
        nam: this.formData.value.nam,
        trangThai: STATUS.BAN_HANH,
        lastest: 1
      }
      await this.loadDanhSachDieuChinh();
      const res = await this.quyetDinhPdKhBdgService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQdPdKeHoach = res.data.content.map(item => ({
          soQd: item.soQdDc || item.soQdPd,
          ngayKy: item.ngayKyDc || item.ngayKyQd,
          ...item
        }));
        const idGocSet = new Set(this.danhSachDieuChinh.map(item => item.idGoc));
        this.danhSachQdPdKeHoach = this.danhSachQdPdKeHoach.filter(item => !idGocSet.has(item.id))
        this.danhSachQdPdKeHoach.forEach(item => {
          item.children = item.children.filter(item => item.trangThai !== STATUS.DA_HOAN_THANH);
        })
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH PHÊ DUYỆT KẾ HOẠCH BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachQdPdKeHoach.filter(item => item.children.length > 0),
          dataHeader: ['Số quyết định cần điều chỉnh', 'Ngày ký quyết định cần điều chỉnh', 'Loại hàng hóa'],
          dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh']
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
    this.dataTable = [];
    this.dataTableAll = [];
    try {
      await this.spinner.show();
      const res = await this.quyetDinhPdKhBdgService.getDetail(datasearch.id);
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
        slDviTsan: data.slDviTsan,
        phanLoai: data.phanLoai,
      })
      data.children.forEach(item => {
        item.id = null;
        item.children.forEach(child => {
          child.id = null;
          child.children.forEach(s => s.id = null);
        });
      });
      this.dataTable = data.children.filter(item => item.trangThai !== STATUS.DA_HOAN_THANH)
      this.dataTableAll = data.children.filter(item => item.trangThai !== STATUS.DA_HOAN_THANH)
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

  async loadDanhSachDieuChinh() {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
      type: 'QDDC',
    }
    const res = await this.quyetDinhPdKhBdgService.search(body)
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
      this.dataInputCache = this.dataTableAll[findndexCache];
    }
  }

  receiveDataFromChild(data: any) {
    if (this.dataTable[this.index]) {
      if (data.hasOwnProperty('tongSoLuong')) {
        this.dataTable[this.index].tongSoLuong = data.tongSoLuong;
      }
      if (data.hasOwnProperty('tongTienKhoiDiemDx')) {
        this.dataTable[this.index].tongTienKhoiDiemDx = data.tongTienKhoiDiemDx;
      }
      if (data.hasOwnProperty('tongTienDuocDuyet')) {
        this.dataTable[this.index].tongTienDuocDuyet = data.tongTienDuocDuyet;
      }
      if (data.hasOwnProperty('tongTienDatTruocDx')) {
        this.dataTable[this.index].tongTienDatTruocDx = data.tongTienDatTruocDx;
      }
      if (data.hasOwnProperty('tongKtienDtruocDduyet')) {
        this.dataTable[this.index].tongKtienDtruocDduyet = data.tongKtienDtruocDduyet;
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
      "nam",
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
