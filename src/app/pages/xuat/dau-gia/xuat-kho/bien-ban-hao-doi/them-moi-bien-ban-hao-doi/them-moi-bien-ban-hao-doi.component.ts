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
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DanhMucService} from 'src/app/services/danhmuc.service';

import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  BienBanHaoDoiService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanHaoDoi.service";
import {
  BienBanTinhKhoService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service";


@Component({
  selector: 'app-bdg-them-moi-bien-ban-hao-doi',
  templateUrl: './them-moi-bien-ban-hao-doi.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi.component.scss']
})
export class ThemMoiBienBanHaoDoiComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuXuatKho: any[] = [];
  listBbTinhKho: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  maBb: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listTiLe: any = []
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idBangKe: number = 0;
  openBangKe = false;

  listBienHaoDoi : any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanHaoDoiService: BienBanHaoDoiService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [''],
        tenDvi:[''],
        maQhns: [''],
        soBbHaoDoi: [''],
        ngayTao:[''],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
        ngayQdGiaoNvXh: [''],
        idHdong: [],
        soHdong: [''],
        ngayKyHd: [''],
        maDiemKho: [''],
        tenDiemKho:[''],
        maNhaKho: [''],
        tenNhaKho: [''],
        maNganKho: [],
        tenNganKho: [''],
        maLoKho: [''],
        tenLoKho: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        idBbTinhKho: [],
        soBbTinhKho: [''],
        tongSlNhap: [],
        ngayKtNhap: [''],
        tongSlXuat: [],
        ngayKtXuat: [''],
        slHaoThucTe: [],
        tiLeHaoThucTe: [''],
        slHaoVuotDm: [],
        tiLeHaoVuotDm: [''],
        slHaoThanhLy: [],
        tiLeHaoThanhLy: [''],
        slHaoDuoiDm: [],
        tiLeHaoDuoiDm: [''],
        dinhMucHaoHut: [1.49],
        nguyenNhan: [''],
        kienNghi: [''],
        ghiChu: [''],
        tenThuKho:[''],
        tenKtvBaoQuan: [''],
        tenKeToan: [''],
        tenLanhDaoChiCuc: [''],
        trangThai: [''],
        tenTrangThai: [''],
        lyDoTuChoi:[''],
        donViTinh:[''],
        listPhieuXuatKho: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
      }
    );
    this.maBb = '-BBHD';
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      if(this.idInput){
        await this.loadDetail(this.idInput);
      }else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_CTVT_BB_HAO_DOI_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbHaoDoi: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      ngayTao: dayjs().format('YYYY-MM-DD'),
      thuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    });
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      let data = await this.detail(idInput);
      this.fileDinhKems = data.fileDinhKems;
      this.dataTable = data.listPhieuXuatKho;
    }
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
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      loaiVthh : this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if(res.msg == MESSAGE.SUCCESS){
      let data = res.data.content;
      if(data && data.length > 0 ){
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

  async bindingDataQd(id) {
    await this.spinner.show();
    if(id > 0){
      await this.quyetDinhGiaoNvXuatHangService.getDetail(id)
        .then(async (res) =>{
          if(res.msg == MESSAGE.SUCCESS){
            const dataQd = res.data
            this.formData.patchValue({
              soQdGiaoNvXh: dataQd.soQd,
              idQdGiaoNvXh: dataQd.id,
              ngayQdGiaoNvXh: dataQd.ngayKy,
              soHdong: dataQd.soHd,
              idHdong: dataQd.idHd,
              ngayKyHd: dataQd.ngayKyHd,
              loaiVthh: dataQd.loaiVthh,
              cloaiVthh: dataQd.cloaiVthh,
            });
            await this.loadBienBanHaoDoi(dataQd.soQd);
            let dataChiCuc = dataQd.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
            if(dataChiCuc) {
              this.listDiaDiemNhap = [];
              dataChiCuc.forEach(e =>{
                this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
              });
              this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
              let set1 = new Set(this.listBienHaoDoi.map(item => JSON.stringify({
                maDiemKho: item.maDiemKho,
                maNhaKho: item.maNhaKho,
                maNganKho: item.maNganKho,
                maLoKho: item.maLoKho
              })));
              this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => {
                const  key = JSON.stringify({
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

  async  loadBienBanHaoDoi(event) {
    let body = {
      soQdGiaoNvXh : event,
    }
    let res = await this.bienBanHaoDoiService.search(body);
    if(res.msg == MESSAGE.SUCCESS){
      let data = res.data;
      if(data && data.content && data.content.length >0){
        this.listBienHaoDoi = data.content
      }
    }else {
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
        });
        await this.loadSoBbTinhKho(data);
      }
    });
  }

  async loadSoBbTinhKho(kho) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
    }
    let res = await this.bienBanTinhKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0){
        this.listBbTinhKho = data.filter(item =>
          item.maDiemKho == kho.maDiemKho &&
          item.maNhaKho == kho.maNhaKho &&
          item.maNganKho == kho.maNganKho &&
          item.maLoKho == kho.maLoKho
        );
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  onSelectSoBbTinhKho(event: any): void {
    let bienBan = this.listBbTinhKho.find(f => f.soBbTinhKho == event);
    if (this.listBbTinhKho) {
      this.dataTable = bienBan.listPhieuXuatKho
    }
    this.formData.patchValue({
      donViTinh: bienBan.donViTinh,
      tongSlNhap: bienBan.tongSlNhap,
      ngayKtNhap: bienBan.ngayBatDauXuat,
      tongSlXuat : bienBan.tongSlXuat,
      ngayKtXuat: bienBan.ngayKetThucXuat,
      slHaoThucTe: bienBan.tongSlNhap - bienBan.tongSlXuat,
      slHaoThanhLy: bienBan.tongSlNhap - bienBan.tongSlXuat,
    })
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  changeSoQd(event) {
    if (event && event !== this.formData.value.soQdGiaoNvXh) {
      this.formData.patchValue({
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        soPhieuKnCl: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
      });
    }
  }

  changeDd(event) {
    if (event && event !== this.formData.value.maDiemKho) {
      this.dataTable.forEach(s => {
          s.slXuat = null;
          s.soBkCanHang = null;
          s.idBkCanHang = null;
          s.idPhieuXuatKho = null;
        }
      )
    }
  }

  async save() {
    this.formData.disable()
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.listPhieuXuatKho = this.dataTable;
    await this.createUpdate(body);
    this.formData.enable();
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
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
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_KTVBQ) {
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

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  openPhieuXkModal(id: number) {
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }

  openBangKeModal(id: number) {
    this.idBangKe = id;
    this.openBangKe = true;
  }

  closeBangKeModal() {
    this.idBangKe = null;
    this.openBangKe = false;
  }

}
