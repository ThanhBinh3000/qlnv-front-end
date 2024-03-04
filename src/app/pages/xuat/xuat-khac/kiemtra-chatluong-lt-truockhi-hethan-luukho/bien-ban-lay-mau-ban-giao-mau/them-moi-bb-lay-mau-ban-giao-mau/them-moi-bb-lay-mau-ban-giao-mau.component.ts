import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {PhuongPhapLayMau} from 'src/app/models/PhuongPhapLayMau';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from '@angular/forms';
import {
  TongHopDanhSachHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";
import {
  BienBanLayMauLuongThucHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/BienBanLayMauLuongThucHangDTQG.service";
import {PREVIEW} from '../../../../../../constants/fileType';
import {cloneDeep} from 'lodash';
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {MangLuoiKhoService} from "../../../../../../services/qlnv-kho/mangLuoiKho.service";

@Component({
  selector: 'app-xk-them-moi-bb-lay-mau-ban-giao-mau',
  templateUrl: './them-moi-bb-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./them-moi-bb-lay-mau-ban-giao-mau.component.scss']
})
export class ThemMoiBbLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() itemInput: any;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = [];
  fileDinhKemNiemPhong: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listDsTongHop: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  listFileDinhKem: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;
  templateName = 'Biên bản lấy mẫu bàn giao mẫu';
  rowItem: BbLayMauDtl = new BbLayMauDtl;
  dataEdit: { [key: string]: { edit: boolean; data: BbLayMauDtl } } = {};
  hasError: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private danhMucService: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private bienBanLayMauLuongThucHangDTQGService: BienBanLayMauLuongThucHangDTQGService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauLuongThucHangDTQGService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        loaiBienBan: [],
        maQhNs: [],
        idTongHop: [, [Validators.required]],
        maDanhSach: [, [Validators.required]],
        tenDanhSach: [],
        ktvBaoQuan: [],
        soBienBan: [],
        ngayLayMau: [],
        dviKiemNghiem: [],
        diaDiemLayMau: [],
        maDiaDiem: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        soLuongMau: [],
        ppLayMau: [],
        chiTieuKiemTra: [],
        ppLayMauList: [null],
        chiTieuKiemTraList: [null],
        ketQuaNiemPhong: [],
        trangThai: [STATUS.DU_THAO],
        ngayGduyet: [],
        nguoiGduyetId: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        lyDoTuChoi: [],
        type: [],
        tenDvi: [],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenCuc: [],
        tenChiCuc: [],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        thuKho: [],
        lanhDaoChiCuc: [],
        bbLayMauDtl: [new Array()],
        fileDinhKems: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        fileDinhKemNiemPhong: [new Array<FileDinhKem>()],

      }
    );
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadMaDs(),
      ])
      await this.loadDetail(this.idInput)
      // if(this.itemInput){
      //   await  this.bindingDataDs(this.itemInput);
      // }
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanLayMauLuongThucHangDTQGService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.checked = data.ketQuaNiemPhong;
            this.listFileDinhKem = data.fileDinhKems;
            this.canCu = data.canCu;
            this.fileNiemPhong = data.fileDinhKemNiemPhong;
            this.dataTable = this.formData.value.bbLayMauDtl;
            this.dataTable.forEach((item, index) => {
              this.dataEdit[index] = {
                edit: false,
                data: {...item},
              };
            });
            //Xử lý pp lấy mẫu và chỉ tiêu kiểm tra chất lượng
            if (data.ppLayMau) {
              const ppLayMauOptions = data.ppLayMau.split(';').map(option => {
                const [label, checked] = option.split('=>');
                return {label, value: null, checked: checked === 'true'};
              });

              this.formData.patchValue({
                ppLayMauList: ppLayMauOptions,
              });
            }

            if (data.chiTieuKiemTra) {
              const chiTieuOptions = data.chiTieuKiemTra.split(";").map(option => {
                const [label, checked] = option.split('=>');
                return {label, value: null, checked: checked === 'true'};
              });
              this.formData.patchValue({
                chiTieuKiemTraList: chiTieuOptions,
              });
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_LT_BB_LAY_MAU_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        ktvBaoQuan: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
        loaiVthh: this.loaiVthh
      });
      this.radioValue = 'ALL'
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadMaDs() {
    let body = {
      trangThai: STATUS.GUI_DUYET,
      loai: this.loaiHhXuatKhac.LT_6_THANG,
    }
    let res = await this.tongHopDanhSachHangDTQGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDsTongHop = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogMaDs() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp hàng DTQG còn 6 tháng hết hạn lưu kho ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDsTongHop,
        dataHeader: ['Mã danh sách', 'Tên danh sách', 'Ngày tạo'],
        dataColumn: ['maDanhSach', 'tenDanhSach', 'ngayTao'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataDs(data.id, true);
      }
    });
  };

  async bindingDataDs(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.tongHopDanhSachHangDTQGService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      idTongHop: data.id,
      tenDanhSach: data.tenDanhSach,
      maDanhSach: data.maDanhSach,
      ngayTongHop: data.ngayTongHop,
    });
    if (data.tongHopDtl) {
      this.listDiaDiemNhap = data.tongHopDtl.filter(i => i.maDiaDiem.substring(0, 8) === this.userInfo.MA_DVI);
    }
    await this.listBienBan(data.maDanhSach)
    await this.spinner.hide();
  }

  async listBienBan(maDanhSach) {
    await this.spinner.show();
    let body = {
      maDanhSach: maDanhSach,
    }
    let res = await this.bienBanLayMauLuongThucHangDTQGService.search(body)
    this.bienBan = res.data.content;
    let listDd = [
      ...this.listDiaDiemNhap.filter((e) => {
        return !this.bienBan.some((bb) => {
          if (bb.maDiaDiem.length > 0 && e.maDiaDiem.length > 0) {
            return e.maDiaDiem === bb.maDiaDiem;
          }
        });
      }),
    ];
    this.listDiaDiemNhap = listDd;
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        maDiaDiem: data.maDiaDiem,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        slTon: data.slTon,
        slHetHan: data.slHetHan,
        donViTinh: data.donViTinh,
        thoiHanLk: data.thoiHanLk,
      });
      this.loadPhuongPhapLayMau(data.cloaiVthh);
      this.loadChiTieuCl(data.cloaiVthh);
      this.tenThuKho(data.maDiaDiem);
    }
  }
  async tenThuKho(event) {
    let body = {
      maDvi: event,
      capDvi: (event?.length / 2 - 1),
    };
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      const detailThuKho = detail.data.object.detailThuKho;
      if (detailThuKho) {
        this.formData.patchValue({
          thuKho: detailThuKho.hoTen,
        });
      }
    }
  }

  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maBb;
    }
    body.fileDinhKems = this.listFileDinhKem;
    body.canCu = this.canCu;
    body.fileDinhKemNiemPhong = this.fileNiemPhong;
    // xử lý pp lấy mẫu và tiêu chuẩn cần lấy mẫu kiểm tra
    if (body.ppLayMauList && body.ppLayMauList.length > 0) {
      body.ppLayMau = body.ppLayMauList.map(function (item) {
        return item['label'] + '=>' + item.checked;
      }).join(";");
    }
    if (body.chiTieuKiemTraList && body.chiTieuKiemTraList.length > 0) {
      body.chiTieuKiemTra = body.chiTieuKiemTraList.map(function (item) {
        return item['label'] + '=>' + item.checked;
      }).join(";");
    }
    body.bbLayMauDtl = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

  async loadPhuongPhapLayMau(cloaiVthh) {
    this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
          let ppLayMauOptions = [];
          res.data.ppLayMau.forEach(item => {
            let option = {
              label: item.giaTri,
              value: item.ma,
              checked: true
            }
            ppLayMauOptions.push(option);
            this.formData.patchValue({
              ppLayMauList: ppLayMauOptions,
            })
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadChiTieuCl(cloaiVthh) {
    this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          let chiTieuClOptions = [];
          res.data.forEach(item => {
            let option = {
              label: item.tenChiTieu,
              value: item.id,
              checked: true
            }
            chiTieuClOptions.push(option);
            this.formData.patchValue({
              chiTieuKiemTraList: chiTieuClOptions,
            })
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }


  async preview(id) {
    this.spinner.show();
    await this.bienBanLayMauLuongThucHangDTQGService.preview({
      tenBaoCao: this.templateName,
      id: id,
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }


  themMoiItem1() {


    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.daiDien && this.rowItem.loaiDaiDien != null) {
      this.sortTableId1();
      let item = cloneDeep(this.rowItem);
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new BbLayMauDtl();
      this.updateEditCache1();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  clearData1() {
    this.rowItem = new BbLayMauDtl();
    this.dataTable = []
  }

  sortTableId1() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  editItem1(index: number): void {
    this.dataEdit[index].edit = true;
  }

  updateEditCache1(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  huyEdit1(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  luuEdit1(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }


  xoaItem1(index: number) {
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
          this.updateEditCache1();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

}

export class BbLayMauDtl {
  id: number;
  daiDien: string;
  loaiDaiDien: string;
}
