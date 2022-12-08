import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import {
  QuanLyBienBanChuanBiKhoService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanChuanBiKho.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

export interface tieuChuanKyThuat {
  tenChiTieu: string;
  chiTieuCha: boolean;
  chungLoaiHangHoa?: string;
  mucYeuCauNhap?: number;
  mucYeuCauXuat?: number;
}

@Component({
  selector: 'app-thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia',
  templateUrl: './thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component.html',
  styleUrls: ['./thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component.scss']
})
export class ThongTinQuanLyQuyChuanKyThuatQuocGiaComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  formData: FormGroup;
  listHopDong: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  radioApDung: string = 'vthh';

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    public globals: Globals,
    private fb: FormBuilder,
    private bienBanChuanBiKhoService: QuanLyBienBanChuanBiKhoService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.typeVthh = '02';
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = 'Dự thảo';

      this.initForm();
      await Promise.all([
      ]);
      await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }


  initForm(): void {
    this.formData = this.fb.group({
      soVanBan: [null],
      ngayKy: [null],
      ngayHieuLuc: [null],
      soHieuQuyChuan: [null],
      apDungTai: [null],
      idVanBanThayThe: [null],
      soVanBanThayThe: [null],
      loaiApDung: [null],
      danhSachApDung: [],
      trichYeu: [null],
      thoiGianLuuKhoToiDa: [null],
      trangThai: [null],
      trangThaiHl: [null],
      fileDinhKem: [],
      tieuChuanKyThuat: []
    });
  }


  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.bienBanChuanBiKhoService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.initForm();
        }
      }
    } else {
      let id = await this.userService.getId("KHCN_QUY_CHUAN_QG_HDR_SEQ")
      this.formData.patchValue({
        soVanBan: id,
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        diaChiDvi: this.userInfo.DON_VI.diaChi,
      })
    }
  }



  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "chiTiets": this.detail.chiTiets,
        "htBaoQuan": this.formData.get("hinhThucBaoQuan").value,
        "id": this.detail.id,
        "keToanDonVi": this.formData.get("keToanDonVi").value,
        "ketLuan": this.formData.get("ketLuan").value,
        "kyThuatVien": this.formData.get("kyThuatVienBaoQuan").value,
        "loaiHinhKho": this.formData.get("loaiHinhKho").value,
        "maDiemKho": this.formData.get("diemKho").value,
        "maNganKho": this.formData.get("nganKho").value,
        "maNganLo": this.formData.get("loKho").value,
        "maNhaKho": this.formData.get("nhaKho").value,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "hopDongId": this.detail.hopDongId,
        "soHopDong": this.formData.get("soHopDong").value,
        "nam": null,
        "ngayNghiemThu": this.formData.get("ngayNghiemThu").value ? dayjs(this.formData.get("ngayNghiemThu").value).format("YYYY-MM-DD") : null,
        "ptBaoQuan": this.formData.get("phuongThucBaoQuan").value,
        "qdgnvnxId": this.formData.get("soQD").value,
        "so": null,
        "soBienBan": this.formData.get("soBienBan").value,
        "thuKho": this.formData.get("thuKho").value,
        "thuTruongDonVi": this.formData.get("thuTruongDonVi").value,
        "thucNhap": this.formData.get("thucNhap").value,
        "tongSo": this.formData.get("tongSo").value,
        "maDvi": this.detail.maDvi,
      };
      if (this.id > 0) {
        let res = await this.bienBanChuanBiKhoService.update(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.bienBanChuanBiKhoService.create(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.bienBanChuanBiKhoService.approve(
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

  pheDuyet() {
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.bienBanChuanBiKhoService.approve(
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
            trangThai: this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.bienBanChuanBiKhoService.approve(
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


  deleteData(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.detail.chiTiets =
          this.detail?.chiTiets.filter(
            (cbKho) => cbKho.idVirtual !== id,
          );
      },
    });
  }


}
