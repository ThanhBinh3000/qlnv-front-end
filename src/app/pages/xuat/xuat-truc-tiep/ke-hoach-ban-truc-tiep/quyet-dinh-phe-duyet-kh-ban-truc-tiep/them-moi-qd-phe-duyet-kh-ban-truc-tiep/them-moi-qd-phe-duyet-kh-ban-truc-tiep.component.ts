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
  vatidateBanHanh: boolean = false;

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
      nam: this.formData.value.namKh
    })
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
    if (dataTongHop) {
      if (dataTongHop.trangThai == STATUS.CHUA_TAO_QD) {
        this.formData.patchValue({
          cloaiVthh: dataTongHop.cloaiVthh,
          tenCloaiVthh: dataTongHop.tenCloaiVthh,
          loaiVthh: dataTongHop.loaiVthh,
          tenLoaiVthh: dataTongHop.tenLoaiVthh,
          idThHdr: dataTongHop.id == null ? dataTongHop.idTh : dataTongHop.id,
          phanLoai: 'TH',
        })
        await this.selectMaTongHop(this.formData.value.idThHdr);
      } else {
        await this.loadChiTiet(dataTongHop.idSoQdPd);
        dataTongHop.trangThai == STATUS.DA_BAN_HANH_QD ? this.isView = true : this.isView = false;
      }
    }
  }

  async save() {
    this.setValidator();
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
    this.setValidForm();
    await this.vatidateBanHanhQd(this.danhsachDx)
    if (this.vatidateBanHanh == false) {
      this.notification.error(MESSAGE.WARNING, 'Hiện chưa có giá bán cụ thể được duyệt cho loại hàng hóa này.');
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
    for (const item of this.danhsachDx) {
      for (const child of item.children) {
        for (const s of child.children) {
          let bodyPag = {
            namKeHoach: this.formData.get('namKh').value,
            loaiVthh: this.formData.get('loaiVthh').value,
            cloaiVthh: this.formData.get('cloaiVthh').value,
            trangThai: STATUS.BAN_HANH,
            maDvi: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '' : child.maDvi,
            loaiGia: 'LG04'
          }
          let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
          if (pag.msg == MESSAGE.SUCCESS) {
            if (pag.data) {
              pag.data.forEach(a => {
                s.donGiaDuocDuyet = a.giaQdTcdt;
              })
            } else {
              s.donGiaDuocDuyet = null;
            }
          }
          s.thanhTienDuocDuyet = s.donGiaDuocDuyet != null ? s.donGiaDuocDuyet * s.soLuongDeXuat : null;
        }
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
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.tongHopKhBanTrucTiepService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
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
        dataColumn: ['id', 'noiDungThop']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);
      }
    });
  }

  async selectMaTongHop(idTh) {
    await this.spinner.show()
    let soLuongDviTsan: number = 0;
    if (idTh > 0) {
      await this.tongHopKhBanTrucTiepService.getDetail(idTh)
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
                slDviTsan: soLuongDviTsan,
                nam: this.formData.value.namKh,
                idThHdr: dataTh.id,
                idTrHdr: null,
                soTrHdr: null,
              })
              await this.getDataChiTieu();
              for (let item of dataTh.children) {
                let res = await this.deXuatKhBanTrucTiepService.getDetail(item.idDxHdr);
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
      +this.formData.get('namKh').value,
    );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        soQdCc: res2.data != null ? res2.data.soQuyetDinh : null,
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
      trangThai: STATUS.DA_DUYET_LDC,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.deXuatKhBanTrucTiepService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
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
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data.id);
      }
    });
  }

  async onChangeIdTrHdr(idDx) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (idDx > 0) {
      await this.deXuatKhBanTrucTiepService.getDetail(idDx)
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
        let res = await this.deXuatKhBanTrucTiepService.getDetail(this.dataInput.idDxHdr);
        this.dataInputCache = res.data;
      }
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[0];
      if (this.dataInput) {
        let res = await this.deXuatKhBanTrucTiepService.getDetail(this.dataInput.idDxHdr);
        this.dataInputCache = res.data;
      }
      this.index = 0;
      await this.spinner.hide();
    }
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

  printPreview(){
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
