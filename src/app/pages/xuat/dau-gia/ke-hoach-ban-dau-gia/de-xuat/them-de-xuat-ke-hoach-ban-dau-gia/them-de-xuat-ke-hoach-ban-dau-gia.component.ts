import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import {API_STATUS_CODE, LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {STATUS} from "../../../../../../constants/status";
import {QuyetDinhGiaTCDTNNService} from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import {DanhSachPhanLo} from 'src/app/models/KeHoachBanDauGia';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {QuyetDinhGiaCuaBtcService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})

export class ThemDeXuatKeHoachBanDauGiaComponent extends Base2Component implements OnInit, OnChanges {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() showFromTH: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  listPhuongThucThanhToan: any[] = [];
  dataChiTieu: any;
  listVatTuCha: any[] = [];
  listVatTu = [];
  maHauTo: any;
  giaToiDa: any;
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;
  dataDonGiaDuocDuyet: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChi: [],
      namKh: [],
      soDxuat: [''],
      trichYeu: [''],
      idSoQdCtieu: [],
      soQdCtieu: [''],
      ngayTao: [''],
      ngayPduyet: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      thoiGianDuKien: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBao: [''],
      khoanTienDatTruoc: [],
      tongSoLuong: [0],
      tongTienKhoiDiemDx: [0],
      tongTienGiaKdTheoDgiaDd: [0],
      tongTienDatTruocDx: [0],
      tongKhoanTienDtTheoDgiaDd: [0],
      ghiChu: [''],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      tongDonGiaDx: [],
      donViTinh: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_TR;
      if (this.idInput === 0) {
        await this.initForm();
      }
      await this.loadDataComboBox();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeNamKh() {
    const shouldGetData = this.userService.isCuc() || this.idInput === 0;
    if (shouldGetData) {
      await this.getDataChiTieu();
    }
  }

