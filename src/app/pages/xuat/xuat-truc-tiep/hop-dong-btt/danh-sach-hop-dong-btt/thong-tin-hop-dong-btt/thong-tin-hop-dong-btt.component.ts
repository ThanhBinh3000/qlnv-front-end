import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import dayjs from 'dayjs';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {STATUS} from 'src/app/constants/status';
import {cloneDeep} from 'lodash';
import {Validators} from '@angular/forms';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {DonviService} from 'src/app/services/donvi.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import _ from 'lodash';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";

@Component({
  selector: 'app-thong-tin-hop-dong-btt',
  templateUrl: './thong-tin-hop-dong-btt.component.html',
  styleUrls: ['./thong-tin-hop-dong-btt.component.scss']
})

export class ThongTinHopDongBttComponent extends Base2Component implements OnInit, OnChanges {
  @Input() loaiVthh: string;
  @Input() idHopDong: number;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isQuanLy: boolean;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  listLoaiHopDong: any[] = [];
  dataTablePhuLuc: any[] = [];
  maHopDongSuffix: string = '';
  objHopDongHdr: any = {};
  listHangHoaAll: any[] = [];
  listTccnChaoGia: any[] = [];
  loadDanhSachHdong: any[] = [];
  listDviTsanFilter: any[] = [];
  listDviTsan: any[] = [];
  listAllDviTsan: any[] = [];
  flagInit: Boolean = false;
  listSoQdKqBtt: any[] = [];
  listSoQdPdKh: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private danhMucService: DanhMucService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongBttService);
    this.formData = this.fb.group(
      {
        id: [],
        maDvi: [''],
        namHd: [dayjs().get('year')],
        loaiHinhNx: [''],
        kieuNx: [''],
        idQdKq: [],
        soQdKq: [''],
        ngayKyQdKq: [''],
        thoiHanXuatKho: [''],
        idQdPd: [],
        soQdPd: [''],
        ngayKyUyQuyen: [''],
        maDviTsan: [''],
        soHopDong: [''],
        tenHopDong: [''],
        ngayKyHopDong: [''],
        ngayHlucHopDong: [''],
        ghiChuNgayHluc: [''],
        loaiHopDong: [''],
        ghiChuLoaiHdong: [''],
        tgianThienHdongNgay: [],
        tgianThienHdong: [''],
        tgianGiaoNhan: [''],
        tgianGiaoNhanTu: [''],
        tgianGiaoNhanDen: [''],
        ghiChuTgianGiaoNhan: [''],
        thoiGianBaoHanh: [''],
        giaTri: [],
        tgianBaoDamHdong: [''],
        ghiChuBaoDam: [''],
        dieuKien: [''],
        diaChiBenBan: [''],
        mstBenBan: [''],
        tenNguoiDaiDien: [''],
        chucVuBenBan: [''],
        sdtBenBan: [''],
        faxBenBan: [''],
        stkBenBan: [''],
        moTaiBenBan: [''],
        giayUyQuyen: [''],
        idBenMua: [],
        tenBenMua: [''],
        diaChiBenMua: [''],
        mstBenMua: [''],
        tenNguoiDdienMua: [''],
        chucVuBenMua: [''],
        sdtBenMua: [''],
        faxBenMua: [''],
        stkBenMua: [''],
        moTaiBenMua: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenHangHoa: [''],
        donViTinh: [''],
        soLuong: [],
        donGia: [],
        thanhTien: [],
        slXuatBanQdPd: [''],
        slXuatBanKyHdong: [''],
        slXuatBanChuaKyHdong: [''],
        moTaHangHoa: [''],
        ghiChu: [''],
        idChaoGia: [],
        idQdNv: [],
        soQdNv: [''],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
        tenDvi: [''],
        tenLoaiHinhNx: [''],
        tenKieuNx: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        fileCanCu: [new Array<FileDinhKem>()],
        fileDinhKem: [new Array<FileDinhKem>()],
        listMaDviTsan: [null, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    try {
      this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
      await Promise.all([
        this.loadDataComboBox(),
        this.loadDsVthh()
      ]);
      this.initForm();
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async onChangeNam(event) {
    this.maHopDongSuffix = `/${event}/HĐMB`;
  }

  async ChangeNgay(event: number) {
    const formDataValue = this.formData.value;
    if (formDataValue.ngayHlucHopDong) {
      const updatedDateTH = new Date(formDataValue.ngayHlucHopDong);
      if (typeof event === 'number') {
        updatedDateTH.setDate(updatedDateTH.getDate() + event);
      }
      this.formData.patchValue({tgianThienHdong: updatedDateTH.toISOString().split('T')[0]});
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    const {idInput, idHopDong} = this;
    if (idInput) {
      await (this.userService.isCuc() ? this.onChangeChaoGia(idInput) : this.onChangeUyQuyen(idInput));
    }
    if (idHopDong) {
      await this.loadChiTiet(idHopDong);
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChiBenBan: this.userInfo.DON_VI.diaChi ?? null,
    })
  }

  async loadDataComboBox() {
    const res = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (res.msg === MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
    }
  }

  async loadChiTiet(id) {
    if (!id) return;
    const data = await this.detail(id);
    if (!data) return;
    const {soHopDong, tgianGiaoNhanTu, tgianGiaoNhanDen, tenBenMua, children, xhHopDongBttDviList, phuLuc} = data;
    this.formData.patchValue({
      soHopDong: soHopDong?.split('/')[0] || null,
      tgianGiaoNhan: this.isValidDate(tgianGiaoNhanTu) && this.isValidDate(tgianGiaoNhanDen)
        ? [tgianGiaoNhanTu, tgianGiaoNhanDen] : [],
    });
    this.dataTable = cloneDeep(this.userService.isChiCuc() ? xhHopDongBttDviList : children);
    if (!this.userService.isChiCuc()) {
      await this.maDviTsanCuc(tenBenMua);
    }
    this.dataTablePhuLuc = phuLuc || [];
    this.objHopDongHdr = data;
  }

  isValidDate(dateString: string): boolean {
    return dayjs(dateString).isValid();
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.setValidator();
    const {soHopDong, tgianGiaoNhan} = this.formData.value;
    const body = {
      ...this.formData.value,
      soHopDong: soHopDong ? soHopDong + this.maHopDongSuffix : null,
      tgianGiaoNhanTu: tgianGiaoNhan ? dayjs(tgianGiaoNhan[0]).format('YYYY-MM-DD') : null,
      tgianGiaoNhanDen: tgianGiaoNhan ? dayjs(tgianGiaoNhan[1]).format('YYYY-MM-DD') : null,
      [this.userService.isCuc() ? 'children' : 'xhHopDongBttDviList']: this.dataTable,
    };
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    const {soHopDong, tgianGiaoNhan} = this.formData.value;
    const body = {
      ...this.formData.value,
      soHopDong: soHopDong ? soHopDong + this.maHopDongSuffix : null,
      tgianGiaoNhanTu: tgianGiaoNhan ? dayjs(tgianGiaoNhan[0]).format('YYYY-MM-DD') : null,
      tgianGiaoNhanDen: tgianGiaoNhan ? dayjs(tgianGiaoNhan[1]).format('YYYY-MM-DD') : null,
      [this.userService.isCuc() ? 'children' : 'xhHopDongBttDviList']: this.dataTable,
    };
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async openDialogChaoGia() {
    await this.spinner.show();
    const body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namHd,
      trangThai: STATUS.BAN_HANH,
    };
    const res = await this.qdPdKetQuaBttService.search(body);
    if (res.msg === MESSAGE.SUCCESS) {
      this.listSoQdKqBtt = res.data.content || [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN QUYẾT ĐỊNH PHÊ DUYỆT KẾT QUẢ CHÀO GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQdKqBtt,
        dataHeader: ['Số QĐ PD KQ chào giá', 'Ngày ký quyết định', ' Loại hàng hóa'],
        dataColumn: ['soQdKq', 'ngayKy', 'tenLoaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeChaoGia(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeChaoGia(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const response = await this.qdPdKetQuaBttService.getDetail(id);
      if (!response || !response.data) {
        console.log('Không tìm thấy dữ liệu');
        return;
      }
      const data = response.data;
      const childrenFlat = data.children.flatMap(item =>
        item.children.flatMap(child =>
          child.children.map(grandchild => grandchild)
        )
      );
      await Promise.all([
        this.loadDanhDachHopDong(),
        this.setListDviTsanCuc(data.children),
      ]);
      this.formData.patchValue({
        namKh: data.namKh,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        idQdKq: data.id,
        soQdKq: data.soQdKq,
        ngayKyQdKq: data.ngayKy,
        thoiHanXuatKho: data.ngayMkho,
        idQdPd: data.idQdPd,
        soQdPd: data.soQdPd,
        idChaoGia: data.idChaoGia,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.moTaHangHoa,
        slXuatBanQdPd: data.tongSoLuong,
        donViTinh: this.listHangHoaAll.find(s => s.ma == data.loaiVthh)?.maDviTinh,
      });
      const filteredItems = this.loadDanhSachHdong.filter(item => item.idQdKq === data.id && item.trangThai === STATUS.DA_KY);
      const slXuatBanKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuong, 0);
      const slXuatBanChuaKyHdong = data.tongSoLuong - slXuatBanKyHdong;
      this.formData.patchValue({
        slXuatBanKyHdong: slXuatBanKyHdong,
        slXuatBanChuaKyHdong: slXuatBanChuaKyHdong,
      });
      this.listTccnChaoGia = childrenFlat;
    } catch (error) {
      console.log('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogToChucCaNhan() {
    await this.spinner.show();
    const uniqueKeyMap = new Map();
    for (const obj of this.listTccnChaoGia) {
      const key = `${obj.tochucCanhan}${obj.mst}`;
      if (uniqueKeyMap.has(key)) {
        const existingObj = uniqueKeyMap.get(key);
        existingObj.someProperty += obj.someProperty;
      } else {
        uniqueKeyMap.set(key, obj);
      }
    }
    const uniqueObjects = Array.from(uniqueKeyMap.values());
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN TÊN TỔ CHỨC CÁ NHÂN CHÀO GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: uniqueObjects.filter(s => s.luaChon),
        dataHeader: ['Tên tổ chức cá nhân', 'Số điện thoại', 'Mã số thuế'],
        dataColumn: ['tochucCanhan', 'sdt', 'mst'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeToChucCaNhan(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeToChucCaNhan(id) {
    if (!id) return;
    await this.spinner.show();
    try {
      const res = await this.qdPdKetQuaBttService.getToChucDetail(id);
      if (res.msg === MESSAGE.SUCCESS) {
        const dataToChuc = res.data;
        if (dataToChuc) {
          await this.maDviTsanCuc(dataToChuc.tochucCanhan);
          this.formData.patchValue({
            idBenMua: dataToChuc.id,
            tenBenMua: dataToChuc.tochucCanhan,
            diaChiBenMua: dataToChuc.diaDiemChaoGia,
            mstBenMua: dataToChuc.mst,
          });
        }
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  ChangeToChucCaNhan(event) {
    if (this.flagInit && event && event !== this.formData.value.tenBenMua) {
      this.formData.patchValue({
        listMaDviTsan: null,
      });
    }
  }

  async setListDviTsanCuc(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      item.children.forEach((element) => {
        const dataGroup = _.chain(element.children).groupBy('tochucCanhan').map((value, key) => ({
          tochucCanhan: key,
          toChuc: value,
        })).value();
        dataGroup.forEach((x) => {
          x.tenDvi = item.tenDvi;
          x.maDvi = item.maDvi;
          x.diaChi = item.diaChi;
          x.maDviTsan = element.maDviTsan;
          x.children = item.children.filter((s) => s.maDviTsan === element.maDviTsan);
        });
        const filteredDataGroup = dataGroup.filter((x) => x.maDviTsan);
        this.listDviTsan.push(...filteredDataGroup);
      });
    });
  }

  async maDviTsanCuc(event) {
    this.listDviTsanFilter = this.idHopDong ? this.listDviTsan.filter(s => s.tochucCanhan === event) : this.listDviTsan.filter(s => {
      return s.tochucCanhan === event &&
        !this.loadDanhSachHdong.some(s1 =>
          s1.maDviTsan.split(',').includes(s.maDviTsan) &&
          s1.tenBenMua.split(',').includes(s.tochucCanhan)
        );
    });
  }

  async selectMaDviTsanCuc() {
    this.dataTable = [];
    const currentSelectList = cloneDeep(this.listDviTsanFilter);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      const selectedItems = currentSelectList.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
      selectedItems.forEach((item) => {
        const existingItem = this.dataTable.find(child => child.maDvi === item.maDvi);
        if (existingItem) {
          existingItem.children.push(...item.children);
          existingItem.toChuc.push(...item.toChuc);
        } else {
          this.dataTable.push(item);
        }
      });
      await this.calculatorTable();
    } else {
      this.dataTable = [];
    }
  }

  async calculatorTable() {
    if (this.userService.isChiCuc()) {
      this.dataTable.forEach(item => {
        item.soLuongKyHd = item.soLuong;
        item.donGiaKyHd = item.donGia;
        item.thanhTien = item.soLuong * item.donGia
      })
      this.formData.patchValue({
        soLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongKyHd, 0),
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
      });
    } else {
      let thanhTien = 0;
      for (const item of this.dataTable) {
        for (const child of item.children) {
          const toChucItem = item.toChuc.find(s => s.idDviDtl === child.id);
          if (toChucItem) {
            child.soLuongKyHd = toChucItem.soLuong;
            child.donGiaKyHd = toChucItem.donGia;
            child.thanhTien = child.soLuongKyHd * child.donGiaKyHd;
            thanhTien += child.thanhTien;
          }
        }
        item.soLuongXuatBan = item.children.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0);
        item.soLuongKyHopDong = item.children.reduce((prev, cur) => prev + cur.soLuongKyHd, 0);
      }
      this.formData.patchValue({
        soLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongKyHopDong, 0),
        thanhTien: thanhTien,
      });
    }
    await this.loadDiaDiemKho();
  }

  async loadDiaDiemKho() {
    const promises = [];
    for (const item of this.dataTable) {
      if (this.userService.isChiCuc()) {
        promises.push(this.loadDiaDiemKhoForItem(item));
      } else {
        for (const child of item.children) {
          promises.push(this.loadDiaDiemKhoForItem(child));
        }
      }
    }
    await Promise.all(promises);
  }

  async loadDiaDiemKhoForItem(item) {
    const res = await this.donViService.getAll({
      trangThai: "01",
      maDviCha: item.maDvi
    });
    const diaDiemKho = res.data.find(s => s.maDvi === item.maDiemKho);
    if (diaDiemKho) {
      item.diaDiemKho = diaDiemKho.diaChi;
    }
  }

  // Hợp đồng chi cục
  async openDialogUyQuyen() {
    await this.spinner.show();
    const body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namHd,
      trangThai: STATUS.DA_HOAN_THANH,
      pthucBanTrucTiep: ['02']
    };
    const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
    if (res.msg === MESSAGE.SUCCESS) {
      this.listSoQdPdKh = res.data.content || [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'SỐ QUYẾT ĐỊNH PHÊ DUYỆT KẾ HOẠCH BÁN TRỰC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQdPdKh,
        dataHeader: ['Số QĐ PD KQ chào giá', ' Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeUyQuyen(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeUyQuyen(id) {
    if (id <= 0) return;
    await this.spinner.show();
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (!res || !res.data) {
        console.log('Không tìm thấy dữ liệu');
        return;
      }
      const data = res.data;
      await this.loadDanhDachHopDong();
      const loaiVthhItem = this.listHangHoaAll.find(s => s.ma == data.loaiVthh);
      const formDataPatchValue = {
        namKh: data.namKh,
        idChaoGia: data.id,
        idQdPd: data.idHdr,
        soQdPd: data.soQdPd,
        idQdNv: data.idQdNv,
        soQdNv: data.soQdNv,
        ngayKyUyQuyen: data.ngayNhanCgia,
        thoiHanXuatKho: data.ngayMkho,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        slXuatBanQdPd: data.children.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
        donViTinh: loaiVthhItem?.maDviTinh,
      };
      const filteredItems = this.loadDanhSachHdong.filter(item => item.idChaoGia === data.id && item.trangThai === STATUS.DA_KY);
      const slXuatBanKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuongXuatBan, 0);
      const slXuatBanChuaKyHdong = data.tongSoLuong - slXuatBanKyHdong;
      this.formData.patchValue({
        slXuatBanKyHdong: slXuatBanKyHdong,
        slXuatBanChuaKyHdong: slXuatBanChuaKyHdong,
      });
      this.formData.patchValue(formDataPatchValue);
      if (!data.idQdNv) {
        this.notification.error(MESSAGE.WARNING, 'Hiện chưa có quyết định giao nhiệm vụ xuất hàng !.');
        return;
      }
      const resQdNv = await this.quyetDinhNvXuatBttService.getDetail(data.idQdNv);
      if (!resQdNv || !resQdNv.data) {
        return;
      }
      const dataQdNv = resQdNv.data;
      await this.setListMaDviTsanChiCuc(dataQdNv.children);
    } catch (e) {
      console.error('error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  ChangeUyQuyen(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdPd) {
      this.formData.patchValue({
        listMaDviTsan: null,
      });
    }
  }

  setListMaDviTsanChiCuc(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      this.listDviTsan.push(...item.children.filter(child => child.maDviTsan));
    });
    this.listAllDviTsan = this.idHopDong ? this.listDviTsan : this.listDviTsan.filter(s => !this.loadDanhSachHdong.some(s1 => s1.maDviTsan.split(',').includes(s.maDviTsan)));
  }

  async selectMaDviTsanChiCuc() {
    this.dataTable = [];
    const selectedMaDviTsan = this.formData.value.listMaDviTsan;
    if (selectedMaDviTsan && selectedMaDviTsan.length > 0) {
      const filteredList = this.listAllDviTsan.filter(item => selectedMaDviTsan.includes(item.maDviTsan));
      this.dataTable = [...filteredList];
      await this.calculatorTable();
    } else {
      this.dataTable = [];
    }
  }

  async loadDanhDachHopDong() {
    const body = {
      loaiVthh: this.loaiVthh,
      namHd: this.formData.value.namHd,
    };
    const res = await this.hopDongBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachHdong = data;
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
          await this.hopDongBttService.delete({id: data.id});
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

  isPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  isViewPhuLuc: boolean;

  redirectPhuLuc(id, isViewPhuLuc: boolean) {
    this.idPhuLuc = id;
    this.isViewPhuLuc = isViewPhuLuc;
    this.isPhuLuc = true;
  }

  showChiTiet() {
    this.isPhuLuc = false;
    this.loadChiTiet(this.idHopDong);
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  calcTong(column) {
    if (!this.dataTable) {
      return 0;
    }
    return this.dataTable.reduce((sum, item) => sum + (item[column] || 0), 0);
  }

  async preview(id) {
    await this.hopDongBttService.preview({
      tenBaoCao: 'Hợp đồng bán trực tiếp',
      id: id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.printSrc = res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  setValidator() {
    if (this.userService.isCuc()) {
      this.formData.controls["soQdKq"].setValidators([Validators.required]);
    }
    if (this.userService.isChiCuc()) {
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
    }
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
    this.formData.controls["soHopDong"].setValidators([Validators.required]);
  }

  setValidForm() {
    this.formData.controls["namHd"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["tenKieuNx"].setValidators([Validators.required]);
    this.formData.controls["thoiHanXuatKho"].setValidators([Validators.required]);
    this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
    this.formData.controls["tenHopDong"].setValidators([Validators.required]);
    this.formData.controls["ngayKyHopDong"].setValidators([Validators.required]);
    this.formData.controls["ngayHlucHopDong"].setValidators([Validators.required]);
    this.formData.controls["ghiChuNgayHluc"].setValidators([Validators.required]);
    this.formData.controls["loaiHopDong"].setValidators([Validators.required]);
    this.formData.controls["ghiChuLoaiHdong"].setValidators([Validators.required]);
    this.formData.controls["tgianThienHdongNgay"].setValidators([Validators.required]);
    this.formData.controls["tgianThienHdong"].setValidators([Validators.required]);
    this.formData.controls["tgianGiaoNhan"].setValidators([Validators.required]);
    this.formData.controls["ghiChuTgianGiaoNhan"].setValidators([Validators.required]);
    this.formData.controls["giaTri"].setValidators([Validators.required]);
    this.formData.controls["tgianBaoDamHdong"].setValidators([Validators.required]);
    this.formData.controls["ghiChuBaoDam"].setValidators([Validators.required]);
    this.formData.controls["dieuKien"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["diaChiBenBan"].setValidators([Validators.required]);
    this.formData.controls["mstBenBan"].setValidators([Validators.required]);
    this.formData.controls["tenNguoiDaiDien"].setValidators([Validators.required]);
    this.formData.controls["chucVuBenBan"].setValidators([Validators.required]);
    this.formData.controls["sdtBenBan"].setValidators([Validators.required]);
    this.formData.controls["faxBenBan"].setValidators([Validators.required]);
    this.formData.controls["stkBenBan"].setValidators([Validators.required]);
    this.formData.controls["moTaiBenBan"].setValidators([Validators.required]);
    this.formData.controls["tenBenMua"].setValidators([Validators.required]);
    this.formData.controls["diaChiBenMua"].setValidators([Validators.required]);
    this.formData.controls["mstBenMua"].setValidators([Validators.required]);
    this.formData.controls["tenNguoiDdienMua"].setValidators([Validators.required]);
    this.formData.controls["chucVuBenMua"].setValidators([Validators.required]);
    this.formData.controls["sdtBenMua"].setValidators([Validators.required]);
    this.formData.controls["faxBenMua"].setValidators([Validators.required]);
    this.formData.controls["stkBenMua"].setValidators([Validators.required]);
    this.formData.controls["moTaiBenMua"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    if (this.userService.isCuc()) {
      this.formData.controls["thoiGianBaoHanh"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQdKq"].setValidators([Validators.required]);
    }
    if (this.userService.isChiCuc()) {
      this.formData.controls["ngayKyUyQuyen"].setValidators([Validators.required]);
      this.formData.controls["giayUyQuyen"].setValidators([Validators.required]);
    }
  }
}
