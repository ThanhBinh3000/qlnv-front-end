import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { HoSoKyThuatService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoKyThuat.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import {HSKT_LOAI_DOI_TUONG, LOAI_BIEN_BAN, STATUS} from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {saveAs} from 'file-saver';
import {v4 as uuidv4} from "uuid";
import {Validators} from "@angular/forms";
@Component({
  selector: 'app-them-moi-ho-so-ky-thuat',
  templateUrl: './them-moi-ho-so-ky-thuat.component.html',
  styleUrls: ['./them-moi-ho-so-ky-thuat.component.scss']
})
export class ThemMoiHoSoKyThuatComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  isViewChild: boolean;
  isBienBan: boolean = false;
  idBienBan: number;
  loaiBienBan: string;
  previewNameBienBan: string;

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
      previewName: 'bien_ban_kiem_tra_ngoai_quan'
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra vận hành",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_VAN_HANH,
      previewName: 'bien_ban_kiem_tra_van_hanh'
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra hồ sơ kỹ thuật",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT,
      previewName: 'bien_ban_kiem_tra_hskt'
    }
  ];
  previewName: string = 'ho_so_ky_thuat';
  hoSoRow: any = {};
  hoSoRowEdit:any[] = [];
  viewTableHoSo: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    public userService: UserService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private bienBanLayMauService: QuanLyBienBanLayMauService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      tenNguoiTao: [''],
      nam: [dayjs().get('year')],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      soBbLayMau: [null],
      soHoSoKyThuat: [null],
      idQdGiaoNvNh: [null],
      soQdGiaoNvNh: [null],
      soHd: [null],
      ldoTuchoi: [],
      trangThai: [],
      tenTrangThai: [],
      ngayPduyet: [],
      ngayKyHd: [],
      tenNganLoKho: [],
      tenNhaKho: [],
      tenDiemKho: [],
      diaDiemKho: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      soLuong: [],
      dvt: [],
      tenChiCuc: [],
      lanhDaoChiCuc: [],
      truongPhong: [],
      lanhDaoCuc: [],
      dviCungCap: [],
      idBbLayMau: [],
      loaiVthh: [],
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
        this.formData.patchValue({
          soHd: data.qdGiaoNvuNhapxuatHdr?.hopDong?.soHd,
          ngayKyHd: data.qdGiaoNvuNhapxuatHdr?.hopDong?.ngayKy,
          dviCungCap: data.qdGiaoNvuNhapxuatHdr?.hopDong?.tenNhaThau,
          tenLoaiVthh: data.qdGiaoNvuNhapxuatHdr?.tenLoaiVthh,
          loaiVthh: data.qdGiaoNvuNhapxuatHdr?.loaiVthh,
          tenCloaiVthh: data.qdGiaoNvuNhapxuatHdr?.tenCloaiVthh,
          dvt: data.qdGiaoNvuNhapxuatHdr?.donViTinh,
          tenNganLoKho: data.bienBanLayMau?.tenNganLoKho,
          tenNhaKho: data.bienBanLayMau?.tenNhaKho,
          tenDiemKho: data.bienBanLayMau?.tenDiemKho,
          tenChiCuc: data.bienBanLayMau?.tenDvi,
        })
        if (this.formData.value.loaiVthh.startsWith('0205') || this.formData.value.loaiVthh.startsWith('0206')){
          this.dataTableBienBan[1].tenBb = 'Biên bản hạ thủy kiểm tra sự hoạt động của xuồng';
        }
        this.dataTable = data.children;
        if (data.listHoSoBienBan) {
          this.dataTableBienBan.forEach(item => {
            let bb = data.listHoSoBienBan.filter(x => x.loaiBb == item.loai);
            if (bb.length > 0) {
              item.id = bb[0].id
              item.trangThai = bb[0].trangThai
              item.tenTrangThai = bb[0].tenTrangThai
            }
          });
        }
      }
    }
  }

  async initForm() {
    let maBb = 'HSKT-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('HO_SO_KY_THUAT_SEQ')
    this.formData.patchValue({
      soHoSoKyThuat: `${id}/${this.formData.get('nam').value}/${maBb}`,
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
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu/bàn giao mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBanGiaoMau,
        dataHeader: ['Số biên bản', 'Ngăn/Lô kho', 'Nhà Kho', 'Điểm kho'],
        dataColumn: ['soBienBan', 'tenNganLoKho', 'tenNhaKho', 'tenDiemKho'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        this.formData.patchValue({
          soBbLayMau: dataChose.soBienBan,
          idBbLayMau: dataChose.id,
          soHd: dataChose.soHd,
          soQdGiaoNvNh: dataChose.soQdGiaoNvNh,
          idQdGiaoNvNh: dataChose.idQdGiaoNvNh,
          tenNganLoKho: dataChose.tenNganLoKho,
          tenNhaKho: dataChose.tenNhaKho,
          tenDiemKho: dataChose.tenDiemKho,
          tenChiCuc: dataChose.tenDvi,
        });
      }
    });
  };

  tuChoi() {
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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
            trangThai: this.detail.trangThai == STATUS.CHO_DUYET_TP ? STATUS.TU_CHOI_TP : STATUS.TU_CHOI_LDC,
          };
          let res =
            await this.hoSoKyThuatService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = this.formData.value;
    body.fileDinhkems = this.fileDinhKem;
    body.children = this.dataTable;
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
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.id = res.data.id;
          this.formData.get('id').setValue(res.data.id);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator(isGuiDuyet) {
    if(isGuiDuyet) {
        this.formData.controls['soQdGiaoNvNh'].setValidators([Validators.required]);
        this.formData.controls['soBbLayMau'].setValidators([Validators.required]);
    } else {
      Object.keys(this.formData.controls).forEach(key => {
        const control = this.formData.controls[key];
        control.clearValidators();
        control.updateValueAndValidity();
      });
      this.formData.updateValueAndValidity();
    }
  }

  async pheDuyet() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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
    this.previewNameBienBan = data.previewName;
    this.isViewChild = isView;
  }

  async backMain() {
    this.isBienBan = false;
    this.ngOnInit();
  }

  async openDialogSoQd() {
    let body = {
      "loaiVthh": this.loaiVthh,
      "trangThai": this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhapHangService.layTatCaQdGiaoNvNh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listSoQuyetDinh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG', ' Chủng loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        this.formData.patchValue({
          soHd: dataChose.hopDong?.soHd,
          ngayKyHd: dataChose.hopDong?.ngayKy,
          dviCungCap: dataChose.hopDong?.tenNhaThau,
          soQdGiaoNvNh: dataChose.soQd,
          idQdGiaoNvNh: dataChose.id,
          tenLoaiVthh: dataChose.tenLoaiVthh,
          loaiVthh: dataChose.loaiVthh,
          tenCloaiVthh: dataChose.tenCloaiVthh,
          dvt: dataChose.donViTinh,
        });
        if (this.formData.value.loaiVthh.startsWith('0205') || this.formData.value.loaiVthh.startsWith('0206')){
          this.dataTableBienBan[1].tenBb = 'Biên bản hạ thủy kiểm tra sự hoạt động của xuồng';
        }
        this.listBanGiaoMau = dataChose.listBienBanLayMau;
      }
    });
  };

  async getNameFile(event?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
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

  async getNameFileEdit(i:number, event?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.hoSoRowEdit[i].fileName = fileList[0].name
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
          this.hoSoRowEdit[i].fileDinhKem = [...[], fileDinhKem]
          this.hoSoRowEdit[i].fileName = resUpload.filename;
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

  async themHoSo() {
    if (this.hoSoRow.tenHoSo
      && this.hoSoRow.loaiTaiLieu
      && this.hoSoRow.soLuong
      && this.hoSoRow.fileName) {
      this.dataTable = [...this.dataTable, this.hoSoRow]
      this.hoSoRow = {};
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không được bỏ trống các trường có dấu *');
    }
  }

  async nhapLaiHoSo() {
    this.hoSoRow = {};
  }

  async suaHoSo(i) {
    this.dataTable.forEach(s => s.edit = false);
    this.dataTable[i].edit = true;
    this.hoSoRowEdit[i] = cloneDeep(this.dataTable[i]);
  }

  async luuHoSo(i) {
    this.hoSoRowEdit[i].edit = false;
    this.dataTable.splice(i, 1, this.hoSoRowEdit[i]);
  }

  async huySuaHoSo() {
    this.dataTable.forEach(s => s.edit = false);
  }

  async xoaHoSo(i) {
    this.dataTable.splice(i, 1);
  }
}
