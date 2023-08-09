import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from "../../../../../../constants/status";
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {PREVIEW} from "src/app/constants/fileType";
import {saveAs} from 'file-saver';
import {QuyetDinhGiaTCDTNNService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
@Component({
  selector: 'app-them-quyet-dinh-ban-dau-gia',
  templateUrl: './them-quyet-dinh-ban-dau-gia.component.html',
  styleUrls: ['./them-quyet-dinh-ban-dau-gia.component.scss']
})

export class ThemQuyetDinhBanDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isView: boolean;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  maHauTo: any;
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  danhsachDx: any[] = [];
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean
  selected: boolean = false;
  maDviCuc: string;
  vatidateBanHanh: boolean = false;
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;
  templateName = "quyet-dinh-ke-hoach-ban-dau-gia";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      id: [null],
      nam: [],
      soQdPd: ['',],
      ngayKyQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      soTrHdr: [''],
      idTrHdr: [''],
      trichYeu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      trangThai: [''],
      tenTrangThai: [''],
      phanLoai: ['', [Validators.required]],
      soQdCc: [''],
      slDviTsan: [],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      namKh: [],
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["ngayKyQd"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idThHdr"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
      this.formData.controls["soTrHdr"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idThHdr"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soTrHdr"].setValidators([Validators.required]);
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.loadChiTiet(this.idInput)
      } else {
        await this.initForm();
      }
      await this.bindingDataTongHop(this.dataTongHop);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async onChangeNamKh() {
    this.formData.patchValue({
      namKh: this.formData.value.nam
    })
  }

  async initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      trangThai: STATUS.DANG_NHAP_DU_LIEU,
      tenTrangThai: 'Đang nhập dữ liệu',
      phanLoai: 'TH'
    })
  }

  async showFirstRow($event, dataDxBdg: any) {
    await this.showDetail($event, dataDxBdg);
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        idThHdr: dataTongHop.id == null ? dataTongHop.idTh : dataTongHop.id,
        phanLoai: 'TH',
      })
      await this.selectMaTongHop(this.formData.value.idThHdr);
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soQdPd: this.formData.value.soQdPd ? this.formData.value.soQdPd + this.maHauTo : null
    }
    body.children = this.danhsachDx;
    body.canCuPhapLy = this.canCuPhapLy;
    body.fileDinhKem = this.fileDinhKem;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    await this.vatidateBanHanhQd(this.danhsachDx)
    if (this.vatidateBanHanh == false) {
      this.notification.error(MESSAGE.ERROR, 'Hiện chưa có giá bán cụ thể được duyệt cho loại hàng hóa này.');
    } else {
      let body = {
        ...this.formData.value,
        soQdPd: this.formData.value.soQdPd ? this.formData.value.soQdPd + this.maHauTo : null
      }
      body.children = this.danhsachDx;
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    }
  }

  async vatidateBanHanhQd(data) {
    data.forEach((item) => {
      item.children.forEach((child) => {
        child.children.forEach(s => {
          if (!s.donGiaDuocDuyet) {
            this.vatidateBanHanh = false;
          } else {
            this.vatidateBanHanh = true
          }
        })
      })
    })
  }

  async loadChiTiet(id: number) {
    if (id) {
      let data = await this.detail(id);
      if (data) {
        this.formData.patchValue({
          soQdPd: data.soQdPd?.split('/')[0],
          namKh: this.formData.value.nam
        })
        this.canCuPhapLy = data.canCuPhapLy ;
        this.fileDinhKem = data.fileDinhKem  ;
      }
      if (this.userService.isCuc()) {
        this.maDviCuc = this.userInfo.MA_DVI
      }
      if (this.maDviCuc) {
        this.danhsachDx = data.children.filter(s => s.maDvi == this.maDviCuc)
      } else {
        this.danhsachDx = data.children;
      }
      if (this.danhsachDx && this.danhsachDx.length > 0) {
        await this.showFirstRow(event, this.danhsachDx[0]);
      }
    }
  }

  async openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    await this.spinner.show();
    let body = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKh: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.tongHopDeXuatKeHoachBanDauGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT BÁN ĐẤU GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDungThop']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);
      }
    });
    await this.spinner.hide();
  }

  async selectMaTongHop(idTh) {
    await this.spinner.show()
    let soLuongDviTsan: number = 0;
    if (idTh > 0) {
      await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(idTh)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataTh = res.data;
            if (dataTh.idQdPd) {
              await this.loadChiTiet(dataTh.idQdPd)
            } else {
              dataTh.children.forEach((item) => {
                soLuongDviTsan += item.slDviTsan;
              })
              this.formData.patchValue({
                cloaiVthh: dataTh.cloaiVthh,
                tenCloaiVthh: dataTh.tenCloaiVthh,
                loaiVthh: dataTh.loaiVthh,
                tenLoaiVthh: dataTh.tenLoaiVthh,
                tchuanCluong: dataTh.tchuanCluong,
                soQdCc: dataTh.soQdPd,
                slDviTsan: soLuongDviTsan,
                namKh: this.formData.value.nam,
                idThHdr: dataTh.id,
                idTrHdr: null,
                soTrHdr: null,
              })
              await this.getDataChiTieu();
              for (let item of dataTh.children) {
                let res = await this.deXuatKhBanDauGiaService.getDetail(item.idDxHdr);
                if (res.msg == MESSAGE.SUCCESS) {
                  const dataDx = res.data;
                  this.formData.patchValue({
                    tchuanCluong: dataDx.tchuanCluong,
                    loaiHinhNx: dataDx.loaiHinhNx,
                    tenLoaiHinhNx: dataDx.tenLoaiHinhNx,
                    kieuNx: dataDx.kieuNx,
                    tenKieuNx: dataDx.tenKieuNx,
                  })
                  dataDx.idDxHdr = dataDx.id;
                  this.danhsachDx.push(dataDx);
                  if (this.danhsachDx && this.danhsachDx.length > 0) {
                    this.showFirstRow(event, this.danhsachDx[0]);
                  }
                }
              }
              this.dataInput = null;
              this.dataInputCache = null;
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide()
  }

  async getDataChiTieu() {
    let res2 = null;
    res2 = await this.chiTieuKeHoachNamCapTongCucService.canCuCucQd(
      +this.formData.get('nam').value,
    );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        soQdCc: res2.data.soQuyetDinh,
      });
    } else {
      this.formData.patchValue({
        soQdCc: null
      });
    }
  }

  async openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    await this.spinner.show();
    let body = {
      trangThai: STATUS.DA_DUYET_CBV,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.deXuatKhBanDauGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỀ XUẤT KẾ HOẠCH BÁN ĐẤU GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listToTrinh,
        dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeIdTrHdr(idDx) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (idDx > 0) {
      await this.deXuatKhBanDauGiaService.getDetail(idDx)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDx = res.data;
            dataDx.idDxHdr = dataDx.id;
            this.formData.patchValue({
              cloaiVthh: dataDx.cloaiVthh,
              tenCloaiVthh: dataDx.tenCloaiVthh,
              loaiVthh: dataDx.loaiVthh,
              tenLoaiVthh: dataDx.tenLoaiVthh,
              tchuanCluong: dataDx.tchuanCluong,
              moTaHangHoa: dataDx.moTaHangHoa,
              tgianDkienTu: dataDx.tgianDkienTu,
              tgianDkienDen: dataDx.tgianDkienDen,
              tgianTtoan: dataDx.tgianTtoan,
              tgianTtoanGhiChu: dataDx.tgianTtoanGhiChu,
              pthucTtoan: dataDx.pthucTtoan,
              tgianGnhan: dataDx.tgianGnhan,
              tgianGnhanGhiChu: dataDx.tgianGnhanGhiChu,
              pthucGnhan: dataDx.pthucGnhan,
              thongBaoKh: dataDx.thongBaoKh,
              trichYeu: dataDx.trichYeu,
              tenDvi: dataDx.tenDvi,
              diaChi: dataDx.diaChi,
              slDviTsan: dataDx.slDviTsan,
              maDvi: dataDx.maDvi,
              loaiHinhNx: dataDx.loaiHinhNx,
              tenLoaiHinhNx: dataDx.tenLoaiHinhNx,
              kieuNx: dataDx.kieuNx,
              tenKieuNx: dataDx.tenKieuNx,
              namKh: this.formData.value.nam,
              idThHdr: null,
              soTrHdr: dataDx.soDxuat,
              idTrHdr: dataDx.id,
            })
            await this.getDataChiTieu();
            this.danhsachDx.push(dataDx);
            if (this.danhsachDx && this.danhsachDx.length > 0) {
              this.showFirstRow(event, this.danhsachDx[0]);
            }
            this.dataInput = null;
            this.dataInputCache = null;
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  index = 0;

  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[index];
      if (this.dataInput) {
        let res = await this.deXuatKhBanDauGiaService.getDetail(this.dataInput.idDxHdr);
        this.dataInputCache = res.data;
      }
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[0];
      if (this.dataInput) {
        let res = await this.deXuatKhBanDauGiaService.getDetail(this.dataInput.idDxHdr);
        console.log(res.data, 999)
        this.dataInputCache = res.data;
      }
      this.index = 0;
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

  async preview(id) {
    await this.quyetDinhPdKhBdgService.preview({
      tenBaoCao: this.templateName,
      id: id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + ".pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + ".docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
}
