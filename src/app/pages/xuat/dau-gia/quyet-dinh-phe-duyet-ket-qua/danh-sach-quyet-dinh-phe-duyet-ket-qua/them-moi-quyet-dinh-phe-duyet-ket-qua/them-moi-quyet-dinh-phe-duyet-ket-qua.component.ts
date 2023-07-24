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


@Component({
  selector: 'app-them-moi-quyet-dinh-phe-duyet-ket-qua',
  templateUrl: './them-moi-quyet-dinh-phe-duyet-ket-qua.component.html',
  styleUrls: ['./them-moi-quyet-dinh-phe-duyet-ket-qua.component.scss']
})
export class ThemMoiQuyetDinhPheDuyetKetQuaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  fileDinhKems: any[] = []
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  loadDsQuyetDinhKq: any[] = [];
  dataMaThongBao: any[] = [];
  maTrinh: String;

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
      nam: [dayjs().get('year')],
      idPdKhDtl: [],
      idThongTin: [],
      maDvi: [''],
      soQdKq: [''],
      trichYeu: [''],
      ngayHluc: [''],
      ngayKy: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      maThongBao: ['', [Validators.required]],
      soBienBan: [''],
      pthucGnhan: [''],
      tgianGnhan: [''],
      tgianGnhanGhiChu: [''],
      ghiChu: [''],
      idQdPd: [],
      soQdPd: [''],
      hinhThucDauGia: [''],
      pthucDauGia: [''],
      soTbKhongThanh: [''],
      tongSlXuat: [],
      thanhTien: [],
      soDvtsDgTc: [],
      tongDvts: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maTrinh = '/' + this.userInfo.MA_QD;
      if (this.idInput) {
        this.getDetail(this.idInput);
      }
      await this.loadDataComboBox();
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
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  async getDetail(idInput) {
    if (idInput) {
      let res = await this.detail(idInput);
      if (res) {
        this.formData.patchValue({
          soQdKq: res.soQdKq.split('/')[0]
        })
      }
      this.fileDinhKems = res.fileDinhKems;
      this.fileDinhKem = res.fileDinhKem;
      await this.onChangeTtinDgia(res.maThongBao.split('/')[0]);
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

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    body.soQdKq = this.formData.value.soQdKq + this.maTrinh;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.idInput = res.id
        this.guiDuyet();
      } else {
        this.getDetail(res.id)
      }
    }
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
    ;
    this.reject(this.idInput, trangThai);
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

  async openMaThongBao() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
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

  async onChangeTtinDgia(idTtinDgia) {
    await this.spinner.show();
    if (idTtinDgia > 0) {
      await this.thongTinDauGiaService.getDetail(idTtinDgia)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataTb = res.data
            let resQdKhDtl = await this.quyetDinhPdKhBdgService.getDtlDetail(dataTb.idQdPdDtl);
            if (resQdKhDtl.data) {
              const dataQdKhDtl = resQdKhDtl.data;
              this.formData.patchValue({
                idThongTin: dataTb.id,
                soQdPd: dataQdKhDtl.xhQdPdKhBdg.soQdPd,
                idQdPd: dataQdKhDtl.xhQdPdKhBdg.id,
                idPdKhDtl: dataQdKhDtl.id,
                maThongBao: dataTb.maThongBao,
                soBienBan: dataTb.soBienBan,
                loaiHinhNx: dataQdKhDtl.xhQdPdKhBdg.loaiHinhNx,
                kieuNx: dataQdKhDtl.xhQdPdKhBdg.kieuNx,
                loaiVthh: dataTb.loaiVthh,
                tenLoaiVthh: dataTb.tenLoaiVthh,
                cloaiVthh: dataTb.cloaiVthh,
                tenCloaiVthh: dataTb.tenCloaiVthh,
                pthucGnhan: dataQdKhDtl.pthucGnhan,
                tgianGnhan: dataQdKhDtl.tgianGnhan,
                tgianGnhanGhiChu: dataQdKhDtl.tgianGnhanGhiChu,
                hinhThucDauGia: dataTb.hthucDgia,
                pthucDauGia: dataTb.pthucDgia,
                tongDvts: dataQdKhDtl.slDviTsan,
              })
            }
            let toChuc = cloneDeep(dataTb.children);
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["soQdKq"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["kieuNx"].setValidators([Validators.required]);
      this.formData.controls["soBienBan"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["pthucGnhan"].setValidators([Validators.required]);
      this.formData.controls["tgianGnhan"].setValidators([Validators.required]);
    } else {
      this.formData.controls["nam"].clearValidators();
      this.formData.controls["soQdKq"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
      this.formData.controls["ngayKy"].clearValidators();
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["kieuNx"].clearValidators();
      this.formData.controls["soBienBan"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["pthucGnhan"].clearValidators();
      this.formData.controls["tgianGnhan"].clearValidators();
    }
  }

}
