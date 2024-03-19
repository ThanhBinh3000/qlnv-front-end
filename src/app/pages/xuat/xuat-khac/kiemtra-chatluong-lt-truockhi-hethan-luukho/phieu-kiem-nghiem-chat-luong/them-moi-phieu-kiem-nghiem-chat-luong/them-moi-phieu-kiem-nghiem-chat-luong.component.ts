import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {
  DialogTableSelectionComponent,
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {PhuongPhapLayMau} from 'src/app/models/PhuongPhapLayMau';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from '@angular/forms';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {LOAI_HH_XUAT_KHAC} from '../../../../../../constants/config';
import {
  TongHopDanhSachHangDTQGService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service';
import {
  BienBanLayMauLuongThucHangDTQGService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/BienBanLayMauLuongThucHangDTQG.service';
import {MangLuoiKhoService} from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import {
  PhieuKiemNgiemClLuongThucHangDTQGService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/PhieuKiemNgiemClLuongThucHangDTQG.service';
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";

@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  listPhieuKn: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  dataTableChiTieu: any[] = [];
  listTieuChuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  maVthh: string;
  listDsTongHop: any[] = [];
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;
  dsDanhGia: any[] = [];
  templateName = 'Phiếu kiểm nghiệm chất lượng';
  LIST_DANH_GIA: any[] = [
    {value: 0, label: "Không đạt"},
    {value: 1, label: "Đạt"}
  ]

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private phieuKiemNgiemClLuongThucHangDTQGService: PhieuKiemNgiemClLuongThucHangDTQGService,
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private bienBanLayMauLuongThucHangDTQGService: BienBanLayMauLuongThucHangDTQGService,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNgiemClLuongThucHangDTQGService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get('year')],
        maDvi: [, [Validators.required]],
        maQhNs: [],
        soPhieu: [],
        ngayLapPhieu: [],
        ngayKnMau: [],
        idBienBan: [, [Validators.required]],
        soBienBan: [, [Validators.required]],
        ngayLayMau: [],
        idTongHop: [, [Validators.required]],
        maDanhSach: [, [Validators.required]],
        tenDanhSach: [],
        nguoiKn: [],
        truongPhong: [],
        thuKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        maDiaDiem: [],
        slTon: [],
        slHetHan: [],
        thoiHanLk: [],
        donViTinh: [],
        hinhThucBq: [],
        noiDung: [],
        ketLuan: [],
        kqThamDinh: [],
        trangThai: [STATUS.DU_THAO],
        ngayGduyet: [],
        nguoiGduyetId: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        lyDoTuChoi: [],
        type: [],
        tenDvi: [],
        tenCuc: [],
        tenChiCuc: [],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        lanhDaoCuc: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        phieuKnClDtl: [new Array()],

      },
    );
    this.maPhieu = 'PKNCL-' + this.userInfo.DON_VI.tenVietTat;
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
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();

      await Promise.all([
        this.loadMaDs(),
        this.loadHinhThucBaoQuan(),
        this.loadTieuChuan(),
      ]);
      await this.loadDetail(this.idInput);
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuKiemNgiemClLuongThucHangDTQGService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.formData.patchValue(data);
            this.checked = data.kqThamDinh;
            this.listFileDinhKem = data.fileDinhKems;
            this.dataTableChiTieu = data.phieuKnClDtl;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_LT_PHIEU_KN_CL_HDR_SEQ');
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        nguoiKn: this.userInfo.TEN_DAY_DU,
        truongPhong: this.userInfo.MA_KTBQ,
        soPhieu: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
        ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadMaDs() {
    let body = {
      trangThai: STATUS.GUI_DUYET,
      loai: this.loaiHhXuatKhac.LT_6_THANG,
    };
    let res = await this.tongHopDanhSachHangDTQGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDsTongHop = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogMaDs() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp hàng DTQG còn 6 tháng hết hạn lưu kho ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDsTongHop,
        dataHeader: ['Mã danh sách', 'Tên danh sách', 'Ngày tạo'],
        dataColumn: ['maDanhSach', 'tenDanhSach', 'ngayTao'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataDs(data.id, true);
      }
    });
  };

  async bindingDataDs(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.tongHopDanhSachHangDTQGService.getDetail(id);
    const data = dataRes.data;
    this.formData.patchValue({
      idTongHop: data.id,
      tenDanhSach: data.tenDanhSach,
      maDanhSach: data.maDanhSach,

    });
    await this.loadBbLayMau(data.maDanhSach);
    await this.loadPhieuKn(data.maDanhSach);
    await this.spinner.hide();
  }


  async loadBbLayMau(ma) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      maDanhSach: ma,
      paggingReq: {
        'limit': this.globals.prop.MAX_INTERGER,
        'page': 0,
      },
    };
    let res = await this.bienBanLayMauLuongThucHangDTQGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listBbLayMau = res.data.content;
      }
    }
  }

  async loadPhieuKn(ma) {
    let body = {
      maDanhSach: ma,
      paggingReq: {
        'limit': this.globals.prop.MAX_INTERGER,
        'page': 0,
      },
    };
    let res = await this.phieuKiemNgiemClLuongThucHangDTQGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listPhieuKn = res.data.content;
      }
    }
    let bienBan = [
      ...this.listBbLayMau.filter((e) => {
        return !this.listPhieuKn.some((bb) => {
          return e.soBienBan === bb.soBienBan;
        });
      }),
    ];
    this.listBbLayMau = bienBan;
  }

  openDialogBbLayMau() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBbLayMau,
        dataHeader: ['Số BB lấy mẫu/bàn giao mẫu', 'Ngày lấy mẫu', 'Mã danh sách'],
        dataColumn: ['soBienBan', 'ngayLayMau', 'maDanhSach'],
      },
    });

    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataBbLayMau(data.id, false);
      }
    });

  }

  async bindingDataBbLayMau(id, isChiTiet) {
    let res = await this.bienBanLayMauLuongThucHangDTQGService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        soBienBan: data.soBienBan,
        idBienBan: data.id,
        ngayLayMau: data.ngayLayMau,
        maDiaDiem: data.maDiaDiem,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        slTon: data.slTon,
        slHetHan: data.slHetHan,
        donViTinh: data.donViTinh,
        thoiHanLk: data.thoiHanLk,
      });
      // if (!isChiTiet) {
      //       //   let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      //       //   if (dmTieuChuan.data) {
      //       //     this.dataTableChiTieu = dmTieuChuan.data.children;
      //       //     this.dataTableChiTieu.forEach(element => {
      //       //       element.edit = false;
      //       //     });
      //       //   }
      //       // }
      this.tenThuKho(data.maDiaDiem);
      this.loadChiTieuCl(data);
    }
  }
  async loadChiTieuCl(itemBbLayMau) {
    let [dmTieuChuan] = await Promise.all([this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(itemBbLayMau.cloaiVthh)])
    if (dmTieuChuan.data) {
      this.dataTableChiTieu = Array.isArray(dmTieuChuan.data) ? dmTieuChuan.data.map(element => ({
        edit: false,
        chiSo: element.mucYeuCauXuat,
        tenChiTieu: element.tenChiTieu,
        maChiTieu: element.id,
        danhGia: element.danhGia,
        hdrId: element.hdrId,
        id: element.id,
        ketQua: element.ketQuaPt,
        ppKiemTra: element.phuongPhapXd
      })) : [];
    }
  }

  async tenThuKho(event) {
    let body = {
      maDvi: event,
      capDvi: (event?.length / 2 - 1),
    };
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      const detailThuKho = detail.data.object.detailThuKho;
      if (detailThuKho) {
        this.formData.patchValue({
          thuKho: detailThuKho.hoTen,
        });
      }
    }
  }

  async loadHinhThucBaoQuan() {
    let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucBaoQuan = res.data;
    }
  }

  async loadDanhMucPhuongThucBaoQuan() {
    let body = {
      maHthuc: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenHthuc: null,
      trangThai: null,
    };
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async save() {
    // this.formData.disable();
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.phieuKnClDtl = this.dataTableChiTieu;
    let data = await this.createUpdate(body);
    // this.formData.enable();
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';

    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai);
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true;
    }
    return false;
  }


  async loadTieuChuan() {
    let body = {
      maHang: this.maVthh,
      namQchuan: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenQchuan: null,
      trangThai: '01',
    };
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (
          res.data.content[0].children &&
          res.data.content[0].children.length > 0
        ) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }


}
