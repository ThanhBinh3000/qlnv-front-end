import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { HSKT_LOAI_DOI_TUONG, LOAI_BIEN_BAN, STATUS } from "src/app/constants/status";
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";
import { Subject } from "rxjs";
import { UserLogin } from "src/app/models/userlogin";
import { UserService } from "src/app/services/user.service";
import { MESSAGE } from "src/app/constants/message";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from 'lodash';
import { FileDinhKem } from "src/app/models/FileDinhKem";
import { saveAs } from 'file-saver';
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { PREVIEW } from "src/app/constants/fileType";
import { HoSoKyThuatXuatDieuChuyenService } from '../../services/dcnb-ho-so-ky-thuat.service';
import { BienBanLayMauDieuChuyenService } from '../../services/dcnb-bien-ban-lay-mau.service';

@Component({
  selector: 'app-chi-tiet-ho-so-ky-thuat-xuat-dieu-chuyen',
  templateUrl: './chi-tiet-ho-so-ky-thuat.component.html',
  styleUrls: ['./chi-tiet-ho-so-ky-thuat.component.scss']
})
export class ChiTietHoSoKyThuatXuatDieuChuyenComponent extends Base2Component implements OnInit {


  @Input() id: number;
  @Input() isView: boolean;
  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
  @Input() loaiDc: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  isViewBb: boolean;
  dataBb: any;
  isBienBan: boolean = false;
  idBienBan: number;
  loaiBienBan: string;

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


  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listDaiDienDonVi: any[] = [];
  fileDinhKem: any[] = [];
  listCanCu: any[] = [];
  listFileDinhKem: any[] = [];

