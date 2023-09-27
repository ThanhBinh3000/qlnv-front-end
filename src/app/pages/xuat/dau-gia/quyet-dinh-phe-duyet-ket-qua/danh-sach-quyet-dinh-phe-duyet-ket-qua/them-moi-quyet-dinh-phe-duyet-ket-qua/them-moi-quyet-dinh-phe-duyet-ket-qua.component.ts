import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import {
  ThongTinDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service";
import {
  QuyetDinhPdKhBdgService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {cloneDeep} from 'lodash';
import {PREVIEW} from "../../../../../../constants/fileType";
import {saveAs} from 'file-saver';
import {FileDinhKem} from "../../../../../../models/CuuTro";

@Component({
  selector: 'app-them-moi-quyet-dinh-phe-duyet-ket-qua',
  templateUrl: './them-moi-quyet-dinh-phe-duyet-ket-qua.component.html',
  styleUrls: ['./them-moi-quyet-dinh-phe-duyet-ket-qua.component.scss']
})
export class ThemMoiQuyetDinhPheDuyetKetQuaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  fileDinhKems: any[] = []
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  loadDsQuyetDinhKq: any[] = [];
  dataMaThongBao: any[] = [];
  maTrinh: String;
  templateName = "quyet_dinh_phe_duyet_ket_qua";
  templateNameVt = "quyet_dinh_phe_duyet_ket_qua_vat_tu";
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;
  maHauTo: any;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      nam: [],
      soQdKq: [''],
      trichYeu: [''],
      ngayHieuLuc: [''],
      ngayKy: [''],
      loaiHinhNx: [''],
      kieuNhapXuat: [''],
      idQdPd: [],
      idQdPdDtl: [],
      idQdDc: [],
      soQdDc: [''],
      soQdPd: [''],
      idThongBao: [],
      maThongBao: [''],
      soBienBan: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      phuongThucGiaoNhan: [''],
      tgianGiaoNhanNgay: [''],
      tgianGnhanGhiChu: [''],
      ghiChu: [''],
      hinhThucDauGia: [''],
      phuongThucDauGia: [''],
      soTbKhongThanh: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNhapXuat: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenTrangThai: [''],
      tongDviTsan: [],
      slDviTsanThanhCong: [],
      slDviTsanKhongThanh: [],
      tongSlXuat: [],
      thanhTien: [],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    })
  }

  async getDetail(idInput) {
    if (!idInput) return;
    const res = await this.detail(idInput);
    if (!res) {
      console.error('Không tìm thấy dữ liệu');
      return;
    }
    this.formData.patchValue({
      soQdKq: res.soQdKq?.split('/')[0]
    });
    if (res.idQdPdDtl) {
      const resTb = await this.thongTinDauGiaService.getDetail(res.idThongBao);
      const dataTb = resTb.data;
      const toChuc = dataTb.children.map(s => ({
        ...s,
        children: s.children.filter(f => f.toChucCaNhan)
      }));
      this.dataTable = toChuc.filter(s => s.children.length !== 0);
      this.calculatorTable(this.dataTable);
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soQdKq"].setValidators([Validators.required]);
      this.formData.controls["maThongBao"].setValidators([Validators.required]);
      const soQdKq = this.formData.value.soQdKq;
      const body = {
        ...this.formData.value,
        soQdKq: soQdKq ? soQdKq + this.maHauTo : null
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
      const soQdKq = this.formData.value.soQdKq;
      const body = {
        ...this.formData.value,
        soQdKq: soQdKq ? soQdKq + this.maHauTo : null
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  async openMaThongBao() {
    try {
      await this.spinner.show();
      const body = {
        nam: this.formData.value.nam,
        loaiVthh: this.loaiVthh,
        trangThai: this.STATUS.DA_HOAN_THANH,
      };
      await this.loadQuyetDinhKetQua();
      const res = await this.thongTinDauGiaService.search(body)
      if (res.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return;
      }
      const data = res.data.content;
      if (!data || data.length === 0) {
        return;
      }
      const maThongBaoSet = new Set(this.loadDsQuyetDinhKq.map(item => item.maThongBao));
      this.dataMaThongBao = data.filter(item => !maThongBaoSet.has(item.maThongBao));
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH THÔNG BÁO BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataMaThongBao.filter(s => s.ketQua == 1 && s.maDvi === this.userInfo.MA_DVI),
          dataHeader: ['Mã thông báo', 'Số biên bản', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
          dataColumn: ['maThongBao', 'soBienBan', 'tenLoaiVthh', 'tenCloaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeTtinDgia(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeTtinDgia(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.thongTinDauGiaService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const resQd = await this.quyetDinhPdKhBdgService.getDtlDetail(data.idQdPdDtl);
      if (resQd.msg !== MESSAGE.SUCCESS || !resQd.data) {
        return;
      }
      const dataQd = resQd.data;
      this.formData.patchValue({
        loaiHinhNx: dataQd.xhQdPdKhBdg ? dataQd.xhQdPdKhBdg.loaiHinhNx : dataQd.xhQdDchinhKhBdgHdr.loaiHinhNx,
        tenLoaiHinhNx: dataQd.xhQdPdKhBdg ? dataQd.xhQdPdKhBdg.tenLoaiHinhNx : dataQd.xhQdDchinhKhBdgHdr.tenLoaiHinhNx,
        kieuNhapXuat: dataQd.xhQdPdKhBdg ? dataQd.xhQdPdKhBdg.kieuNx : dataQd.xhQdDchinhKhBdgHdr.kieuNx,
        tenKieuNhapXuat: dataQd.xhQdPdKhBdg ? dataQd.xhQdPdKhBdg.tenKieuNx : dataQd.xhQdDchinhKhBdgHdr.tenKieuNx,
        idQdPd: data.idQdPd,
        idQdPdDtl: data.idQdPdDtl,
        soQdPd: data.soQdPd,
        idQdDc: data.idQdDc,
        soQdDc: data.soQdDc,
        idThongBao: data.id,
        maThongBao: data.maThongBao,
        soBienBan: data.soBienBan,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa:  dataQd.xhQdPdKhBdg ? dataQd.xhQdPdKhBdg.moTaHangHoa : dataQd.xhQdDchinhKhBdgHdr.moTaHangHoa,
        phuongThucGiaoNhan: dataQd.pthucGnhan,
        tgianGiaoNhanNgay: dataQd.tgianGnhan,
        tgianGnhanGhiChu: dataQd.tgianGnhanGhiChu,
        hinhThucDauGia: data.hthucDgia,
        phuongThucDauGia: data.pthucDgia,
        tongDviTsan: dataQd.slDviTsan,
      });
      const toChuc = cloneDeep(data.children);
      this.dataTable = toChuc.filter(s => s.children.some(f => f.toChucCaNhan));
      this.dataTable.forEach(s => {
        s.children = s.children.filter(f => f.toChucCaNhan);
      });
      this.calculatorTable(this.dataTable);
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  calculatorTable(data) {
    let slDviTsanThanhCong: number = 0;
    data.forEach((item) => {
      item.children.forEach((child) => {
        child.thanhTien = child.soLuongDeXuat * child.donGiaTraGia
      })
      item.tongSoLuong = item.children.reduce((total, child) => total + child.soLuongDeXuat, 0);
      item.tongGiaKhoiDiem = item.children.reduce((total, child) => total + child.donGiaDeXuat, 0);
      item.tongTienDatTruoc = item.children.reduce((total, child) => total + child.soTienDatTruoc, 0);
      item.tongThanhTien = item.children.reduce((total, child) => total + child.thanhTien, 0);
      slDviTsanThanhCong += item.children.length;
    });
    this.formData.patchValue({
      slDviTsanThanhCong: slDviTsanThanhCong,
      slDviTsanKhongThanh: this.formData.value.tongDviTsan - slDviTsanThanhCong,
      tongSlXuat: data.reduce((total, child) => total + child.tongSoLuong, 0),
      thanhTien: data.reduce((total, child) => total + child.tongThanhTien, 0),
    })
  }

  async loadQuyetDinhKetQua() {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.qdPdKetQuaBanDauGiaService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadDsQuyetDinhKq = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidForm() {
    this.formData.controls["nam"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["ngayHieuLuc"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNhapXuat"].setValidators([Validators.required]);
    this.formData.controls["tenKieuNhapXuat"].setValidators([Validators.required]);
    this.formData.controls["soBienBan"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
  }

  async preview(id) {
    let tenBaoCao;
    if (this.loaiVthh == "02") {
      tenBaoCao = this.templateNameVt
    } else {
      tenBaoCao = this.templateName
    }
    await this.qdPdKetQuaBanDauGiaService.preview({
      tenBaoCao: tenBaoCao,
      id: id
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadPdf() {
    let tenBaoCao;
    if (this.loaiVthh == "02") {
      tenBaoCao = this.templateNameVt
    } else {
      tenBaoCao = this.templateName
    }
    saveAs(this.pdfSrc, tenBaoCao + ".pdf");
  }

  downloadWord() {
    let tenBaoCao;
    if (this.loaiVthh == "02") {
      tenBaoCao = this.templateNameVt
    } else {
      tenBaoCao = this.templateName
    }
    saveAs(this.wordSrc, tenBaoCao + ".docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
}
