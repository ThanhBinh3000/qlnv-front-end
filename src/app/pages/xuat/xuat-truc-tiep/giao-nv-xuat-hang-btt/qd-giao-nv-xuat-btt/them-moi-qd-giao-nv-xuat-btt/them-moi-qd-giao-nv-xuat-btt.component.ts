import {Component, Input, OnInit,} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {chain, cloneDeep} from 'lodash';

@Component({
  selector: 'app-them-moi-qd-giao-nv-xuat-btt',
  templateUrl: './them-moi-qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./them-moi-qd-giao-nv-xuat-btt.component.scss']
})
export class ThemMoiQdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() idQdPdDtl: number;
  @Input() isViewOnModal: boolean;
  maQd: string = null;
  listDviTsan: any[] = [];
  fileDinhKems: any[] = []
  loadQdNvXh: any[] = [];
  dsThongTinChaoGia: any[] = [];
  dsHdongBanTrucTiep: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      namKh: [dayjs().get('year')],
      soQdNv: ['',],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      idHd: [],
      soHd: [''],
      idQdPd: [],
      idQdPdDtl: [],
      soQdPd: [''],
      maDviTsan: [''],
      tenTccn: ['',],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      soLuongBanTrucTiep: [],
      donViTinh: [''],
      tgianGnhan: [''],
      trichYeu: [''],
      trangThaiXh: [''],
      tenTrangThaiXh: [''],
      phanLoai: ['CG', [Validators.required]],
      pthucBanTrucTiep: [''],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      listMaDviTsan: [null],
      ngayKyHd: ['']
    })
  }

  setValidator(isGuiDuyet?) {
    if (this.formData.value.phanLoai == 'CG' && isGuiDuyet) {
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
    }
    if (this.formData.value.phanLoai == 'UQBL' && isGuiDuyet) {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
    }
    if (this.formData.value.phanLoai == 'CG') {
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["listMaDviTsan"].clearValidators();
    }
    if (this.formData.value.phanLoai == 'UQBL') {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
    }
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await Promise.all([]);
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
        await this.loadQdNvXuatHang();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      ngayTao: dayjs().format('YYYY-MM-DD'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async openDialogSoHopDong() {
    if (this.formData.get('phanLoai').value != 'CG') {
      return
    }
    await this.spinner.show();
    let body = {
      trangThai: STATUS.DA_KY,
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadQdNvXh.map((item => JSON.stringify({soHd: item.soHd}))));
        this.dsHdongBanTrucTiep = data.filter(item => {
          const key = JSON.stringify({soHd: item.soHd});
          return !set.has(key);
        });
        this.dsHdongBanTrucTiep = this.dsHdongBanTrucTiep.filter(item => item.maDvi === this.userInfo.MA_DVI);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN HỢP ĐỒNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsHdongBanTrucTiep,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeHd(data.id);
      }
    });
    await this.spinner.hide();
  }

  async loadQdNvXuatHang() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadQdNvXh = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeHd(idHd) {
    await this.spinner.show();
    if (idHd > 0) {
      await this.hopDongBttService.getDetail(idHd)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataHd = res.data
            this.formData.patchValue({
              idHd: dataHd.id,
              soHd: dataHd.soHd,
              maDviTsan: dataHd.maDviTsan,
              loaiHinhNx: dataHd.loaiHinhNx,
              kieuNx: dataHd.kieuNx,
              tenTccn: dataHd.tenDviMua,
              loaiVthh: dataHd.loaiVthh,
              tenLoaiVthh: dataHd.tenLoaiVthh,
              cloaiVthh: dataHd.cloaiVthh,
              tenCloaiVthh: dataHd.tenCloaiVthh,
              moTaHangHoa: dataHd.moTaHangHoa,
              soLuongBanTrucTiep: dataHd.soLuongBanTrucTiep,
              donViTinh: dataHd.donViTinh,
              ngayKyHd: dataHd.ngayPduyet,
              pthucBanTrucTiep: '01',
              phanLoai: 'CG',
              tgianGnhan: dataHd.tgianGnhanDen
            })
            this.dataTable = dataHd.children;
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async openDialogQdPdKhBtt() {
    if (this.formData.get('phanLoai').value != 'UQBL') {
      return
    }
    await this.spinner.show();
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucBanTrucTiep: ['02', '03'],
      lastest: 1
    }
    let res = await this.chaoGiaMuaLeUyQuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data && data.length > 0) {
        this.dsThongTinChaoGia = data;
        this.dsThongTinChaoGia = this.dsThongTinChaoGia.filter(item => item.maDvi == this.userInfo.MA_DVI);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN QUYẾT ĐỊNH KẾ HOẠCH BÁN TRỰC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsThongTinChaoGia,
        dataHeader: ['Số quyết định KH BTT', 'Số đề xuất KH BTT', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeQdPdKh(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeQdPdKh(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            await this.setListDviTsan(data.children);
            this.formData.patchValue({
              idQdPd: data.xhQdPdKhBttHdr.id,
              soQdPd: data.xhQdPdKhBttHdr.soQdPd,
              loaiVthh: data.xhQdPdKhBttHdr.loaiVthh,
              tenLoaiVthh: data.xhQdPdKhBttHdr.tenLoaiVthh,
              cloaiVthh: data.xhQdPdKhBttHdr.cloaiVthh,
              tenCloaiVthh: data.xhQdPdKhBttHdr.tenCloaiVthh,
              moTaHangHoa: data.xhQdPdKhBttHdr.moTaHangHoa,
              loaiHinhNx: data.xhQdPdKhBttHdr.loaiHinhNx,
              kieuNx: data.xhQdPdKhBttHdr.kieuNx,
              donViTinh: 'Kg',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
              phanLoai: 'UQBL',
              tgianGnhan: data.thoiHanBan,
              idQdPdDtl: data.id
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

  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value
      })).value();
      item.dataDviTsan = dataGroup;
      item.dataDviTsan.forEach(x => {
        x.tenDvi = item.tenDvi
        x.maDvi = item.maDvi
        x.soLuongChiCuc = null;
        if (x.maDviTsan) {
          this.listDviTsan = [...this.listDviTsan, x];
        }
      })
    })
    this.listDviTsan = this.listDviTsan.filter(s => !this.loadQdNvXh.some(s1 => {
      return s1.maDviTsan.split(',').includes(s.maDviTsan);
    }))
  }

  selectMaDviTsan($event) {
    this.dataTable = [];
    let currentSelectList = cloneDeep(this.listDviTsan);
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

  calculatorTable() {
    let soLuongBanTrucTiep: number = 0;
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        item.soLuongChiCuc += child.soLuongDeXuat;
      })
      soLuongBanTrucTiep += item.soLuongChiCuc
    });
    this.formData.patchValue({
      soLuongBanTrucTiep: soLuongBanTrucTiep
    })
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQdNv) {
      body.soQdNv = this.formData.value.soQdNv + "/" + this.maQd;
    }
    body.children = this.dataTable;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        this.loadChiTiet(data.id)
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        msg = MESSAGE.BAN_HANH_CONFIRM;
        trangThai = STATUS.BAN_HANH;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      if (this.idQdPdDtl) {
        await this.onChangeQdPdKh(this.idQdPdDtl);
      }
      let data = await this.detail(id);
      this.formData.patchValue({
        soQdNv: data.soQdNv?.split('/')[0],
      })
      this.dataTable = data.children;
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
    };
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.BAN_HANH || trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
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
}


