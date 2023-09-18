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
import { HoSoKyThuatBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/HoSoKyThuatBdg.service';
import dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { BienBanLayMauService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-lay-mau';

@Component({
  selector: 'app-thong-tin-ho-so-ky-thuat',
  templateUrl: './thong-tin-ho-so-ky-thuat.component.html',
  styleUrls: ['./thong-tin-ho-so-ky-thuat.component.scss']
})
export class ThongTinHoSoKyThuatComponent extends Base2Component implements OnInit {

  @Input() loaiDc: string
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
    private bienBanLayMauService: BienBanLayMauService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private hoSoKyThuatBdgService: HoSoKyThuatBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatBdgService);

    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      ngayTao: [],
      nguoiTaoId: [],
      tenNguoiTao: [],
      ngaySua: [],
      nguoiSuaId: [],
      soHsktNh: [],
      idHsktNh: [],
      idBbLayMau: [],
      soBbLayMau: [],
      soBbLayMauNh: [],
      soQdGiaoNvNh: [],
      ngayTaoNh: [dayjs().format('YYYY-MM-DD')],
      ngayDuyetNh: [],
      maDvi: [],
      maDiaDiem: [],
      loaiVthh: [],
      cloaiVthh: [],
      lyDo: [],
      type: ["DCNBN"],
      loaiDc: ["DCNB"],
      kqKiemTra: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenDvi: [],
      tenCuc: [],
      tenChiCuc: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      canBoTaoHoSo: [],
      soBbKtNgoaiQuan: [],
      soBbKtVanHanh: [],
      soBbKtHskt: [],
      xhHoSoKyThuatDtl: []
    });
  }

  async ngOnInit() {
    try {
      let id = await this.userService.getId('HO_SO_KY_THUAT_SEQ')
      this.formData.patchValue({
        soHsktNh: `${id}/${this.formData.get('nam').value}/HSKT-CDTKVVP`,
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        tenNguoiTao: this.userInfo.TEN_DAY_DU,
      });

      await this.spinner.show();
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadDetail(this.id);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail(id) {
    let res = await this.hoSoKyThuatBdgService.getDetail({ id: id, type: "DCNBX" });
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

  async save() {
    try {
      this.formData.patchValue({ type: 'DCNBX' });
      let body = this.formData.value;
      let rs = await this.createUpdate(body);
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

  async openDialogQD() {
    await this.spinner.show();
    let listDanhSachQuyetDinh = []
    let body = {
      trangThai: STATUS.BAN_HANH,
      // isVatTu: true,
      // loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI,
      type: "01"
    }
    let resSoDX = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: listDanhSachQuyetDinh,
        dataHeader: ['Số quyết định'],
        dataColumn: ['soQdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdDcCuc: data.soQdinh,
          ngayQdDcCuc: data.ngayKyQdinh,
          qdDcCucId: data.id,
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          soLuongQdDcCuc: "",
          dviTinh: "",
        });
        // await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogBBLMGBGM() {
    if (this.isView) return
    await this.spinner.show();
    let dsBB = []
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc,
      qdccId: this.formData.value.qdccId,
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho
    }
    let res = await this.bienBanLayMauService.getDanhSach(body)
    if (res.msg == MESSAGE.SUCCESS) {
      dsBB = res.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách BB lấy mẫu/bàn giao mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsBB,
        dataHeader: ['Số BB lấy mẫu/bàn giao mẫu'],
        dataColumn: ['soBb']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        console.log('openDialogQD', data)
        this.formData.patchValue({
          soBbLayMauNh: data.soBb,
          idBbLayMau: data.id,

        });
      }
    });
  }
}

