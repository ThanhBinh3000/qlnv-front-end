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
  @Input() idQdNv: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  listPhieuXk: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
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
        trangThai: [''],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        tenTrangThai: [''],
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
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      if(this.idInput){
        await this.loadDetail(this.idInput);
      }else {
        await this.initForm();
      }
      await Promise.all([
        this.loadDataComboBox(),
      ]);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_DG_PHIEU_XUAT_KHO_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      canBoLapPhieu: this.userInfo.TEN_DAY_DU,
      soPhieuXuatKho: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
      ngayTaoPhieu: dayjs().format('YYYY-MM-DD'),
      ngayXuatKho: dayjs().format('YYYY-MM-DD'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
    if(this.idQdNv){
      await this.bindingDataQd(this.idQdNv);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      let data = await this.detail(idInput);
      this.fileDinhKems = data.fileDinhKems;
    }
  }

  async openDialogSoQd() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS){
      let data = res.data.content;
      if(data && data.length > 0){
        this.listSoQuyetDinh = data;
        this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
    }else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
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
    await this.spinner.hide();
  }

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
    if(id >0){
      await this.quyetDinhGiaoNvXuatHangService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQd = res.data
            this.formData.patchValue({
              soQdGiaoNvXh: dataQd.soQd,
              idQdGiaoNvXh: dataQd.id,
              ngayQdGiaoNvXh: dataQd.ngayKy,
              soHdong: dataQd.soHd,
              idHdong: dataQd.idHd,
              ngayKyHd: dataQd.ngayKyHd,
              donViTinh: dataQd.donViTinh,
              loaiHinhNx: dataQd.loaiHinhNx,
              kieuNhapXuat: dataQd.kieuNx,
            });
            await this.loadDsPhieuXk(dataQd.soQd);
            let dataChiCuc = dataQd.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
            if (dataChiCuc) {
              this.listDiaDiemNhap = [];
              dataChiCuc.forEach(e => {
                this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
              });
              this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
              let set1 = new Set(this.listPhieuXk.map(item => JSON.stringify({
                maDiemKho: item.maDiemKho,
                maNhaKho: item.maNhaKho,
                maNganKho: item.maNganKho,
                maLoKho: item.maLoKho
              })));
              this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => {
                const key = JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho
                });
                return !set1.has(key);
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
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
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
        });
        await this.loadPhieuKtraCluong(data);
      }
    });
  }

  async loadPhieuKtraCluong(data) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
      loaiVthh: this.loaiVthh,
      soQdGiaoNvXh: this.formData.value.soQdGiaoNvXh,
    }
    let res = await this.xhPhieuKnghiemCluongService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let danhSachPhieuKn = res.data.content
      if (danhSachPhieuKn && danhSachPhieuKn.length > 0) {
        let danhSach = danhSachPhieuKn.find(item => (
          item.maDiemKho == data.maDiemKho &&
          item.maNhaKho == data.maNhaKho &&
          item.maNganKho == data.maNganKho &&
          item.maLoKho == data.maLoKho));
        if (danhSach) {
          await this.spinner.show();
          await this.xhPhieuKnghiemCluongService.getDetail(danhSach.id)
            .then((dataDtail) => {
              if (dataDtail.msg == MESSAGE.SUCCESS) {
                const dataPhieuKn = dataDtail.data
                console.log(dataPhieuKn, 999)
                this.formData.patchValue({
                  idPhieuKnCl: dataPhieuKn.id,
                  soPhieuKnCl: dataPhieuKn.soPhieu,
                  ktvBaoQuan: dataPhieuKn.nguoiKn,
                  ngayKn: dataPhieuKn.ngayTao,
                  loaiVthh: dataPhieuKn.loaiVthh,
                  cloaiVthh: dataPhieuKn.cloaiVthh,
                  tenLoaiVthh: dataPhieuKn.tenLoaiVthh,
                  tenCloaiVthh: dataPhieuKn.tenCloaiVthh,
                  moTaHangHoa: dataPhieuKn.moTaHangHoa,
                });
              }
            }).catch((e) => {
              console.log('error: ', e);
              this.spinner.hide();
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
          await this.spinner.hide();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

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
}
