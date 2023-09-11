import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
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
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {
  DeXuatKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import {
  TongHopKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/tong-hop-kh-ban-truc-tiep.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {LOAI_HANG_DTQG} from "../../../../../../constants/config";
import {QuyetDinhGiaTCDTNNService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-them-moi-qd-phe-duyet-kh-ban-truc-tiep',
  templateUrl: './them-moi-qd-phe-duyet-kh-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-qd-phe-duyet-kh-ban-truc-tiep.component.scss']
})

export class ThemMoiQdPheDuyetKhBanTrucTiepComponent extends Base2Component implements OnInit {
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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private tongHopKhBanTrucTiepService: TongHopKhBanTrucTiepService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);
    this.formData = this.fb.group({
      id: [],
      namKh: [],
      maDvi: [''],
      idGoc: [],
      soQdPd: [''],
      ngayKyQd: [''],
      ngayHluc: [''],
      idThHdr: [],
      idTrHdr: [],
      soTrHdr: [''],
      trichYeu: [''],
      soQdCc: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      tchuanCluong: [''],
      slDviTsan: [],
      slHdongDaKy: [],
      phanLoai: [''],
      trangThai: [''],
      tenTrangThai: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      nam: [''],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.loadChiTiet(this.idInput);
      } else {
        await this.initForm();
      }
      await this.bindingDataTongHop(this.dataTongHop);
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeNamKh() {
    this.formData.get('nam').setValue(this.formData.get('namKh').value);
  }

  async initForm() {
    this.formData.patchValue({
      namKh: dayjs().get('year'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      phanLoai: 'TH'
    })
  }

  async showFirstRow($event, dataDxBtt: any) {
    await this.showDetail($event, dataDxBtt);
  }

  async bindingDataTongHop(dataTongHop?) {
    if (!dataTongHop) return;
    if (dataTongHop.trangThai == STATUS.CHUA_TAO_QD) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        idThHdr: dataTongHop.id || dataTongHop.idTh,
        phanLoai: 'TH',
      });
      await this.onChangeIdThHdr(this.formData.value.idThHdr);
    } else {
      await this.loadChiTiet(dataTongHop.idSoQdPd);
      this.isView = dataTongHop.trangThai == STATUS.DA_BAN_HANH_QD;
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.setValidator();
    const body = {
      ...this.formData.value,
      soQdPd: this.formData.value.soQdPd ? `${this.formData.value.soQdPd}${this.maHauTo}` : null,
      children: this.danhsachDx,
      canCuPhapLy: this.canCuPhapLy,
      fileDinhKem: this.fileDinhKem,
    };
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    if (await this.vatidateBanHanhQd(this.danhsachDx)) {
      const body = {
        ...this.formData.value,
        soQdPd: this.formData.value.soQdPd ? `${this.formData.value.soQdPd}${this.maHauTo}` : null,
        children: this.danhsachDx,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } else {
      this.notification.error(MESSAGE.WARNING, 'Hiện chưa có giá bán cụ thể được duyệt cho loại hàng hóa này.');
    }
  }

  async vatidateBanHanhQd(data) {
    return data.some((item) => {
      return item.children.some((child) => {
        return child.children.some(s => s.donGiaDuocDuyet);
      });
    });
  }

  async loadChiTiet(id: number) {
    if (id) {
      let data = await this.detail(id);
      if (data) {
        this.formData.patchValue({
          soQdPd: data.soQdPd?.split('/')[0],
          nam: this.formData.value.namKh
        })
        this.canCuPhapLy = data.canCuPhapLy;
        this.fileDinhKem = data.fileDinhKem;
      }
      this.danhsachDx = data.children;
      await this.calculatorTable();
      if (this.danhsachDx && this.danhsachDx.length > 0) {
        await this.showFirstRow(event, this.danhsachDx[0]);
      }
    }
  }

  async calculatorTable() {
    const {value: namKeHoach} = this.formData.get('namKh');
    const {value: loaiVthh} = this.formData.get('loaiVthh');
    const {value: cloaiVthh} = this.formData.get('cloaiVthh');
    const trangThai = STATUS.BAN_HANH;
    const loaiGia = 'LG04';
    await Promise.all(
      this.danhsachDx.map(async (item) => {
        const maDvi = this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '' : item.maDvi;
        const bodyPag = {namKeHoach, loaiVthh, cloaiVthh, trangThai, maDvi, loaiGia};
        const pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag);
        item.children.forEach((child) => {
          child.children.forEach((s) => {
            s.donGiaDuocDuyet = pag.msg === MESSAGE.SUCCESS && pag.data ? pag.data[0].giaQdTcdt : null;
            s.thanhTienDuocDuyet = s.donGiaDuocDuyet !== null ? s.donGiaDuocDuyet * s.soLuongDeXuat : null;
          });
        });
      })
    );
  }

  async openDialogTh() {
    const phanLoaiValue = this.formData.get('phanLoai').value;
    if (phanLoaiValue !== 'TH') {
      return;
    }
    await this.spinner.show();
    try {
      const body = {
        trangThai: STATUS.CHUA_TAO_QD,
        namKh: this.formData.value.namKh,
        loaiVthh: this.loaiVthh,
      };
      const res = await this.tongHopKhBanTrucTiepService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listDanhSachTongHop = res.data.content;
        const modalQD = this.modal.create({
          nzTitle: 'DANH SÁCH TỔNG HỢP KẾ HOẠCH BÁN TRỰC TIẾP',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: this.listDanhSachTongHop,
            dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
            dataColumn: ['id', 'noiDungThop'],
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            await this.onChangeIdThHdr(data.id);
          }
        });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      console.error('error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeIdThHdr(idTh) {
    await this.spinner.show();
    try {
      if (idTh <= 0) {
        return;
      }
      const res = await this.tongHopKhBanTrucTiepService.getDetail(idTh);
      if (res.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return;
      }
      const dataTh = res.data;
      if (dataTh.idQdPd) {
        await this.loadChiTiet(dataTh.idQdPd);
      } else {
        let soLuongDviTsan = 0;
        for (const item of dataTh.children) {
          soLuongDviTsan += item.slDviTsan;
        }
        this.formData.patchValue({
          cloaiVthh: dataTh.cloaiVthh,
          tenCloaiVthh: dataTh.tenCloaiVthh,
          loaiVthh: dataTh.loaiVthh,
          tenLoaiVthh: dataTh.tenLoaiVthh,
          slDviTsan: soLuongDviTsan,
          nam: this.formData.value.namKh,
          idThHdr: dataTh.id,
          idTrHdr: null,
          soTrHdr: null,
        });
        await this.getDataChiTieu();
        for (const item of dataTh.children) {
          const resDx = await this.deXuatKhBanTrucTiepService.getDetail(item.idDxHdr);
          if (resDx.msg === MESSAGE.SUCCESS) {
            const dataDx = resDx.data;
            this.formData.patchValue({
              tchuanCluong: dataDx.tchuanCluong,
              loaiHinhNx: dataDx.loaiHinhNx,
              tenLoaiHinhNx: dataDx.tenLoaiHinhNx,
              kieuNx: dataDx.kieuNx,
              tenKieuNx: dataDx.tenKieuNx,
            });
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
    } catch (error) {
      console.error('Lỗi:', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getDataChiTieu() {
    const namKhValue = +this.formData.get('namKh').value;
    try {
      const res2 = await this.chiTieuKeHoachNamCapTongCucService.canCuCucQd(namKhValue);
      this.formData.patchValue({
        soQdCc: res2.msg === MESSAGE.SUCCESS ? (res2.data ? res2.data.soQuyetDinh : null) : null,
      });
    } catch (e) {
      console.error('error:', e);
      this.formData.patchValue({
        soQdCc: null
      });
    }
  }

  async openDialogTr() {
    const phanLoaiValue = this.formData.get('phanLoai').value;
    if (phanLoaiValue !== 'TTr') {
      return;
    }
    await this.spinner.show();
    try {
      const body = {
        trangThai: STATUS.DA_DUYET_LDC,
        trangThaiTh: STATUS.CHUA_TONG_HOP,
        namKh: this.formData.value.namKh,
        loaiVthh: this.loaiVthh,
      };
      const res = await this.deXuatKhBanTrucTiepService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listToTrinh = res.data.content;
        const modalQD = this.modal.create({
          nzTitle: 'DANH SÁCH ĐỀ XUẤT KẾ HOẠCH BÁN TRỰC TIẾP',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: this.listToTrinh,
            dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
            dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh'],
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            await this.onChangeIdTrHdr(data.id);
          }
        });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      console.error('error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeIdTrHdr(idDx) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (idDx <= 0) {
      await this.spinner.hide();
      return;
    }
    try {
      const res = await this.deXuatKhBanTrucTiepService.getDetail(idDx);
      if (res.msg === MESSAGE.SUCCESS) {
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
          thongBao: dataDx.thongBao,
          slDviTsan: dataDx.slDviTsan,
          loaiHinhNx: dataDx.loaiHinhNx,
          tenLoaiHinhNx: dataDx.tenLoaiHinhNx,
          kieuNx: dataDx.kieuNx,
          tenKieuNx: dataDx.tenKieuNx,
          nam: this.formData.value.namKh,
          idThHdr: null,
          soTrHdr: dataDx.soDxuat,
          idTrHdr: dataDx.id,
        });
        await this.getDataChiTieu();
        this.danhsachDx.push(dataDx);
        if (this.danhsachDx && this.danhsachDx.length > 0) {
          this.showFirstRow(event, this.danhsachDx[0]);
        }
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  index = 0;

  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type === 'click') {
      const selectedRow = $event.target.parentElement;
      const previouslySelectedRow = selectedRow.parentElement.querySelector('.selectedRow');
      if (previouslySelectedRow) {
        previouslySelectedRow.classList.remove('selectedRow');
      }
      selectedRow.classList.add('selectedRow');
      this.selected = false;
      this.index = index;
    } else {
      this.selected = true;
      this.index = 0;
    }
    this.isTongHop = this.formData.value.phanLoai === 'TH';
    this.dataInput = this.danhsachDx[this.index];
    if (this.dataInput) {
      const res = await this.deXuatKhBanTrucTiepService.getDetail(this.dataInput.idDxHdr);
      this.dataInputCache = res.data;
    }
    await this.spinner.hide();
  }

  async preview(id) {
    await this.quyetDinhPdKhBanTrucTiepService.preview({
      tenBaoCao: 'Quyết định phê duyệt kê hoạch bán trực tiếp',
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
    saveAs(this.pdfSrc, "quyet-dinh-phe-duyet-ke-hoach-ban-truc-tiep.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "quyet-dinh-phe-duyet-ke-hoach-ban-truc-tiep.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  setValidator() {
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

  setValidForm() {
    this.formData.controls["namKh"].setValidators([Validators.required]);
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
    this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["soQdCc"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["tenKieuNx"].setValidators([Validators.required]);
    this.formData.controls["tchuanCluong"].setValidators([Validators.required]);
  }
}
