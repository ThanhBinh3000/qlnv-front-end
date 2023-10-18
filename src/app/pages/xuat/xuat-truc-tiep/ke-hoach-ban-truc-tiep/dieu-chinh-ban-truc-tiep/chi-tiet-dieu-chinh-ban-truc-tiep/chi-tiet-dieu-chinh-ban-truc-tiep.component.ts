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
import {
  QuyetDinhDcBanttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/dieuchinh-kehoach-bantt/quyet-dinh-dc-bantt.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

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
  maConVan: any;
  maHauTo: any;
  danhSachQdPdKeHoach: any[] = [];
  selected: boolean = false;
  dataInput: any[] = [];
  dataInputCache: any[] = [];
  danhSachDieuChinh: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private quyetDinhDcBanttService: QuyetDinhDcBanttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDcBanttService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      namKh: [''],
      soCongVan: [''],
      ngayTaoCongVan: [''],
      trichYeu: [''],
      idQdPd: [],
      soQdPd: [''],
      lanDieuChinh: [],
      ngayKyQd: [''],
      soQdCc: [''],
      soQdDc: [''],
      idDcGoc: [],
      ngayKyDc: [''],
      ngayHlucDc: [''],
      noiDungDieuChinh: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      slDviTsan: [],
      slHdongDaKy: [],
      thoiHanGiaoNhan: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenTrangThai: [''],
      fileToTrinh: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
      fileCanCu: [new Array<FileDinhKem>()],
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
    })
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id)
    if (!data) {
      console.error('Không tìm thấy dữ liệu');
      return;
    }
    const {soCongVan, soQdDc, children} = data;
    this.formData.patchValue({
      soCongVan: soCongVan?.split('/')[0],
      soQdDc: soQdDc?.split('/')[0],
    })
    this.dataTable = children;
    await this.showFirstRow(event, 0);
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
      const res = await this.quyetDinhPdKhBanTrucTiepService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const soQdPdSet = new Set(this.danhSachDieuChinh.map(item => item.soQdPd));
        this.danhSachQdPdKeHoach = res.data.content.filter(item => !soQdPdSet.has(item.soQdPd));
        this.danhSachQdPdKeHoach.push(...this.danhSachDieuChinh);
        this.danhSachQdPdKeHoach = this.danhSachQdPdKeHoach.map(item => {
          item.soQd = item.soQdDc ? item.soQdDc : item.soQdPd;
          item.ngayKy = item.ngayKyDc ? item.ngayKyDc : item.ngayKyQd;
          return item;
        });
      } else if (res && res.msg) {
        this.notification.error(MESSAGE.ERROR, res.msg);
      } else {
        this.notification.error(MESSAGE.ERROR, 'Unknown error occurred.');
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH PHÊ DUYỆT KẾ HOẠCH BÁN TRỰC TIẾP',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachQdPdKeHoach,
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
    if (datasearch.id <= 0) return;
    try {
      await this.spinner.show();
      const service = datasearch.soQdDc ? this.quyetDinhDcBanttService : this.quyetDinhPdKhBanTrucTiepService;
      const res = await service.getDetail(datasearch.id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data
      this.formData.patchValue({
        idQdPd: datasearch.soQdDc ? data.idQdPd : datasearch.id,
        soQdPd: data.soQdPd,
        ngayKyQd: data.ngayKyQd,
        idDcGoc: datasearch.soQdDc ? data.id : '',
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
      })
      if (data.children && data.children.length > 0) {
        this.dataTable = data.children
        await this.showFirstRow(event, 0);
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
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH,
    }
    const res = await this.quyetDinhDcBanttService.search(body)
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

  resetIds(data) {
    data.forEach((item) => {
      item.id = null;
      item.lastest = null;
      item.isDieuChinh = null;
      if (item.children && item.children.length > 0) {
        this.resetIds(item.children);
      }
    });
  }

  async save() {
    try {
      this.resetIds(this.dataTable);
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soCongVan"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdDc"].setValidators([Validators.required]);
      const soCongVan = this.formData.value.soCongVan;
      const soQdDc = this.formData.value.soQdDc;
      const body = {
        ...this.formData.value,
        soCongVan: soCongVan ? soCongVan + this.maConVan : null,
        soQdDc: soQdDc ? soQdDc + this.maHauTo : null,
        children: this.dataTable,
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
      this.setValidForm();
      this.resetIds(this.dataTable);
      const soCongVan = this.formData.value.soCongVan;
      const soQdDc = this.formData.value.soQdDc;
      const body = {
        ...this.formData.value,
        soCongVan: soCongVan ? soCongVan + this.maConVan : null,
        soQdDc: soQdDc ? soQdDc + this.maHauTo : null,
        children: this.dataTable,
      }
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi duyệt:", error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async showFirstRow($event, index: number) {
    await this.showDetail($event, index);
  }

  index = 0;

  async showDetail($event, index: number) {
    if ($event.type == 'click') {
      const selectedRow = $event.target.parentElement;
      const previouslySelectedRow = selectedRow.parentElement.querySelector('.selectedRow');
      if (previouslySelectedRow) {
        previouslySelectedRow.classList.remove('selectedRow');
      }
      selectedRow.classList.add('selectedRow');
      this.selected = false;
      this.index = index
    } else {
      this.selected = true
    }
    this.dataInput = this.dataTable[index];
    const id = this.formData.value.idDcGoc || this.formData.value.idQdPd;
    if (id) {
      const service = this.formData.value.idDcGoc ? this.quyetDinhDcBanttService : this.quyetDinhPdKhBanTrucTiepService;
      const res = await service.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS && res.data) {
        const data = res.data;
        this.dataInputCache = data.children.find(item => item.soDxuat === this.dataTable[index].soDxuat) ?? null;
      }
    }
    await this.spinner.hide();
  }

  async receiveDataFromChild(data: any) {
    if (this.dataTable[this.index]) {
      if (data.hasOwnProperty('tongSoLuong')) {
        this.dataTable[this.index].tongSoLuong = data.tongSoLuong;
      }
      if (data.hasOwnProperty('thanhTien')) {
        this.dataTable[this.index].thanhTien = data.thanhTien;
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
      "ngayTaoCongVan",
      "trichYeu",
      "ngayKyQd",
      "soQdCc",
      "tenLoaiHinhNx",
      "tenKieuNx",
      "tenLoaiVthh",
      "tenCloaiVthh",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}



