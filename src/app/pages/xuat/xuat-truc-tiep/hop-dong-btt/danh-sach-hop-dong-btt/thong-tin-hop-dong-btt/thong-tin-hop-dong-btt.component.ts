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
import {STATUS, THONG_TIN_BAN_TRUC_TIEP} from 'src/app/constants/status';
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
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";
import {el} from "date-fns/locale";

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
  @Input() phanLoai: string;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  listLoaiHopDong: any[] = [];
  dataTablePhuLuc: any[] = [];
  maHopDongSuffix: string = '';
  objHopDongHdr: any = {};
  listHangHoaAll: any[] = [];
  listTccnChaoGia: any[] = [];
  loadDanhSachHdong: any[] = [];
  listDviTsanFilter: any[] = [];
  listDviTsanHienThi: any[] = [];
  listDviTsan: any[] = [];
  listAllDviTsan: any[] = [];
  flagInit: Boolean = false;
  listSoQdPdKh: any[] = [];
  dataChildren: any[] = [];
  modalChiTiet: boolean = false;
  selectedRadioId: number;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
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
        sdtBenBan: ['', [this.validatePhoneNumber]],
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
        sdtBenMua: ['', [this.validatePhoneNumber]],
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
        slXuatBanQdPd: [],
        slXuatBanKyHdong: [],
        slXuatBanChuaKyHdong: [],
        moTaHangHoa: [''],
        ghiChu: [''],
        idChaoGia: [],
        idQdNv: [],
        soQdNv: [''],
        trangThai: [''],
        tenTrangThai: [''],
        tenDvi: [''],
        tenLoaiHinhNx: [''],
        tenKieuNx: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        fileCanCu: [new Array<FileDinhKem>()],
        fileDinhKem: [new Array<FileDinhKem>()],
        listMaDviTsan: [null],
        idQdDc: [''],
        soQdDc: [''],
        soQd: [''],
        phanLoai: [''],
        idKh:[],
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
      this.amount.align = "left";
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
    if (this.idHopDong) {
      await this.loadChiTiet(this.idHopDong);
    } else {
      await this.initForm();
    }
    if (this.idInput) {
      await (this.userService.isCuc() ? this.handleRadioClick(this.idInput) : this.onChangeUyQuyen(this.idInput));
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChiBenBan: this.userInfo.DON_VI.diaChi ?? null,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      phanLoai: this.userService.isChiCuc() ? null : this.phanLoai
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
    const {soHopDong, tgianGiaoNhanTu, tgianGiaoNhanDen, children, xhHopDongBttDviList, phuLuc} = data;
    this.formData.patchValue({
      soHopDong: soHopDong?.split('/')[0] || null,
      tgianGiaoNhan: this.isValidDate(tgianGiaoNhanTu) && this.isValidDate(tgianGiaoNhanDen)
        ? [tgianGiaoNhanTu, tgianGiaoNhanDen] : [],
      phanLoai: data.phanLoai ? data.phanLoai.toString() : null,
      soQd: data.phanLoai === "QĐKQ" ? data.soQdKq : data.soQdDc || data.soQdPd
    });
    this.dataTable = cloneDeep(this.userService.isChiCuc() ? xhHopDongBttDviList : children);
    this.dataTablePhuLuc = phuLuc || [];
    this.objHopDongHdr = data;
  }

  isValidDate(dateString: string): boolean {
    return dayjs(dateString).isValid();
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
      const {soHopDong, tgianGiaoNhan} = this.formData.value;
      const body = {
        ...this.formData.value,
        soHopDong: soHopDong ? soHopDong + this.maHopDongSuffix : null,
        tgianGiaoNhanTu: tgianGiaoNhan ? dayjs(tgianGiaoNhan[0]).format('YYYY-MM-DD') : null,
        tgianGiaoNhanDen: tgianGiaoNhan ? dayjs(tgianGiaoNhan[1]).format('YYYY-MM-DD') : null,
        [this.userService.isCuc() ? 'children' : 'xhHopDongBttDviList']: this.dataTable,
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
      const {soHopDong, tgianGiaoNhan} = this.formData.value;
      const body = {
        ...this.formData.value,
        soHopDong: soHopDong ? soHopDong + this.maHopDongSuffix : null,
        tgianGiaoNhanTu: tgianGiaoNhan ? dayjs(tgianGiaoNhan[0]).format('YYYY-MM-DD') : null,
        tgianGiaoNhanDen: tgianGiaoNhan ? dayjs(tgianGiaoNhan[1]).format('YYYY-MM-DD') : null,
        [this.userService.isCuc() ? 'children' : 'xhHopDongBttDviList']: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async openDialogChaoGia() {
    this.modalChiTiet = true;
    const checkPhanLoai = this.formData.value.phanLoai === "QĐKQ";
    const trangThai = checkPhanLoai ? STATUS.DA_DUYET_LDC : STATUS.BAN_HANH;
    try {
      await this.spinner.show();
      const body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namHd,
        trangThai: trangThai,
        lastest: checkPhanLoai ? undefined : 1,
        typeHopDong: checkPhanLoai ? undefined : 0
      };
      const res = checkPhanLoai ? await this.qdPdKetQuaBttService.search(body) : await this.quyetDinhPdKhBanTrucTiepService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.dataTableAll = checkPhanLoai ? res.data.content.filter(item => item.maDvi === this.userInfo.MA_DVI) || [] : res.data.content;
        if (!checkPhanLoai) {
          this.dataTableAll = this.dataTableAll.map(item => ({
            soQdKq: item.soQdDc || item.soQdPd,
            ngayKy: item.ngayKyDc || item.ngayKyQd,
            ...item
          }))
        }
      }
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async handleRadioClick(idInput?) {
    const id = idInput ? idInput : this.selectedRadioId;
    if (id <= 0) {
      return;
    }
    const checkPhanLoai = this.formData.value.phanLoai === "QĐKQ";
    try {
      await this.spinner.show();
      const res = checkPhanLoai ? await this.qdPdKetQuaBttService.getDetail(id) : await this.quyetDinhPdKhBanTrucTiepService.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS || res.data) {
        const data = res.data;
        this.formData.patchValue({
          namHd: data.namKh,
          loaiHinhNx: data.loaiHinhNx,
          tenLoaiHinhNx: data.tenLoaiHinhNx,
          kieuNx: data.kieuNx,
          tenKieuNx: data.tenKieuNx,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tenHangHoa: data.moTaHangHoa,
          donViTinh: this.listHangHoaAll.find(s => s.ma == data.loaiVthh)?.maDviTinh,
        })
        await this.loadDanhDachHopDong();
        if (checkPhanLoai) {
          await this.onChangeKetQua(data);
        } else {
          await this.onChangekeHoach(data);
        }
      }
      await this.dongMoDal();
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeKetQua(data) {
    this.formData.patchValue({
      idQdKq: data.id,
      soQdKq: data.soQdKq,
      soQd: data.soQdKq,
      ngayKyQdKq: data.ngayKy,
      thoiHanXuatKho: data.ngayMkho,
      idQdPd: data.idQdPd,
      soQdPd: data.soQdPd,
      idQdDc: data.idQdDc,
      soQdDc: data.soQdDc,
      idChaoGia: data.idChaoGia,
      slXuatBanQdPd: data.tongSoLuong || 0,
    });
    this.listTccnChaoGia = data.children.flatMap(item => item.children.flatMap(child => child.children.map(grandchild => grandchild))).filter(info => info.luaChon);
    const filteredItems = this.loadDanhSachHdong.filter(item => item.idQdKq === data.id && item.trangThai === STATUS.DA_KY);
    this.formData.patchValue({
      slXuatBanKyHdong: filteredItems.reduce((acc, item) => acc + item.soLuong, 0),
      slXuatBanChuaKyHdong: data.tongSoLuong - filteredItems.reduce((acc, item) => acc + item.soLuong, 0),
    });
    this.dataChildren = data.children.map(item => {
      item.children.forEach(child => {
        child.children = child.children.filter(s => s.luaChon);
      });
      return item;
    });
    await this.setListDviTsanCuc(this.dataChildren);
    if (!this.userService.isChiCuc() && this.idHopDong) {
      await this.maDviTsanCuc(this.formData.value.tenBenMua);
    }
  }

  async onChangekeHoach(data) {
    const filteredItems = this.loadDanhSachHdong.filter(item =>
      item.soQdDc ?
        item.soQdDc === data.soQdDc :
        item.soQdPd === data.soQdPd && item.trangThai === STATUS.DA_KY
    );
    const soLuongQdKh = data.children.reduce((acc, item) => acc + item.tongSoLuong, 0);
    const soLuongKyHd = filteredItems.reduce((acc, item) => acc + item.soLuong, 0)
    this.formData.patchValue({
      idKh: data.id,
      soQd: data.soQdDc || data.soQdPd,
      idQdPd: data.type === 'QDDC' ? data.idQdPd : data.id,
      soQdPd: data.soQdPd,
      idQdDc: data.type === 'QDDC' ? data.id : null,
      soQdDc: data.soQdDc,
      thoiHanXuatKho: data.children[0].tgianDkienDen,
      slXuatBanQdPd: soLuongQdKh,
      slXuatBanKyHdong: soLuongKyHd,
      slXuatBanChuaKyHdong: soLuongQdKh - soLuongKyHd,
    })
    data.children.forEach(item => {
      this.dataChildren = this.dataChildren.concat(item.children);
    })
    await this.setListDviTsanCuc(this.dataChildren);
  }

  async dongMoDal() {
    this.modalChiTiet = false;
  }


  async openDialogToChucCaNhan() {
    try {
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
          dataTable: uniqueObjects,
          dataHeader: ['Tên tổ chức cá nhân', 'Số điện thoại', 'Mã số thuế'],
          dataColumn: ['tochucCanhan', 'sdt', 'mst'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          const dataThongTin = this.listTccnChaoGia.find(item => item.id === data.id);
          if (dataThongTin) {
            this.formData.patchValue({
              idBenMua: data.id,
              tenBenMua: data.tochucCanhan,
              diaChiBenMua: data.diaDiemChaoGia,
              mstBenMua: data.mst,
            });
          }
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async setListDviTsanCuc(inputTable) {
    console.log(inputTable, 777)
    this.listDviTsan = [];
    inputTable.forEach((element) => {
      console.log(element.children, 888)
      const dataGroup = _.chain(element.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value,
      })).filter((x) => x.maDviTsan).map((child) => ({
        maDvi: element.maDvi,
        tenDvi: element.tenDvi,
        diaChi: element.diaChi,
        ...child
      })).value();
      if (this.formData.value.phanLoai === "QĐKQ") {
        this.listDviTsan.push(...dataGroup);
      } else {
        // this.dataTable = [];
        this.listDviTsanHienThi = [];
        this.listDviTsan.push(...dataGroup);
        const listDanhSachHopDong = this.loadDanhSachHdong.filter(item => item.maDvi === this.userInfo.MA_DVI && item.idQdDc ? item.idQdDc === this.formData.value.idQdDc && item.idQdPd === this.formData.value.idQdPd : item.idQdPd === this.formData.value.idQdPd);
        this.listDviTsanFilter = this.idHopDong ? this.listDviTsan : this.listDviTsan.filter(item => !listDanhSachHopDong.some(child => child.maDviTsan.includes(item.maDviTsan)));
        const group = this.listDviTsanFilter.reduce((acc, val) => {
          acc[val.maDviTsan] = acc[val.maDviTsan] || [];
          acc[val.maDviTsan].push(val);
          return acc;
        }, {});
        this.listDviTsanHienThi.push(...Object.entries(group).map(([key, value]) => ({
          maDviTsan: key,
          children: value
        })));
      }
    })
  }

  async maDviTsanCuc(event) {
    if (this.flagInit && event && event !== this.formData.value.tenBenMua) {
      this.formData.patchValue({
        listMaDviTsan: null,
      });
      this.dataTable = [];
      this.listDviTsanHienThi = [];
    }
    this.listDviTsanFilter = this.listDviTsan.map(grandchild => {
      if (grandchild.children && grandchild.children.length > 0) {
        const filteredChildren = grandchild.children.filter(item => item.children.some(child => child.tochucCanhan === event));
        return filteredChildren.length > 0 ? {...grandchild, children: filteredChildren} : null;
      }
      return null;
    }).filter(item => item !== null);
    const dataGroup = this.listDviTsanFilter.reduce((acc, val) => {
      acc[val.maDviTsan] = acc[val.maDviTsan] || [];
      acc[val.maDviTsan].push(val);
      return acc;
    }, {});
    if (this.idHopDong) {
      this.listDviTsanHienThi.push(...Object.entries(dataGroup).map(([key, value]) => ({
        maDviTsan: key,
        children: value
      })));
    } else {
      this.loadDanhDachHopDong()
      this.loadDanhSachHdong = this.loadDanhSachHdong.filter(item => item.tenBenMua === event);
      const filteredDataGroup = Object.entries(dataGroup)
        .filter(([key]) => !this.loadDanhSachHdong.some(child => child.maDviTsan.split(',').includes(key)))
        .map(([key, value]) => ({maDviTsan: key, children: value}));
      this.listDviTsanHienThi.push(...filteredDataGroup);
    }
  }

  async selectMaDviTsanCuc() {
    this.dataTable = [];
    console.log(this.listDviTsanFilter, 999)
    const currentSelectList = cloneDeep(this.listDviTsanFilter);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      const selectedItems = currentSelectList.filter(item => this.formData.value.listMaDviTsan.includes(item.maDviTsan));
      selectedItems.forEach((item) => {
        const existingItem = this.dataTable.find(child => child.maDvi === item.maDvi);
        if (existingItem) {
          existingItem.children.push(...item.children);
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
        donGia: this.dataTable[0].donGiaKyHd,
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
      });
    } else {
      this.dataTable.forEach((item) => {
        item.children.forEach(child => {
          if (this.formData.value === "QĐKQ") {
            const thongTin = child.children.find((info) => info.idDviDtl === child.id);
            if (thongTin) {
              child.soLuongKyHd = thongTin.soLuong;
              child.donGiaKyHd = thongTin.donGia;
              child.thanhTien = thongTin.soLuong * thongTin.donGia;
            }
          }
          child.soLuongKyHd = child.soLuongDeXuat;
          child.donGiaKyHd = child.donGiaDuocDuyet;
          child.thanhTien = child.thanhTienDuocDuyet;
        })
        item.soLuongXuatBan = item.children.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0);
        item.soLuongKyHopDong = item.children.reduce((prev, cur) => prev + cur.soLuongKyHd, 0);
        item.thanhTien = item.children.reduce((prev, cur) => prev + cur.thanhTien, 0);
      });
      this.formData.patchValue({
        soLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongKyHopDong, 0),
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
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
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    const diaDiemKho = res.data.find(s => s.maDvi === item.maDiemKho);
    if (diaDiemKho) {
      item.diaDiemKho = diaDiemKho.diaChi;
    }
  }

  // Hợp đồng chi cục
  async openDialogUyQuyen() {
    try {
      await this.spinner.show();
      const body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namHd,
        trangThai: STATUS.DA_HOAN_THANH,
        pthucBanTrucTiep: ['02'],
        lastest: 1
      };
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listSoQdPdKh = res.data.content
          .filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI))
          .map(item => ({
            soQd: item.soQdDc || item.soQdPd,
            ...item
          }));
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
          dataHeader: ['Số QĐ PD/ĐC KQ chào giá', ' Loại hàng hóa', 'Chủng loại hàng hóa'],
          dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeUyQuyen(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeUyQuyen(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const loaiVthhItem = this.listHangHoaAll.find(s => s.ma == data.loaiVthh);
      this.formData.patchValue({
        namHd: data.namKh,
        idChaoGia: data.id,
        idQdPd: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.xhQdPdKhBttHdr.idQdPd : data.idHdr,
        soQdPd: data.soQdPd,
        idQdDc: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.idHdr : null,
        soQdDc: data.soQdDc,
        soQd: data.soQdDc || data.soQdPd,
        idQdNv: data.idQdNv,
        soQdNv: data.soQdNv,
        ngayKyUyQuyen: data.ngayNhanCgia,
        thoiHanXuatKho: data.tgianDkienDen,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.moTaHangHoa,
        slXuatBanQdPd: data.children.find(item => item.maDvi === this.userInfo.MA_DVI).soLuongChiCuc,
        donViTinh: loaiVthhItem?.maDviTinh,
      });
      await this.loadDanhDachHopDong();
      const filteredItems = this.loadDanhSachHdong.filter(item => item.idChaoGia === data.id && item.trangThai === STATUS.DA_KY);
      const slXuatBanKyHdong = filteredItems.reduce((acc, item) => acc + item.soLuong, 0);
      const tonSl = this.formData.value.slXuatBanQdPd || 0
      const slXuatBanChuaKyHdong = tonSl - slXuatBanKyHdong;
      this.formData.patchValue({
        slXuatBanKyHdong: slXuatBanKyHdong,
        slXuatBanChuaKyHdong: slXuatBanChuaKyHdong,
      });
      if (!data.idQdNv) {
        this.notification.error(MESSAGE.WARNING, 'Hiện chưa có quyết định giao nhiệm vụ xuất hàng !.');
        return;
      }
      const resQdNv = await this.quyetDinhNvXuatBttService.getDetail(data.idQdNv);
      if (resQdNv.msg !== MESSAGE.SUCCESS || !resQdNv.data) {
        return;
      }
      const dataQdNv = resQdNv.data;
      if (dataQdNv.children && dataQdNv.children.length > 0) {
        const foundItem = dataQdNv.children.find(item => item.maDvi === this.userInfo.MA_DVI);
        if (foundItem) {
          await this.setListMaDviTsanChiCuc([foundItem]);
        }
      }
    } catch (e) {
      console.error('error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  ChangeUyQuyen(event) {
    if (this.flagInit && event && event !== this.formData.value.soQd) {
      this.formData.patchValue({
        listMaDviTsan: null,
      });
    }
  }

  setListMaDviTsanChiCuc(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      let dataGroup = _.chain(item.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value
      })).value();
      dataGroup.forEach(child => {
        child.tenDvi = item.tenDvi
        child.maDvi = item.maDvi
        child.soLuong = item.soLuong
        if (child.maDviTsan) {
          this.listDviTsan = [...this.listDviTsan, child];
        }
      })
    })
    const listDanhSachHopDong = this.loadDanhSachHdong.filter(item => item.maDvi === this.userInfo.MA_DVI && item.idQdNv === this.formData.value.idQdNv);
    this.listAllDviTsan = this.idHopDong ? this.listDviTsan : this.listDviTsan.filter(item => !listDanhSachHopDong.some(child => child.maDviTsan.includes(item.maDviTsan)));
  }

  async selectMaDviTsanChiCuc() {
    this.dataTable = [];
    let currentSelectList = cloneDeep(this.listAllDviTsan);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      const selectedItems = currentSelectList.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
      this.dataTable = selectedItems.flatMap(item => item.children);
      await this.calculatorTable();
    } else {
      this.dataTable = []
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

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (!phoneNumber || phoneNumber[0] !== '0' || !/^[0-9]+$/.test(phoneNumber)) {
      return {invalidPhoneNumber: true};
    }
    return null;
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

  setValidForm() {
    const fieldsToValidate = [
      "namHd",
      "soQdPd",
      "tenBenMua",
      "listMaDviTsan",
      "soHopDong",
      "tenHopDong",
      "ngayKyHopDong",
      "ngayHlucHopDong",
      "loaiHopDong",
      "tgianGiaoNhan",
      "dieuKien",
      "diaChiBenBan",
      "mstBenBan",
      "tenNguoiDaiDien",
      "chucVuBenBan",
      "sdtBenBan",
      "faxBenBan",
      "stkBenBan",
      "moTaiBenBan",
      "stkBenMua",
      "moTaiBenMua",
      "moTaHangHoa",
    ];
    if (this.userService.isCuc()) {
      fieldsToValidate.push("soQdKq");
    }
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }

  protected readonly THONG_TIN_BAN_TRUC_TIEP = THONG_TIN_BAN_TRUC_TIEP;
}
