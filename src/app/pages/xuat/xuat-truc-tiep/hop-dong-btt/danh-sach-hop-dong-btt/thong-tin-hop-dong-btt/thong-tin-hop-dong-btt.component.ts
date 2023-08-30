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
import {chain, cloneDeep} from 'lodash';
import {Validators} from '@angular/forms';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {DonviService} from 'src/app/services/donvi.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";

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
  listHdDaKy: any[] = [];
  listDviTsanFilter: any[] = [];
  listDviTsan: any[] = [];
  listAllDviTsan: any[] = [];
  listDiaDiemKho: any[] = [];
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
        ngayKyQdPd: [''],
        tenDviMua: [''],
        maDviTsan: [''],
        loaiHinhNx: [''],
        kieuNx: [''],
        soHd: ['', [Validators.required]],
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
        tongSlDaKyHdong: [],
        tongSlChuaKyHdong: [],
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
    await this.spinner.show();
    try {
      this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
      await Promise.all([
        this.loadDataComboBox(),
        this.loadDsVthh(),
      ]);
      this.initForm();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.idInput) {
        if (this.userService.isCuc()) {
          await this.onChangeChaoGia(this.idInput);
        } else {
          await this.onChangeUyQuyen(this.idInput);
        }
      }
      if (this.idHopDong) {
        await this.loadChiTiet(this.idHopDong);
      }
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
    // loại hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
    }
  }

  async loadChiTiet(id) {
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soHd: data?.soHd?.split('/')[0],
        tgianGnhanHang: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
      })
      if (this.userService.isCuc()) {
        this.maDviTsanCuc(data.tenDviMua);
      }
      if (!this.userService.isChiCuc()) {
        this.dataTable = cloneDeep(data.children);
      } else {
        this.dataTable = cloneDeep(data.xhHopDongBttDviList)
      }
      this.dataTablePhuLuc = data?.phuLuc || [];
      this.objHopDongHdr = data || {};
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soHd: this.formData.value.soHd ? this.formData.value.soHd + this.maHopDongSuffix : null
    }
    if (this.formData.get('tgianGnhanHang').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('tgianGnhanHang').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('tgianGnhanHang').value[1]).format('YYYY-MM-DD')
    }
    if (this.userService.isCuc()) {
      body.children = this.dataTable;
    } else {
      body.xhHopDongBttDviList = this.dataTable;
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    let body = {
      ...this.formData.value,
      soHd: this.formData.value.soHd ? this.formData.value.soHd + this.maHopDongSuffix : null
    }
    if (this.formData.get('tgianGnhanHang').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('tgianGnhanHang').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('tgianGnhanHang').value[1]).format('YYYY-MM-DD')
    }
    if (this.userService.isCuc()) {
      body.children = this.dataTable;
    } else {
      body.xhHopDongBttDviList = this.dataTable;
    }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async openDialogChaoGia() {
    await this.spinner.show();
    let body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namHd,
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.qdPdKetQuaBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.listSoQdKqBtt = data;
      }
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
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeChaoGia(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeChaoGia(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.qdPdKetQuaBttService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            await this.loadDsHd(data.soQdKq)
            await this.setListDviTsanCuc(data.children);
            this.formData.patchValue({
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
              tongSlXuatBanQdKh: data.children.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
              tongSlDaKyHdong: data.tongSlDaKyHdong,
              tongSlChuaKyHdong: data.tongSlChuaKyHdong,
            });
            data.children.forEach((item) => {
              item.children.flatMap((child) =>
                child.children.map((grandchild) =>
                  this.listTccnChaoGia = [...this.listTccnChaoGia, grandchild]))
            });
            this.formData.patchValue({
              donViTinh: this.listHangHoaAll.find(s => s.ma == data.loaiVthh,)?.maDviTinh
            })
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async openDialogToChucCaNhan() {
    await this.spinner.show();
    let map = new Map();
    for (let obj of this.listTccnChaoGia) {
      let key = obj.tochucCanhan + obj.mst + obj.sdt + obj.luaChon;
      if (map.has(key)) {
        // Gộp đối tượng mới với đối tượng đã tồn tại trong Map
        let existingObj = map.get(key);
        existingObj.someProperty += obj.someProperty;
      } else {
        // Thêm đối tượng mới vào Map
        map.set(key, obj);
      }
    }
    let result = Array.from(map.values());
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN TÊN TỔ CHỨC CÁ NHÂN CHÀO GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: result.filter(s => s.luaChon == true),
        dataHeader: ['Tên tổ chức cá nhân', 'Số điện thoại', 'Mã số thuế'],
        dataColumn: ['tochucCanhan', 'sdt', 'mst'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeToChucCaNhan(data.id)
      }
    });
    await this.spinner.hide();
  }

  async onChangeToChucCaNhan(id) {
    await this.spinner.show();
    if (id) {
      await this.qdPdKetQuaBttService.getToChucDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataToChuc = res.data;
            if (res.data) {
              this.maDviTsanCuc(dataToChuc.tochucCanhan)
              this.formData.patchValue({
                idDviMua: dataToChuc.id,
                tenDviMua: dataToChuc.tochucCanhan,
                diaChiDviMua: dataToChuc.diaDiemChaoGia,
                mstDviMua: dataToChuc.mst,
              });
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }


  setListDviTsanCuc(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      item.children.forEach(element => {
        let dataGroup = chain(element.children).groupBy('tochucCanhan').map((value, key) => ({
          tochucCanhan: key,
          toChuc: value
        })).value();
        item.dataDviTsan = dataGroup;
        item.dataDviTsan.forEach(x => {
          x.tenDvi = item.tenDvi
          x.maDvi = item.maDvi
          x.diaChi = item.diaChi
          x.maDviTsan = element.maDviTsan
          x.children = item.children.filter(s => s.maDviTsan == element.maDviTsan)
          if (x.maDviTsan) {
            this.listDviTsan = [...this.listDviTsan, x];
          }
        })
      });
    })
  }

  maDviTsanCuc(event) {
    if (this.idHopDong) {
      this.listDviTsanFilter = this.listDviTsan.filter(s => s.tochucCanhan == event)
    } else {
      this.listDviTsanFilter = this.listDviTsan.filter(s => s.tochucCanhan == event)
      this.listDviTsanFilter = this.listDviTsanFilter.filter(s => !this.listHdDaKy.some(s1 => {
          return s1.maDviTsan.split(',').includes(s.maDviTsan) && s1.tenDviMua.split(',').includes(s.tochucCanhan);
        })
      );
    }
  }

  selectMaDviTsanCuc() {
    this.dataTable = [];
    let currentSelectList = cloneDeep(this.listDviTsanFilter);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      let listAll = currentSelectList.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
      listAll.forEach(item => {
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((child) => {
            if (child.maDvi == item.maDvi) {
              child.children = [...child.children, ...item.children]
            } else {
              this.dataTable = [...this.dataTable, item]
            }
          })
        } else {
          this.dataTable = [...this.dataTable, item]
        }
      });
      this.calculatorTable();
    } else {
      this.dataTable = []
    }
  }

  async calculatorTable() {
    this.listHdDaKy = this.listHdDaKy.filter(item => item.trangThai == STATUS.DA_KY);
    if (this.userService.isChiCuc()) {
      this.formData.patchValue({
        soLuongBanTrucTiep: this.dataTable.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0),
        donGiaBanTrucTiep: this.dataTable[0].donGiaDuocDuyet,
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0) * this.dataTable[0].donGiaDuocDuyet,
      });
    } else {
      let donGiaBanTrucTiep: number = 0;
      this.dataTable.forEach((item) => {
        item.soLuongChiCuc = 0;
        item.soLuongBanTrucTiepHd = 0;
        item.children.forEach((child) => {
          child.children.filter(s => s.tochucCanhan == item.tochucCanhan).forEach(s1 => {
            child.soLuongKyHd = s1.soLuong
            child.donGiaKyHd = s1.donGia
          })
          item.soLuongChiCuc += child.soLuongDeXuat;
          item.soLuongBanTrucTiepHd += child.soLuongKyHd;
          donGiaBanTrucTiep += child.donGiaKyHd;
        })
      });
      this.formData.patchValue({
        soLuongBanTrucTiep: this.dataTable.reduce((prev, cur) => prev + cur.soLuongBanTrucTiepHd, 0),
        donGiaBanTrucTiep: donGiaBanTrucTiep,
        thanhTien: donGiaBanTrucTiep * this.dataTable.reduce((prev, cur) => prev + cur.soLuongBanTrucTiepHd, 0),
      });
    }
    await this.loadDiaDiemKho();
  }

  async loadDiaDiemKho() {
    for (const item of this.dataTable) {
      let bodyCuc = {
        trangThai: "01",
        maDviCha: item.maDvi
      };
      let bodyChiCuc = {
        trangThai: "01",
        maDviCha: this.userInfo.MA_DVI
      }
      const res = await this.donViService.getAll(this.userService.isChiCuc() ? bodyChiCuc : bodyCuc)
      const dataDk = res.data;
      if (dataDk) {
        if (this.userService.isChiCuc()) {
          this.listDiaDiemKho = dataDk.filter(s => s.maDvi == item.maDiemKho);
          this.listDiaDiemKho.forEach(s => {
            item.diaDiemKho = s.diaChi;
          })
        } else {
          item.children.forEach((child) => {
            this.listDiaDiemKho = dataDk.filter(item => item.maDvi == child.maDiemKho);
            this.listDiaDiemKho.forEach(s => {
              child.diaDiemKho = s.diaChi;
            })
          })
        }
      }
    }
  }

  // Hợp đồng chi cục
  async openDialogUyQuyen() {
    await this.spinner.show();
    let body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namHd,
      trangThai: STATUS.BAN_HANH,
      pthucBanTrucTiep: '02'
    };
    let res = await this.quyetDinhNvXuatBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.listSoQdPdKh = data;
        this.listSoQdPdKh = this.listSoQdPdKh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
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
        await this.onChangeUyQuyen(data.idQdPdDtl);
      }
    });
    await this.spinner.hide();
  }

  async onChangeUyQuyen(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.chaoGiaMuaLeUyQuyenService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            await this.loadDsHd(data.soQdNv)
            this.formData.patchValue({
              idChaoGia: data.id,
              idQdPd: data.idHdr,
              soQdPd: data.soQdPd,
              idQdNv: data.idQdNv,
              soQdNv: data.soQdNv,
              ngayKyQdPd: data.ngayNhanCgia,
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
              tongSlDaKyHdong: data.tongSlDaKyHdong,
              tongSlChuaKyHdong: data.tongSlChuaKyHdong,
            });
            this.formData.patchValue({
              donViTinh: this.listHangHoaAll.find(s => s.ma == data.loaiVthh,)?.maDviTinh
            })
            let resQdNv = await this.quyetDinhNvXuatBttService.getDetail(data.idQdNv);
            if (resQdNv.msg == MESSAGE.SUCCESS) {
              if (resQdNv.data) {
                const dataQdNv = resQdNv.data
                await this.setListMaDviTsanChiCuc(dataQdNv.children);
              }
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }


  setListMaDviTsanChiCuc(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      item.children.forEach((child) => {
        if (child.maDviTsan) {
          this.listDviTsan = [...this.listDviTsan, child];
        }
      })
    })
    if (this.idHopDong) {
      this.listAllDviTsan = this.listDviTsan;
    } else {
      this.listAllDviTsan = this.listDviTsan.filter(s => !this.listHdDaKy.some(s1 => {
          return s1.maDviTsan.split(',').includes(s.maDviTsan);
        })
      );
    }
  }

  selectMaDviTsanChiCuc() {
    this.dataTable = [];
    let currentSelectList = cloneDeep(this.listAllDviTsan);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      let listAll = currentSelectList.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
      listAll.forEach(item => {
        this.dataTable = [...this.dataTable, item]
      });
      this.calculatorTable();
    } else {
      this.dataTable = []
    }
  }

  async loadDsHd(event) {
    let bodyCuc = {
      soQdKq: event,
      // trangThai: STATUS.DA_KY,
      loaiVthh: this.loaiVthh,
      namHd: this.formData.value.namHd,
    }
    let bodyChiCuc = {
      soQdNv: event,
      // trangThai: STATUS.DA_KY,
      loaiVthh: this.loaiVthh,
      namHd: this.formData.value.namHd,
    }
    let res = await this.hopDongBttService.search(this.userService.isCuc() ? bodyCuc : bodyChiCuc);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listHdDaKy = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: data.id
          };
          this.hopDongBttService.delete(body).then(async () => {
            this.loadChiTiet(this.idHopDong);
            this.spinner.hide();
          });
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
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }

  setValidForm() {
    this.formData.controls["namHd"].setValidators([Validators.required]);
    this.formData.controls["soQdKq"].setValidators([Validators.required]);
    this.formData.controls["ngayKyQdKq"].setValidators([Validators.required]);
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
  }
}


