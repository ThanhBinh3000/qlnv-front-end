import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { PhieuKtraCluongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
@Component({
  selector: 'app-them-moi-phieu-xuat-kho-btt',
  templateUrl: './them-moi-phieu-xuat-kho-btt.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho-btt.component.scss']
})
export class ThemMoiPhieuXuatKhoBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idQdGiaoNvXh: number;

  @Output()
  showListEvent = new EventEmitter<any>();

  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dataTable: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private PhieuXuatKhoBttService: PhieuXuatKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, PhieuXuatKhoBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: ['',],

      soPhieuXuat: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayXuatKho: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      no: [],
      co: [],

      idQd: [],
      soQd: [],

      idHd: [],
      soHd: [''],
      ngayKyHd: [null,],

      idDdiemXh: [],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],

      idPhieuKtraCluong: [],
      soPhieu: ['', [Validators.required]],
      ngayKnghiem: [],
      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],

      idNguoiLapPhieu: [],
      tenNguoiLapPhieu: [''],
      idKtv: [],
      tenKtv: [''],

      keToanTruong: [''],
      nguoiGiao: [''],
      cmtNguoiGiao: [''],
      ctyNguoiGiao: [''],
      diaChiNguoiGiao: [''],
      tenNguoiPduyet: [],

      tgianGiaoNhan: [''],
      soBangKe: [''],
      maSo: [''],
      dviTinh: [''],
      soLuongChungTu: [''],
      soLuongThucXuat: [''],
      donGia: [''],
      soLuongHd: [''],
      ghiChu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [],
    })
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      soPhieuXuat: `${id}/${this.formData.get('namKh').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiLapPhieu: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async openDialogSoQdNvXh() {
    let dataQdNvXh = [];
    let body = {
      namKh: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdNvXh = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQdNvXh,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhNvXuatBttService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      idQd: data.id,
      soQd: data.soQd,
      idHd: data.idHd,
      soHd: data.soHd,
      ngayKyHd: data.ngayHd,
      dviTinh: data.donViTinh,
      donGia: data.donGia,
      soLuongHd: data.soLuong,
    });
    let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc) {
      dataChiCuc.forEach(e => {
        this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
      });
      this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
    }
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      console.log(data);

      if (data) {
        this.dataTable = [];

        this.formData.patchValue({
          idDdiemXh: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        });
        let body = {
          trangThai: STATUS.DA_DUYET_LDC,
          namKh: dayjs().get('year'),
          loaiVthh: this.loaiVthh,
        }
        let res = await this.phieuKtraCluongBttService.search(body);
        const dataCl = res.data.content;
        this.listPhieuKtraCl = dataCl.filter(item => item.maDiemKho == data.maDiemKho);
      }
    });
  }

  openDialogPhieuKtraCl() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm tra chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKtraCl,
        dataHeader: ['Số phiếu', 'Ngày kiểm nghiệm'],
        dataColumn: ['soPhieu', 'ngayKnghiem']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataKtCl(data.id);
      }
    });
  }

  async bindingDataKtCl(id) {
    let res = await this.phieuKtraCluongBttService.getDetail(id);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        idPhieuKtraCluong: data.id,
        soPhieu: data.soPhieu,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        ngayKnghiem: data.ngayKnghiem,
        idKtv: data.idKtv,
        tenKtv: data.tenKtv,
      });

      let dataObj = {
        moTaHangHoa: this.loaiVthh.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
        maSo: '',
        dviTinh: this.formData.value.dviTinh,
        soLuongChungTu: 0,
        soLuongThucXuat: this.formData.value.donGia * this.formData.value.soLuongHd,
        donGia: this.formData.value.donGia
      }
      this.dataTable.push(dataObj)
    }
  }

  async logdataTable() {
    this.dataTable.forEach(s => {
      this.formData.patchValue({
        soLuongThucXuat: s.soLuongThucXuat,
        maSo: s.maSo,
        soLuongChungTu: s.soLuongChungTu
      });
    })

  }

  async save(isGuiDuyet?: boolean) {
    this.logdataTable();
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.goBack();
      }
    }
  }

  async loadChiTiet() {
    let data = await this.detail(this.id);
    if (data) {
      this.fileDinhKem = data.fileDinhKems;
      this.dataTable.push(data);
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet(isPheDuyet) {
    let trangThai = ''
    let msg = ''
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.DU_THAO:
          trangThai = STATUS.CHO_DUYET_LDCC
          msg = 'Bạn có muốn gửi duyệt ?'
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.DA_DUYET_LDCC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          break;
      }
      this.approve(this.id, trangThai, msg);
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.TU_CHOI_LDCC
          break;
      }
      this.reject(this.id, trangThai)
    }
  }

  clearItemRow(i) {
    this.dataTable[i] = {};
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

}
