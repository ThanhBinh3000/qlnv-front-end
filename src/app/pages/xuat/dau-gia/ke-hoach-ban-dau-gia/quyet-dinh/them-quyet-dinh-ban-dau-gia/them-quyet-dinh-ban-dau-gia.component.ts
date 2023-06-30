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

@Component({
  selector: 'app-them-quyet-dinh-ban-dau-gia',
  templateUrl: './them-quyet-dinh-ban-dau-gia.component.html',
  styleUrls: ['./them-quyet-dinh-ban-dau-gia.component.scss']
})

export class ThemQuyetDinhBanDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = []
  maQd: string = null;
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  danhsachDx: any[] = [];
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean
  selected: boolean = false;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  maDviCuc: string;
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
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year'), Validators.required],
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
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      phanLoai: ['TH', [Validators.required]],
      soQdCc: [''],
      slDviTsan: [],
      loaiHinhNx: [''],
      kieuNx: [''],
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
      this.maQd = this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      }
      await Promise.all([
        this.loadDataComboBox(),
        this.bindingDataTongHop(this.dataTongHop),
      ]);
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

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
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

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    if (this.formData.value.soQdPd) {
      body.soQdPd = this.formData.value.soQdPd + "/" + this.maQd;
    }
    body.children = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        this.loadChiTiet(data.id)
      }
    }
    await this.spinner.hide();
  }

  tuChoi() {
    this.reject(this.idInput, STATUS.TU_CHOI_LDV)
  }

  async guiDuyet() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Văn bản sẵn sàng ban hành ?'
    this.approve(this.idInput, trangThai, mesg);
  }

  async loadChiTiet(id: number) {
    this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQdPd: data.soQdPd?.split('/')[0],
        namKh: this.formData.value.nam
      })
      if (this.userService.isCuc()) {
        this.maDviCuc = this.userInfo.MA_DVI
      }
      if (this.maDviCuc) {
        this.danhsachDx = data.children.filter(s => s.maDvi == this.maDviCuc)
      } else {
        this.danhsachDx = data.children;
      }
      if (this.danhsachDx && this.danhsachDx.length > 0) {
        this.showFirstRow(event, this.danhsachDx[0]);
      }
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
    }
    this.spinner.hide()
  }

  async openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    await this.spinner.show();
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKh: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopDeXuatKeHoachBanDauGiaService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
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
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    let soLuongDviTsan: number = 0;
    if (event) {
      const res = await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        if (data.idQdPd) {
          this.loadChiTiet(data.idQdPd)
        } else {
          data.children.forEach((item) => {
            soLuongDviTsan += item.slDviTsan;
          })
          this.formData.patchValue({
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tchuanCluong: data.tchuanCluong,
            soQdCc: data.soQdPd,
            slDviTsan: soLuongDviTsan,
            loaiHinhNx: data.loaiHinhNx,
            kieuNx: data.kieuNx,
            namKh: this.formData.value.nam,
            idThHdr: event,
            idTrHdr: null,
            soTrHdr: null,
          })
          this.getDataChiTieu();
          for (let item of data.children) {
            await this.deXuatKhBanDauGiaService.getDetail(item.idDxHdr).then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                const dataRes = res.data;
                this.formData.patchValue({
                  tchuanCluong: dataRes.tchuanCluong,
                })
                dataRes.idDxHdr = dataRes.id;
                this.danhsachDx.push(dataRes);
                if (this.danhsachDx && this.danhsachDx.length > 0) {
                  this.showFirstRow(event, this.danhsachDx[0]);
                }
              }
            })
          }
          ;
          this.dataInput = null;
          this.dataInputCache = null;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: STATUS.DA_DUYET_CBV,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.deXuatKhBanDauGiaService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content;
    }
    await this.spinner.hide();

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
        await this.onChangeIdTrHdr(data);
      }
    });
  }

  async onChangeIdTrHdr(data) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.deXuatKhBanDauGiaService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        dataRes.idDxHdr = dataRes.id;
        this.danhsachDx.push(dataRes);
        if (this.danhsachDx && this.danhsachDx.length > 0) {
          this.showFirstRow(event, this.danhsachDx[0]);
        }
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          moTaHangHoa: data.moTaHangHoa,
          tgianDkienTu: data.tgianDkienTu,
          tgianDkienDen: data.tgianDkienDen,
          tgianTtoan: data.tgianTtoan,
          tgianTtoanGhiChu: data.tgianTtoanGhiChu,
          pthucTtoan: data.pthucTtoan,
          tgianGnhan: data.tgianGnhan,
          tgianGnhanGhiChu: data.tgianGnhanGhiChu,
          pthucGnhan: data.pthucGnhan,
          thongBaoKh: data.thongBaoKh,
          trichYeu: dataRes.trichYeu,
          tenDvi: data.tenDvi,
          diaChi: data.diaChi,
          slDviTsan: dataRes.slDviTsan,
          maDvi: data.maDvi,
          loaiHinhNx: data.loaiHinhNx,
          kieuNx: data.kieuNx,
          namKh: this.formData.value.nam,
          idThHdr: null,
          soTrHdr: dataRes.soDxuat,
          idTrHdr: dataRes.id,
        })
        this.getDataChiTieu();
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
        this.dataInputCache = res.data;
      }
      this.index = 0;
      await this.spinner.hide();
    }

  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
      return false;
    } else {
      return true;
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
