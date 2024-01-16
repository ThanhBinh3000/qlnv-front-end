import { startWith, pairwise } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Validators } from '@angular/forms';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { KetQuaKiemNghiemChatLuongHang, PhieuKiemNghiemChatLuongHang } from 'src/app/models/PhieuKiemNghiemChatLuongThoc';
import {
  PhieuKiemTraChatLuongService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/PhieuKiemTraChatLuong.service";
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { BienBanTinhKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanTinhKho.service';
import { AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL } from 'src/app/Utility/utils';
import { KhCnQuyChuanKyThuat } from 'src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
// import {
//   QuyetDinhGiaoNvCuuTroService
// } from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/QuyetDinhGiaoNvCuuTro.service";

@Component({
  selector: 'app-them-moi-phieu-kiem-tra-chat-luong',
  templateUrl: './them-moi-phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-tra-chat-luong.component.scss']
})
export class ThemMoiPhieuKiemTraChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  radioValue: string = 'yes';
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  dataTableChiTieu: any[] = [];
  listTieuChuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  maVthh: string;
  templateName = "Phiếu kiểm tra chất lượng-Xuất cấp";
  type: string = 'XC';
  listBbTinhKho: any[];
  amount1Left = { ...AMOUNT_TWO_DECIMAL, align: "left" };
  listChungLoaiGao: any[] = [];
  dmDanhBongGao: any[] = [];
  dmMucXatGao: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private phieuKiemTraChatLuongService: PhieuKiemTraChatLuongService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private danhMucDungChungService: DanhMucDungChungService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemTraChatLuongService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        maQhNs: [],
        soPhieuKtCl: [, [Validators.required]],
        ngayLapPhieu: [dayjs().format("YYYY-MM-DD")],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: [, [Validators.required]],
        thoiHanXuatCtVt: [],
        nguoiKn: [],
        truongPhong: [],
        thuKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        maDiemKho: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        hinhThucBq: [],
        ketQua: [],
        ketLuan: [],
        soLuongXuat: [],
        soLuongNhan: [],
        trangThai: [STATUS.DU_THAO],
        ngayGduyet: [],
        nguoiGduyetId: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        lyDoTuChoi: [],
        type: [],
        soBbTinhKho: [],
        idBbTinhKho: [],
        tenDvi: [],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        ketQuaPhanTich: [new Array()],
        tenNganLoKho: [],
        chungLoaiGao: [, [Validators.required]]
      }
    );
    this.maPhieu = 'PKTCL-' + this.userInfo.DON_VI.tenVietTat;
    this.formData.get('chungLoaiGao')?.valueChanges.pipe(startWith(this.formData.get('chungLoaiGao')?.value), pairwise()).subscribe(([prevValue, currentValue]) => {
      if (currentValue && currentValue !== prevValue) {
        this.loadDsChiTieuChatLuong(currentValue)
      }
    });
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinh(),
        // this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
        this.loadDsVthh(),
        this.loadDmDanhBongGao('DANH_BONG'),
        this.loadDmMucXatGao('MUC_XAT')
      ])
      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuKiemTraChatLuongService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const hinhThucBq = res.data.hinhThucBq ? JSON.parse(res.data.hinhThucBq) : [];
            this.helperService.bidingDataInFormGroupAndIgnore(this.formData, { ...res.data, hinhThucBq, tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho }, ['chungLoaiGao']);
            this.formData.controls["chungLoaiGao"].setValue(res.data.chungLoaiGao, { emitEvent: false })
            // this.formData.patchValue({ ...res.data, hinhThucBq, tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
            const data = res.data;
            this.listFileDinhKem = data.fileDinhKems;
            this.dataTableChiTieu = data.ketQuaPhanTich;
            this.radioValue = data.type;
            if (res.data.cloaiVthh) {
              this.loadDanhMucPhuongThucBaoQuan(res.data.cloaiVthh)
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XC_PHIEU_KN_CL_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        nguoiKn: this.userInfo.TEN_DAY_DU,
        truongPhong: this.userInfo.MA_KTBQ,
        soPhieuKtCl: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
        ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
        // loaiVthh: this.loaiVthh
      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }
  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: '0102' });
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChungLoaiGao = Array.isArray(res.data) ? res.data : [];
    }
  }
  async loadDsChiTieuChatLuong(cloaiVthh: string) {
    try {
      await this.spinner.show();
      if (!cloaiVthh) return;
      this.dataTableChiTieu = [];
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          res.data.forEach(item => {
            let option = {
              tenTchuan: item.tenChiTieu,
              value: item.id,
              chiSoXuat: item.mucYeuCauXuat,
              chiSoNhap: item.mucYeuCauNhap,
              chiSoClToiThieu: item.mucYeuCauXuatToiThieu,
              chiSoClToiDa: item.mucYeuCauXuatToiDa,
              toanTu: item.toanTu,
              phuongPhap: item.phuongPhapXd,
              maChiTieu: item.maChiTieu,
              thuTu: item.thuTuHt
            };
            this.dataTableChiTieu.push(option);
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("err", error)
    }
    finally {
      await this.spinner.hide()
    }
  }
  async loadDanhMucPhuongThucBaoQuan(cloaiVthh: string) {
    try {
      if (!cloaiVthh) return;
      const res = await this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh);
      if (res.msg === MESSAGE.SUCCESS) {
        const dsHinhThucBq = Array.isArray(res.data.hinhThucBq) ? res.data.hinhThucBq.map(item => ({ ten: item.giaTri, label: item.giaTri, value: item.ma, checked: true })) : [];
        this.formData.controls['hinhThucBq'].setValue(dsHinhThucBq)
      }
    } catch (error) {
      console.log("e", error)
    }
  }
  async loadDmDanhBongGao(ma: string) {
    const res = await this.danhMucDungChungService.danhMucChungGetAll(ma);
    if (res.msg === MESSAGE.SUCCESS) {
      this.dmDanhBongGao = Array.isArray(res.data) ? res.data : []
    }

  }
  async loadDmMucXatGao(ma: string) {
    const res = await this.danhMucDungChungService.danhMucChungGetAll(ma);
    if (res.msg === MESSAGE.SUCCESS) {
      this.dmMucXatGao = Array.isArray(res.data) ? res.data : []
    }
  }
  // async loadDanhMucPhuongThucBaoQuan() {
  //   let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.content) {
  //       this.listHinhThucBaoQuan = res.data.content;
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: this.loaiVthh,
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      types: [this.type]
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      // this.listSoQuyetDinh = data.content;
      this.listSoQuyetDinh = data.content.filter(f => f.dataDtl.some(f => f.trangThai === STATUS.DA_HOAN_THANH));
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadDsBbTinhKho() {
    try {
      const body = {
        trangThai: STATUS.DA_DUYET_LDCC,
        soQdGiaoNvXh: this.formData.value.soQdGiaoNvXh,
        type: this.type
      };
      const res = await this.bienBanTinhKhoService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listBbTinhKho = Array.isArray(res.data?.content) ? res.data.content : [];
      }
    } catch (error) {
      console.log("e", error)
    }
  }
  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soBbQd', 'ngayKy', 'tenVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvXh: data.soBbQd,
      idQdGiaoNvXh: data.id,
      thoiHanXuatCtVt: data.ngayKy,
      // soLuongXuat: data.soLuong,
    });
    dataRes.data.dataDtl.forEach(s => {
      s.maDiemKho = s.maDvi.length >= 10 ? s.maDvi.substring(0, 10) : null;
      s.maNhaKho = s.maDvi.length >= 12 ? s.maDvi.substring(0, 12) : null;
      s.maNganKho = s.maDvi.length >= 14 ? s.maDvi.substring(0, 14) : null;
      s.maLoKho = s.maDvi.length >= 16 ? s.maDvi.substring(0, 16) : null;
    });
    // const dataChiCuc = dataRes.data.dataDtl.filter(item => item.maDvi && item.maDvi.slice(0, 8) == this.userInfo.MA_DVI && item.trangThai === STATUS.DA_HOAN_THANH);
    // if (dataChiCuc) {
    //   this.listDiaDiemNhap = dataChiCuc;
    // }
    this.loadDsBbTinhKho();
    await this.spinner.hide();
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
      this.bindingDataDdNhap(data, false);
    });
  }

  async bindingDataDdNhap(data, isChiTiet) {
    if (data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        thuKho: data.tenThuKho,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho
      })
      // if (!isChiTiet) {
      //   let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      //   if (dmTieuChuan.data) {
      //     this.dataTableChiTieu = dmTieuChuan.data.children;
      //     this.dataTableChiTieu.forEach(element => {
      //       element.edit = false
      //     });
      //   }
      // }
      this.loadDanhMucPhuongThucBaoQuan(data.cloaiVthh)
    }
  }
  openDialogBienBanTinhKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản tịnh kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBbTinhKho,
        dataHeader: ['Số biên bản tịnh kho', 'Ngày lập biên bản tịnh kho', 'Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['soBbTinhKho', 'ngayTaoBb', 'tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.spinner.show()
      await this.bindingDataBbTinhKho(data, false);
      this.spinner.hide();
    });
  }
  async bindingDataBbTinhKho(dataBbTinhKho, isChiTiet) {
    if (dataBbTinhKho) {
      let data;
      if (dataBbTinhKho.id) {
        const res = await this.bienBanTinhKhoService.getDetail(dataBbTinhKho.id);
        if (res.msg === MESSAGE.SUCCESS) {
          data = res.data
        }
      }
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        thuKho: data.tenThuKho,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        soBbTinhKho: data.soBbTinhKho,
        idBbTinhKho: data.id,
        soLuongXuat: data.tongSlXuat
      })
      // if (!isChiTiet && data) {
      //   let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      //   if (dmTieuChuan.data) {
      //     this.dataTableChiTieu = dmTieuChuan.data.children;
      //     this.dataTableChiTieu.forEach(element => {
      //       element.edit = false
      //     });
      //   }
      // }
      await this.loadDanhMucPhuongThucBaoQuan(data.cloaiVthh)
    }
  }
  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    const hinhThucBq = this.formData.value.hinhThucBq ? JSON.stringify(this.formData.value.hinhThucBq) : "";
    body.fileDinhKems = this.listFileDinhKem;
    body.ketQuaPhanTich = this.dataTableChiTieu;
    body.type = this.radioValue;
    body.hinhThucBq = hinhThucBq;
    let data = await this.createUpdate(body, null, isGuiDuyet);
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
  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
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

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }

}
