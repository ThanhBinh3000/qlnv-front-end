import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {STATUS} from "../../../../../../constants/status";
import {DanhSachXuatBanTrucTiep} from 'src/app/models/KeHoachBanDauGia';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  DeXuatKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import {
  DialogThemMoiXuatBanTrucTiepComponent
} from 'src/app/components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {QuyetDinhGiaCuaBtcService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'app-them-moi-de-xuat-kh-ban-truc-tiep',
  templateUrl: './them-moi-de-xuat-kh-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-de-xuat-kh-ban-truc-tiep.component.scss']
})

export class ThemMoiDeXuatKhBanTrucTiepComponent extends Base2Component implements OnInit, OnChanges {
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
  listVatTu = [];
  listVatTuCha: any[] = [];
  maHauTo: any;
  giaToiDa: number;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanTrucTiepService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      diaChi: [''],
      namKh: [],
      soDxuat: [''],
      trichYeu: ['',],
      ngayTao: [''],
      ngayPduyet: [''],
      idSoQdCtieu: [],
      soQdCtieu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      ghiChuTgianDkien: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [],
      pthucGnhan: [''],
      thongBao: [''],
      tongSoLuong: [],
      thanhTien: [],
      thanhTienDuocDuyet: [],
      ghiChu: [''],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      slDviTsan: [],
      donViTinh: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenPthucTtoan: [''],
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
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeNamKh() {
    if (!this.isView) {
      await Promise.all([
        this.getDataChiTieu(),
        this.getGiaToiThieu()
      ]);
    }
  }

  async initForm() {
    const {TEN_PHONG_BAN, MA_DVI, DON_VI} = this.userInfo;
    this.formData.patchValue({
      tenDvi: TEN_PHONG_BAN || null,
      maDvi: MA_DVI || null,
      diaChi: DON_VI.diaChi || null,
      namKh: dayjs().get('year'),
      ngayTao: dayjs().format('YYYY-MM-DD'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      loaiVthh: !this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? this.loaiVthh : null
    })
    await Promise.all([
      this.loadDsVthh(),
      this.getDataChiTieu()
    ]);
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.getDetail(this.idInput);
  }

  async getDetail(id: number) {
    if (id && id > 0) {
      const data = await this.detail(id);
      this.formData.patchValue({
        soDxuat: data.soDxuat?.split('/')[0]
      });
      this.dataTable = data.children;
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        await this.loaiVatTu(data);
      }
    }
  }

  async loaiVatTu(data) {
    this.listVatTuCha = [
      {
        maVatTuCha: data.loaiVthh,
        tenVatTuCha: data.tenLoaiVthh
      },
    ]
    this.listVatTu = [
      {
        maVatTu: data.cloaiVthh,
        tenVatTu: data.tenCloaiVthh
      },
    ]
  }

