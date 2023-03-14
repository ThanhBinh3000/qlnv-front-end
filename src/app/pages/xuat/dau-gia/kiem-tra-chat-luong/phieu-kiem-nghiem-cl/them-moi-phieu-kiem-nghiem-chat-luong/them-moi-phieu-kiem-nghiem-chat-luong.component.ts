import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { STATUS } from 'src/app/constants/status';
import { ItemDaiDien } from 'src/app/pages/nhap/dau-thau/kiem-tra-chat-luong/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component';
import { BienBanLayMauXhService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import { QuyetDinhGiaoNvXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { XhPhieuKnghiemCluongService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;

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
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      lyDoTuChoi: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],

      soBbLayMau: ['', [Validators.required]],
      soQdGiaoNvXh: ['', [Validators.required]],
      idQdGiaoNvXh: ['', [Validators.required]],

      soPhieu: ['', [Validators.required]],

      idNguoiKiemNghiem: [''],
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
    let data = [];
    let body = {
      nam: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.DA_DUYET_LDCC,
      // maDvi: this.userInfo.MA_DVI
    }
    let res = await this.bienBanLayMauXhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      data = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: data,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa', 'Số lượng'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh', 'soLuong'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  }

  async openDialogSoQd() {
    let dataQd = [];
    let body = {
      nam: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQd = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQd,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    let res = await this.bienBanLayMauXhService.getDetail(id);
    console.log(res);
    if (res.data) {
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        soQd: data.soQd,
        soHd: data.soHd,
        ngayHd: data.ngayKy,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        soBbLayMau: data.soBienBan,
        soQdGiaoNvXh: data.soQd,
        idQdGiaoNvXh: data.idQd,
        idKtv: data.idKtv,
        tenKtv: data.tenKtv,
        idDdiemXh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
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
  }

  async loadDataComboBox() {
    // Loại biên bản
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data.filter(item => item.ma == 'LBGM');
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
    // PP lây mẫu
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
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
  }


  async changeLoaiHangHoa(id: any) {

  }

  itemRow: ItemDaiDien = new ItemDaiDien();
  itemRow2: ItemDaiDien = new ItemDaiDien();

  addDaiDien(data: any, type: string) {
    data.loaiDaiDien = type;
    let body = cloneDeep(data);
    this.dataTable.push(body);
    // if (!this.listDaiDien) {
    //   this.listDaiDien = [];
    // }
    // if (type) {
    //   let item = {
    //     bbLayMauId: null,
    //     daiDien: null,
    //     id: null,
    //     idTemp: new Date().getTime(),
    //     loaiDaiDien: type,
    //   };
    //   this.listDaiDien = [item, ...this.listDaiDien];
    //   this.loadDaiDien();
    // }
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
    this.formData.patchValue({
      flagNiemPhong: this.formData.value.ketQuaNiemPhong == 1,
    })
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

  editRow(index: number) {
    this.dataTable[index].edit = true;
  }

}
