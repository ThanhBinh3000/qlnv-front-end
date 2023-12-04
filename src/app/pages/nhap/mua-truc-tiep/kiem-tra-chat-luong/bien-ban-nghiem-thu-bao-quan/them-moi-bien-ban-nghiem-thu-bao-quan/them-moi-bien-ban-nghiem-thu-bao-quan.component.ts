import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import * as dayjs from 'dayjs';
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {
  QuyetDinhGiaoNvNhapHangService
} from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { DanhMucTieuChuanService } from './../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service';
import { Base2Component } from './../../../../../../components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  MttBienBanNghiemThuBaoQuan
} from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanNghiemThuBaoQuan.service';
import { BienBanNghiemThuBaoQuanDtl } from './../../../../../../models/KiemTraChatLuong';
import { cloneDeep } from 'lodash';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from './../../../../../../services/uploaFile.service';
import {
  ThongTinHangDtqgComponent
} from "../../../../../dieu-chuyen-noi-bo/nhap-dieu-chuyen/tablevel3/bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-hang-dtqg/thong-tin-hang-dtqg.component";
import * as uuidv4 from "uuid";
import {
  BangKeThuMuaLeService
} from "../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/BangKeThuMuaLeService.service";

@Component({
  selector: 'app-them-moi-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './them-moi-bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./them-moi-bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class ThemMoiBienBanNghiemThuBaoQuanComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() disableField: boolean = false;

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listBangKe: any[] = [];
  listLoaiKho: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];
  listDiaDiemNhap: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  listFileDinhKem: FileDinhKem[] = [];

  hasError: boolean = false;
  rowItem: BienBanNghiemThuBaoQuanDtl = new BienBanNghiemThuBaoQuanDtl;
  dataTable: any[] = [];
  dataEdit: { [key: string]: { edit: boolean; data: BienBanNghiemThuBaoQuanDtl } } = {};

  rowItem1: BienBanNghiemThuBaoQuanDtl = new BienBanNghiemThuBaoQuanDtl;
  dataTable1: any[] = [];
  dataEdit1: { [key: string]: { edit: boolean; data: BienBanNghiemThuBaoQuanDtl } } = {};
  danhSach: any[] = []
  dsHangTH = []
  dsHangPD = []
  typeData: string;
  typeAction: string;
  previewName: string = 'ntt_bien_ban_ntbq_lan_dau';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private bienBanNghiemThuBaoQuan: MttBienBanNghiemThuBaoQuan,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private banKeThuMuaLeService: BangKeThuMuaLeService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanNghiemThuBaoQuan);

    this.formData = this.fb.group(
      {
        id: [],
        namKh: [dayjs().get('year')],
        maDvi: ['', [Validators.required]],
        maQhns: ['',],
        tenDvi: ['', [Validators.required]],
        idQdGiaoNvNh: ['', [Validators.required]],
        soQdGiaoNvNh: [, [Validators.required]],
        tgianNkho: [''],
        soBb: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'),],
        ngayNghiemThu: [''],
        slCanNhap: [''],
        nguoiTao: [''],
        thuKho: [''],
        keToan: [''],
        nguoiPduyet: [''],
        tenNganLoKho: [''],

        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],

        idDdiemGiaoNvNh: [, [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        maLoKho: [''],
        tenLoKho: [''],

        loaiHinhKho: [''],
        tichLuong: [''],

        idPhieuNhapKho: [],
        soPhieuNhapKho: [],
        slThucNhap: [],
        hthucBquan: [''],
        pthucBquan: [''],
        dinhMucGiao: [''],
        dinhMucThucTe: [''],
        ketLuan: [''],
        loaiQd: [''],
        soBangKe: [''],

        ldoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
        dviChuDongThucHien: [],
        dmTongCucPdTruocThucHien: [],
        fileDinhKem: [FileDinhKem],
        kinhPhiThucTe: [''],
        kinhPhiTcPd: [''],
        soHopDong: [''],
      }
    );

  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDataComboBox(),
        this.loadSoQuyetDinh(),
        this.loadDsBangKe(),
        this.loadDonViTinh()
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("HH_BIEN_BAN_NGHIEM_THU_SEQ");
    this.formData.patchValue({
      soBb: `${res}/${this.formData.get('namKh').value}/BBNTBQ-CCDTKVVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      nguoiTao: this.userInfo.sub
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  async loadDataComboBox() {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    }
  }

  async loadDsBangKe(){
    let body = {
      idQdGiaoNvNh: this.idQdGiaoNvNh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    }
    let res = await this.banKeThuMuaLeService.search(body);
    if(res.msg == MESSAGE.SUCCESS){
      this.listBangKe = res.data.content
    }
  }

  async openDialogSoBangKe() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BẢNG KÊ MUA LẺ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBangKe,
        dataHeader: ['Số bảng kê', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soBangKe', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataBangKe(data.id, true);
      }
    });
  };

  async bindingDataBangKe(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.banKeThuMuaLeService.getDetail(id)
    console.log(dataRes, "1")
    const data = dataRes.data;
    this.formData.patchValue({
      soBangKe: data.soBangKe,
      idQdGiaoNvNh: data.idQdGiaoNvNh,
      // slCanNhap: data.soLuongQd,
    });
    await this.spinner.hide();
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      tgianNkho: data.tgianNkho,
      slCanNhap: data.soLuong,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      loaiQd: data.loaiQd,
    });
    let dataChiCuc = data.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi.includes(this.userInfo.MA_DVI));
    console.log(dataChiCuc, "2")
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
    }
    this.loadDataComboBox();
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      console.log(data, "kho kho kho")
      if (data.listPhieuNhapKho) {
        this.listSoPhieuNhapKho = data.listPhieuNhapKho.filter(item => item.trangThai == STATUS.DA_DUYET_LDCC);
        this.listSoPhieuNhapKho.forEach(item => {
          let phieuKtraCL = data.listPhieuKtraCl.filter(x => x.soPhieu == item.soPhieuKtraCl)[0];
          item.soLuongThucNhap = phieuKtraCL.soLuongNhapKho
        })
      }

      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        slCanNhap: data.soLuong,
        // soPhieuNhapKho: data?.hhPhieuNhapKhoHdr.find(x => x.maLoKho == data.maLoKho).soPhieuNhapKho,
      })
      // this.loadLoaiKho()
    }
  }

  openSoPhieuNhapKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số phiếu nhập kho ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoPhieuNhapKho,
        dataHeader: ['Số Phiếu nhập kho', 'Số phiếu kiểm tra CL', 'Số lượng thực nhập'],
        dataColumn: ['soPhieuNhapKho', 'soPhieuKtraCl', 'soLuongThucNhap']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataSoPhieuNk(data);
      }
    });
  }

  async bindingDataSoPhieuNk(data) {
    this.formData.patchValue({
      soPhieuNhapKho: data.soPhieuNhapKho,
      slThucNhap: data.soLuongThucNhap
    })
  }


  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.bienBanNghiemThuBaoQuan.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        await this.helperService.bidingDataInFormGroup(this.formData, data);
        console.log(data)
        this.listFileDinhKem = data.fileDinhKems;
        await this.bindingDataQd(res.data?.idQdGiaoNvNh);
        let dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == res.data.idDdiemGiaoNvNh)[0];
        await this.bindingDataDdNhap(dataDdNhap);
        this.dsHangTH = data.dviChuDongThucHien;
        this.dsHangPD = data.dmTongCucPdTruocThucHien;
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(index: number) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  editRow(index: number) {
    this.dataEdit[index].edit = true;
  }


  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.noiDung != null) {
      this.sortTableId();
      let item = cloneDeep(this.rowItem);
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new BienBanNghiemThuBaoQuanDtl();
      this.updateEditCache();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  emitDataTable() {

  }

  clearItemRow() {
    this.rowItem = new BienBanNghiemThuBaoQuanDtl();
  }


  cancelEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  saveEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = +(item?.thanhTienTn ?? 0) + +(item?.thanhTienQt ?? 0);
    }
  }

  calcTong() {
    if (this.dsHangTH) {
      const sum = this.dsHangTH.reduce((prev, cur) => {
        prev += cur.tongGiaTri;
        return prev;
      }, 0);
      this.formData.patchValue({
        kinhPhiThucTe: sum,
      })
      return sum;

    }
  }


  addRow1() {
    if (!this.dataTable1) {
      this.dataTable1 = [];
    }
    if (this.rowItem1.noiDung != null) {
      this.sortTableId1();
      let item = cloneDeep(this.rowItem1);
      item.stt = this.dataTable1.length + 1;
      item.edit = false;
      this.dataTable1 = [
        ...this.dataTable1,
        item,
      ]

      this.rowItem1 = new BienBanNghiemThuBaoQuanDtl();
      this.updateEditCache1();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  updateEditCache1(): void {
    if (this.dataTable1) {
      this.dataTable1.forEach((item, index) => {
        this.dataEdit1[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  sortTableId1() {
    this.dsHangPD.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  clearItemRow1() {
    this.rowItem = new BienBanNghiemThuBaoQuanDtl();
  }

  cancelEdit1(id: number): void {
    const index = this.dataTable1.findIndex((item) => item.idVirtual == id);
    this.dataEdit1[id] = {
      data: { ...this.dataTable1[index] },
      edit: false,
    };
  }

  editRow1(index: number) {
    this.dataEdit1[index].edit = true;
  }

  saveEdit1(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable1[index], this.dataEdit1[index].data);
    this.dataEdit1[index].edit = false;
  }

  deleteRow1(index: number) {
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
          this.dataTable1.splice(index, 1);
          this.updateEditCache1();
          this.dataTable1;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  calcTong1() {
    if (this.dataTable1) {
      const sum = this.dataTable1.reduce((prev, cur) => {
        prev += cur.tongGtri;
        return prev;
      }, 0);
      this.formData.patchValue({
        kinhPhiTcPd: sum,
      })
      return sum;

    }
  }

  async loadHinhThucBaoQuan() {
    let body = {
      "maHthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenHthuc": null,
      "trangThai": null
    }
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadLoaiKho() {
    let body = {
      "maLhKho": this.formData.value.maLoKho,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenLhKho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        console.log(res.data, 5555);
        this.listLoaiKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      console.log(res)
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async save(isGuiDuyet: boolean) {
    if (this.validateSave()) {
      try {
        this.spinner.show();
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          await this.spinner.hide();
          return;
        }
        let body = this.formData.value;
        body.dviChuDongThucHien = this.dsHangTH;
        body.dmTongCucPdTruocThucHien = this.dsHangPD;
        body.fileDinhkems = this.listFileDinhKem;
        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.bienBanNghiemThuBaoQuan.update(body);
        } else {
          res = await this.bienBanNghiemThuBaoQuan.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            await this.spinner.hide();
            this.id = res.data.id;
            this.pheDuyet();
          } else {
            if (this.formData.get('id').value) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
            await this.spinner.hide();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
          await this.spinner.hide();
        }
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }

  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TK:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TK;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.CHO_DUYET_KT;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai
          };
          let res =
            await this.bienBanNghiemThuBaoQuan.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_TK: {
              body.trangThai = STATUS.TU_CHOI_TK;
              break;
            }
            case STATUS.CHO_DUYET_KT: {
              body.trangThai = STATUS.TU_CHOI_KT;
              break;
            }
            case STATUS.CHO_DUYET_LDCC: {
              body.trangThai = STATUS.TU_CHOI_LDCC;
              break;
            }
          }
          let res =
            await this.bienBanNghiemThuBaoQuan.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  back() {
    this.showListEvent.emit();
  }

  getNameFile($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

  validateSave() {
    return true;
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  print() {

  }

  async addTH(row?: any) {
    this.typeData = "CD"
    this.typeAction = "ADD"
    await this.add(row)
  }

  async add(row?: any, isChildren?) {
    await this.spinner.show();

    await this.spinner.hide();

    if (!row) this.typeAction = "ADD"

    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangDtqgComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: row,
        typeData: this.typeData,
        typeAction: this.typeAction,
        isChildren: isChildren
      },
    });
    modalQD.afterClose.subscribe(async (data) => {

      if (data) {
        if (this.typeData === "CD") {
          if (this.typeAction === "ADD") {
            if (isChildren) {
              this.addDataTH({
                ...row,
                ...data
              })
            } else this.addDataTH(data)
          } else
            this.updateDataTH({
              ...row,
              ...data
            })
        }

        if (this.typeData === "PD") {
          if (this.typeAction === "ADD") {
            if (isChildren) {
              this.addDataPD({
                ...row,
                ...data
              })
            } else this.addDataPD(data)
          } else
            this.updateDataPD({
              ...row,
              ...data
            })
        }

        this.updateDataTable()

      }
    });
  }

  updateDataTable() {
    this.danhSach = []
    this.danhSach = this.danhSach.concat(this.dsHangTH)
    this.danhSach = this.danhSach.concat(this.dsHangPD)
    this.formData.patchValue({
      dcnbBBNTBQDtl: this.danhSach
    })
  }

  addDataTH(data) {
    if (data.isChildren) {
      this.dsHangTH.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idVirtual: uuidv4.v4(),
        edit: false,
        isParent: false,
        type: this.typeData
      })
      const hangTH = this.dsHangTH.find(item => item.idParent === data.idParent)
      const index = this.dsHangTH.findIndex(item => item.idParent === data.idParent)
      const tongGiaTri = Number(hangTH.tongGiaTri) + Number(data.tongGiaTri)
      this.dsHangTH[index].tongGiaTri = tongGiaTri;

      this.viewTableTH()

      return
    }
    if (data.isMatHang) {
      const parent = {
        ...data,
        idVirtual: uuidv4.v4(),
        type: this.typeData
      }
      this.dsHangTH.push({
        danhMuc: parent.danhMuc,
        nhomHang: parent.nhomHang,
        donViTinh: parent.donViTinh,
        tongGiaTri: parent.tongGiaTri,
        idVirtual: parent.idVirtual,
        idParent: parent.idVirtual,
        isParent: true,
        edit: false,
        type: this.typeData
      })
      this.dsHangTH.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idParent: parent.idVirtual,
        idVirtual: uuidv4.v4(),
        edit: false,
        type: this.typeData
      })
    } else {
      const uuid = uuidv4.v4()
      this.dsHangTH.push({
        ...data,
        tongGiaTri: data.thanhTienTrongNam,
        isParent: true,
        idVirtual: uuid,
        idParent: uuid,
        edit: false,
        type: this.typeData
      })
    }


    this.viewTableTH()
  }

  viewTableTH() {
    let tableTHs = []
    this.dsHangTH.forEach(element => {
      if (element.isParent) {
        const dsChildren = this.dsHangTH.filter(item => item.idParent === element.idParent)
        tableTHs = tableTHs.concat(dsChildren)
      }
    });
    let tongKinhPhiDaTh = this.dsHangTH.filter(item => item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
    this.formData.patchValue({
      tongKinhPhiDaTh,
      tongKinhPhiDaThBc
    })
    this.dsHangTH = cloneDeep(tableTHs)
  }

  updateDataTH(data) {
    const index = this.dsHangTH.findIndex(item => data.id ? item.id == data.id : item.idVirtual === data.idVirtual)
    this.dsHangTH[index] = data

    const iParent = this.dsHangTH.findIndex(item => (item.idParent === data.idParent) && item.isParent)
    const tongGiaTri = this.dsHangTH.filter(item => (item.idParent === data.idParent) && !item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    this.dsHangTH[iParent].tongGiaTri = tongGiaTri;

    this.viewTableTH()

  }

  xoa(row, type) {
    if (type === "CD") {
      if (row.id)
        this.dsHangTH = this.dsHangTH.filter(item => item.id !== row.id)
      else
        this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual)
      if (row.isParent)
        this.dsHangTH = this.dsHangTH.filter(item => item.idParent !== row.idParent)
      let tongKinhPhiDaTh = this.dsHangTH.reduce((prev, cur) => prev + cur.tongGiaTri, 0);
      if (tongKinhPhiDaTh > 0) {
        let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
        this.formData.patchValue({
          tongKinhPhiDaTh,
          tongKinhPhiDaThBc
        })
      } else {
        this.formData.patchValue({
          tongKinhPhiDaTh: "",
          tongKinhPhiDaThBc: ""
        })
      }
      this.dsHangTH = cloneDeep(this.dsHangTH)
    }
    if (type === "PD") {
      if (row.id)
        this.dsHangPD = this.dsHangPD.filter(item => item.id !== row.id)
      else
        this.dsHangPD = this.dsHangPD.filter(item => item.idVirtual !== row.idVirtual)
      if (row.isParent)
        this.dsHangPD = this.dsHangPD.filter(item => item.idParent !== row.idParent)
      this.dsHangPD = cloneDeep(this.dsHangPD)
    }
    this.updateDataTable()
  }

  async addRowTH(row?: any) {
    this.typeData = "CD"
    this.typeAction = "ADD"
    await this.add(row, true)
  }

  async updateTH(row) {
    this.typeData = "CD"
    this.typeAction = "UPDATE"
    await this.add(row)
  }

  async addPD(row?: any) {
    this.typeData = "PD"
    this.typeAction = "ADD"
    await this.add(row)
  }

  async updatePD(row) {
    this.typeData = "PD"
    this.typeAction = "UPDATE"
    await this.add(row)
  }

  async addRowPD(row?: any) {
    this.typeData = "PD"
    this.typeAction = "ADD"
    await this.add(row, true)
  }

  viewTablePD() {
    let tablePDs = []
    this.dsHangPD.forEach(element => {
      if (element.isParent) {
        const dsChildren = this.dsHangPD.filter(item => item.idParent === element.idParent)
        tablePDs = tablePDs.concat(dsChildren)
      }
    });
    this.dsHangPD = cloneDeep(tablePDs)
  }

  addDataPD(data) {
    if (data.isChildren) {
      this.dsHangPD.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idVirtual: uuidv4.v4(),
        edit: false,
        isParent: false,
        type: this.typeData
      })
      const hangPD = this.dsHangPD.find(item => item.idParent === data.idParent)
      const index = this.dsHangPD.findIndex(item => item.idParent === data.idParent)
      const tongGiaTri = Number(hangPD.tongGiaTri) + Number(data.tongGiaTri)
      this.dsHangPD[index].tongGiaTri = tongGiaTri;

      this.viewTablePD()

      return
    }
    if (data.isMatHang) {
      const parent = {
        ...data,
        idVirtual: uuidv4.v4(),
        type: this.typeData
      }
      this.dsHangPD.push({
        danhMuc: parent.danhMuc,
        nhomHang: parent.nhomHang,
        donViTinh: parent.donViTinh,
        tongGiaTri: parent.tongGiaTri,
        idVirtual: parent.idVirtual,
        idParent: parent.idVirtual,
        isParent: true,
        edit: false,
        type: this.typeData
      })
      this.dsHangPD.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idParent: parent.idVirtual,
        idVirtual: uuidv4.v4(),
        edit: false,
        type: this.typeData
      })
    } else {
      const uuid = uuidv4.v4()
      this.dsHangPD.push({
        ...data,
        tongGiaTri: data.thanhTienTrongNam,
        isParent: true,
        idVirtual: uuid,
        idParent: uuid,
        edit: false,
        type: this.typeData
      })
    }
    this.viewTablePD()
  }

  updateDataPD(data) {
    const index = this.dsHangPD.findIndex(item => data.id ? item.id == data.id : item.idVirtual === data.idVirtual)
    this.dsHangPD[index] = data

    const iParent = this.dsHangPD.findIndex(item => (item.idParent === data.idParent) && item.isParent)
    const tongGiaTri = this.dsHangPD.filter(item => (item.idParent === data.idParent) && !item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    this.dsHangPD[iParent].tongGiaTri = tongGiaTri;

    this.viewTablePD()
  }
}

