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
      ngayHluc: [''],
      ngayKy: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      idQdPd: [],
      soQdPd: [''],
      idThongTin: [],
      idPdKhDtl: [],
      maThongBao: ['', [Validators.required]],
      soBienBan: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      pthucGnhan: [''],
      tgianGnhan: [''],
      tgianGnhanGhiChu: [''],
      ghiChu: [''],
      hinhThucDauGia: [''],
      pthucDauGia: [''],
      soTbKhongThanh: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenHinhThucDauGia: [''],
      tenPthucDauGia: [''],
      tenTrangThai: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
      tongSlXuat: [],
      thanhTien: [],
      soDvtsDgTc: [],
      tongDvts: []
    });
  }


  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput)
      } else {
        await this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    })
  }

  async getDetail(idInput) {
    if (idInput) {
      let res = await this.detail(idInput);
      if (res) {
        this.formData.patchValue({
          soQdKq: res.soQdKq?.split('/')[0]
        })
      }
      if (res.idPdKhDtl) {
        let resTb = await this.thongTinDauGiaService.getDetail(res.idThongTin)
        const dataTb = resTb.data
        let toChuc = cloneDeep(dataTb.children);
        toChuc.forEach(s => {
          s.children = s.children.filter(f => f.toChucCaNhan);
        });
        this.dataTable = toChuc.filter(s => s.children.length != 0)
        this.calculatorTable(this.dataTable);
      }
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soQdKq: this.formData.value.soQdKq ? this.formData.value.soQdKq + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidator();
    let body = {
      ...this.formData.value,
      soQdKq: this.formData.value.soQdKq ? this.formData.value.soQdKq + this.maHauTo : null
    }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  isDisabled() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  async openMaThongBao() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.DA_HOAN_THANH,
    }
    await this.loadQuyetDinhKetQua();
    let res = await this.thongTinDauGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadDsQuyetDinhKq.map(item => JSON.stringify({maThongBao: item.maThongBao})));
        this.dataMaThongBao = data.filter(item => {
          const key = JSON.stringify({maThongBao: item.maThongBao});
          return !set.has(key);
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH THÔNG BÁO BÁN ĐẤU GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dataMaThongBao.filter(s => s.ketQua == 1),
        dataHeader: ['Mã thông báo', 'Số biên bản', 'Loại hàng háo', 'Chủng loại hàng hóa'],
        dataColumn: ['maThongBao', 'soBienBan', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeTtinDgia(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeTtinDgia(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.thongTinDauGiaService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataTt = res.data
            let resQdKhDtl = await this.quyetDinhPdKhBdgService.getDtlDetail(dataTt.idQdPdDtl);
            if (resQdKhDtl.data) {
              const dataQdKhDtl = resQdKhDtl.data;
              this.formData.patchValue({
                loaiHinhNx: dataQdKhDtl.xhQdPdKhBdg.loaiHinhNx,
                tenLoaiHinhNx: dataQdKhDtl.xhQdPdKhBdg.tenLoaiHinhNx,
                kieuNx: dataQdKhDtl.xhQdPdKhBdg.kieuNx,
                tenKieuNx: dataQdKhDtl.xhQdPdKhBdg.tenKieuNx,
                idQdPd: dataTt.idQdPd,
                soQdPd: dataTt.soQdPd,
                idThongTin: dataTt.id,
                idPdKhDtl: dataTt.idQdPdDtl,
                maThongBao: dataTt.maThongBao,
                soBienBan: dataTt.soBienBan,
                loaiVthh: dataTt.loaiVthh,
                tenLoaiVthh: dataTt.tenLoaiVthh,
                cloaiVthh: dataTt.cloaiVthh,
                tenCloaiVthh: dataTt.tenCloaiVthh,
                pthucGnhan: dataQdKhDtl.pthucGnhan,
                tgianGnhan: dataQdKhDtl.tgianGnhan,
                tgianGnhanGhiChu: dataQdKhDtl.tgianGnhanGhiChu,
                hinhThucDauGia: dataTt.hthucDgia,
                pthucDauGia: dataTt.pthucDgia,
                tongDvts: dataQdKhDtl.slDviTsan,
              })
            }
            let toChuc = cloneDeep(dataTt.children);
            toChuc.forEach(s => {
              s.children = s.children.filter(f => f.toChucCaNhan);
            });
            this.dataTable = toChuc.filter(s => s.children.length != 0)
            this.calculatorTable(this.dataTable);
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  calculatorTable(data) {
    let tongSlXuat: number = 0;
    let thanhTien: number = 0;
    let soDvtsDgTc: number = 0;
    data.forEach((item) => {
      item.slBanDauGiaChiCuc = 0;
      item.giaKhoiDiemChiCuc = 0;
      item.soTienDatTruocCc = 0;
      item.children.forEach((child) => {
        item.slBanDauGiaChiCuc += child.soLuongDeXuat;
        item.giaKhoiDiemChiCuc += child.donGiaDeXuat;
        item.soTienDatTruocCc += child.soTienDatTruoc;
        thanhTien += child.soLuongDeXuat * child.donGiaTraGia
      })
      soDvtsDgTc += item.children.length;
      tongSlXuat += item.slBanDauGiaChiCuc;
    })
    this.formData.patchValue({
      tongSlXuat: tongSlXuat,
      thanhTien: thanhTien,
      soDvtsDgTc: soDvtsDgTc,
    });
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

  setValidator() {
    this.formData.controls["nam"].setValidators([Validators.required]);
    this.formData.controls["soQdKq"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNx"].setValidators([Validators.required]);
    this.formData.controls["tenKieuNx"].setValidators([Validators.required]);
    this.formData.controls["soBienBan"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
  }
  async preview(id) {
    let tenBaoCao;
    if (this.loaiVthh=="02"){
       tenBaoCao= this.templateNameVt
    }else {
       tenBaoCao= this.templateName
    }
    await this.qdPdKetQuaBanDauGiaService.preview({
      tenBaoCao: tenBaoCao,
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
    let tenBaoCao;
    if (this.loaiVthh=="02"){
      tenBaoCao= this.templateNameVt
    }else {
      tenBaoCao= this.templateName
    }
    saveAs(this.pdfSrc, tenBaoCao + ".pdf");
  }

  downloadWord() {
    let tenBaoCao;
    if (this.loaiVthh=="02"){
      tenBaoCao= this.templateNameVt
    }else {
      tenBaoCao= this.templateName
    }
    saveAs(this.wordSrc, tenBaoCao + ".docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
}
