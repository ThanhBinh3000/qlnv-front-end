import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanLayMauXhService } from 'src/app/services/qlnv-hang/xuat-hang/kiem-tra-chat-luong/bienBanLayMauXh.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import dayjs from 'dayjs';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { STATUS } from 'src/app/constants/status';
import { ItemDaiDien } from 'src/app/pages/nhap/dau-thau/kiem-tra-chat-luong/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component';
import { QuyetDinhGiaoNvXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';

@Component({
  selector: 'app-create-bien-ban-lay-mau',
  templateUrl: './create-bien-ban-lay-mau.component.html',
  styleUrls: ['./create-bien-ban-lay-mau.component.scss'],
})
export class CreateBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;

  listBienBan: any[] = [];
  listDiaDiemXh: any[] = [];

  // listSoQuyetDinh: any[] = [];
  // listSoHopDong: any[] = [];
  // listFileDinhKem: any[] = [];
  // listTong: any;
  // listDiemKho: any[] = [];
  // listNhaKho: any[] = [];
  // listNganKho: any[] = [];
  // listNganLo: any[] = [];
  // listLoKho: any[] = [];
  // listLoaiHangHoa: any[] = [];
  // listChungLoaiHangHoa: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauXhService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],

      soQd: ['', [Validators.required]],
      idQd: ['', [Validators.required]],
      soHd: [''],
      ngayHd: [''],

      idKyThuatVien: [''],
      tenKyThuatVien: [''],

      soBienBan: ['', [Validators.required]],
      ngayLayMau: [dayjs().format('YYYY-MM-DD'), [Validators.required]],


      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],

      idDdiem: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],


      dviKiemNghiem: ['', [Validators.required]],
      soBbNhapDayKho: ['', [Validators.required]],
      idBbNhapDayKho: ['', [Validators.required]],
      diaDiemLayMau: ['', [Validators.required]],

      soLuongMau: ['', [Validators.required]],
      ppLayMau: [''],
      chiTieuKiemTra: ['', [Validators.required]],
      ketQuaNiemPhong: [''],
      tenNguoiTao: [''],
      soBbGuiHang: [''],
      idBbGuiHang: [''],
    })

    // this.formData = this.fb.group({
    //   id: [],
    //   trangThai: [STATUS.DU_THAO],
    //   tenTrangThai: ['Dự Thảo'],
    //   lyDoTuChoi: [''],
    //   loaiBienBan: [''],
    // })
  }

  async ngOnInit() {
    await Promise.all([
      this.loadLoaiBienBan()
    ]);
    if (this.id > 0) {
      await this.loadChitiet();
    } else {
      this.initForm();
    }
  }

  async openDialogSoQd() {
    let dataQd = [];
    let body = {
      nam: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQd = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQd,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id);
    console.log(res);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        soQd: data.soQd,
        idQd: data.id,
        soHd: data.soHd,
        ngayHd: data.ngayKy,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa
      });
      let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
      if (dataChiCuc && dataChiCuc.length > 0) {
        this.listDiaDiemXh = dataChiCuc[0].children;
      }
    };
    // const data = dataRes.data;
    // this.formData.patchValue({
    //   soQdGiaoNvNh: data.soQd,
    //   idQdGiaoNvNh: data.id,
    //   ngayQdGiaoNvNh: data.ngayQdinh,
    //   loaiVthh: data.loaiVthh,
    //   cloaiVthh: data.cloaiVthh,
    //   tenLoaiVthh: data.tenLoaiVthh,
    //   tenCloaiVthh: data.tenCloaiVthh,
    //   moTaHangHoa: data.moTaHangHoa,
    //   soHd: data.soHd,
    //   ngayHd: data.hopDong.ngayKy,
    //   donGiaHd: data.hopDong.donGia
    // });
    // let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0];
    // if (dataChiCuc) {
    //   if (this.loaiVthh.startsWith('02')) {
    //     this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanGuiHang));
    //   } else {
    //     this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanNhapDayKho) && isEmpty(item.bienBanLayMau));
    //   }
    // }
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
        dataTable: this.listDiaDiemXh,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idDdiem: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        });
      }
    });
  }

  async loadSoHopDong() {

  }

  async changeHopDong() {

  }

  isDisabled() {

  }



  initForm(): void {
    // let id = await this.userService.getId('BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      loaiBienBan: this.listBienBan[0].ma,
      tenKyThuatVien: this.userInfo.TEN_DAY_DU,
    })
  }

  async initData() {
    await this.loadDonVi();
  }

  async loadDonVi() {
    // const body = {
    //   maDviCha: this.detail.maDvi,
    //   trangThai: '01',
    // };
    // const dsTong = await this.donViService.layDonViTheoCapDo(body);
    // if (!isEmpty(dsTong)) {
    //   this.listTong = dsTong;
    //   this.donVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    //   if (!isEmpty(this.donVi)) {
    //     this.formData.patchValue({
    //       tenDonVi: this.donVi[0].tenDvi,
    //       maQHNS: this.donVi[0].maQhns,
    //     });
    //     const chiCuc = this.donVi[0];
    //     if (chiCuc) {
    //       const result = {
    //         ...this.donViService.layDsPhanTuCon(this.listTong, chiCuc),
    //       };
    //       this.listDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
    //     } else {
    //       this.listDiemKho = [];
    //     }
    //   }
    // }
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
  }


  async changeLoaiHangHoa(id: any) {

  }

  itemRow: ItemDaiDien = new ItemDaiDien();
  addDaiDien() {
    // if (!this.listDaiDien) {
    //   this.listDaiDien = [];
    // }
    // if (type) {
    //   let item = {
    //     bbLayMauId: null,
    //     daiDien: null,
    //     id: null,
    //     idTemp: new Date().getTime(),
    //     loaiDaiDien: type,
    //   };
    //   this.listDaiDien = [item, ...this.listDaiDien];
    //   this.loadDaiDien();
    // }
  }

  async loadSoQuyetDinh() {
    // let body = {};
    // let res = await this.quyetDinhGiaoNhiemVuXuatHangService.timKiem(body);
    // if (res.msg == MESSAGE.SUCCESS) {
    //   let data = res.data;
    //   this.listSoQuyetDinh = data.content;
    // } else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
  }
  async changeSoQuyetDinh() {
    // this.listSoHopDong = [];
    // this.formData.get('soHopDong').setValue(null);
    // if (this.formData.value.soQDXuat) {
    //   let res = await this.quyetDinhGiaoNhiemVuXuatHangService.loadChiTiet(this.formData.value.soQDXuat);
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     if (res.data.hopDongs && res.data.hopDongs.length > 0) {
    //       res.data.hopDongs.forEach(element => {
    //         this.listSoHopDong.push(
    //           {
    //             id: element.id,
    //             soHd: element.name
    //           }
    //         )
    //       });
    //     }
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.msg);
    //   }
    // }
  }

  save(isGuiDuyet?: boolean) {

  }


  pheDuyet() {

  }

  tuChoi() {

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
  }

  async loadChitiet() {

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

  // addDaiDien() {
  //   this.itemRow.loaiDaiDien = this.loaiDaiDien;
  //   this.dataTable.push(this.itemRow);
  //   this.itemRow = new ItemDaiDien();
  //   this.emitDataTable();
  // }


}
