import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
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
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {
  XhPhieuKnghiemCluongService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
import {
  PhieuXuatKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';

@Component({
  selector: 'app-bdg-them-moi-phieu-xuat-kho',
  templateUrl: './them-moi-phieu-xuat-kho.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho.component.scss']
})
export class ThemMoiPhieuXuatKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  listPhieuXk: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  soQdChange: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listLoaiHinhNx: any = [];
  listKieuNx: any = [];
  flagInit: Boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService,
    private phieuXuatKhoService: PhieuXuatKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [],
        maQhNs: [],
        soPhieuXuatKho: ['', [Validators.required]],
        ngayTaoPhieu: [],
        ngayXuatKho: [],
        taiKhoanNo: [],
        taiKhoanCo: [],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
        ngayQdGiaoNvXh: [],
        idHdong: [],
        soHdong: ['', [Validators.required]],
        ngayKyHd: [],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        idPhieuKnCl: [],
        soPhieuKnCl: ['', [Validators.required]],
        ngayKn: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        canBoLapPhieu: [],
        ldChiCuc: [],
        ktvBaoQuan: [],
        keToanTruong: [],
        nguoiGiaoHang: [],
        soCmt: [],
        ctyNguoiGh: [],
        diaChi: [],
        thoiGianGiaoNhan: [],
        soBangKeCh: [],
        maSo: [],
        donViTinh: [],
        theoChungTu: [],
        thucXuat: [],
        donGia: [],
        thanhTien: [],
        ghiChu: [],
        trangThai: [STATUS.DU_THAO],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        tenLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        loaiHinhNx: [],
        kieuNhapXuat: [],
      }
    );
    this.maPhieu = 'PXK-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();

      await Promise.all([
        this.loadSoQuyetDinh(),
      ])
      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
      this.flagInit = true;
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuXuatKhoService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);

            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_DG_PHIEU_XUAT_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        canBoLapPhieu: this.userInfo.TEN_DAY_DU,
        soPhieuXuatKho: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
        ngayTaoPhieu: dayjs().format('YYYY-MM-DD'),
        ngayXuatKho: dayjs().format('YYYY-MM-DD'),
        loaiVthh: this.loaiVthh
      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
      this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id);
      }
    });
  };

  changeSoQd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdGiaoNvXh) {
      this.formData.patchValue({
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        donGia: null,
        soPhieuKnCl: null,
        ktvBaoQuan: null,
        ngayKn: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
      });
    }
  }

  changeDd(event) {
    if (this.flagInit && event && event !== this.formData.value.maDiemKho) {
      this.formData.patchValue({
        soPhieuKnCl: null,
        ktvBaoQuan: null,
        ngayKn: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
      });
    }
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvXuatHangService.getDetail(id)
    const data = dataRes.data;
    await this.loadDataComboBox(data);
    this.formData.patchValue({
      soQdGiaoNvXh: data.soQd,
      idQdGiaoNvXh: data.id,
      ngayQdGiaoNvXh: data.ngayKy,
      soHdong: data.soHd,
      idHdong: data.idHd,
      ngayKyHd: data.ngayKyHd,
      donViTinh: data.donViTinh,
      loaiHinhNx: data.loaiHinhNx,
      kieuNhapXuat: data.kieuNx,
    });
    this.soQdChange = data.soQd;
    await this.loadDsPhieuXk(data.soQd);
    let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc) {
      this.listDiaDiemNhap = [];
      dataChiCuc.forEach(e => {
        this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
      });
      this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
      // if (this.listPhieuXk.length > 0) {
      //   this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => {
      //     return this.listPhieuXk.some(phieuXk => {
      //       return (
      //         item.maLoKho !== phieuXk.maLoKho ||
      //         item.maNganKho !== phieuXk.maNganKho
      //       );
      //     });
      //   });
      // }

      let set1 = new Set(this.listPhieuXk.map(item => JSON.stringify({ maLoKho: item.maLoKho, maNganKho: item.maNganKho })));
      this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => {
        const key = JSON.stringify({ maLoKho: item.maLoKho, maNganKho: item.maNganKho });
        return !set1.has(key);
      });

    }
    await this.spinner.hide();
  }

  async loadDsPhieuXk(event) {
    let body = {
      soQdGiaoNvXh: event,

    }
    let res = await this.phieuXuatKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listPhieuXk = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {

    if (data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        donGia: data.donGiaVat,
      })

      let body = {
        trangThai: STATUS.DA_DUYET_LDC,
        loaiVthh: this.loaiVthh,
        soQdGiaoNvXh: this.formData.value.soQdGiaoNvXh,
      }
      let res = await this.xhPhieuKnghiemCluongService.search(body)
      const list = res.data.content;
      // this.listPhieuKtraCl = list.find(item => (item.maDiemKho == data.maDiemKho));
      let soPhieu = list.find(item => (item.maLoKho == data.maLoKho&&item.maNganKho == data.maNganKho));
      if(soPhieu){
        this.formData.patchValue({
          soPhieuKnCl: soPhieu.soPhieu,
          ktvBaoQuan: soPhieu.nguoiKn,
          ngayKn: soPhieu.ngayTao,
          loaiVthh: soPhieu.loaiVthh,
          cloaiVthh: soPhieu.cloaiVthh,
          tenLoaiVthh: soPhieu.tenLoaiVthh,
          tenCloaiVthh: soPhieu.tenCloaiVthh,
          moTaHangHoa: soPhieu.moTaHangHoa,

        });
      }
    }
  }

  // openDialogPhieuKnCl() {
  //   const modalQD = this.modal.create({
  //     nzTitle: 'Danh sách phiếu kiểm nghiệm chất lượng',
  //     nzContent: DialogTableSelectionComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '900px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       dataTable: this.listPhieuKtraCl,
  //       dataHeader: ['Số phiếu', 'Ngày kiểm nghiệm'],
  //       dataColumn: ['soPhieu', 'ngayTao']
  //     },
  //   });
  //   modalQD.afterClose.subscribe(async (data) => {
  //     if (data) {
  //       console.log(data, "phiếu");
  //       this.formData.patchValue({
  //         soPhieuKnCl: data.soPhieu,
  //         ktvBaoQuan: data.nguoiKn,
  //         ngayKn: data.ngayTao,
  //         loaiVthh: data.loaiVthh,
  //         cloaiVthh: data.cloaiVthh,
  //         tenLoaiVthh: data.tenLoaiVthh,
  //         tenCloaiVthh: data.tenCloaiVthh,
  //         moTaHangHoa: data.moTaHangHoa,
  //
  //       });
  //     }
  //   });
  // }

  async save() {
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    await this.createUpdate(body);
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    if(this.formData.value.soBangKeCh){
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    }else {
      this.notification.error(MESSAGE.ERROR, "Phiếu xuất kho chưa có bảng kê cân hàng");
    }
  }


  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

  clearItemRow(id) {

    this.formData.patchValue({
      maSo: null,
      theoChungTu: null,
      thucXuat: null,
    })
  }

  calculateSum() {
    let sum = this.formData.value.thucXuat * this.formData.value.donGia;
    return sum;

  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  async loadDataComboBox(data) {
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.ma == data.loaiHinhNx);
    }
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }


}
