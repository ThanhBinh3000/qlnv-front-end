import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import {cloneDeep} from 'lodash';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {STATUS} from 'src/app/constants/status';
import {DonviService} from "../../../../../../services/donvi.service";
import _ from 'lodash';
import {AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-thong-tin',
  templateUrl: './thong-tin.component.html',
  styleUrls: ['./thong-tin.component.scss']
})

export class ThongTinComponent extends Base2Component implements OnInit, OnChanges {
  @Input() loaiVthh: string;
  @Input() idHopDong: number;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isQuanLy: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  amount = {...AMOUNT_ONE_DECIMAL};
  maHopDongSuffix: string = '';
  listLoaiHopDong: any[] = [];
  listHangHoaAll: any[] = [];
  listDataQdKq: any[] = [];
  lisDviTrungGia: any[] = [];
  listToChucCaNhan: any[] = [];
  listDviTsan: any[] = [];
  listDviTsanFilter: any[] = [];
  listDanhSachHopDong = [];
  dataTablePhuLuc: any[] = [];
  objHopDongHdr: any = {};
  flagInit: Boolean = false;
  previewName: string = "Thông tin hợp đồng bán";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongXuatHangService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      loaiHinhNx: [''],
      kieuNhapXuat: [''],
      idQdKq: [],
      soQdKq: [''],
      ngayKyQdKq: [''],
      idQdPd: [],
      soQdPd: [''],
      toChucCaNhan: [''],
      maDviTsan: [''],
      tgianXuatKho: [''],
      soHopDong: [''],
      tenHopDong: [''],
      ngayKyHopDong: [''],
      ngayHieuLuc: [''],
      ghiChuNgayHluc: [''],
      loaiHopDong: [''],
      ghiChuLoaiHdong: [''],
      tgianThienHdongNgay: [],
      tgianThienHdong: [''],
      tgianBaoHanh: [''],
      tgianGiaoHang: [''],
      tgianTinhPhat: [],
      soLuongHangCham: [],
      soTienTinhPhat: [],
      giaTri: [],
      tgianBaoDamHdong: [''],
      ghiChuBaoDam: [''],
      dieuKien: [''],
      maDvi: [''],
      diaChiBenBan: [''],
      mstBenBan: [''],
      tenNguoiDaiDien: [''],
      chucVuBenBan: [''],
      sdtBenBan: ['', [this.validatePhoneNumber]],
      faxBenBan: [''],
      stkBenBan: [''],
      moTaiBenBan: [''],
      giayUyQuyen: [''],
      tenDviBenMua: [''],
      diaChiBenMua: [''],
      mstBenMua: [''],
      tenNguoiDdienMua: [''],
      chucVuBenMua: [''],
      sdtBenMua: ['', [this.validatePhoneNumber]],
      faxBenMua: [''],
      stkBenMua: [''],
      moTaiBenMua: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      moTaHangHoa: [''],
      soLuong: [],
      donViTinh: [''],
      thanhTien: [],
      ghiChu: [''],
      idQdNv: [],
      soQdNv: [''],
      trangThai: [''],
      tenTrangThai: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNhapXuat: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tgianGiaoNhanNgay: [],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
      listMaDviTsan: [null],
    });
  }

  async ngOnInit() {
    try {
      this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
      await Promise.all([
        this.loadDataComboBox(),
        this.loadDsVthh()
      ]);
      this.amount.align = "left";
    } catch (error) {
      console.log('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async onChangeNam(event) {
    this.maHopDongSuffix = `/${event}/HĐMB`;
  }

  async ChangeNgay(event: Date | number, changeType: string) {
    const formDataValue = this.formData.value;
    switch (changeType) {
      case 'XK':
        if (formDataValue.tgianGiaoNhanNgay) {
          const updatedDateXK = new Date(event);
          updatedDateXK.setDate(updatedDateXK.getDate() + formDataValue.tgianGiaoNhanNgay);
          this.formData.patchValue({tgianXuatKho: updatedDateXK.toISOString().split('T')[0]});
        }
        break;
      case 'TH':
        if (formDataValue.ngayHieuLuc) {
          const updatedDateTH = new Date(formDataValue.ngayHieuLuc);
          if (typeof event === 'number') {
            updatedDateTH.setDate(updatedDateTH.getDate() + event);
          }
          this.formData.patchValue({tgianThienHdong: updatedDateTH.toISOString().split('T')[0]});
        }
        break;
      case 'TP':
        if (formDataValue.tgianXuatKho) {
          const tgianXuatKho = new Date(formDataValue.tgianXuatKho);
          const tgianGiaoHang = new Date(event);
          // if (tgianXuatKho > tgianGiaoHang && this.formData.value.tgianGiaoHang) {
          //   this.notification.error(MESSAGE.WARNING, 'Thời gian giao hàng thực tế phải lớn hơn hoặc bằng thời gian xuất kho trước ngày.');
          //   this.formData.patchValue({tgianGiaoHang: '', tgianTinhPhat: ''});
          // } else {
          if (tgianGiaoHang > tgianXuatKho) {
            const khoangThoiGianMs = tgianGiaoHang.getTime() - tgianXuatKho.getTime();
            const khoangThoiGianNgayLamTron = Math.round(khoangThoiGianMs / (1000 * 60 * 60 * 24));
            this.formData.patchValue({tgianTinhPhat: khoangThoiGianNgayLamTron});
          }
        }
        break;
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.idInput) {
      await this.onChange(this.idInput);
    }
    if (this.idHopDong) {
      await this.loadChiTiet(this.idHopDong);
    } else {
      await this.initForm();
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChiBenBan: this.userInfo.DON_VI.diaChi ?? null,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async loadDataComboBox() {
    const fetchData = async (fieldName, targetArray, filterCondition) => {
      const res = await this.danhMucService.danhMucChungGetAll(fieldName);
      if (res.msg === MESSAGE.SUCCESS) {
        targetArray.push(...res.data.filter(filterCondition));
      }
    };
    await Promise.all([
      fetchData('LOAI_HDONG', this.listLoaiHopDong, () => true),
    ]);
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    this.listHangHoaAll = res.data;
  }

  async loadChiTiet(id) {
    if (!id) {
      return;
    }
    const data = await this.detail(id);
    const {soHopDong, children, phuLuc} = data;
    this.formData.patchValue({
      soHopDong: soHopDong?.split('/')[0] || null,
    })
    this.dataTable = cloneDeep(children);
    this.dataTablePhuLuc = phuLuc || [];
    this.objHopDongHdr = data;
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
      const soHopDong = this.formData.value.soHopDong;
      const body = {
        ...this.formData.value,
        soHopDong: soHopDong ? soHopDong + this.maHopDongSuffix : null,
        children: this.dataTable,
      };
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
      this.setValidForm();
      const soHopDong = this.formData.value.soHopDong;
      const body = {
        ...this.formData.value,
        soHopDong: soHopDong ? soHopDong + this.maHopDongSuffix : null,
        children: this.dataTable,
      };
      await super.saveAndSend(body, status, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async openDialog() {
    try {
      await this.spinner.show()
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.BAN_HANH
      };
      const res = await this.qdPdKetQuaBanDauGiaService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.listDataQdKq = res.data.content.filter(item => item.maDvi === this.userInfo.MA_DVI) || [];
      }
      const modalQD = this.modal.create({
        nzTitle: 'THÔNG TIN QUYẾT ĐỊNH KẾT QUẢ BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listDataQdKq,
          dataHeader: ['Số QĐ PDKQ BĐG', 'Số biên bản', 'Mã thông báo'],
          dataColumn: ['soQdKq', 'soBienBan', 'maThongBao'],
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

  async onChange(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.qdPdKetQuaBanDauGiaService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const response = await this.thongTinDauGiaService.getDetail(data.idThongBao);
      if (response.msg !== MESSAGE.SUCCESS || !response.data) {
        return;
      }
      const dataponse = response.data;
      await this.loadDanhSachHopDong(data);
      await this.setListDviTsan(dataponse.children);
      const loaiVthhItem = this.listHangHoaAll.find(s => s.ma == data.loaiVthh);
      this.formData.patchValue({
        nam: data.nam,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
        tenKieuNhapXuat: data.tenKieuNhapXuat,
        idQdKq: data.id,
        soQdKq: data.soQdKq,
        ngayKyQdKq: data.ngayKy,
        idQdPd: data.idQdPd,
        soQdPd: data.soQdPd,
        tgianGiaoNhanNgay: data.tgianGiaoNhanNgay,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        donViTinh: loaiVthhItem?.maDviTinh,
        tenHangHoa: data.moTaHangHoa,
      });
      this.listToChucCaNhan = Array.from(new Set(dataponse.children.flatMap(child => child.children.map(grandchild => grandchild.toChucCaNhan)).filter(val => val !== null))).map(name => ({name}));
      this.lisDviTrungGia = dataponse.listNguoiTgia.filter(s => s.loai === 'NTG');
    } catch (e) {
      console.error('error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  async setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((element) => {
      const dataGroup = _.chain(element.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value.filter(s => s.toChucCaNhan !== null),
      })).filter((x) => x.maDviTsan).map((child) => ({
        maDvi: element.maDvi,
        tenDvi: element.tenDvi,
        diaChi: element.diaChi,
        ...child
      })).value();
      if (this.idHopDong) {
        this.listDviTsan.push(...dataGroup);
      } else {
        const filteredDataGroup = dataGroup.filter(child => {
          return !this.listDanhSachHopDong.some(item =>
            item.maDviTsan.split(',').includes(child.maDviTsan) &&
            child.children.every(s => item.tenDviBenMua === s.toChucCaNhan)
          );
        });
        this.listDviTsan.push(...filteredDataGroup);
      }
    });
  }

  async maDviTsan(event) {
    const {flagInit, formData, listDviTsan, lisDviTrungGia} = this;
    if (flagInit && event && event !== formData.value.tenDviBenMua) {
      formData.patchValue({
        listMaDviTsan: null
      });
      this.dataTable = [];
    }
    this.listDviTsanFilter = listDviTsan.map(item => {
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter(s => s.toChucCaNhan === event);
        return filteredChildren.length > 0 ? {...item, children: filteredChildren} : null;
      }
      return null;
    }).filter(item => item !== null);
    const thongTinDviMua = lisDviTrungGia.find(s => s.hoVaTen === event);
    if (thongTinDviMua) {
      formData.patchValue({
        tenDviBenMua: thongTinDviMua.hoVaTen,
        diaChiBenMua: thongTinDviMua.diaChi,
        mstBenMua: thongTinDviMua.soCccd,
      });
    }
  }

  async selectMaDviTsan() {
    this.dataTable = [];
    const {listDviTsanFilter, formData, idHopDong} = this;
    const currentSelectList = cloneDeep(listDviTsanFilter);
    if (formData.value.listMaDviTsan && formData.value.listMaDviTsan.length > 0) {
      const selectedItems = currentSelectList.filter(s => formData.value.listMaDviTsan.includes(s.maDviTsan));
      selectedItems.forEach(item => {
        const existingItem = this.dataTable.find(child => child.maDvi === item.maDvi);
        if (existingItem) {
          existingItem.children.push(...item.children);
        } else {
          this.dataTable.push(item);
        }
      });
      if (idHopDong === 0) {
        await Promise.all([
          this.loadDiaDiemKho(),
          this.calculatorTable()
        ]);
      }
    }
  }

  async loadDiaDiemKho() {
    await Promise.all(this.dataTable.map(async (item) => {
      const res = await this.donViService.getAll({
        trangThai: "01",
        maDviCha: item.maDvi
      });
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      item.children.forEach(child => {
        const diaDiemKho = res.data.find(s => s.maDvi === child.maDiemKho);
        if (diaDiemKho) {
          child.diaDiemKho = diaDiemKho.diaChi;
        }
      });
    }));
  }

  async calculatorTable() {
    this.dataTable.forEach(item => {
      item.children.forEach(child => {
        child.soLuong = child.soLuongDeXuat;
        child.donGia = child.donGiaTraGia;
        child.thanhTien = child.soLuong * child.donGia;
      });
      item.soLuongXuatBan = item.children.reduce((total, child) => total + child.soLuong, 0);
      item.thanhTienXuatBan = item.children.reduce((total, child) => total + child.thanhTien, 0);
    });
    const calculateTotal = (key) => this.dataTable.reduce((total, item) => total + item[key], 0);
    this.formData.patchValue({
      soLuong: calculateTotal('soLuongXuatBan'),
      thanhTien: calculateTotal('thanhTienXuatBan'),
    });
  }

  async loadDanhSachHopDong(dsData) {
    if (!dsData) {
      return;
    }
    const body = {
      soQdKq: dsData.soQdKq,
      loaiVthh: this.loaiVthh,
      nam: dsData.nam,
    };
    const res = await this.hopDongXuatHangService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.listDanhSachHopDong = data;
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (!phoneNumber || phoneNumber[0] !== '0' || !/^[0-9]+$/.test(phoneNumber)) {
      return {invalidPhoneNumber: true};
    }
    return null;
  }

  isPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  isViewPhuLuc: boolean;

  redirectPhuLuc(id: number, isViewPhuLuc: boolean) {
    this.idPhuLuc = id;
    this.isViewPhuLuc = isViewPhuLuc;
    this.isPhuLuc = true;
  }

  async deletePhuLuc(data) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.hopDongXuatHangService.delete({id: data.id});
          await this.loadChiTiet(this.idHopDong);
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async showChiTiet() {
    this.isPhuLuc = false;
    await this.loadChiTiet(this.idHopDong);
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  setValidForm() {
    const fieldsToValidate = [
      "nam",
      "soQdKq",
      "soQdPd",
      "toChucCaNhan",
      "listMaDviTsan",
      "soHopDong",
      "tenHopDong",
      "ngayKyHopDong",
      "ngayHieuLuc",
      "loaiHopDong",
      "tgianBaoHanh",
      "tgianGiaoHang",
      "dieuKien",
      "diaChiBenBan",
      "mstBenBan",
      "tenNguoiDaiDien",
      "chucVuBenBan",
      "stkBenBan",
      "moTaiBenBan",
      "tenNguoiDdienMua",
      "chucVuBenMua",
      "sdtBenMua",
      "moTaHangHoa",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
