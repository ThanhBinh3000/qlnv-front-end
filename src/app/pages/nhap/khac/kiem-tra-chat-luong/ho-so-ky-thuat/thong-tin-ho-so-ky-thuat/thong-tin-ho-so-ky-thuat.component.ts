import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
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
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LOAI_BIEN_BAN } from 'src/app/constants/status';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { BienBanGuiHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/bienBanGuiHang.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { HelperService } from 'src/app/services/helper.service';
import { HoSoBienBanService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoBienBan.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {
  HoSoKyThuatNkService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/hoSoKyThuatNk.service";
import {HoSoBienBanNkService} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/hoSoBienBanNk.service";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {FILETYPE} from "../../../../../../constants/fileType";
import {
  QuanLyBienBanLayMauKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyBienBanLayMauKhac.service";

@Component({
  selector: 'app-thong-tin-ho-so-ky-thuat',
  templateUrl: './thong-tin-ho-so-ky-thuat.component.html',
  styleUrls: ['./thong-tin-ho-so-ky-thuat.component.scss']
})
export class ThongTinHoSoKyThuatComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() idHoSoKyThuat: number;
  @Input() loai: string;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

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


  listDaiDien: any[] = [];

  listCanCu: any[] = [];
  listFileDinhKem: any[] = [];
  listHopDong: any[] = [];
  title: string;
  sufffix: string;
  LOAI_BIEN_BAN = LOAI_BIEN_BAN;
  fileDinhKems: FileDinhKem[] = [];
  canCuPhapLy: FileDinhKem[] = [];
  taiLieuBoSung: FileDinhKem[] = [];
  listFile: any[] = []


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hoSoKyThuatService: HoSoKyThuatNkService,
    private bienBanLayMauService: QuanLyBienBanLayMauKhacService,
    private bienBanGuiHangService: BienBanGuiHangService,
    private hoSoBienBanService: HoSoBienBanNkService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoBienBanService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: [],
      tenDvi: ['',],
      maQhns: ['',],
      soBienBan: [],
      soHoSoKyThuat: [],
      soBbLayMau: [],
      soQdGiaoNvNh: ['', [Validators.required]],
      idQdGiaoNvNh: ['', [Validators.required]],
      ngayHd: ['',],
      soBienBanGuiHang: [''],
      thoiGianGiaoNhan: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      dviTinh: [''],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      lyDoTuChoi: [],
      diaDiemKiemTra: [],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      noiDung: [],
      soSerial: [],
      kyMaHieu: [],
      ppLayMau: [],
      soLuongNhap: [],
      tgianNhap: [],
      tgianBsung: [],
      tgianKtra: [],
      loaiBb: [''],
      ketLuan: [''],
      idBbLayMau: ['']
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadTitle()
      ]);
      debugger
      if (this.id) {
        await this.getDetail(this.id);
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

  async getDetail(id) {
    if (id > 0) {
      let res = await this.hoSoBienBanService.getDetail(id);
      if (res.data) {
        const data = res.data;
        if (data.fileDinhKems.length > 0) {
          data.fileDinhKems.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.fileDinhKems.push(item)
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.canCuPhapLy.push(item)
            } else if (item.fileType == FILETYPE.FILE_TAI_LIEU_SO_SUNG) {
              this.taiLieuBoSung.push(item)
            }
          })
        }
        this.helperService.bidingDataInFormGroup(this.formData, data);
        debugger
        if(data.idBbLayMau){
          await this.buldingDataBbLayMau(data)
        }
        console.log("1", this.formData.value)
        this.listDaiDien = data.children;
      }
    }
  }

  async buldingDataBbLayMau(data: any){
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
          tenCloaiVthh: data.tenCloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          soLuongNhap: data.soLuongMau,
          diaDiemKiemTra: data.diaDiemLayMau,
          idBbLayMau: data.id
        });
      }
      console.log("2", this.formData.value)
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async initForm() {
    let res = await this.hoSoKyThuatService.getDetail(this.idHoSoKyThuat);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      // const dataBbLm = await this.bienBanLayMauService.getDetail(data.idBbLayMau);
      let id = await this.userService.getId('NH_HO_SO_BIEN_BAN_SEQ');
      this.formData.patchValue({
        soBienBan: `${id}/${this.formData.get('nam').value}/${this.sufffix}`,
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        tenNguoiTao: this.userInfo.TEN_DAY_DU,
        trangThai: "00",
        tenTrangThai: "Dự Thảo",
        soHoSoKyThuat: data.soHoSoKyThuat,
        soBbLayMau: data.soBbLayMau,
        soQdGiaoNvNh: data.soQdGiaoNvNh,
        idQdGiaoNvNh: data.idQdGiaoNvNh,
        soHd: data.soHd,
        ngayHd: data.ngayHd,
        loaiBb: this.sufffix
      })
      if(data.idBbLayMau){
        await this.buldingDataBbLayMau(data)
      }
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }


  addDaiDien(data, type) {
    let item = {
      "daiDien": data.daiDien,
      "loaiDaiDien": type,
    }
    this.listDaiDien = [
      ...this.listDaiDien
      , item
    ]
  }

  xoaDaiDien(index) {
    this.listDaiDien = this.listDaiDien.filter((x, i) => i != index);
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.STATUS.DA_KY,
          };
          let res =
            await this.hoSoBienBanService.approve(
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
      },
    });
  }



  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet: boolean) {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      if (this.fileDinhKems.length > 0) {
        this.fileDinhKems.forEach(item => {
          item.fileType = FILETYPE.FILE_DINH_KEM
          this.listFile.push(item)
        })
      }
      if (this.canCuPhapLy.length > 0) {
        this.canCuPhapLy.forEach(element => {
          element.fileType = FILETYPE.CAN_CU_PHAP_LY
          this.listFile.push(element)
        })
      }
      if (this.taiLieuBoSung.length > 0) {
        this.taiLieuBoSung.forEach(element => {
          element.fileType = FILETYPE.FILE_TAI_LIEU_SO_SUNG
          this.listFile.push(element)
        })
      }
      body.fileDinhKems = this.listFile;
      body.children = this.listDaiDien;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.hoSoBienBanService.update(body);
      } else {
        res = await this.hoSoBienBanService.create(body);
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  print() {

  }

  async openBienBanGuiHang() {
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

  }

  getNameFile($event) {

  }
}
