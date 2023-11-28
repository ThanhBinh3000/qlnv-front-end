import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";
import { Subject } from "rxjs";
import { UserLogin } from "src/app/models/userlogin";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BienBanGuiHangService } from "src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/bienBanGuiHang.service";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HSKT_LOAI_DOI_TUONG, LOAI_BIEN_BAN, STATUS } from 'src/app/constants/status';
import { FileDinhKem } from "src/app/models/DeXuatKeHoachMuaTrucTiep";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import {
  HoSoKyThuatCtvtService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/HoSoKyThuatCtvt.service";
import { HoSoKyThuatXuatDieuChuyenService } from '../../../services/dcnb-ho-so-ky-thuat.service';

@Component({
  selector: 'app-chi-tiet-bien-ban-kiem-tra-xuat-dieu-chuyen',
  templateUrl: './chi-tiet-bien-ban-kiem-tra.component.html',
  styleUrls: ['./chi-tiet-bien-ban-kiem-tra.component.scss']
})
export class ChiTietBienBanKiemTraXuatDieuChuyenComponent extends Base2Component implements OnInit {

  @Input() data: any;
  @Input() dataHdr: any;
  @Input() id: number;
  @Input() idHoSoKyThuat: number;
  @Input() loai: string;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Output() showListEvent = new EventEmitter<any>();
  @Output() saveDtl = new EventEmitter<any>();


  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listThuKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBanGiaoMau: any[] = [];
  listBienBanGuiHang: any[] = [];


  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  capCuc: string = '2';
  capChiCuc: string = '3';
  capDonVi: string = '0';

  daiDienCuc: any = {};
  daiDienChiCuc: any = {};
  daiDienDonVi: any = {};


  viewTableDaiDien: any[] = [];
  viewTableHoSo: any[] = [];

  listCanCu: any[] = [];
  listFileDinhKem: any[] = [];
  listVanBanBsung: any[] = [];
  listHopDong: any[] = [];
  title: string;
  sufffix: string;
  LOAI_BIEN_BAN = LOAI_BIEN_BAN;
  daiDienRow: any = {};
  isDisable: any = true;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanGuiHangService: BienBanGuiHangService,
    private hoSoKyThuatXuatDieuChuyenService: HoSoKyThuatXuatDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatXuatDieuChuyenService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      idVirtual: [],
      soBienBan: [],
      ngayLapBb: [],
      soHskt: [],
      maDviNhapHskt: [],
      ngayTaoHskt: [],
      idBbLayMau: [],
      soBbLayMau: [],
      soQdGiaoNvNh: [],
      idQdGiaoNvNh: [],
      dviCungCap: [],
      tgianKtra: [],
      kquaKtra: [],
      diaDiemKtra: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenVthh: [],
      soLuongNhap: [],
      tgianNhap: [],
      ppLayMau: [],
      kyMaHieu: [],
      soSerial: [],
      noiDung: [],
      ketLuan: [],
      trangThai: [],
      tenTrangThai: [],
      loaiBb: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      vanBanBsung: [new Array<FileDinhKem>()],
      tgianBsung: [],
      thoiDiemLap: [],
      xhHoSoKyThuatRow: [],
      ngayTao: [],
      nguoiTaoId: [],
      ngaySua: [],
      nguoiSuaId: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenDviNhapHskt: []
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.userInfo = this.userService.getUserLogin();
      if (!(this.data.thoiDiemLap == 'NHAP' && this.data.trangThai == STATUS.DA_KY)) {
        this.isDisable = false;
      }
      await this.getDetail(this.data);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadTitle() {
    this.title = ''
    if (this.loai == LOAI_BIEN_BAN.BB_KTRA_NGOAI_QUAN) {
      this.title = 'Biên bản kiểm tra ngoại quan';
      this.sufffix = 'BBKTNQ';
    } else if (this.loai == LOAI_BIEN_BAN.BB_KTRA_VAN_HANH) {
      this.title = 'Biên bản kiểm tra vận hành';
      this.sufffix = 'BBKTVH';
    } else if (this.loai == LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT) {
      this.title = 'Biên bản kiểm tra hồ sơ kỹ thuật';
      this.sufffix = 'BBKTHSKT';
    }
  }

  async getDetail(data) {
    this.title = ''
    if (data.loaiBb == LOAI_BIEN_BAN.BB_KTRA_NGOAI_QUAN) {
      this.title = 'Biên bản kiểm tra ngoại quan';
      this.sufffix = 'BBKTNQ';
    } else if (data.loaiBb == LOAI_BIEN_BAN.BB_KTRA_VAN_HANH) {
      this.title = 'Biên bản kiểm tra vận hành';
      this.sufffix = 'BBKTVH';
    } else if (data.loaiBb == LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT) {
      this.title = 'Biên bản kiểm tra hồ sơ kỹ thuật';
      this.sufffix = 'BBKTHSKT';
    }
    this.data.maDviNhapHskt = this.data.maDviNhapHskt ? this.userInfo.MA_DVI : this.data.maDviNhapHskt;
    this.data.tenDviNhapHskt = this.data.tenDviNhapHskt ? this.userInfo.TEN_DVI : this.data.tenDviNhapHskt;
    this.formData.patchValue(data);
    this.listCanCu = this.data.canCu ? this.data.canCu : [];
    this.listVanBanBsung = this.data.listVanBanBsung ? this.data.listVanBanBsung : [];
    await this.buildTableView();
  }

  back() {
    this.showListEvent.emit(this.dataHdr.idHsktNh);
  }

  async save() {
    try {
      Object.assign(this.dataHdr.xhHoSoKyThuatDtl.find(s => s.idVirtual == this.formData.value.idVirtual), this.formData.value)
      /*await this.createUpdate(this.dataHdr);
      this.dataHdr.dtl = this.formData.value;*/
      await this.createUpdate(this.dataHdr);
      // this.saveDtl.emit(this.formData.value);
      /*this.data.xhHoSoKyThuatDtl = this.formData.value;
      await this.createUpdate(this.data);*/
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, e);
    }
  }

  async approve() {
    try {
      this.formData.patchValue({ trangThai: STATUS.DA_KY });
      Object.assign(this.dataHdr.xhHoSoKyThuatDtl.find(s => s.idVirtual == this.formData.value.idVirtual), this.formData.value)
      await this.createUpdate(this.dataHdr);
    } catch (e) {
      console.log(e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  /*  async openBienBanGuiHang() {
      let body = {
        // "maDvi": this.userInfo.MA_DVI,
        // "loaiVthh": this.loaiVthh,
        "paggingReq": {
          "limit": this.globals.prop.MAX_INTERGER,
          "page": 0
        },
        // "trangThai": STATUS.BAN_HANH,
        // "namNhap": this.formData.get('nam').value
      }
      let res = await this.bienBanGuiHangService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listBienBanGuiHang = data.content;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'Danh sách biên bản gửi hàng',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listBienBanGuiHang,
          dataHeader: ['Số biên bản gửi hàng'],
          dataColumn: ['soBienBanGuiHang'],
        },
      })
      modalQD.afterClose.subscribe(async (dataChose) => {
        if (dataChose) {
          this.formData.patchValue({
            soBienBanGuiHang: dataChose.soBienBanGuiHang,
            loaiVthh: dataChose.loaiVthh,
            tenLoaiVthh: dataChose.tenLoaiVthh,
            cloaiVthh: dataChose.cloaiVthh,
            tenCloaiVthh: dataChose.tenCloaiVthh,
            soLuongNhap: dataChose.soLuongDdiemGiaoNvNh,
            tgianNhap: dataChose.ngayTao
          })
        }
      });

    }*/

  async getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    console.log(fileList, 'fileList')
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          fileDinhKem.idVirtual = new Date().getTime();
          this.formData.value.fileDinhKem = [...[], fileDinhKem]
        });
    }
  }

  async themDaiDien() {
    if (this.daiDienRow.ten && this.daiDienRow.loai) {
      this.daiDienRow.type = HSKT_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN;
      this.daiDienRow.idVirtual = uuidv4();
      let newData = [...this.formData.value.xhHoSoKyThuatRow, this.daiDienRow];
      this.formData.patchValue({ xhHoSoKyThuatRow: newData });
      await this.buildTableView();
      this.daiDienRow = {};
    }
  }

  async nhapLaiDaiDien() {
    this.daiDienRow = {};
  }

  async suaDaiDien(item) {
    await this.buildTableView();
    this.viewTableDaiDien.forEach(s => s.edit = false);
    let currentRow = this.viewTableDaiDien.find(s => s.idVirtual == item.idVirtual);
    currentRow.edit = true;
  }

  async luuDaiDien(item) {
    let newValue = cloneDeep(this.formData.value.xhHoSoKyThuatRow);
    let index = newValue.findIndex(s => s.idVirtual == item.idVirtual);
    item.edit = false;
    newValue.splice(index, 1, item);
    this.formData.patchValue({ xhHoSoKyThuatRow: newValue });
    await this.buildTableView();
  }

  async huySuaDaiDien() {
    await this.buildTableView();
    this.viewTableDaiDien.forEach(s => s.edit = false);
  }

  async xoaDaiDien(item) {
    let newValue = cloneDeep(this.formData.value.xhHoSoKyThuatRow);
    let index = newValue.findIndex(s => s.idVirtual == item.idVirtual);
    newValue.splice(index, 1);
    this.formData.patchValue({ xhHoSoKyThuatRow: newValue });
    await this.buildTableView();
  }

  async buildTableView() {
    this.viewTableDaiDien = cloneDeep(this.formData.value.xhHoSoKyThuatRow.filter(s => s.type == HSKT_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN));
    this.viewTableHoSo = cloneDeep(this.formData.value.xhHoSoKyThuatRow.filter(s => s.type == HSKT_LOAI_DOI_TUONG.HO_SO));
  }

  async downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }
}
