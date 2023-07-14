import {Component, Input, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {HttpClient} from '@angular/common/http';
import dayjs from 'dayjs';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {STATUS} from 'src/app/constants/status';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {
  PhieuKtraCluongBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import {
  BienBanLayMauBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';

@Component({
  selector: 'app-them-phieu-ktra-cluong-btt',
  templateUrl: './them-phieu-ktra-cluong-btt.component.html',
  styleUrls: ['./them-phieu-ktra-cluong-btt.component.scss']
})
export class ThemPhieuKtraCluongBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isViewOnModal: boolean;
  maPhieu: string;
  listHinhThucBaoQuan: any[] = [];
  dsDanhGia: any[] = [];
  loadPhieuKnghiemCluong: any[] = [];
  dataBienBanLayMau: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      idBienBan: [],
      soBienBan: ['', [Validators.required]],
      soQdNv: [''],
      idQdNv: [],
      ngayQdNv: [''],
      soHd: [''],
      idHd: [],
      soPhieu: [''],
      idNgKnghiem: [''],
      tenNguoiKiemNghiem: [''],
      idTruongPhong: [''],
      tenTruongPhong: [''],
      idKtv: [''],
      tenKtv: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemXh: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soLuong: [],
      hthucBquan: [''],
      ngayLayMau: [''],
      ngayKnghiem: [''],
      ketQua: [''],
      ketLuan: [''],
      trangThai: [''],
      tenTrangThai: [''],
      ngayTao: [''],
      lyDoTuChoi: [''],
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maPhieu = 'PKNCL-' + this.userInfo.DON_VI.tenVietTat;
      if (this.id > 0) {
        await this.loadChitiet();
      } else {
        await this.initForm();
      }
      await this.loadDataComboBox();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    }
    await this.spinner.hide();
  }

  async initForm() {
    let id = await this.userService.getId('XH_PHIEU_KTRA_CLUONG_BTT_SEQ')
    this.formData.patchValue({
      ngayTao: dayjs().format('YYYY-MM-DD'),
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      soPhieu: `${id}/${this.formData.get('namKh').value}/${this.maPhieu}`,
      tenNguoiKiemNghiem: this.userInfo.TEN_DAY_DU,
      tenTruongPhong: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    });
  }

  async loadChitiet() {
    let data = await this.detail(this.id);
    this.dataTable = data.children
    this.fileDinhKem = data.fileDinhKems;
  }

  async loadDataComboBox() {
    this.danhMucService.danhMucChungGetAll("HINH_THUC_BAO_QUAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listHinhThucBaoQuan = res.data;
      } else {
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

  async openDialogBbLm() {
    await this.spinner.show();
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.DA_DUYET_LDCC,
      // maDvi: this.userInfo.MA_DVI
    }
    await this.loadPhieuKnCluong();
    let res = await this.bienBanLayMauBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadPhieuKnghiemCluong.map(item => JSON.stringify({soBienBan: item.soBienBan})));
        this.dataBienBanLayMau = data.filter(item => {
          const key = JSON.stringify({soBienBan: item.soBienBan});
          return !set.has(key);
        });
      }
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
        dataTable: this.dataBienBanLayMau,
        dataHeader: ['Số QĐ giao NVXH', 'Số BB lấy mẫu/bàn giao mẫu', 'Loại hàng hóa'],
        dataColumn: ['soQdNv', 'soBienBan', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.loadDataDtailBienBanLayMau(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  async loadDataDtailBienBanLayMau(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.bienBanLayMauBttService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            this.formData.patchValue({
              idBienBan: data.id,
              soBienBan: data.soBienBan,
              soHd: data.soHd,
              idHd: data.idHd,
              soQdNv: data.soQdNv,
              idQdNv: data.idQdNv,
              ngayQdNv: data.ngayQdNv,
              idKtv: data.idKtv,
              tenKtv: data.tenKtv,
              idDdiemXh: data.idDdiemXh,
              maDiemKho: data.maDiemKho,
              tenDiemKho: data.tenDiemKho,
              maNhaKho: data.maNhaKho,
              tenNhaKho: data.tenNhaKho,
              maNganKho: data.maNganKho,
              tenNganKho: data.tenNganKho,
              maLoKho: data.maLoKho,
              tenLoKho: data.tenLoKho,
              soLuong: data.soLuongLayMau,
              loaiVthh: data.loaiVthh,
              cloaiVthh: data.cloaiVthh,
              tenLoaiVthh: data.tenLoaiVthh,
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
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async loadPhieuKnCluong() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.phieuKtraCluongBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadPhieuKnghiemCluong = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC || trangThai == STATUS.DA_DUYET_LDC) {
      return true;
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


  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.children = this.dataTable;
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.id = data.id
        this.loadChitiet();
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
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["soPhieu"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["hthucBquan"].setValidators([Validators.required]);
      this.formData.controls["ngayLayMau"].setValidators([Validators.required]);
      this.formData.controls["ngayKnghiem"].setValidators([Validators.required]);
      this.formData.controls["ketQua"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["soQdNv"].clearValidators();
      this.formData.controls["soPhieu"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["hthucBquan"].clearValidators();
      this.formData.controls["ngayLayMau"].clearValidators();
      this.formData.controls["ngayKnghiem"].clearValidators();
      this.formData.controls["ketQua"].clearValidators();

    }
  }

}
