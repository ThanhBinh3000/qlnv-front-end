import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import {MESSAGE} from "../../../../../constants/message";
import {LOAI_HANG_DTQG} from "../../../../../constants/config";
import {DauGiaComponent} from "../../dau-gia.component";
import {CHUC_NANG} from "../../../../../constants/status";

@Component({
  selector: 'app-danh-sach-quyet-dinh-phe-duyet-ket-qua',
  templateUrl: './danh-sach-quyet-dinh-phe-duyet-ket-qua.component.html',
  styleUrls: ['./danh-sach-quyet-dinh-phe-duyet-ket-qua.component.scss']
})
export class DanhSachQuyetDinhPheDuyetKetQuaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idThongTin: number = 0;
  isViewThongTin: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dauGiaComponent: DauGiaComponent,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      nam: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      soQdKq: [null],
      trichYeu: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      maDvi: [null]
    });
    this.filterTable = {
      nam: '',
      soQdKq: '',
      ngayPduyet: '',
      trichYeu: '',
      ngayKy: '',
      soQdPd: '',
      maThongBao: '',
      tenHinhThucDauGia: '',
      tenPthucDauGia: '',
      soTbKhongThanh: '',
      soBienBan: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search(),
        this.loadDsVthh(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([
      this.timKiem(),
      this.search()
    ])
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async loadDsVthh() {
    const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg !== MESSAGE.SUCCESS) return;
    const matchingItem = res.data.find(item => (
      (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) ?
        item.children.some(child => child.ma === this.loaiVthh) :
        item.ma === this.loaiVthh
    ));
    if (!matchingItem) return;
    if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
      this.listCloaiVthh = matchingItem.children.find(child => child.ma === this.loaiVthh)?.children || [];
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
      this.listCloaiVthh = matchingItem.children || [];
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.listVthh = matchingItem.children || [];
    }
  }

  onChangeCloaiVthh(event) {
    this.formData.patchValue({
      cloaiVthh: null,
      tenCloaiVthh: null,
    });
    const selectedData = this.listVthh.find(item => item.ma === event);
    this.listCloaiVthh = selectedData ? selectedData.children : [];
  }

  openModal(id: number, modalType: string) {
    if (modalType === 'QdPd') {
      this.idQdPd = id;
      this.isViewQdPd = true;
    } else if (modalType === 'MaThongBao') {
      this.idThongTin = id;
      this.isViewThongTin = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'QdPd') {
      this.idQdPd = null;
      this.isViewQdPd = false;
    } else if (modalType === 'MaThongBao') {
      this.idThongTin = null;
      this.isViewThongTin = false;
    }
  }

  disabledNgayKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
  };

  disabledNgayKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };
}
