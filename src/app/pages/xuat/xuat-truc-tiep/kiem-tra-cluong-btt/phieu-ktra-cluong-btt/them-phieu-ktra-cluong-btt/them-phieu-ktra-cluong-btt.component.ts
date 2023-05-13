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
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { PhieuKtraCluongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import { BienBanLayMauBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import { DonviService } from 'src/app/services/donvi.service';
@Component({
  selector: 'app-them-phieu-ktra-cluong-btt',
  templateUrl: './them-phieu-ktra-cluong-btt.component.html',
  styleUrls: ['./them-phieu-ktra-cluong-btt.component.scss']
})
export class ThemPhieuKtraCluongBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isViewOnModal: boolean;

  listDiaDiemXh: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  dsDanhGia: any[] = [];

  loadPhieuKnghiemCluong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private donViService: DonviService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongBttService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      lyDoTuChoi: [''],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      idBienBan: [],
      soBienBan: ['', [Validators.required]],
      soQdNv: ['', [Validators.required]],
      idQdNv: ['', [Validators.required]],
      ngayQd: [''],

      soPhieu: ['', [Validators.required]],

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

      hthucBquan: ['', [Validators.required]],
      ngayLayMau: ['', [Validators.required]],
      ngayKnghiem: ['', [Validators.required]],

      ketQua: [''],
      ketLuan: [''],
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
    let body = {
      namKh: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.DA_DUYET_LDCC,
      // maDvi: this.userInfo.MA_DVI
    }
    await this.loadPhieuKnCluong();
    let dataBbLM = [];
    let res = await this.bienBanLayMauBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = [
        ...res.data?.content.filter((item) => {
          return !this.loadPhieuKnghiemCluong.some((child) => {
            if (item.soBienBan.length > 0 && child.soBienBan.length > 0) {
              return item.soBienBan === child.soBienBan;
            }
          })
        })
      ];
      dataBbLM = data
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu bán trực tiếp',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataBbLM,
        dataHeader: ['Số Biên bản', 'Loại hàng hóa', 'Chủng loại hàng hóa', 'Số lượng lấy mẫu'],
        dataColumn: ['soBienBan', 'tenLoaiVthh', 'tenCloaiVthh', 'soLuongLayMau'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  }

  async loadPhieuKnCluong() {
    let body = {
      nameKh: this.formData.value.nameKh,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.phieuKtraCluongBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      this.loadPhieuKnghiemCluong = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    let res = await this.bienBanLayMauBttService.getDetail(id);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        idBienBan: data.id,
        soBienBan: data.soBienBan,
        soQdNv: data.soQdNv,
        idQdNv: data.idQdNv,
        ngayQd: data.ngayQd,
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
    };

    await this.spinner.hide();
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC || trangThai == STATUS.DA_DUYET_LDC) {
      return true;
    } else {
      return false;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_PHIEU_KTRA_CLUONG_BTT_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      soPhieu: `${id}/${this.formData.get('namKh').value}/PKNCL-CDTVP`,
      tenNguoiKiemNghiem: this.userInfo.TEN_DAY_DU,
      tenTruongPhong: this.userInfo.TEN_DAY_DU,
    });
  }

  async loadDataComboBox() {
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
    let body = this.formData.value;
    body.children = this.dataTable;
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
  }

  getNameFile(event?: any) {
    // const element = event.currentTarget as HTMLInputElement;
    // const fileList: FileList | null = element.files;
    // if (fileList) {
    //   this.nameFile = fileList[0].name;
    // }
    // this.formData.patchValue({
    //   file: event.target.files[0] as File,
    // });
    // if (this.dataCanCuXacDinh) {
    //   this.formTaiLieuClone.file = this.nameFile;
    //   this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    // }
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

}