  STATUS = STATUS;
  dataTable: any[] = [];
  dataTableBienBan: any[] = [
    {
      id: null,
      tenBb: "Biên bản kiểm tra ngoại quan",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_NGOAI_QUAN,
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra vận hành",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_VAN_HANH
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra hồ sơ kỹ thuật",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT
    }
  ];
  radioData = [
    { label: 'Đã đạt yêu cầu để có thể xuất hàng', value: '1', disable: false },
    { label: 'Không đạt yêu cầu', value: '0', disable: false },
  ];
  hoSoRow: any = {};
  viewTableHoSo: any[] = [];
  viewTableBienBan: any[] = [];
  bienBanRow: any = {};
  templateName = "Hồ sơ kỹ thuật";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
    // private bienBanLayMauService: QuanLyBienBanLayMauService,
    private bienBanLayMauDieuChuyenService: BienBanLayMauDieuChuyenService,
    private hoSoKyThuatXuatDieuChuyenService: HoSoKyThuatXuatDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatXuatDieuChuyenService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      ngayTao: [],
      nguoiTaoId: [],
      nguoiTao: [],
      ngaySua: [],
      nguoiSuaId: [],
      soHsktNh: [],
      idHsktNh: [],
      idBbLayMau: [],
      soBbLayMau: [],
      soBbLayMauNh: [],
      soQdGiaoNvNh: [],
      ngayTaoNh: [],
      ngayDuyetNh: [],
      maDvi: [],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      lyDo: [],
      trangThai: [],
      type: [],
      kqKiemTra: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: [],
      tenDvi: [],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      canBoTaoHoSo: [],
      canBoTaoHoSoNh: [],
      soBbKtNgoaiQuan: [],
      soBbKtVanHanh: [],
      soBbKtHskt: [],
      xhHoSoKyThuatDtl: []
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadDetail(this.id);
      }
      else {
        await this.save(true)
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail(id) {
    let res = await this.hoSoKyThuatXuatDieuChuyenService.getDetail({ id: id, type: "DCNBX" });
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.formData.patchValue(data);
      this.viewTableHoSo = [];
      this.radioData[0].disable = false;
      this.formData.value.xhHoSoKyThuatDtl.forEach(s => {
        console.log(s.trangThai, 'trangthai')
        if (s.trangThai != STATUS.DA_KY) {
          this.radioData[0].disable = true;
        }
        s.idVirtual = uuidv4();
        if (s.loaiBb === LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT) {
          s.xhHoSoKyThuatRow.forEach(s1 => {
            s1.idVirtual = uuidv4();
            if (s1.type == HSKT_LOAI_DOI_TUONG.HO_SO)
              this.viewTableHoSo.push(s1);
          })
        }
      })
    }
    if (!this.formData.value.id) {
      this.formData.patchValue({
        trangThai: STATUS.DA_DUYET_LDC
      })
      await this.save(true);
    }
  }

  async initForm() {
    let id = await this.userService.getId('HO_SO_KY_THUAT_SEQ')
    this.formData.patchValue({
      soHoSoKyThuat: `${id}/${this.formData.get('nam').value}/HSKT-CDTKVVP`,
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenNguoiTao: this.userInfo.TEN_DAY_DU,
      trangThai: "00",
      tenTrangThai: "Dự Thảo"
    });

  }

  quayLai() {
    this.showListEvent.emit();
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async save(isHideMessage?: boolean) {
    try {
      this.formData.patchValue({ type: "DCNBX" });
      let body = this.formData.value;
      let rs = await this.createUpdate(body, null, isHideMessage);
      this.formData.patchValue(rs);
    } catch (e) {
      console.log(e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToBienBan(isView: boolean, data: any) {
    this.isViewBb = isView;
    this.dataBb = data;
    this.isBienBan = true;
    /*  this.idBienBan = data.id;
      this.loaiBienBan = data.loai;
      this.isBienBan = true;*/
  }

  async backMain($event?) {
    if ($event) {
      this.id = $event;
    }
    this.isBienBan = false;
    await this.ngOnInit();
  }

  getTenLoaiBb(loaiBb: string) {
    let tenLoaiBb = "";
    switch (loaiBb) {
      case "BBKTNQ":
        tenLoaiBb = "Biên bản kiểm tra ngoại quan";
        break;
      case "BBKTVH":
        tenLoaiBb = "Biên bản kiểm tra vận hành";
        break;
      case "BBKTHSKT":
        tenLoaiBb = "Biên bản kiểm tra hồ sơ kỹ thuật";
        break;
    }
    return tenLoaiBb;
  }

  async saveDtl(data: any) {
    let dataUpdate = this.formData.value.xhHoSoKyThuatDtl.map(s => {
      if (s.idVirtual === data.idVirtual) {
        return data;
      }
      return s;
    });
    this.formData.patchValue({ id: data.id, xhHoSoKyThuatDtl: dataUpdate });
    await this.save();
  }

  async themHoSo() {
    // if (this.hoSoRow.ten && this.hoSoRow.loai) {
    console.log(this.hoSoRow)
    this.hoSoRow.type = HSKT_LOAI_DOI_TUONG.HO_SO;
    this.hoSoRow.idVirtual = uuidv4();
    let newValue = cloneDeep(this.formData.value.xhHoSoKyThuatDtl);
    let hsktDtl = newValue.find(s => (s.loaiBb == LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT && s.thoiDiemLap == 'XUAT'));
    hsktDtl.xhHoSoKyThuatRow = [...hsktDtl.xhHoSoKyThuatRow, this.hoSoRow];
    this.formData.patchValue({ xhHoSoKyThuatDtl: newValue });
    await this.buildTableView();
    console.log(this.hoSoRow)
    this.hoSoRow = {};
  }

  async nhapLaiHoSo() {
    this.hoSoRow = {};
  }

  async suaHoSo(item) {
    await this.buildTableView();
    this.viewTableHoSo.forEach(s => s.edit = false);
    let currentRow = this.viewTableHoSo.find(s => s.idVirtual == item.idVirtual);
    currentRow.edit = true;
  }

  async luuHoSo(item) {
    let newValue = cloneDeep(this.formData.value.xhHoSoKyThuatDtl);
    let hsktDtl = newValue.find(s => (s.loaiBb == LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT && s.thoiDiemLap == 'XUAT'));
    let index = hsktDtl.xhHoSoKyThuatRow.findIndex(s => s.idVirtual == item.idVirtual);
    item.edit = false;
    hsktDtl.xhHoSoKyThuatRow.splice(index, 1, item);
    this.formData.patchValue({ xhHoSoKyThuatDtl: newValue });
    await this.buildTableView();
  }

  async huySuaHoSo() {
    await this.buildTableView();
    this.viewTableHoSo.forEach(s => s.edit = false);
  }

  async xoaHoSo(item) {
    let newValue = cloneDeep(this.formData.value.xhHoSoKyThuatDtl);
    let hsktDtl = newValue.find(s => (s.loaiBb == LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT && s.thoiDiemLap == 'XUAT'));
    let index = hsktDtl.xhHoSoKyThuatRow.findIndex(s => s.idVirtual == item.idVirtual);
    hsktDtl.xhHoSoKyThuatRow.splice(index, 1);
    this.formData.patchValue({ xhHoSoKyThuatDtl: newValue });
    await this.buildTableView();
  }

  async buildTableView() {
    let listHoSo = [];
    this.formData.value.xhHoSoKyThuatDtl.forEach(s => {
      if (s.loaiBb == LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT) {
        let hoSo = s.xhHoSoKyThuatRow.filter(s => s.type == HSKT_LOAI_DOI_TUONG.HO_SO);
        listHoSo = listHoSo.concat(hoSo);
      }
      s.fileName = s.fileDinhKem[0]?.fileName;
    })
    listHoSo.forEach(s => {
      s.fileName = s.fileDinhKem[0]?.fileName;
    })
    this.viewTableHoSo = cloneDeep(listHoSo);

    //bienban
    this.viewTableBienBan = cloneDeep(this.formData.value.xhHoSoKyThuatDtl);
    this.viewTableBienBan.forEach(s => {
      s.fileName = s.fileDinhKem[0]?.fileName
    });
  }

  async getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    console.log(fileList, 'fileList')
    if (fileList) {
      this.hoSoRow.fileName = fileList[0].name

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
          this.hoSoRow.fileDinhKem = [...[], fileDinhKem]
          this.hoSoRow.fileName = resUpload.filename;
        });
    }
  }

  async downloadFile(item: FileDinhKem) {
    try {
      if (item) {
        this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
          saveAs(blob, item.fileName);
        });
      } else {
        this.notification.error(MESSAGE.ERROR, 'File không tồn tại');
      }
    } catch (e) {
      console.log(e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  changeKqKiemtra($event) {
    this.formData.patchValue({ kqKiemTra: $event });
  }

  async openDialogBbLayMauXuat() {
    let body = {
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
      trangThai: STATUS.DA_DUYET_LDCC,
    }
    let res = await this.bienBanLayMauDieuChuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBanGiaoMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu/bàn giao mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBanGiaoMau,
        dataHeader: ['Số biên bản', 'Loại hàng hóa'],
        dataColumn: ['soBienBan', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      console.log(dataChose, 'dataChose')
      if (dataChose) {
        this.formData.patchValue({
          idBbLayMau: dataChose.id,
          soBbLayMau: dataChose.soBienBan
        });
      }
    });
  };

  async inBienBan(id, type, loai) {
    await this.hoSoKyThuatXuatDieuChuyenService.preview({
      id: id,
      type: type,
      loai: loai
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }
}
