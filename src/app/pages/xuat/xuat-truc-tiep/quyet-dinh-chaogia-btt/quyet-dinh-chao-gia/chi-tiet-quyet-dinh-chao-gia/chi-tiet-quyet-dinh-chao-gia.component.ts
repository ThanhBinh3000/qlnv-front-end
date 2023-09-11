import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";
import {
  QdPdKetQuaBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service";
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import {ChiTietThongTinBanTrucTiepChaoGia, FileDinhKem} from "../../../../../../models/DeXuatKeHoachBanTrucTiep";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import * as dayjs from "dayjs";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {Validators} from "@angular/forms";
import {saveAs} from 'file-saver';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";

@Component({
  selector: 'app-chi-tiet-quyet-dinh-chao-gia',
  templateUrl: './chi-tiet-quyet-dinh-chao-gia.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-chao-gia.component.scss']
})
export class ChiTietQuyetDinhChaoGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  maHauTo: any;
  listOfData: any[] = [];
  showFromTT: boolean;
  selected: boolean = false;
  luaChon: boolean = false;
  loadQuyetDinhKetQua: any[] = [];
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
      namKh: [],
      soQdKq: [''],
      ngayKy: [''],
      ngayHluc: [''],
      idQdPd: [],
      soQdPd: [''],
      idChaoGia: [],
      loaiHinhNx: [''],
      kieuNx: [''],
      trichYeu: [''],
      maDvi: [''],
      diaDiemChaoGia: [''],
      ngayMkho: [''],
      ngayKthuc: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      ghiChu: [''],
      slHdDaKy: [],
      slHdChuaKy: [],
      tongSoLuong: [],
      tongGiaTriHdong: [],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDaKy: [new Array<FileDinhKem>()],
      fileQd: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
      await this.onExpandChange(0, true);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      namKh: dayjs().get('year'),
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
        this.dataTable = res.children;
        if (this.dataTable && this.dataTable.length > 0) {
          this.showFirstRow(event, this.dataTable[0].children);
        }
      }
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.setValidator();
    let body = {
      ...this.formData.value,
      soQdKq: this.formData.value.soQdKq ? this.formData.value.soQdKq + this.maHauTo : null
    }
    body.children = this.dataTable;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    let body = {
      ...this.formData.value,
      soQdKq: this.formData.value.soQdKq ? this.formData.value.soQdKq + this.maHauTo : null
    }
    body.children = this.dataTable;
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async openThongtinChaoGia() {
    await this.spinner.show();
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucBanTrucTiep: ['01'],
    }
    await this.loadQdNvXuatHang();
    let res = await this.chaoGiaMuaLeUyQuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadQuyetDinhKetQua.map((item => JSON.stringify({idChaoGia: item.idChaoGia}))));
        this.dataThongTinChaoGia = data.filter(item => {
          const key = JSON.stringify({idChaoGia: item.id});
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
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.qdPdKetQuaBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadQuyetDinhKetQua = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeTtin(idPdKhDtl) {
    await this.spinner.show();
    if (idPdKhDtl > 0) {
      await this.chaoGiaMuaLeUyQuyenService.getDetail(idPdKhDtl)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQdKh = res.data
            this.formData.patchValue({
              idQdPd: dataQdKh.idHdr,
              soQdPd: dataQdKh.soQdPd,
              idChaoGia: dataQdKh.id,
              tenDvi: dataQdKh.tenDvi,
              diaDiemChaoGia: dataQdKh.diaDiemChaoGia,
              ngayMkho: dataQdKh.ngayMkho,
              ngayKthuc: dataQdKh.ngayKthuc,
              loaiVthh: dataQdKh.loaiVthh,
              tenLoaiVthh: dataQdKh.tenLoaiVthh,
              cloaiVthh: dataQdKh.cloaiVthh,
              tenCloaiVthh: dataQdKh.tenCloaiVthh,
              moTaHangHoa: dataQdKh.moTaHangHoa,
              pthucBanTrucTiep: dataQdKh.pthucBanTrucTiep,
              loaiHinhNx: dataQdKh.loaiHinhNx,
              tenLoaiHinhNx: dataQdKh.tenLoaiHinhNx,
              kieuNx: dataQdKh.kieuNx,
              tenKieuNx: dataQdKh.tenKieuNx,
              tongSoLuong: dataQdKh.tongSoLuong,
            })
            this.dataTable = dataQdKh.children;
            if (this.dataTable && this.dataTable.length > 0) {
              this.showFirstRow(event, this.dataTable[0].children);
            }
            if (this.dataTable) {
              let tongGiaTriHdong : number = 0
              this.dataTable.forEach((item) => {
                item.id = null;
                item.children.forEach((child) => {
                  child.id = null
                  tongGiaTriHdong += child.thanhTien;
                  child.children.forEach((s) => {
                    s.id = null
                    if (s.fileDinhKems) {
                      s.fileDinhKems.id = null;
                    }
                  })
                })
              })
              this.formData.patchValue({
                tongGiaTriHdong : tongGiaTriHdong,
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

  async preview(id) {
    await this.qdPdKetQuaBttService.preview({
      tenBaoCao: 'Quyết định phê duyệt kết quả chào giá',
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

  downloadPdf() {
    saveAs(this.pdfSrc, "quyet-dinh-phe-duyet-ke-qua-chao-gia.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "quyet-dinh-phe-duyet-ke-qua-chao-gia.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview(){
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  setValidator() {
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
  }
  setValidForm() {
    this.formData.controls["namKh"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["soQdKq"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["diaDiemChaoGia"].setValidators([Validators.required]);
    this.formData.controls["ngayMkho"].setValidators([Validators.required]);
    this.formData.controls["ngayKthuc"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
  }
}