  async loadDsVthh() {
    const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res && res.msg === MESSAGE.SUCCESS && res.data) {
      let tenLoaiVthhItem = null;
      const data = res.data;
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.GAO) || this.loaiVthh.startsWith(LOAI_HANG_DTQG.THOC)) {
        const thocGaoItem = data.find(item => item.children?.some(child => child.ma === this.loaiVthh));
        tenLoaiVthhItem = thocGaoItem?.children.find(child => child.ma === this.loaiVthh)?.ten;
      } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
        const muoiItem = data.find(item => item.ma === this.loaiVthh);
        tenLoaiVthhItem = muoiItem?.ten;
      }
      this.formData.patchValue({
        tenLoaiVthh: tenLoaiVthhItem,
      });
    }
  }

  async loadDataComboBox() {
    const fetchData = async (fieldName, targetArray, filterCondition) => {
      const res = await this.danhMucService.danhMucChungGetAll(fieldName);
      if (res && res.msg === MESSAGE.SUCCESS && res.data) {
        targetArray.push(...res.data.filter(filterCondition));
      }
    };
    await Promise.all([
      this.isView ? null : fetchData('LOAI_HINH_NHAP_XUAT', this.listLoaiHinhNx, () => true),
      this.isView ? null : fetchData('KIEU_NHAP_XUAT', this.listKieuNx, () => true),
      fetchData('PHUONG_THUC_TT', this.listPhuongThucThanhToan, () => true),
    ]);
    if (!this.isView) {
      const findItemByApDung = (array, apDung) => array.find(item => item.apDung === apDung);
      const loaiHinhXuat = findItemByApDung(this.listLoaiHinhNx, 'XUAT_DG');
      const KieuXuat = findItemByApDung(this.listKieuNx, 'XUAT_DG');
      this.formData.patchValue({
        loaiHinhNx: loaiHinhXuat?.ma,
        tenLoaiHinhNx: loaiHinhXuat?.giaTri,
        kieuNx: KieuXuat?.ma,
        tenKieuNx: KieuXuat?.giaTri,
      });
    }
  }

  async selectHangHoa() {
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
        await Promise.all([
          this.getGiaToiThieu(),
          this.getDanhMucTieuChuan()
        ]);
      }
    });
  }


  async onChangeLoaiVthh(event, isCheck?) {
    if (isCheck) {
      this.formData.patchValue({
        cloaiVthh: null,
        tenCloaiVthh: null
      });
    }
    const filteredVatTu = (this.dataChiTieu?.khVatTuXuat || []).filter(item => item.maVatTuCha === event);
    const uniqueVatTu = [...new Set(filteredVatTu.map(item => item.maVatTu))].map(maVatTu => {
      const vatTuItem = filteredVatTu.find(item => item.maVatTu === maVatTu);
      return {
        maVatTu: vatTuItem.maVatTu,
        tenVatTu: vatTuItem.tenVatTu
      };
    });
    const listCloaiVthh = uniqueVatTu.filter(item => item.maVatTu != null && item.tenVatTu != null)
    if (listCloaiVthh.length > 0) {
      this.listVatTu = listCloaiVthh;
      this.formData.patchValue({
        donViTinh: filteredVatTu[0].donViTinh
      });
    } else {
      const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
      if (res && res.msg === MESSAGE.SUCCESS || res.data) {
        const data = res.data;
        const matchingItem = data.find(item => item.ma === this.loaiVthh);
        if (matchingItem) {
          const selectedData = matchingItem.children.find(item => item.ma === event);
          this.listVatTu = selectedData?.children.map(item => ({
            maVatTu: item.ma,
            tenVatTu: item.title
          }));
          this.formData.patchValue({
            donViTinh: selectedData?.children[0].maDviTinh
          });
        }
      }
    }
  }

  async onChangeCloaiVthh() {
    if (this.listVatTu) {
      const matchingItem = this.listVatTu.find(item => item?.maVatTu === this.formData.value.cloaiVthh);
      if (matchingItem) {
        this.formData.patchValue({
          tenCloaiVthh: matchingItem.tenVatTu || null
        });
      }
      await Promise.all([
        this.getGiaToiThieu(),
        this.getDanhMucTieuChuan()
      ]);
    }
  }

  async getGiaToiThieu() {
    const body = {
      loaiGia: "LG02",
      trangThai: STATUS.BAN_HANH,
      namKeHoach: this.formData.value.namKh,
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: this.formData.value.cloaiVthh,
      maDvi: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? this.formData.value.maDvi.substring(0, 4) : this.userInfo.MA_DVI
    };
    const res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res && res.msg === MESSAGE.SUCCESS && res.data) {
      let giaToiDa = 0;
      res.data.forEach((item) => {
        const giaQdBtc = item.giaQdDcBtc != null && item.giaQdDcBtc > 0 ? item.giaQdDcBtc : item.giaQdBtc;
        giaToiDa = Math.max(giaToiDa, giaQdBtc);
      });
      this.giaToiDa = giaToiDa;
    }
  }


  themMoiBangPhanLoTaiSan($event, data?: DanhSachXuatBanTrucTiep, index?: number) {
    $event.stopPropagation();
    if (!this.validateThemDiaDiem()) {
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiXuatBanTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        typeLoaiVthh: this.loaiVthh,
        dataOriginal: this.formData.value,
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

  validateThemDiaDiem(): boolean {
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      if (!this.formData.value.loaiVthh) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng DTQG');
        return false;
      }
    } else {
      if (!this.formData.value.loaiVthh || !this.formData.value.cloaiVthh) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng DTQG và chủng loại hàng DTQG');
        return false;
      }
    }
    const isGiaToiDaValid = this.giaToiDa !== null && this.giaToiDa !== 0 && this.giaToiDa !== undefined;
    if (!isGiaToiDaValid) {
      this.notification.error(MESSAGE.ERROR, 'Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá bán tối thiểu bạn mới thêm được danh mục đơn vị tài sản BTT vì giá bán đề xuất ở đây nhập vào phải lớn hơn hoặc bằng giá bán tối thiểu');
      return false;
    }
    return true;
  }

  async getDanhMucTieuChuan() {
    const loaiHangHoa = this.formData.value.cloaiVthh || this.formData.value.loaiVthh;
    if (loaiHangHoa) {
      let res = await this.danhMucService.getDetail(loaiHangHoa);
      if (res && res.msg === MESSAGE.SUCCESS && res.data.tieuChuanCl) {
        this.formData.patchValue({
          tchuanCluong: res.data.tieuChuanCl,
        });
      } else {
        this.formData.patchValue({
          tchuanCluong: null,
        });
      }
    }
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
      item.children.forEach((child) => {
        child.thanhTienDuocDuyet = child.soLuongDeXuat * child.donGiaDuocDuyet
      })
      item.tienDuocDuyet = item.children.map(child => child.thanhTienDuocDuyet).reduce((prev, cur) => prev + cur, 0)
      item.thanhTien = item.children.map(child => child.thanhTienDeXuat).reduce((prev, cur) => prev + cur, 0);
    })
    this.formData.patchValue({
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
      thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
      thanhTienDuocDuyet: this.dataTable.reduce((prev, cur) => prev + cur.tienDuocDuyet, 0),
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
          await this.calculatorTable();
          if (this.dataTable.length === 0) {
            this.formData.patchValue({
              tongSoLuong: null,
            })
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      if (!this.validateNgay()) {
        return;
      }
      const {soDxuat, ...formDataValue} = this.formData.value;
      const body = {
        ...formDataValue,
        soDxuat: soDxuat ? soDxuat + this.maHauTo : null,
        children: this.dataTable,
      };
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (error) {
      console.log('error', error);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      this.setValidForm();
      if (this.dataTable.length === 0) {
        this.notification.error(MESSAGE.ERROR, 'Danh sách danh mục tài sản bán đấu giá không được để trống');
        return;
      }
      // if (!this.validatemaDviTsan()){
      //   return;
      // }
      const {soDxuat, ...formDataValue} = this.formData.value;
      const body = {
        ...formDataValue,
        soDxuat: soDxuat ? soDxuat + this.maHauTo : null,
        children: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (error) {
      console.log('error', error);
    }
  }

  async getDataChiTieu() {
    const namKhValue = +this.formData.get('namKh').value;
    const res = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(namKhValue);
    if (res && res.msg === MESSAGE.SUCCESS || res.data) {
      this.dataChiTieu = res.data;
      this.formData.patchValue({
        soQdCtieu: this.dataChiTieu?.soQuyetDinh || null,
        idSoQdCtieu: this.dataChiTieu?.id || null
      })
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) && Array.isArray(this.dataChiTieu.khVatTuXuat) && this.dataChiTieu.khVatTuXuat.length > 0) {
        const uniqueVatTuCha = this.dataChiTieu.khVatTuXuat.filter((item, index, self) => item.maVatTuCha !== null && index === self.findIndex(value => value.maVatTuCha === item.maVatTuCha))
          .map(item => ({
            maVatTuCha: item.maVatTuCha,
            tenVatTuCha: item.tenVatTuCha
          }));
        this.listVatTuCha = uniqueVatTuCha || [];
      }
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
    if (!this.dataTable) {
      return 0;
    }
    return this.dataTable.reduce((sum, cur) => sum + (cur?.[columnName] || 0), 0);
  }

  disabledTgianTocChucTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianDkienDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.tgianDkienDen.getTime();
  };

  disabledTgianTocChucDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianDkienTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tgianDkienTu.getTime();
  };

  setValidForm() {
    const requiredValidators = [Validators.required];
    const fieldsRequireValidation = [
      "tenLoaiHinhNx",
      "diaChi",
      "soDxuat",
      "ngayTao",
      "trichYeu",
      "soQdCtieu",
      "tgianTtoan",
      "pthucTtoan",
      "tgianGnhan",
      "thongBao"
    ];
    fieldsRequireValidation.forEach(field => {
      const control = this.formData.controls[field];
      control.setValidators(requiredValidators);
    });
    if (!this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.formData.controls["tenCloaiVthh"].setValidators(requiredValidators);
    }
  }
}
