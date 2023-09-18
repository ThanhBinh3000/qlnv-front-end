import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HoSoKyThuatService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoKyThuat.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from "../../../../../../components/base/base.component";
import { FormBuilder, Validators } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from '../../../../../../constants/config';
import { HelperService } from '../../../../../../services/helper.service';
import { DatePipe } from '@angular/common';
import { LOAI_BIEN_BAN, STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { ChiTietThongTinChaoGia } from "../../../../../../models/DeXuatKeHoachMuaTrucTiep";
import { HoSoTaiLieu } from "../../../../../../models/HoSoKyThuatNhapKhac";
import { saveAs } from 'file-saver';
import { FileDinhKem } from "../../../../../../models/FileDinhKem";
import { HoSoKyThuatNkService } from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/hoSoKyThuatNk.service";
import {
  QuanLyBienBanLayMauKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyBienBanLayMauKhac.service";

@Component({
  selector: 'app-them-moi-ho-so-ky-thuat',
  templateUrl: './them-moi-ho-so-ky-thuat.component.html',
  styleUrls: ['./them-moi-ho-so-ky-thuat.component.scss']
})
export class ThemMoiHoSoKyThuatComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  dataTableChange = new EventEmitter<any>();

  isBienBan: boolean = false;
  idBienBan: number;
  loaiBienBan: string;
  previewName: string = 'nk_ho_so_kt';

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
      fileDinhKems: [],
      loai: LOAI_BIEN_BAN.BB_KTRA_NGOAI_QUAN,
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra vận hành",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: [],
      loai: LOAI_BIEN_BAN.BB_KTRA_VAN_HANH
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra hồ sơ kỹ thuật",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: [],
      loai: LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT
    }
  ];
  rowItem: HoSoTaiLieu = new HoSoTaiLieu();
  dataEdit: { [key: string]: { edit: boolean; data: HoSoTaiLieu } } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
    private hoSoKyThuatService: HoSoKyThuatNkService,
    private bienBanLayMauService: QuanLyBienBanLayMauKhacService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      nam: [dayjs().get('year'), [Validators.required]],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      soBbLayMau: [null, [Validators.required]],
      soHoSoKyThuat: [null, [Validators.required]],
      idQdGiaoNvNh: [null, [Validators.required]],
      soQdGiaoNvNh: [null, [Validators.required]],
      soHd: [],
      ldoTuchoi: [],
      trangThai: [],
      tenTrangThai: [],
      maLoKho: [],
      maNganKho: [],
      maNhaKho: [],
      maDiemKho: [],
      tenLoKho: [],
      tenNganKho: [],
      tenNguoiTao: [],
      ngayPduyet: [],
      idBbLayMau: []
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hoSoKyThuatService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, data);
        console.log(data, "222")
        if (data.idBbLayMau) {
          await this.buldingDataBbLayMau(data)
        }
        if (data.children) {
          this.dataTable = data.children
          this.updateEditCache()
        }
        if (data.listHoSoBienBan) {
          this.dataTableBienBan.forEach(item => {
            let bb = data.listHoSoBienBan.filter(x => x.loaiBb == item.loai);
            console.log(data.listHoSoBienBan, bb);
            if (bb.length > 0) {
              item.id = bb[0].id
              item.trangThai = bb[0].trangThai
              item.tenTrangThai = bb[0].tenTrangThai
              item.fileDinhKems = bb[0].fileDinhKems ? bb[0].fileDinhKems.find(x => x.fileType == 'FILE_DINH_KEM') : ""
            }
          });
          console.log(this.dataTableBienBan);
        }
      }
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

  async openDialogBbLayMau() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.DA_DUYET_LDCC,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.bienBanLayMauService.search(body);
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
      if (dataChose) {
        console.log(dataChose, "123")
        this.formData.patchValue({
          soBbLayMau: dataChose.soBienBan,
          soQdGiaoNvNh: dataChose.soQdGiaoNvNh,
          idQdGiaoNvNh: dataChose.idQdGiaoNvNh,
          maLoKho: dataChose.maLoKho,
          maNganKho: dataChose.maNganKho,
          maNhaKho: dataChose.maNhaKho,
          maDiemKho: dataChose.maDiemKho,
          tenLoKho: dataChose.tenLoKho,
          tenNganKho: dataChose.tenNganKho,
          idBbLayMau: dataChose.id
        });
      }
    });
  };

  async buldingDataBbLayMau(data: any) {
    console.log(data, "bien ban")
    let res = await this.bienBanLayMauService.getDetail(data.idBbLayMau);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data) {
        this.formData.patchValue({
          soBbLayMau: data.soBienBan,
          soQdGiaoNvNh: data.soQdGiaoNvNh,
          idQdGiaoNvNh: data.idQdGiaoNvNh,
          maLoKho: data.maLoKho,
          maNganKho: data.maNganKho,
          maNhaKho: data.maNhaKho,
          maDiemKho: data.maDiemKho,
          tenLoKho: data.tenLoKho,
          tenNganKho: data.tenNganKho,
          idBbLayMau: data.id
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_TP == STATUS.CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CUC,
          };
          console.log(this.detail, "body")
          let res =
            await this.hoSoKyThuatService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.loadChiTiet(this.id)
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

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = this.formData.value;
    body.fileDinhkems = this.fileDinhKem;
    body.children = this.dataTable;
    if (body.listHoSoBienBan != undefined) {

    } else {
      // body.listHoSoBienBan = this.dataTableBienBan
    }
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.hoSoKyThuatService.update(body);
    } else {
      res = await this.hoSoKyThuatService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.id = res.data.id;
        await this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
          }
          let res = await this.hoSoKyThuatService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.THAO_TAC_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  redirectToBienBan(isView: boolean, data: any) {
    this.idBienBan = data.id;
    this.loaiBienBan = data.loai;
    this.isBienBan = true;
  }

  async backMain() {
    this.isBienBan = false;
    this.ngOnInit();
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          if (item) {
            item.fileName = resUpload.filename;
            item.fileSize = resUpload.size;
            item.fileUrl = resUpload.url;
          }
          else {
            if (!type) {
              if (!this.rowItem.fileDinhKems) {
                this.rowItem.fileDinhKems = new FileDinhKem();
              }
              this.rowItem.fileDinhKems.fileName = resUpload.filename;
              this.rowItem.fileDinhKems.fileSize = resUpload.size;
              this.rowItem.fileDinhKems.fileUrl = resUpload.url;
              this.rowItem.fileDinhKems.idVirtual = new Date().getTime();
            } else {
              // if (!type.fileDinhKem) {
              //   type.fileDinhKem = new FileDinhKem();
              // }
              type.fileDinhKems.fileName = resUpload.filename;
              type.fileDinhKems.fileSize = resUpload.size;
              type.fileDinhKems.fileUrl = resUpload.url;
              type.fileDinhKems.idVirtual = new Date().getTime();
            }

          }
        });
    }
  }

  addRow(): void {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.rowItem.hoSoKyThuatId = this.id;
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new HoSoTaiLieu();
    this.emitDataTable();
    this.updateEditCache()
  }

  clearItemRow() {
    // let soLuong = this.rowItem.soLuong;
    this.rowItem = new HoSoTaiLieu();
    // this.rowItem.soLuong = soLuong;
    this.rowItem.id = null;
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
        // this.danhSachCtietDtl = [...this.danhSachCtietDtl, item];
      });
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

}
