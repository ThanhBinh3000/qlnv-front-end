import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { STATUS } from 'src/app/constants/status';
import { cloneDeep } from 'lodash';
import { Validators } from '@angular/forms';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { DonviService } from 'src/app/services/donvi.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import _ from 'lodash';

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
        idQdKq: [],
        soQdKq: [''],
        ngayKyQdKq: [''],
        thoiHanXuatKho: [''],
        idQdPd: [],
        soQdPd: [''],
        NgayKyUyQuyen: [''],
        tenDviMua: [''],
        maDviTsan: [''],
        loaiHinhNx: [''],
        kieuNx: [''],
        soHd: [''],
        tenHd: [''],
        ngayHluc: [''],
        ghiChuNgayHluc: [''],
        loaiHdong: [''],
        ghiChuLoaiHdong: [''],
        tgianThienHd: [],
        tgianGnhanHang: [''],
        tgianGnhanTu: [''],
        tgianGnhanDen: [''],
        ghiChuTgianGnhan: [''],
        noiDungHdong: [''],
        dkienHanTtoan: [''],
        diaChiDvi: [''],
        mst: [''],
        tenNguoiDdien: [''],
        chucVu: [''],
        sdt: [''],
        fax: [''],
        stk: [''],
        moTai: [''],
        ttinGiayUyQuyen: [''],
        idDviMua: [],
        diaChiDviMua: [''],
        mstDviMua: [''],
        tenNguoiDdienDviMua: [''],
        chucVuDviMua: [''],
        sdtDviMua: [''],
        faxDviMua: [''],
        stkDviMua: [''],
        moTaiDviMua: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        soLuongBanTrucTiep: [],
        donGiaBanTrucTiep: [],
        thanhTien: [],
        ghiChu: [''],
        tongSlXuatBanQdKh: [],
        tongSlBanttQdkhDakyHd: [],
        tongSlBanttQdkhChuakyHd: [],
        trangThai: [STATUS.DU_THAO],
        idQdNv: [],
        soQdNv: [''],
        idChaoGia: [''],
        tenDvi: [''],
        tenLoaiHinhNx: [''],
        tenKieuNx: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự thảo'],
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

  async ngOnChanges(changes: SimpleChanges) {
    const { idInput, idHopDong } = this;
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
      diaChiDvi: this.userInfo.DON_VI.diaChi ?? null,
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
    const { soHd, tgianGnhanTu, tgianGnhanDen, tenDviMua, children, xhHopDongBttDviList, phuLuc } = data;
    this.formData.patchValue({
      soHd: soHd?.split('/')[0] || null,
      tgianGnhanHang: (tgianGnhanTu && tgianGnhanDen) ? [tgianGnhanTu, tgianGnhanDen] : null,
    });
    this.dataTable = cloneDeep(this.userService.isChiCuc() ? xhHopDongBttDviList : children);
    if (!this.userService.isChiCuc()) {
      await this.maDviTsanCuc(tenDviMua);
    }
    this.dataTablePhuLuc = phuLuc || [];
    this.objHopDongHdr = data;
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.setValidator();
    const { soHd, tgianGnhanHang } = this.formData.value;
    const body = {
      ...this.formData.value,
      soHd: soHd ? soHd + this.maHopDongSuffix : null,
      tgianGnhanTu: tgianGnhanHang ? dayjs(tgianGnhanHang[0]).format('YYYY-MM-DD') : null,
      tgianGnhanDen: tgianGnhanHang ? dayjs(tgianGnhanHang[1]).format('YYYY-MM-DD') : null,
      [this.userService.isCuc() ? 'children' : 'xhHopDongBttDviList']: this.dataTable,
    };
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    const { soHd, tgianGnhanHang } = this.formData.value;
    const body = {
      ...this.formData.value,
      soHd: soHd ? soHd + this.maHopDongSuffix : null,
      tgianGnhanTu: tgianGnhanHang ? dayjs(tgianGnhanHang[0]).format('YYYY-MM-DD') : null,
      tgianGnhanDen: tgianGnhanHang ? dayjs(tgianGnhanHang[1]).format('YYYY-MM-DD') : null,
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
      if (response.msg === MESSAGE.SUCCESS) {
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
          idQdKq: data.id,
          soQdKq: data.soQdKq,
          ngayKyQdKq: data.ngayKy,
          thoiHanXuatKho: data.ngayMkho,
          idQdPd: data.idQdPd,
          soQdPd: data.soQdPd,
          idChaoGia: data.idChaoGia,
          loaiHinhNx: data.loaiHinhNx,
          tenLoaiHinhNx: data.tenLoaiHinhNx,
          kieuNx: data.kieuNx,
          tenKieuNx: data.tenKieuNx,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
          tongSlXuatBanQdKh: data.tongSoLuong,
          donViTinh: this.listHangHoaAll.find(s => s.ma == data.loaiVthh)?.maDviTinh,
        });
        const filteredItems = this.loadDanhSachHdong.filter(item => item.idQdKq === data.id && item.trangThai === STATUS.DA_KY);
        const tongSlBanttQdkhDakyHd = filteredItems.reduce((acc, item) => acc + item.soLuongBanTrucTiep, 0);
        const tongSlBanttQdkhChuakyHd = data.tongSoLuong - tongSlBanttQdkhDakyHd;
        this.formData.patchValue({
          tongSlBanttQdkhDakyHd: tongSlBanttQdkhDakyHd,
          tongSlBanttQdkhChuakyHd: tongSlBanttQdkhChuakyHd,
        });
        this.listTccnChaoGia = childrenFlat;
      } else {
        this.notification.error(MESSAGE.ERROR, response.msg);
      }
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
      const key = `${obj.tochucCanhan}${obj.mst}${obj.luaChon}`;
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
            idDviMua: dataToChuc.id,
            tenDviMua: dataToChuc.tochucCanhan,
            diaChiDviMua: dataToChuc.diaDiemChaoGia,
            mstDviMua: dataToChuc.mst,
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
    if (this.flagInit && event && event !== this.formData.value.tenDviMua) {
      this.formData.patchValue({
        listMaDviTsan: null,
      });
    }
  }

  async setListDviTsanCuc(inputTable) {
    this.listDviTsan = [];

    inputTable.forEach((item) => {
      item.children.forEach((element) => {
        const dataGroup = _.chain(element.children)
          .groupBy('tochucCanhan')
          .map((value, key) => ({
            tochucCanhan: key,
            toChuc: value,
          }))
          .value();
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
          s1.tenDviMua.split(',').includes(s.tochucCanhan)
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
        item.thanhTien = item.soLuongDeXuat * item.donGiaDuocDuyet
      })
      this.formData.patchValue({
        soLuongBanTrucTiep: this.dataTable.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0),
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
      });
    } else {
      let tonThanhTien = 0;
      for (const item of this.dataTable) {
        for (const child of item.children) {
          const toChucItem = item.toChuc.find(s => s.idDviDtl === child.id);
          if (toChucItem) {
            child.soLuongKyHd = toChucItem.soLuong;
            child.donGiaKyHd = toChucItem.donGia;
            child.thanhTien = child.soLuongKyHd * child.donGiaKyHd;
            tonThanhTien += child.thanhTien;
          }
        }
        item.soLuongChiCuc = item.children.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0);
        item.soLuongBanTrucTiepHd = item.children.reduce((prev, cur) => prev + cur.soLuongKyHd, 0);
      }
      this.formData.patchValue({
        soLuongBanTrucTiep: this.dataTable.reduce((prev, cur) => prev + cur.soLuongBanTrucTiepHd, 0),
        thanhTien: tonThanhTien,
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
      trangThai: STATUS.BAN_HANH,
      pthucBanTrucTiep: '02'
    };
    const res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data && data.length > 0) {
        this.listSoQdPdKh = data;
      }
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
        await this.onChangeUyQuyen(data.idChaoGia);
      }
    });
    await this.spinner.hide();
  }

  async onChangeUyQuyen(id) {
    if (id <= 0) return;
    await this.spinner.show();
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS) throw new Error(res.msg);
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
        NgayKyUyQuyen: data.ngayNhanCgia,
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
        tongSlXuatBanQdKh: data.children.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
        donViTinh: loaiVthhItem?.maDviTinh,
      };
      const filteredItems = this.loadDanhSachHdong.filter(item => item.idChaoGia === data.id && item.trangThai === STATUS.DA_KY);
      const tongSlBanttQdkhDakyHd = filteredItems.reduce((acc, item) => acc + item.soLuongBanTrucTiep, 0);
      const tongSlBanttQdkhChuakyHd = data.tongSoLuong - tongSlBanttQdkhDakyHd;
      this.formData.patchValue({
        tongSlBanttQdkhDakyHd: tongSlBanttQdkhDakyHd,
        tongSlBanttQdkhChuakyHd: tongSlBanttQdkhChuakyHd,
      });
      this.formData.patchValue(formDataPatchValue);
      if (!data.idQdNv) {
        console.error('Hiện chưa có quyết định giao nhệm vụ!');
        return;
      }
      const resQdNv = await this.quyetDinhNvXuatBttService.getDetail(data.idQdNv);
      if (resQdNv.msg === MESSAGE.SUCCESS && resQdNv.data) {
        const dataQdNv = resQdNv.data;
        await this.setListMaDviTsanChiCuc(dataQdNv.children);
      }
    } catch (e) {
      console.error('error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  changeSoQdPd(event) {
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
          await this.hopDongBttService.delete({ id: data.id });
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

  setValidator() {
    const validatorsToApply = [];
    if (this.userService.isCuc()) {
      validatorsToApply.push(Validators.required);
    }
    if (this.userService.isChiCuc()) {
      validatorsToApply.push(Validators.required);
    }
    this.formData.controls["soQdKq"].setValidators(validatorsToApply);
    this.formData.controls["soQdPd"].setValidators(validatorsToApply);
    this.formData.controls["soHd"].setValidators([Validators.required]);
  }

  setValidForm() {
    this.formData.controls["namHd"].setValidators([Validators.required]);
    this.formData.controls["thoiHanXuatKho"].setValidators([Validators.required]);
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
    this.formData.controls["tenDviMua"].setValidators([Validators.required]);
    this.formData.controls["maDviTsan"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNx"].setValidators([Validators.required]);
    this.formData.controls["tenKieuNx"].setValidators([Validators.required]);
    this.formData.controls["soHd"].setValidators([Validators.required]);
    this.formData.controls["tenHd"].setValidators([Validators.required]);
    this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    this.formData.controls["loaiHdong"].setValidators([Validators.required]);
    this.formData.controls["tgianThienHd"].setValidators([Validators.required]);
    this.formData.controls["tgianGnhanHang"].setValidators([Validators.required]);
    this.formData.controls["noiDungHdong"].setValidators([Validators.required]);
    this.formData.controls["dkienHanTtoan"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["diaChiDvi"].setValidators([Validators.required]);
    this.formData.controls["mst"].setValidators([Validators.required]);
    this.formData.controls["tenNguoiDdien"].setValidators([Validators.required]);
    this.formData.controls["chucVu"].setValidators([Validators.required]);
    this.formData.controls["sdt"].setValidators([Validators.required]);
    this.formData.controls["fax"].setValidators([Validators.required]);
    this.formData.controls["stk"].setValidators([Validators.required]);
    this.formData.controls["moTai"].setValidators([Validators.required]);
    this.formData.controls["tenDviMua"].setValidators([Validators.required]);
    this.formData.controls["diaChiDviMua"].setValidators([Validators.required]);
    this.formData.controls["mstDviMua"].setValidators([Validators.required]);
    this.formData.controls["tenNguoiDdienDviMua"].setValidators([Validators.required]);
    this.formData.controls["chucVuDviMua"].setValidators([Validators.required]);
    this.formData.controls["sdtDviMua"].setValidators([Validators.required]);
    this.formData.controls["faxDviMua"].setValidators([Validators.required]);
    this.formData.controls["stkDviMua"].setValidators([Validators.required]);
    this.formData.controls["moTaiDviMua"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    if (this.userService.isCuc()) {
      this.formData.controls["soQdKq"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQdKq"].setValidators([Validators.required]);
    }
    if (this.userService.isChiCuc()) {
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["NgayKyUyQuyen"].setValidators([Validators.required]);
    }
  }
}


