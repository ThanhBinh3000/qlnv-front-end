import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { BienBanGuiHangService } from 'src/app/services/bienBanGuiHang.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HoSoKyThuatService } from 'src/app/services/hoSoKyThuat.service';
import { QuanLyBienBanGiaoNhanService } from 'src/app/services/quanLyBienBanGiaoNhan.service';
import { QuanLyBienBanKetThucNhapKhoService } from 'src/app/services/quanLyBienBanKetThucNhapKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BienBanGiaoNhan, ChiTietBienBanGiaoNhan } from './../../../../../../models/BienBanGiaoNhan';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
@Component({
  selector: 'app-thong-tin-bien-ban-giao-nhan',
  templateUrl: './thong-tin-bien-ban-giao-nhan.component.html',
  styleUrls: ['./thong-tin-bien-ban-giao-nhan.component.scss']
})
export class ThongTinBienBanGiaoNhanComponent implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;

  listThuKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBienBanKetThucNhapKho: any[] = [];
  listBienBanGuiHang: any[] = [];
  listBienBanHoSoKyThuat: any[] = [];
  listFileDinhKem: Array<FileDinhKem> = [];
  listCanCu: Array<FileDinhKem> = [];
  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  bienBanGiaoNhan: BienBanGiaoNhan = new BienBanGiaoNhan();
  formData: FormGroup;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  chiTietDaiDienChiCuc: ChiTietBienBanGiaoNhan = new ChiTietBienBanGiaoNhan();
  chiTietDaiDienCuc: ChiTietBienBanGiaoNhan = new ChiTietBienBanGiaoNhan();
  chiTietDaiDienBenGiao: ChiTietBienBanGiaoNhan = new ChiTietBienBanGiaoNhan();
  listHopDong: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    public globals: Globals,
    private fb: FormBuilder,
    private quanLyPhieuKetThucNhapKhoService: QuanLyBienBanKetThucNhapKhoService,
    private bienBanGuiHangService: BienBanGuiHangService,
    private quanLyBienBanBanGiaoNhanService: QuanLyBienBanGiaoNhanService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private thongTinHopDongService: ThongTinHopDongService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.bienBanGiaoNhan.maDvi = this.userInfo.MA_DVI;
      this.bienBanGiaoNhan.tenDvi = this.userInfo.TEN_DVI;
      this.bienBanGiaoNhan.ngayKy = dayjs().format("YYYY-MM-DD");
      this.bienBanGiaoNhan.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.bienBanGiaoNhan.tenTrangThai = 'Dự thảo';
      this.initForm();
      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadBienBanKetThucNhapKho(),
        this.loadBienBanGuiHang(),
        this.loadHoSoKyThuat(),
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
    if (this.bienBanGiaoNhan && (this.bienBanGiaoNhan.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanGiaoNhan.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanGiaoNhan.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  initForm() {
    this.formData = this.fb.group({
      soQD: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.qdgnvnxId
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      donVi: [
        {
          value: this.userInfo.TEN_DVI, disabled: true
        },
        [],
      ],
      maQHNS: [
        {
          value: this.userInfo.MA_DVI, disabled: true
        },
        [],
      ],
      soBienBan: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.soBienBan
            : null,
          disabled: true
        },
        [],
      ],
      bbKtNhapKhoId: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.bbKtNhapKhoId
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],

      ngayKy: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.ngayKy
            : null,
          disabled: true
        },

        [],
      ],
      hopDongId: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.hopDongId
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      ngayHopDong: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.ngayHopDong
            : null,
          disabled: true
        },

        [],
      ],
      bbGuiHangId: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.bbGuiHangId
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      ngayKyBbGh: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.ngayKyBbGh
            : null, disabled: true
        },
        [],
      ],
      hoSKyThuatId: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.hoSKyThuatId
            : null, disabled: this.isView ? true : false
        },
        [],
      ],
      ngayKyHskt: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.ngayKyHskt
            : null, disabled: true
        },
        [],
      ],
      tenHang: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.tenHang
            : null, disabled: true
        },
        [],
      ],
      tenChungLoaiHang: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.chungLoaiHangHoa
            : null, disabled: true
        },
        [],
      ],
      soLuong: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.soLuong
            : null,
          disabled: true
        },

        [],
      ],
      ghiChu: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.ghiChu
            : null, disabled: this.isView ? true : false
        },
        [],
      ],
      ketLuan: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.ketLuan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      qdgnvnxId: [{
        value: this.bienBanGiaoNhan
          ? this.bienBanGiaoNhan.qdgnvnxId
          : null,
        disabled: this.isView ? true : false
      }],
      daiDienCuc: [{
        value: this.chiTietDaiDienCuc
          ? this.chiTietDaiDienCuc.daiDien
          : null,
        disabled: this.isView ? true : false
      }],
      chucVuCuc: [{
        value: this.chiTietDaiDienCuc
          ? this.chiTietDaiDienCuc.chucVu
          : null,
        disabled: this.isView ? true : false
      }],
      daiDienChiCuc: [{
        value: this.chiTietDaiDienChiCuc
          ? this.chiTietDaiDienChiCuc.daiDien
          : null,
        disabled: this.isView ? true : false
      }],
      chucVuChiCuc: [{
        value: this.chiTietDaiDienChiCuc
          ? this.chiTietDaiDienChiCuc.chucVu
          : null,
        disabled: this.isView ? true : false
      }],
      daiDienBenGiao: [{
        value: this.chiTietDaiDienBenGiao
          ? this.chiTietDaiDienBenGiao.daiDien
          : null,
        disabled: this.isView ? true : false
      }],
      chucVuBenGiao: [{
        value: this.chiTietDaiDienBenGiao
          ? this.chiTietDaiDienBenGiao.chucVu
          : null,
        disabled: this.isView ? true : false
      }],
      soHd: [
        {
          value: this.bienBanGiaoNhan
            ? this.bienBanGiaoNhan.soHd
            : null,
          disabled: true
        },

        [],
      ],
    });
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
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quanLyBienBanBanGiaoNhanService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.bienBanGiaoNhan = res.data;
          this.bienBanGiaoNhan.maDvi = this.userInfo.MA_DVI;
          this.bienBanGiaoNhan.tenDvi = this.userInfo.TEN_DVI;
          this.listFileDinhKem = res.data.fileDinhKems;
          this.listCanCu = res.data.canCus;
          this.bienBanGiaoNhan.chiTiets.forEach(bienBan => {
            bienBan.idVirtual = bienBan.id
          })
          this.initForm();
          this.changeSoQuyetDinh();
        }
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = (item?.thanhTienTn ?? 0) + (item?.thanhTienQt ?? 0);
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
            await this.quanLyBienBanBanGiaoNhanService.updateStatus(
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
    if (this.bienBanGiaoNhan.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
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
            await this.quanLyBienBanBanGiaoNhanService.updateStatus(
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
            trangThai: this.bienBanGiaoNhan.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.quanLyBienBanBanGiaoNhanService.updateStatus(
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

  back() {
    this.showListEvent.emit();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "bbGuiHangId": this.formData.get("bbGuiHangId").value,
        "bbKtNhapKhoId": this.formData.get("bbKtNhapKhoId").value,
        "chiTiets": this.bienBanGiaoNhan.chiTiets,
        "fileDinhKemReqs": this.listFileDinhKem,
        "canCus": this.listCanCu,
        "ghiChu": this.formData.get("ghiChu").value,
        "hoSKyThuatId": this.formData.get("hoSKyThuatId").value,
        "hopDongId": this.formData.get("hopDongId").value,
        "id": this.bienBanGiaoNhan.id,
        "ketLuan": this.formData.get("ketLuan").value,
        "maDvi": this.formData.get("maQHNS").value,
        "maVatTu": this.bienBanGiaoNhan.maVatTu,
        "maVatTuCha": this.bienBanGiaoNhan.maVatTuCha,
        "ngayHopDong": this.formData.get("ngayHopDong").value,
        "ngayKy": this.formData.get("ngayKy").value,
        "ngayKyBbGh": this.formData.get("ngayKyBbGh").value,
        "ngayKyHskt": this.formData.get("ngayKyHskt").value,
        "qdgnvnxId": this.formData.get("qdgnvnxId").value,
        "soBienBan": this.formData.get("soBienBan").value,
        "soLuong": this.formData.get("soLuong").value,
      };
      if (this.id > 0) {
        let res = await this.quanLyBienBanBanGiaoNhanService.sua(
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
        let res = await this.quanLyBienBanBanGiaoNhanService.them(
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

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  async loadBienBanKetThucNhapKho() {
    let body = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "pageSize": 1000,
      "pageNumber": 1,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
    }
    let res = await this.quanLyPhieuKetThucNhapKhoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanKetThucNhapKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadBienBanGuiHang() {
    let body = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "pageSize": 1000,
      "pageNumber": 1,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
    }
    let res = await this.bienBanGuiHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanGuiHang = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadHoSoKyThuat() {
    let body = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "pageSize": 1000,
      "pageNumber": 1
    }
    let res = await this.hoSoKyThuatService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanHoSoKyThuat = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async changeSoQuyetDinh() {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.formData.get("qdgnvnxId").value);
    if (quyetDinh && quyetDinh.length > 0) {
      this.bienBanGiaoNhan.qdgnvnxId = quyetDinh[0].id;
      this.detailGiaoNhap = quyetDinh[0];
      this.bienBanGiaoNhan.hopDongId = this.detailHopDong.id;
      if (this.detailGiaoNhap.children1 && this.detailGiaoNhap.children1.length > 0) {
        this.listHopDong = [];
        this.detailGiaoNhap.children1.forEach(element => {
          if (element && element.hopDong) {
            if (this.typeVthh) {
              if (element.hopDong.loaiVthh.startsWith(this.typeVthh)) {
                this.listHopDong.push(element);
              }
            }
            else {
              if (!element.hopDong.loaiVthh.startsWith('02')) {
                this.listHopDong.push(element);
              }
            }
          }
        });
      }
      this.changeHopDong();
    }
  }
  async changeHopDong() {
    if (!this.formData.get("hopDongId").value) {
      return;
    }
    let hopDong = this.listHopDong.find(x => x.hopDong.id == this.formData.get("hopDongId").value);
    let body = {
      "str": hopDong.hopDong.soHd
    }
    let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.detailHopDong = res.data;
      this.bienBanGiaoNhan.soHd = this.detailHopDong.soHd;
      this.bienBanGiaoNhan.tenHang = this.detailHopDong.tenVthh;
      this.bienBanGiaoNhan.chungLoaiHangHoa = this.detailHopDong.tenCloaiVthh;
      this.bienBanGiaoNhan.hopDongId = this.detailHopDong.id;
      this.bienBanGiaoNhan.ngayHopDong = this.detailHopDong.ngayKy;
      this.bienBanGiaoNhan.maVatTuCha = this.detailHopDong.loaiVthh;
      this.bienBanGiaoNhan.maVatTu = this.detailHopDong.cloaiVthh;

      this.initForm();
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async getHopDong(id) {
    if (id) {
      let body = {
        "str": id
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.formData.patchValue({
          tenHang: this.detailHopDong.tenVthh,
          tenChungLoaiHang: this.detailHopDong.tenCloaiVthh
        })
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  changeBbKtNhapKho() {
    let bbKtNhapKho = this.listBienBanKetThucNhapKho.find(x => x.id == this.formData.get("bbKtNhapKhoId").value);
    if (bbKtNhapKho && bbKtNhapKho.length > 0) {
      this.bienBanGiaoNhan.bbKtNhapKhoId = bbKtNhapKho.id;
    }
  }
  changeBienBanGuiHang() {
    let bbGuiHang = this.listBienBanGuiHang.find(x => x.id == this.formData.get("bbGuiHangId").value);
    if (bbGuiHang && bbGuiHang.length > 0) {
      this.bienBanGiaoNhan.bbGuiHangId = bbGuiHang.id;
      this.formData.patchValue({
        ngayKyBbGh: bbGuiHang.ngayHopDong
      })
    }
  }
  changeHoSoKyThuat() {
    let bbHoSoKyThuat = this.listBienBanHoSoKyThuat.find(x => x.id == this.formData.get("hoSKyThuatId").value);
    if (bbHoSoKyThuat && bbHoSoKyThuat.length > 0) {
      this.bienBanGiaoNhan.hoSKyThuatId = bbHoSoKyThuat.id;
    }
    this.formData.patchValue({
      ngayKyHskt: bbHoSoKyThuat.ngayKiemTra
    })
  }
  addDaiDien(type: string) {
    if ((type == '2' && (!this.formData.get("chucVuCuc").value || !this.formData.get("daiDienCuc").value))
      || (type == '3' && (!this.formData.get("chucVuChiCuc").value || !this.formData.get("daiDienChiCuc").value))
      || (type == '4' && (!this.formData.get("chucVuBenGiao").value || !this.formData.get("daiDienBenGiao").value))) {
      return;
    }

    const chiTiet = new ChiTietBienBanGiaoNhan();
    chiTiet.idVirtual = new Date().getTime();
    chiTiet.loaiDaiDien = type;

    switch (type) {
      case '2':
        chiTiet.chucVu = this.formData.get("chucVuCuc").value;
        chiTiet.daiDien = this.formData.get("daiDienCuc").value;
        break;
      case '3':
        chiTiet.chucVu = this.formData.get("chucVuChiCuc").value;
        chiTiet.daiDien = this.formData.get("daiDienChiCuc").value;
        break;
      case '4':
        chiTiet.chucVu = this.formData.get("chucVuBenGiao").value;
        chiTiet.daiDien = this.formData.get("daiDienBenGiao").value;
        break;
      default:
        break;
    }

    this.bienBanGiaoNhan.chiTiets.push(chiTiet);
    this.clearDaiDien(type);
  }
  clearDaiDien(type: string) {
    if (type === '00') {
      this.formData.patchValue({
        chucVuCuc: null,
        daiDienCuc: null
      })
    } else if (type === '01') {
      this.formData.patchValue({
        chucVuChiCuc: null,
        daiDienChiCuc: null
      })
    } else {
      this.formData.patchValue({
        chucVuBenGiao: null,
        daiDienBenGiao: null
      })
    }
  }
  deleteBienBan(id: number) {
    this.bienBanGiaoNhan.chiTiets = this.bienBanGiaoNhan.chiTiets.filter(bienBan => bienBan.idVirtual !== id);
  }
}
