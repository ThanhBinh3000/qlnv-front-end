import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import {
  KetQuaKiemNghiemChatLuongHang,
  PhieuKiemNghiemChatLuongHang,
} from 'src/app/models/PhieuKiemNghiemChatLuongThoc';
import { UserLogin } from 'src/app/models/userlogin';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemNghiemChatLuongHang.service';
import { FormBuilder, Validators } from '@angular/forms';
import { STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { HelperService } from 'src/app/services/helper.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import {
  QuanLyPhieuKiemNghiemChatLuongHangKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyPhieuKiemNghiemChatLuongHangKhac.service";
import {
  QuanLyBienBanLayMauKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyBienBanLayMauKhac.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";

@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() typeVthh: string;
  @Input() isView: boolean;
  @Input() qdGvuNh: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  dsTong: any = {};
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listSoQuyetDinh = [];
  listBbBanGiaoMau = [];
  dataTableChiTieu: any[] = [];
  listDiaDiemNhap: any[] = [];
  listBbNhapDayKho: any[] = [];
  hhQdPdNhapKhacDtlReq: any;
  dsDanhGia: any[] = [];
  previewName: string = 'nk_phieu_knghiem_cl';

  phieuKiemNghiemChatLuongHang: PhieuKiemNghiemChatLuongHang =
    new PhieuKiemNghiemChatLuongHang();
  viewChiTiet: boolean = false;
  ketQuaKiemNghiemHangCreate: KetQuaKiemNghiemChatLuongHang =
    new KetQuaKiemNghiemChatLuongHang();
  dsKetQuaKiemNghiemHangClone: Array<KetQuaKiemNghiemChatLuongHang> = [];
  isChiTiet: boolean = false;
  listTieuChuan: any[] = [];
  dmTieuChuan: any[] = [];
  isValid = false;
  toDay = new Date();
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangKhacService,
    private danhMucService: DanhMucService,
    private quanLyBienBanLayMauService: QuanLyBienBanLayMauKhacService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongHangService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      soPhieuKiemNghiemCl: [''],
      tenDvi: [''],
      maDvi: [''],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      idDdiemGiaoNvNh: [''],
      soQdGiaoNvNh: [''],
      idQdGiaoNvNh: [''],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [''],
      soLuongNhapDayKho: [''],
      ngayNhapDayKho: [''],
      nguoiKiemNghiem: [''],
      tenNganLoKho: [''],
      soBbNhapDayKho: [''],

      soBbLayMau: [''],
      tenThuKho: [''],
      tenNguoiKiemNghiem: [''],
      tenTruongPhong: [''],

      ketQuaDanhGia: [],
      ketLuan: [],
      idBbLayMau: [''],

      ngayTao: [dayjs().format('YYYY-MM-DD')],
      tenKyThuatVien: [''],
      ngayKnghiem: [''],
      hthucBquan: [''],
    });

    this.dsDanhGia = [
      {
        ma: 'Đạt',
        giaTri: 'Đạt',
      },
      {
        ma: 'Không Đạt',
        giaTri: 'Không Đạt',
      },
    ];
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit()
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
      ]);
      if (this.id > 0) {
        await this.getDetail(this.id);
      } else {
        await this.initForm();
      }

      if (this.qdGvuNh) {
        await this.initForm();
        await this.bindingDataQd(this.qdGvuNh);
      }

      this.isValid =
        !!this.phieuKiemNghiemChatLuongHang.bbBanGiaoMauId &&
        !!this.phieuKiemNghiemChatLuongHang.qdgnvnxId;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("PHIEU_KNGHIEM_CLUONG_SEQ");
    this.formData.patchValue({
      soPhieuKiemNghiemCl: `${res}/${this.formData.get('nam').value}/PKNCL-CDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenTruongPhong: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      nguoiKiemNghiem: this.userInfo.TEN_DAY_DU,
      ngayKnghiem: this.toDay
    });
  }

  async getDetail(id: number) {
    this.spinner.show()
    let res = await this.phieuKiemNghiemChatLuongHangService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        const data = res.data;
        console.log(data)
        this.helperService.bidingDataInFormGroup(this.formData, data);
        console.log(this.formData.value)
        this.bindingDataBbLayMau(data.idBbLayMau, true);
        this.dataTableChiTieu = data.listKquaKngiem;
      }
    }
  }

  isDisableField() {
    if (this.phieuKiemNghiemChatLuongHang &&
      (this.phieuKiemNghiemChatLuongHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN
        || this.phieuKiemNghiemChatLuongHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.phieuKiemNghiemChatLuongHang.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  newObjectBienBanLayMau() {
    this.phieuKiemNghiemChatLuongHang = new PhieuKiemNghiemChatLuongHang();
  }

  async save(isGuiDuyet?: boolean) {
    await this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.kquaKnghiem = this.dataTableChiTieu;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.phieuKiemNghiemChatLuongHangService.update(body);
    } else {
      res = await this.phieuKiemNghiemChatLuongHangService.create(body);
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
  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
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
            await this.phieuKiemNghiemChatLuongHangService.approve(
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
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.phieuKiemNghiemChatLuongHangService.approve(
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

  async loadBbLayMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quanLyBienBanLayMauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listBbBanGiaoMau = res.data.content
      }
    }
  }

  openDialogBbLayMau() {
    // this.loadBbLayMau();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBbBanGiaoMau,
        dataHeader: ['Số biên bản', 'Số biên bản nhập đầy kho', 'Số QĐ Giao NV NH'],
        dataColumn: ['soBienBan', 'soBbNhapDayKho', 'soQdGiaoNvNh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataBbLayMau(data.id, false);
    });
  }

  async bindingDataBbLayMau(id, isChiTiet) {
    let res = await this.quanLyBienBanLayMauService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        soBbLayMau: data.soBienBan,
        soBbNhapDayKho: data.soBbNhapDayKho,
        soQdGiaoNvNh: data.soQdGiaoNvNh,
        idQdGiaoNvNh: data.idQdGiaoNvNh,
        ngayLayMau: data.ngayLayMau,
        idDdiemGiaoNvNh: data.idDdiemGiaoNvNh,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        // loaiVthh: data.loaiVthh,
        // cloaiVthh: data.cloaiVthh,
        // tenLoaiVthh: data.tenLoaiVthh,
        // tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        soLuongNhapDayKho: data.bbNhapDayKho?.soLuong,
        ngayNhapDayKho: data.bbNhapDayKho?.ngayKetThucNhap,
        tenThuKho: data.bbNhapDayKho?.tenNguoiTao,
        tenNganLoKho: data.tenLoKho + " - " + data.tenNganKho,
        nguoiKiemNghiem: this.userInfo.TEN_DAY_DU,
        tenTruongPhong: this.userInfo.TEN_DAY_DU,
        ngayKnghiem: this.toDay
      })
      if (!isChiTiet) {
        let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
        if (dmTieuChuan.data) {
          this.dataTableChiTieu = dmTieuChuan.data.children;
          this.dataTableChiTieu.forEach(element => {
            element.edit = false
          });
        }
      }
    }
  }

  async loadDanhMucPhuongThucBaoQuan() {
    let body = {
      maHthuc: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenHthuc: null,
      trangThai: null,
    };
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async loadTieuChuan() {
    let body = {
      maHang: this.maVthh,
      namQchuan: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenQchuan: null,
      trangThai: '01',
    };
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (
          res.data.content[0].children &&
          res.data.content[0].children.length > 0
        ) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  startEdit(index: number) {
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = true;
  }

  deleteData(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.phieuKiemNghiemChatLuongHang.kquaKnghiem =
          this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsKetQuaKiemNghiemHangClone = cloneDeep(
          this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
        );
        // this.loadData();
      },
    });
  }

  saveEditPhieuKiemNghiem(i: number): void {
    this.dsKetQuaKiemNghiemHangClone[i].isEdit = false;
    Object.assign(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem[i],
      this.dsKetQuaKiemNghiemHangClone[i],
    );
  }

  cancelEditPhieuKiemNghiem(index: number) {
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
    );
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = false;
  }

  getNameFile(event?: any) {
    // const element = event.currentTarget as HTMLInputElement;
    // const fileList: FileList | null = element.files;
    // if (fileList) {
    //   this.nameFile = fileList[0].name;
    // }
    // this.formData.patchValue({
    //   file: event.target.files[0] as File,
    // });
    // if (this.dataCanCuXacDinh) {
    //   this.formTaiLieuClone.file = this.nameFile;
    //   this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    // }
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
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
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tongSlNhap']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.hhQdPdNhapKhacDtlReq = data;
        this.listBbNhapDayKho = [];
        this.formData.patchValue({
          idDdiemGiaoNvNh: data.id,
          soBbLayMau: data.bbLayMau?.soBienBan,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenNganLoKho ? data.tenNganLoKho : `${data.tenLoKho} - ${data.tenNganKho}`,
          tenCloaiVthh: data.tenCloaiVthh,
          cloaiVthh: data.cloaiVthh,
          soBbNhapDayKho: data.bienBanNhapDayKho?.soBienBanNhapDayKho,
          idBbNhapDayKho: data.bienBanNhapDayKho?.id,
          soBbGuiHang: data.bienBanGuiHang?.soBienBanGuiHang,
          idBbGuiHang: data.bienBanGuiHang?.id,
          ngayLayMau: data.bbLayMau?.ngayLayMau,
          idBbLayMau: data.bbLayMau?.id
        });
          await this.loadDsQcTheoCloaiVthh();
      }
    });
  }

  async loadDsQcTheoCloaiVthh() {
    this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dataTableChiTieu = res.data
          this.dataTableChiTieu.forEach(element => {
            element.edit = false
          });
          console.log(this.dataTableChiTieu, "dataTableChiTieu")
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
  }

  async openDialogSoQd() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "paggingReq": {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value,
      "checkIdBbLayMau": 1,
    }
    let res = await this.quyetDinhGiaoNhapHangKhacService.dsQdNvuDuocLapBb(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      console.log(res)
      this.listSoQuyetDinh = data;
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
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose);
      }
    });
  };

  async bindingDataQd(data) {
    await this.spinner.show();
    console.log(123)
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQd,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      moTaHangHoa: data.moTaHangHoa,
    });
    data.dtlList.forEach(item => {
      if (item.idBbLayMau == this.id) {
        // this.listBbBanGiaoMau.push(item.bbLayMau);
        this.formData.patchValue({
          tenCloaiVthh: item.tenCloaiVthh,
          tenNganLoKho: item.tenNganLoKho,
        });
      }
    })
    let dataChiCuc = data.dtlList;
    if (dataChiCuc) {
      // if (this.loaiVthh.startsWith('02')) {
      //   this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanGuiHang));
      // } else {
      this.listDiaDiemNhap = dataChiCuc.filter(item => item.maCuc == this.userInfo.MA_DVI);
      // }
    }
    await this.spinner.hide();
  }
}