  async initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_PHONG_BAN,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
      namKh: dayjs().get('year'),
      ngayTao: dayjs().format('YYYY-MM-DD'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      loaiVthh: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '' : this.loaiVthh
    })
    await Promise.all([
      this.getDataChiTieu(),
      this.loadDsVthh()
    ]);
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.getDetail(this.idInput);
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    if (!data) return;
    const {soDxuat, tgianDkienTu, tgianDkienDen, children, loaiVthh} = data;
    this.formData.patchValue({
      soDxuat: soDxuat?.split('/')[0],
      thoiGianDuKien: tgianDkienTu && tgianDkienDen ? [tgianDkienTu, tgianDkienDen] : null
    });
    this.dataTable = children;
    await Promise.all([this.getGiaToiThieu(), this.donGiaDuocDuyet()]);
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      await this.onChangeLoaiVthh(loaiVthh);
    }
  }

  async loadDsVthh() {
    const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg !== MESSAGE.SUCCESS || !res.data) return;
    let tenLoaiVthh = null;
    if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
      const loaiVthhItem = res.data.find(item => item.children?.some(child => child.ma === this.loaiVthh));
      if (loaiVthhItem) tenLoaiVthh = loaiVthhItem.children.find(child => child.ma === this.loaiVthh)?.ten;
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
      const muoiItem = res.data.find(item => item.ma === this.loaiVthh);
      if (muoiItem) tenLoaiVthh = muoiItem.ten;
    }
    this.formData.patchValue({
      tenLoaiVthh: tenLoaiVthh,
    });
  }

  async loadDataComboBox() {
    const fetchData = async (fieldName, targetArray, filterCondition) => {
      const res = await this.danhMucService.danhMucChungGetAll(fieldName);
      if (res.msg === MESSAGE.SUCCESS) {
        targetArray.push(...res.data.filter(filterCondition));
      }
    };
    await Promise.all([
      fetchData('LOAI_HINH_NHAP_XUAT', this.listLoaiHinhNx, item => item.apDung === 'XUAT_DG'),
      fetchData('KIEU_NHAP_XUAT', this.listKieuNx, () => true),
      fetchData('PHUONG_THUC_TT', this.listPhuongThucThanhToan, () => true),
    ]);
  }

  onChangeLhNx($event) {
    const dataNx = this.listLoaiHinhNx.find(item => item.ma === $event);
    if (dataNx) {
      this.formData.patchValue({
        kieuNx: dataNx.ghiChu
      });
    }
  }

  selectHangHoa() {
    this.dataTable = [];
    const modalTuChoi = this.modal.create({
      nzTitle: 'DANH SÁCH HÀNG HÓA',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: this.loaiVthh
      }
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (data.ma.startsWith(LOAI_HANG_DTQG.MUOI)) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
            donViTinh: data.parent.maDviTinh
          });
        } else {
          this.formData.patchValue({
            cloaiVthh: data.cap == 3 ? data.ma : null,
            tenCloaiVthh: data.cap == 3 ? data.ten : null,
            loaiVthh: data.cap == 3 ? data.parent.ma : data.ma,
            tenLoaiVthh: data.cap == 3 ? data.parent.ten : data.ten,
            donViTinh: data.cap == 3 ? data.parent.maDviTinh : null,
          });
        }
        await Promise.all([this.getGiaToiThieu(), this.donGiaDuocDuyet()]);
      }
    });
  }

  async onChangeLoaiVthh(event, isCloai?) {
    if (isCloai) {
      this.formData.patchValue({cloaiVthh: null, tenCloaiVthh: null});
    }
    const filteredVatTu = (this.dataChiTieu?.khVatTuXuat || []).filter(item => item.maVatTuCha === event);
    const uniqueVatTu = [...new Set(filteredVatTu.map(item => item.maVatTu))].map(maVatTu => {
      const vatTuItem = filteredVatTu.find(item => item.maVatTu === maVatTu);
      return {maVatTu: vatTuItem.maVatTu, tenVatTu: vatTuItem.tenVatTu};
    });
    this.listVatTu = uniqueVatTu;
    if (isCloai) {
      const vatTu = filteredVatTu[0];
      this.formData.patchValue({donViTinh: vatTu?.donViTinh, tenCloaiVthh: vatTu?.tenVatTu});
    }
  }

  async onChangeCloaiVthh() {
    await Promise.all([
      this.getGiaToiThieu(),
      this.donGiaDuocDuyet()
    ]);
  }

  async getGiaToiThieu(event?) {
    const {namKh, loaiVthh, cloaiVthh} = this.formData.value;
    const body = {
      namKeHoach: namKh,
      loaiVthh: loaiVthh,
      cloaiVthh: cloaiVthh,
      loaiGia: "LG02",
      maDvi: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '0101' : this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH
    };
    const res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res.msg !== MESSAGE.SUCCESS || !res.data || res.data.length === 0) {
      return;
    }
    let giaToiDa = 0;
    res.data.forEach((item) => {
      const giaQdBtc = item.giaQdBtc != null && item.giaQdBtc > 0 ? item.giaQdBtc : item.giaQdDcBtc;
      giaToiDa = Math.max(giaToiDa, giaQdBtc);
    });
    this.giaToiDa = giaToiDa;
    const resTC = await this.dmTieuChuanService.getDetailByMaHh(cloaiVthh);
    if (resTC.statusCode === API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: resTC.data ? resTC.data.tenQchuan : null,
      });
    }
  }

  async donGiaDuocDuyet() {
    const {namKh, loaiVthh, cloaiVthh} = this.formData.value;
    const bodyPag = {
      namKeHoach: namKh,
      loaiVthh: loaiVthh,
      cloaiVthh: cloaiVthh,
      trangThai: STATUS.BAN_HANH,
      maDvi: this.formData.value.maDvi.substring(0, 6),
      loaiGia: 'LG04'
    };
    const pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag);
    if (pag.msg !== MESSAGE.SUCCESS) {
      return;
    }
    this.dataDonGiaDuocDuyet = pag.data || null;
    await this.calculatorTable();
  }

  async themMoiBangPhanLoTaiSan($event, data?: DanhSachPhanLo, index?: number) {
    $event.stopPropagation();
    const loaiVthhValue = this.formData.get('loaiVthh').value;
    const cloaiVthhValue = this.formData.get('cloaiVthh').value;
    const khoanTienDatTruoc = this.formData.get('khoanTienDatTruoc').value;
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) && !loaiVthhValue) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    if (!loaiVthhValue || !cloaiVthhValue) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa và chủng loại hàng hóa');
      return;
    }
    if (!khoanTienDatTruoc) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
      return;
    }
    if (this.validateGiaGiaToiDa()) {
      const modalGT = this.modal.create({
        nzTitle: 'THÊM ĐỊA ĐIỂM GIAO NHẬN HÀNG',
        nzContent: DialogThemDiaDiemPhanLoComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '2500px',
        nzFooter: null,
        nzComponentParams: {
          dataEdit: data,
          dataChiTieu: this.dataChiTieu,
          dataDonGiaDuocDuyet: this.dataDonGiaDuocDuyet,
          loaiVthh: loaiVthhValue,
          cloaiVthh: cloaiVthhValue,
          tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
          khoanTienDatTruoc: khoanTienDatTruoc,
          namKh: this.formData.get('namKh').value,
          donViTinh: this.formData.get('donViTinh').value,
          giaToiDa: this.giaToiDa,
        },
      });
      modalGT.afterClose.subscribe((data) => {
        if (!data) {
          return;
        }
        if (index >= 0) {
          this.dataTable[index] = data;
        } else {
          if (!this.validateAddDiaDiem(data)) {
            return;
          }
          this.dataTable.push(data);
        }
        this.calculatorTable();
      });
    }
  }

  validateGiaGiaToiDa() {
    const isGiaToiDaValid = this.giaToiDa !== null;
    if (!isGiaToiDaValid) {
      this.notification.error(MESSAGE.ERROR, 'Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá bán tối thiểu bạn mới thêm được danh mục đơn vị tài sản BDG vì giá bán đề xuất ở đây nhập vào phải >= giá bán tối thiểu');
    }
    return isGiaToiDaValid;
  }

  validateAddDiaDiem(dataAdd): boolean {
    const existingData = this.dataTable.find(item => item.maDvi === dataAdd.maDvi);
    if (existingData) {
      const errorMessage = `${existingData.tenDvi} đã tồn tại. Vui lòng thêm chi cục khác`;
      this.notification.error(MESSAGE.ERROR, errorMessage);
      return false;
    }
    return true;
  }

  calculatorTable() {
    this.dataTable.forEach((item) => {
      item.tongGiaKdiemDx = 0;
      item.tongGiaKdiemDd = 0;
      item.tongTienDtruocDd = 0;
      item.tongTienDatTruocDx = 0;
      const donGiaMap = new Map();
      if (this.dataDonGiaDuocDuyet && this.dataDonGiaDuocDuyet.length > 0) {
        this.dataDonGiaDuocDuyet.forEach((item) => {
          donGiaMap.set(item.maChiCuc, item.giaQdTcdt);
        });
      }
      let donGiaDuocDuyet = 0;
      if (this.loaiVthh === LOAI_HANG_DTQG.VAT_TU) {
        const firstItem = this.dataDonGiaDuocDuyet?.[0];
        donGiaDuocDuyet = firstItem?.giaQdTcdt || 0;
      } else {
        donGiaDuocDuyet = donGiaMap.get(item.maDvi);
      }
      item.children.forEach((child) => {
        child.donGiaDuocDuyet = donGiaDuocDuyet || null;
        child.giaKhoiDiemDd = child.soLuongDeXuat * (donGiaDuocDuyet || 0);
        child.soTienDtruocDd = child.soLuongDeXuat * (donGiaDuocDuyet || 0) * this.formData.value.khoanTienDatTruoc / 100;
      });
      item.tongGiaKdiemDx = item.children.map(child => child.giaKhoiDiemDx).reduce((prev, cur) => prev + cur, 0);
      item.tongGiaKdiemDd = item.children.map(child => child.giaKhoiDiemDd).reduce((prev, cur) => prev + cur, 0);
      item.tongTienDtruocDd = item.children.map(child => child.soTienDtruocDd).reduce((prev, cur) => prev + cur, 0);
      item.tongTienDatTruocDx = item.children.map(child => child.soTienDtruocDx).reduce((prev, cur) => prev + cur, 0);
    });
    this.formData.patchValue({
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.tongSlXuatBanDx, 0),
      tongTienKhoiDiemDx: this.dataTable.reduce((prev, cur) => prev + cur.tongGiaKdiemDx, 0),
      tongTienGiaKdTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongGiaKdiemDd, 0),
      tongTienDatTruocDx: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDatTruocDx, 0),
      tongKhoanTienDtTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDtruocDd, 0),
    });
  }

  deleteRow(i: number) {
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
          this.dataTable = this.dataTable.filter((item, index) => index != i);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      if (!this.validateNgay()) return;
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
      const body = {
        ...this.formData.value,
        soDxuat: this.formData.value.soDxuat ? this.formData.value.soDxuat + this.maHauTo : null,
        tgianDkienTu: null,
        tgianDkienDen: null,
        children: this.dataTable
      };
      const thoiGianDuKienValue = this.formData.get('thoiGianDuKien').value;
      if (thoiGianDuKienValue) {
        body.tgianDkienTu = this.formatDate(thoiGianDuKienValue, 0);
        body.tgianDkienDen = this.formatDate(thoiGianDuKienValue, 1);
      }
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (e) {
      console.log('error', e);
    }
  }

  formatDate(dateRange, index) {
    return dateRange ? dayjs(dateRange[index]).format('YYYY-MM-DD') : null;
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    if (this.dataTable.length === 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách danh mục tài sản bán đấu giá không được để trống');
      return;
    }
    if (!this.validatemaDviTsan()) return;
    const body = {
      ...this.formData.value,
      soDxuat: this.formData.value.soDxuat ? this.formData.value.soDxuat + this.maHauTo : null,
      tgianDkienTu: null,
      tgianDkienDen: null,
      children: this.dataTable
    };
    const thoiGianDuKienValue = this.formData.get('thoiGianDuKien').value;
    if (thoiGianDuKienValue) {
      body.tgianDkienTu = this.formatDate(thoiGianDuKienValue, 0);
      body.tgianDkienDen = this.formatDate(thoiGianDuKienValue, 1);
    }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async getDataChiTieu() {
    const namKhValue = +this.formData.get('namKh').value;
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(namKhValue);
    this.dataChiTieu = res2.msg === MESSAGE.SUCCESS ? res2.data : null;
    const patchValues = {
      soQdCtieu: this.dataChiTieu?.soQuyetDinh || null,
      idSoQdCtieu: this.dataChiTieu?.id || null
    };
    this.formData.patchValue(patchValues);
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) && Array.isArray(this.dataChiTieu.khVatTuXuat) && this.dataChiTieu.khVatTuXuat.length > 0) {
      const uniqueVatTuCha = this.dataChiTieu.khVatTuXuat
        .filter((item, index, self) => item.maVatTuCha !== null && index === self.findIndex(x => x.maVatTuCha === item.maVatTuCha))
        .map(item => ({maVatTuCha: item.maVatTuCha, tenVatTuCha: item.tenVatTuCha}));
      this.listVatTuCha = uniqueVatTuCha;
    } else {
      this.listVatTuCha = [];
    }
  }

  validatemaDviTsan(): boolean {
    if (this.dataTable && this.dataTable.length > 0) {
      const data = this.dataTable.flatMap(s => s.children);
      const checkMaDviTsan = {};
      data.forEach(item => {
        const maDviTsan = item.maDviTsan;
        checkMaDviTsan[maDviTsan] = (checkMaDviTsan[maDviTsan] || 0) + 1;
      });
      const duplicateMdvts = Object.entries(checkMaDviTsan)
        .filter(([_, count]) => count > 1)
        .map(([maDviTsan, count]) => `${maDviTsan} (hiện đang bị lặp lại ${count} lần)`);
      if (duplicateMdvts.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Mã đơn vị tài sản " + duplicateMdvts.join(', ') + " vui lòng nhập lại");
        return false;
      }
    }
    return true;
  }

  validateNgay() {
    const {ngayTao, ngayPduyet} = this.formData.value;
    if (ngayPduyet && new Date(ngayTao) > new Date(ngayPduyet)) {
      this.notification.error(MESSAGE.ERROR, "Ngày tạo không được vượt quá ngày phê duyệt");
      return false;
    }
    return true;
  }

  calcTong(columnName) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[columnName] || 0), 0);
  }

  setValidForm() {
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["diaChi"].setValidators([Validators.required]);
    this.formData.controls["namKh"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["ngayTao"].setValidators([Validators.required]);
    this.formData.controls["soQdCtieu"].setValidators([Validators.required]);
    this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    this.formData.controls["thoiGianDuKien"].setValidators([Validators.required]);
    this.formData.controls["tgianTtoan"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["tgianGnhan"].setValidators([Validators.required]);
    this.formData.controls["thongBao"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    if (!LOAI_HANG_DTQG.VAT_TU) {
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    }
  }
}
