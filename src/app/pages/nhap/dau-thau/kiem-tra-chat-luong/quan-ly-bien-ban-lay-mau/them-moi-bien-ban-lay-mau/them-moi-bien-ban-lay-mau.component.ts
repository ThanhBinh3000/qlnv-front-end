import { L, M } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import {HSKT_LOAI_DOI_TUONG, STATUS} from 'src/app/constants/status';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import { isEmpty } from 'lodash';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {cloneDeep} from 'lodash';
@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() loaiVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  maSuffix: string = '/BBLM-CCDTVP';
  viewTableDaiDien: any[] = [];
  listFileDinhKemBb: any[] = [];
  listFileDinhKemAnh: any[] = [];
  listCcPhapLy: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  userInfo: UserLogin;
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listDiaDiemNhap: any[] = [];
  listBbNhapDayKho: any[] = [];

  bienBanLayMau: any;
  maBb: any;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: any[] = [];
  chiTieuChatLuongs: any[] = [];
  listBienBan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBienBanDayKho: any[] = [];
  listHopDong: any[] = [];
  listNam: any[] = [];
  capCuc: string = '2';
  capChiCuc: string = '3';
  previewName: string = '';
  listHangHoa: any[] = [];
  listDaiDien: any[] = [
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '2'
    },
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '3'
    }
  ];
  STATUS = STATUS;
  daiDienRow: any = {};
  daiDienRowEdit: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
    private router: Router,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    public userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year')],
      soBienBan: [''],
      tenDvi: [''],
      maDvi: [''],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemGiaoNvNh: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      soQdGiaoNvNh: [''],
      ngayQdGiaoNvNh: [''],
      idQdGiaoNvNh: [''],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      dviKiemNghiem: ['Phòng KTBQ'],
      soBbNhapDayKho: [''],
      idBbNhapDayKho: [''],
      diaDiemLayMau: [''],

      soLuongMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: [''],
      tenNguoiTao: [''],
      soBbGuiHang: [''],
      idBbGuiHang: [''],
      dviCungCap: [''],
      ngayNhapDayKho: [''],
      tenNganLoKho: [''],
      tenNguoiPduyet: [''],
      truongBpKtbq: [''],
      dvt: [''],
      kyHieuSeri: [''],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
    if (!this.loaiVthh.startsWith('02')) {
      this.formData.patchValue({
        dvt: 'kg'
      })
    }
    await Promise.all([
      this.loadLoaiBienBan(),
    ]);
    if (this.id > 0) {
      await this.loadBienbanLayMau();
    }
    else {
      await this.initForm();
    }
  }

  isDisableField() {
    if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async initForm() {
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      loaiBienBan: this.listBienBan[0].ma,
      soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      tenNguoiTao: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
    if (!this.loaiVthh.startsWith('02')){
      this.formData.patchValue({
        dviKiemNghiem: 'Phòng KTBQ'
      });
    }
  }

  async save(isGuiDuyet?: boolean) {
    this.spinner.show();
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.spinner.hide();
      return;
    }
    if (isGuiDuyet) {
      if(this.listFileDinhKemBb.length <= 0) {
        this.notification.error(MESSAGE.ERROR, 'File đính kèm biên bản đã ký không được để trống.');
        this.spinner.hide();
        return;
      }
      if(this.listFileDinhKemAnh.length <= 0) {
        this.notification.error(MESSAGE.ERROR, 'File đính kèm ảnh chụp mẫu đã niêm phong không được để trống.');
        this.spinner.hide();
        return;
      }
      if (this.phuongPhapLayMaus.filter(item => item.checked).length <= 0) {
        this.notification.error(MESSAGE.ERROR, 'Phương pháp lấy mẫu không được để trống.');
        this.spinner.hide();
        return;
      }
    }
    let body = this.formData.value;
    body.listFileDinhKemBb = this.listFileDinhKemBb;
    body.listFileDinhKemAnh = this.listFileDinhKemAnh;
    body.listCcPhapLy = this.listCcPhapLy;
    body.chiTiets = this.viewTableDaiDien;
    body.ppLayMau = this.phuongPhapLayMaus.filter(item => item.checked).map(f => `${f.id}-${f.giaTri}`).join(",")
    body.chiTieuKiemTra = this.chiTieuChatLuongs.filter(item => item.checked).map(f => `${f.id}-${f.giaTri}`).join(";")
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.bienBanLayMauService.update(body);
    } else {
      res = await this.bienBanLayMauService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.id = res.data.id;
          this.formData.get('id').setValue(res.data.id);
        }
        this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }

  setValidator(isGuiDuyet) {
    if(isGuiDuyet) {
      if (this.loaiVthh.startsWith('02')) {
        this.formData.controls['soBbNhapDayKho'].clearValidators();
        this.formData.controls['idBbNhapDayKho'].clearValidators();
        this.formData.controls['soBbGuiHang'].setValidators([Validators.required]);
        this.formData.controls['idBbGuiHang'].setValidators([Validators.required]);
        this.formData.controls['truongBpKtbq'].setValidators([Validators.required]);
        this.formData.controls['soLuongMau'].setValidators([Validators.required]);
      } else {
        this.formData.controls['ngayLayMau'].setValidators([Validators.required]);
        this.formData.controls['soQdGiaoNvNh'].setValidators([Validators.required]);
        this.formData.controls['soBbNhapDayKho'].setValidators([Validators.required]);
        this.formData.controls['truongBpKtbq'].setValidators([Validators.required]);
        this.formData.controls['dviKiemNghiem'].setValidators([Validators.required]);
        this.formData.controls['diaDiemLayMau'].setValidators([Validators.required]);
        this.formData.controls['soLuongMau'].setValidators([Validators.required]);
      }
    } else {
      Object.keys(this.formData.controls).forEach(key => {
        const control = this.formData.controls[key];
        control.clearValidators();
        control.updateValueAndValidity();
      });
      this.formData.updateValueAndValidity();
    }
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          const res = await this.bienBanLayMauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          const res = await this.bienBanLayMauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectBienBanLayMau();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
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
        this.redirectBienBanLayMau();
      },
    });
  }

  redirectBienBanLayMau() {
    this.showListEvent.emit();
  };

  async loadPhuongPhapLayMau(maChLoaiHangHoa) {
    let res = await this.danhMucService.loadDanhMucHangChiTiet(maChLoaiHangHoa)
    if (res.msg == MESSAGE.SUCCESS) {
      this.phuongPhapLayMaus = res.data.ppLayMau
    }
  }

  async loadLoaiBienBan() {
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data.filter(item => item.ma == 'LBGM');
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
    this.listDaiDien = [];
    let tcdd = await this.danhMucService.danhMucChungGetAll("TO_CHUC_DAI_DIEN");
    if (tcdd.msg == MESSAGE.SUCCESS) {
      this.listDaiDien = tcdd.data;
    }
  }

  async loadBienbanLayMau() {
    this.spinner.show()
    let res = await this.bienBanLayMauService.getDetail(+this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      if (data.loaiVthh.startsWith('02')) {
        this.previewName = 'bien_ban_lay_mau'
      } else {
        this.previewName = 'bb_lay_mau_bgiao_mau_dau_thau_lt'
      }
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho,
        ngayNhapDayKho: data.bbNhapDayKho?.ngayKetThucNhap
      })
      this.listFileDinhKemBb = data.listFileDinhKemBb;
      this.listFileDinhKemAnh = data.listFileDinhKemAnh;
      this.listCcPhapLy = data.listCcPhapLy;
      this.viewTableDaiDien = data.chiTiets;
      await this.bindingDataQd(data.idQdGiaoNvNh);
      if (data.ppLayMau) {
        const dspplayMau = data.ppLayMau.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.phuongPhapLayMaus = this.phuongPhapLayMaus.map(pp => {
          return {
            ...pp,
            checked: !!dspplayMau.find(check => Number(check.id) == pp.id)
          }
        })
      }
      if (data.chiTieuKiemTra) {
        const dschiTieuKiemTra = data.chiTieuKiemTra.split(";").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.chiTieuChatLuongs = this.chiTieuChatLuongs.map(pp => {
          return {
            ...pp,
            checked: !!dschiTieuKiemTra.find(check => Number(check.id) == pp.id)
          }
        })
      }
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()

  }

  async openDialogSoQd() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
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
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong?.ngayKy,
      dviCungCap: data.hopDong?.tenNhaThau,
      donGiaHd: data.hopDong?.donGia
    });
    await this.loadPhuongPhapLayMau(data.cloaiVthh)
    await this.loadChiTieuChatLuongs(data.cloaiVthh)
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0];
    if (dataChiCuc) {
      if (this.loaiVthh.startsWith('02')) {
        this.formData.get('dvt').setValue(data.donViTinh)
        // this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanGuiHang));
        this.listDiaDiemNhap = dataChiCuc.children;
      } else {
        this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanNhapDayKho) && isEmpty(item.bienBanLayMau));
      }
    }
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data)
    });
  }

  bindingDataDdNhap (data) {
    if (data) {
      this.listBbNhapDayKho = [];
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
        soBbNhapDayKho: data.bienBanNhapDayKho?.soBienBanNhapDayKho,
        ngayNhapDayKho: data.bienBanNhapDayKho?.soBienBanNhapDayKho,
        idBbNhapDayKho: data.bienBanNhapDayKho?.id,
        soBbGuiHang: data.bienBanGuiHang?.soBienBanGuiHang,
        idBbGuiHang: data.bienBanGuiHang?.id,
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho,
      });
      if (!this.loaiVthh.startsWith('02')){
        this.formData.patchValue({
          diaDiemLayMau: this.formData.value.tenDvi + ' - ' + data.tenDiemKho
        });
      }
    }
  }

  async loadChiTieuChatLuongs(cloaiVthh: string) {
    if (cloaiVthh) {
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
      if (res?.msg === MESSAGE.SUCCESS) {
        this.chiTieuChatLuongs = Array.isArray(res.data) ? res.data.map((f) => ({
          id: f.id, giaTri: (f.tenChiTieu || "") + " " + (f.mucYeuCauNhap || ""), checked: false
        })) : []
      }
    }
  }

  async themDaiDien() {
    if (this.daiDienRow.daiDien && this.daiDienRow.loaiDaiDien) {
      this.daiDienRow.tenLoaiDaiDien = this.listDaiDien.find(i => i.ma == this.daiDienRow.loaiDaiDien)?.giaTri
      this.viewTableDaiDien = [...this.viewTableDaiDien, this.daiDienRow];
      this.daiDienRow = {};
    }
  }

  async nhapLaiDaiDien() {
    this.daiDienRow = {};
  }

  async suaDaiDien(i) {
    this.viewTableDaiDien[i].edit = true;
    this.daiDienRowEdit[i] = cloneDeep(this.viewTableDaiDien[i])
  }

  async luuDaiDien(i) {
    if (this.daiDienRowEdit[i].daiDien && this.daiDienRowEdit[i].loaiDaiDien) {
      this.daiDienRowEdit[i].tenLoaiDaiDien = this.listDaiDien.find(e => e.ma == this.daiDienRowEdit[i].loaiDaiDien)?.giaTri
      this.viewTableDaiDien[i] = cloneDeep(this.daiDienRowEdit[i])
      this.viewTableDaiDien[i].edit = false;
    }
  }

  async huySuaDaiDien(i) {
    this.viewTableDaiDien[i].edit = false;
  }

  async xoaDaiDien(i) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.viewTableDaiDien.splice(i, 1)
      },
    });
  }
}
