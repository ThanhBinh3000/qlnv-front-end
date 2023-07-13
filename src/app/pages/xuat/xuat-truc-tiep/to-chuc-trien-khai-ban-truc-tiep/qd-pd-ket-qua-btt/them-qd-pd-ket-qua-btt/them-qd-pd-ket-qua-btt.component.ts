import {Component, Input, OnInit} from '@angular/core';
import * as dayjs from "dayjs";
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {STATUS} from 'src/app/constants/status';
import {MESSAGE} from 'src/app/constants/message';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {saveAs} from 'file-saver';
import {ChiTietThongTinBanTrucTiepChaoGia, FileDinhKem} from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-them-qd-pd-ket-qua-btt',
  templateUrl: './them-qd-pd-ket-qua-btt.component.html',
  styleUrls: ['./them-qd-pd-ket-qua-btt.component.scss']
})

export class ThemQdPdKetQuaBttComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  maTrinh: String;
  listOfData: any[] = [];
  showFromTT: boolean;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  fileCanCu: any[] = [];
  fileQdDaKy: any[] = [];
  fileQd: any[] = [];
  selected: boolean = false;
  luaChon: boolean = false;
  loadQdKqBtt: any[] = []
  dataThongTinChaoGia: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);

    this.formData = this.fb.group({
      id: [],
      idPdKhDtl: [],
      idPdKhHdr: [],
      namKh: [dayjs().get('year')],
      soQdKq: [''],
      ngayHluc: [''],
      ngayKy: [''],
      soQdPd: [''],
      trichYeu: [''],
      maDvi: [''],
      tenDvi: [''],
      diaDiemChaoGia: [''],
      ngayMkho: [''],
      ngayKthuc: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      ghiChu: [''],
      pthucBanTrucTiep: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      soDxuat: [''],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maTrinh = '/' + this.userInfo.MA_QD;
      if (this.idInput) {
        this.getDetail(this.idInput);
      } else {
        this.initForm();
      }
      await Promise.all([
        this.onExpandChange(0, true),
        this.loadDataComboBox()
      ])
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
  }

  async showFirstRow($event, dataToChuc: any) {
    await this.selectRow($event, dataToChuc);
  }

  async getDetail(idInput) {
    if (idInput) {
      let res = await this.detail(idInput);
      if (res) {
        this.formData.patchValue({
          soQdKq: res.soQdKq?.split('/')[0],
        })
        this.fileCanCu = res.fileCanCu;
        this.fileQdDaKy = res.fileQdDaKy;
        this.fileQd = res.fileQd;
        this.dataTable = res.children;
        if (this.dataTable && this.dataTable.length > 0) {
          this.showFirstRow(event, this.dataTable[0].children);
        }
      }
    }
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    if (this.formData.get('soQdKq').value) {
      body.soQdKq = this.formData.get('soQdKq').value + this.maTrinh;
    }
    body.fileCanCu = this.fileCanCu;
    body.fileQdDaKy = this.fileQdDaKy;
    body.fileQd = this.fileQd;
    body.children = this.dataTable;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.idInput = res.id
        this.guiDuyet();
      } else {
        this.idInput = res.id
        await this.getDetail(res.id);
      }
    }
    await this.spinner.hide();
  }

  async guiDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.BAN_HANH;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai);
  }

  async openThongtinChaoGia() {
    await this.spinner.show();
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucBanTrucTiep: ['01'],
      maDvi: this.userInfo.MA_DVI,
    }
    await this.loadQdNvXuatHang();
    let res = await this.chaoGiaMuaLeUyQuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadQdKqBtt.map((item => JSON.stringify({soDxuat: item.soDxuat}))));
        this.dataThongTinChaoGia = data.filter(item => {
          const key = JSON.stringify({soDxuat: item.soDxuat});
          return !set.has(key);
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH THÔNG TIN CHÀO GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dataThongTinChaoGia,
        dataHeader: ['Số quyết định phê duyệt KH BTT', 'Số Đề xuất kế hoạch bán trực tiếp', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeTtin(data.id);
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
    let res = await this.qdPdKetQuaBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadQdKqBtt = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeTtin(idPdKhDtl) {
    await this.spinner.show();
    if (idPdKhDtl > 0) {
      await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(idPdKhDtl)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQdKh = res.data
            this.formData.patchValue({
              soQdPd: dataQdKh.xhQdPdKhBttHdr.soQdPd,
              diaDiemChaoGia: dataQdKh.diaDiemChaoGia,
              ngayMkho: dataQdKh.ngayMkho,
              ngayKthuc: dataQdKh.ngayKthuc,
              loaiVthh: dataQdKh.xhQdPdKhBttHdr.loaiVthh,
              tenLoaiVthh: dataQdKh.xhQdPdKhBttHdr.tenLoaiVthh,
              cloaiVthh: dataQdKh.xhQdPdKhBttHdr.cloaiVthh,
              tenCloaiVthh: dataQdKh.xhQdPdKhBttHdr.tenCloaiVthh,
              moTaHangHoa: dataQdKh.xhQdPdKhBttHdr.moTaHangHoa,
              pthucBanTrucTiep: dataQdKh.pthucBanTrucTiep,
              loaiHinhNx: dataQdKh.xhQdPdKhBttHdr.loaiHinhNx,
              kieuNx: dataQdKh.xhQdPdKhBttHdr.kieuNx,
              soDxuat: dataQdKh.soDxuat,
              idPdKhDtl: dataQdKh.id,
              idPdKhHdr: dataQdKh.xhQdPdKhBttHdr.id
            })
            this.dataTable = dataQdKh.children;
            if (this.dataTable && this.dataTable.length > 0) {
              this.showFirstRow(event, this.dataTable[0].children);
            }
            if (this.dataTable) {
              this.dataTable.forEach((item) => {
                item.children.forEach((child) => {
                  child.children.forEach((s) => {
                    if (s.fileDinhKems) {
                      s.fileDinhKems.id = null;
                    }
                  })
                })
              })
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

  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

  startEdit(index: number): void {
    this.listOfData[index].edit = true
  }

  saveEdit(index: number): void {
    this.listOfData[index].edit = false
    this.formData.patchValue({})
  }

  cancelEdit(index: number): void {
    this.listOfData[index].edit = false
    this.formData.patchValue({})
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  async selectRow($event, item) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.listOfData = item.children;
      this.showFromTT = true;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.listOfData = item[0].children;
      this.showFromTT = true;
      await this.spinner.hide();
    }
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  isDisabledLuaChon(item) {
    if (this.luaChon == item) {
      return false
    } else {
      return true;
    }
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["soQdKq"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["diaDiemChaoGia"].setValidators([Validators.required]);
      this.formData.controls["ngayMkho"].setValidators([Validators.required]);
      this.formData.controls["ngayKthuc"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["soQdKq"].clearValidators();
      this.formData.controls["ngayKy"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["diaDiemChaoGia"].clearValidators();
      this.formData.controls["ngayMkho"].clearValidators();
      this.formData.controls["ngayKthuc"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
    }
  }
}
