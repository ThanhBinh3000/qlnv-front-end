import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { STATUS } from 'src/app/constants/status';
import { BienBanLayMauXhService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import { QuyetDinhGiaoNvXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { XhPhieuKnghiemCluongService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-bdg-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idBbLayMau: number;
  dsDanhGia: any[] = [];
  listBienBan: any[] = [];
  listDiaDiemXh: any[] = [];
  phuongPhapLayMaus: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, xhPhieuKnghiemCluongService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      idBbLayMau: [],
      soBbLayMau: ['', [Validators.required]],
      soQdGiaoNvXh: [''],
      ngayQdGiaoNvXh: [''],
      idQdGiaoNvXh: [],
      soPhieu: [''],
      idDdiemXh: [],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      hthucBquan: [''],
      ngayLayMau: [''],
      ngayKnghiem: [''],
      ketQua: [''],
      ketLuan: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      lyDoTuChoi: [''],
      idNguoiKiemNghiem: [],
      tenNguoiKiemNghiem: [''],
      idTruongPhong: [],
      tenTruongPhong: [''],
      idThuKho: [],
      tenThuKho: [''],
    })
  }

  async ngOnInit() {
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.id > 0) {
      await this.loadChitiet();
    } else {
      this.initForm();
    }
  }

  async openDialogBbLm() {
    let data = [];
    let body = {
      nam: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.DA_DUYET_LDCC,
      maDviCuc: this.userInfo.MA_DVI
    }
    let res = await this.bienBanLayMauXhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      data = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BIÊN BẢN LẤY MẪU/BÀN GIAO MẪU',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: data,
        dataHeader: ['Số QĐ giao NVXH', 'Số BB lấy mẫu/bàn giao mẫu', 'Loại hàng hóa', 'Chủng loại hàng hóa', 'Số lượng lấy mẫu'],
        dataColumn: ['soQd', 'soBienBan', 'tenLoaiVthh', 'tenCloaiVthh', 'soLuongLayMau'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingBienBanLM(dataChose.id);
      }
    });
  }

  async bindingBienBanLM(id) {
    await this.spinner.show();
    let res = await this.bienBanLayMauXhService.getDetail(id);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        idBbLayMau: data.id,
        soBbLayMau: data.soBienBan,
        idQdGiaoNvXh: data.idQd,
        soQdGiaoNvXh: data.soQd,
        ngayQdGiaoNvXh: data.ngayQd,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        ngayLayMau: data.ngayLayMau
      });

      let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      if (dmTieuChuan.data) {
        this.dataTable = dmTieuChuan.data.children;
        this.dataTable.forEach(element => {
          element.edit = false
        });
      }
      let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
      if (dataChiCuc && dataChiCuc.length > 0) {
        this.listDiaDiemXh = dataChiCuc[0].children;
      }
    };

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
        dataTable: this.listDiaDiemXh,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
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
          soLuong: data.soLuong
        });
      }
    });
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC || trangThai == STATUS.DA_DUYET_LDC) {
      return true;
    } else {
      return false;
    }
  }

  isDisabledBb() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_PHIEU_KNGHIEM_CLUONG_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      loaiBienBan: this.listBienBan[0].ma,
      soPhieu: `${id}/${this.formData.get('nam').value}/PKNCL-CDTVP`,
      tenNguoiKiemNghiem: this.userInfo.TEN_DAY_DU,
    });
    if (this.idBbLayMau) {
      await this.bindingBienBanLM(this.idBbLayMau);
    }
  }

  async loadDataComboBox() {
    // HTHUC_BQUAN
    this.danhMucService.danhMucChungGetAll("HINH_THUC_BAO_QUAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listHinhThucBaoQuan = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
    this.dsDanhGia = [
      {
        ma: 'Đạt',
        giaTri: 'Đạt',
      },
      {
        ma: 'Không Đạt',
        giaTri: 'Không Đạt',
      },
    ];
  }

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    if (this.validateNgay()) {
      let body = this.formData.value;
      body.children = this.dataTable;
      body.fileDinhKems = this.fileDinhKem;
      body.children.forEach(e => {
        e.chiSoNhap = e.chiSoXuat
      });
      let data = await this.createUpdate(body);
      if (data) {
        if (isGuiDuyet) {
          this.id = data.id
          this.pheDuyet(true);
        } else {
          // this.goBack();
        }
      }
    }
  }

  pheDuyet(isPheDuyet) {
    let trangThai = ''
    let msg = ''
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDC:
        case STATUS.TU_CHOI_TP:
        case STATUS.DU_THAO:
          trangThai = STATUS.CHO_DUYET_TP
          msg = 'Bạn có muốn gửi duyệt ?'
          break;
        case STATUS.CHO_DUYET_TP:
          trangThai = STATUS.CHO_DUYET_LDC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          break;
        case STATUS.CHO_DUYET_LDC:
          trangThai = STATUS.DA_DUYET_LDC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          break;
      }
      this.approve(this.id, trangThai, msg);
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_TP:
          trangThai = STATUS.TU_CHOI_TP
          break;
        case STATUS.CHO_DUYET_LDC:
          trangThai = STATUS.TU_CHOI_LDC
          break;
      }
      this.reject(this.id, trangThai)
    }
  }

  async loadChitiet() {
    let data = await this.detail(this.id);
    this.dataTable = data.children
    this.fileDinhKem = data.fileDinhKems;
    this.dataTable.forEach(e => {
      e.chiSoXuat = e.chiSoNhap
    });
    this.formData.patchValue({
      flagNiemPhong: this.formData.value.ketQuaNiemPhong == 1,
    })
  }

  cancelEdit(index: number): void {
    this.dataTable[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTable[index].edit = false;
  }

  // editRow(index: number) {
  //   this.dataTable[index].edit = true;
  // }

  deleteRow(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable[index].ketQuaKiemTra = null;
          this.dataTable[index].danhGia = null
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["soQdGiaoNvXh"].setValidators([Validators.required]);
      this.formData.controls["soPhieu"].setValidators([Validators.required]);
      this.formData.controls["ngayTao"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["tenDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["tenNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      this.formData.controls["tenNganKho"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["hthucBquan"].setValidators([Validators.required]);
      this.formData.controls["ngayLayMau"].setValidators([Validators.required]);
      this.formData.controls["ngayKnghiem"].setValidators([Validators.required]);
      this.formData.controls["ketQua"].setValidators([Validators.required]);
      this.formData.controls["ketLuan"].setValidators([Validators.required]);
    } else {
      this.formData.controls["nam"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["soQdGiaoNvXh"].clearValidators();
      this.formData.controls["soPhieu"].clearValidators();
      this.formData.controls["ngayTao"].clearValidators();
      this.formData.controls["maDiemKho"].clearValidators();
      this.formData.controls["tenDiemKho"].clearValidators();
      this.formData.controls["maNhaKho"].clearValidators();
      this.formData.controls["tenNhaKho"].clearValidators();
      this.formData.controls["maNganKho"].clearValidators();
      this.formData.controls["tenNganKho"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["hthucBquan"].clearValidators();
      this.formData.controls["ngayLayMau"].clearValidators();
      this.formData.controls["ngayKnghiem"].clearValidators();
      this.formData.controls["ketQua"].clearValidators();
      this.formData.controls["ketLuan"].clearValidators();
    }
  }

  validateNgay() {
    let pipe = new DatePipe('en-US');
    let ngayLayMau = new Date(pipe.transform(this.formData.value.ngayLayMau, 'yyyy-MM-dd'));
    let ngayKnghiem = new Date(pipe.transform(this.formData.value.ngayKnghiem, 'yyyy-MM-dd'));
    if (this.formData.value.ngayLayMau) {
      if (ngayLayMau > ngayKnghiem) {
        this.notification.error(MESSAGE.ERROR, "Này kiểm nghiệm không được phép vượt quá ngày lấy mẫu");
        return false
      }
    }
    return true;
  }
}
