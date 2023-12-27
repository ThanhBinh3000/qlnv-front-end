import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { PhieuNhapKhoMuaTrucTiepService } from 'src/app/services/phieu-nhap-kho-mua-truc-tiep.service';
import {
  MttPhieuKiemTraChatLuongService
} from "../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttPhieuKiemTraChatLuongService.service";


@Component({
  selector: 'app-them-moi-phieu-nhap-kho',
  templateUrl: './them-moi-phieu-nhap-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-kho.component.scss']
})
export class ThemMoiPhieuNhapKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() isTatCa: boolean;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];

  fileDinhKems: any[] = [];
  dataTable: any[] = [];
  previewName: string = 'ntt_phieu_nhap_kho';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuNhapKhoMuaTrucTiepService: PhieuNhapKhoMuaTrucTiepService,
    private phieuKtraCluongService: MttPhieuKiemTraChatLuongService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuNhapKhoMuaTrucTiepService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      idQdGiaoNvNh: [],
      idDdiemGiaoNvNh: [],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],
      soPhieuNhapKho: [],
      ngayNkho: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      no: [],
      co: [],
      soQuyetDinhNhap: [],
      soHdong: [],
      ngayKiHdong: [],
      maDiemKho: [],
      tenDiemKho: [],
      maNhaKho: [],
      tenNhaKho: [],
      maNganKho: [],
      tenNganKho: [],
      maLoKho: [],
      tenLoKho: [],
      soPhieuKtraCluong: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      moTaHangHoa: [],
      canBoLapPhieu: [],
      lanhDaoChiCuc: [],
      ktvBaoQuan: [],
      keToanTruong: [],
      hoTenNguoiGiao: [],
      cmt: [],
      donViGiao: [],
      diaChiNguoiGiao: [],
      thoiGianGiaoNhan: [],
      soBangKeCanHang: [''],
      trangThaiBk: [''],
      ghiChu: [],
      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      donGiaHd: [''],
      donViTinhHd: ['kg'],
      nguoiPduyet: [],
      tenNganLoKho: [],
      ngayGdinh: [],
      soBangKe: [],
      loaiQd: [],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("HH_PHIEU_NHAP_KHO_HDR_SEQ");
    console.log(res, 999)
    this.formData.patchValue({
      soPhieuNhapKho: `${res}/${this.formData.get('namKh').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      canBoLapPhieu: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      namNhap: this.formData.get('namKh').value,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
      loaiVthh: this.loaiVthh
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh()
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
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
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
    let dataRes = await this.quyetDinhGiaoNvNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQuyetDinhNhap: data.soQd,
      soHdong: data.soHd,
      ngayKiHdong: data.ngayKyHd,
      idQdGiaoNvNh: data.id,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      loaiQd: data.loaiQd,
      donGiaHd: data.hopDongMttHdrs[0]?.donGiaGomThue
    });
    let dataChiCuc = data.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi.includes(this.userInfo.MA_DVI));
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
    }
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: ' Danh sách địa điểm nhập hàng ',
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
      if (data) {
        console.log(data)
        this.dataTable = [];

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
          tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        });
        this.listPhieuKtraCl = [];
        this.listPhieuKtraCl = data.listPhieuKtraCl.filter(item => (item.trangThai == STATUS.DA_DUYET_LDCC));
        this.formData.patchValue({
          soPhieuKtraCluong: '',
        });
        let dataObj = {
          moTaHangHoa: this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh,
          maSo: '',
          donViTinh: this.formData.value.donViTinhHd,
          soLuongChungTu: 0,
          soLuongThucNhap: 0,
          donGia: this.formData.value.donGiaHd,
        }
        this.dataTable.push(dataObj)
      }
    });
  }

  openDialogPhieuKtraCl() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm tra chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKtraCl,
        dataHeader: ['Số phiếu', 'Ngày giám định'],
        dataColumn: ['soPhieu', 'ngayGdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        let phieuKtraCl = await this.phieuKtraCluongService.getDetail(data.id);
        this.formData.patchValue({
          soPhieuKtraCluong: phieuKtraCl.data.soPhieu,
          ktvBaoQuan: phieuKtraCl.data.ktvBaoQuan,
          ngayGdinh: phieuKtraCl.data.ngayGdinh,
          soBangKe: phieuKtraCl.data.soBangKe,
        });
        console.log(this.dataTable, 123)
        this.dataTable[0].soLuongThucNhap = phieuKtraCl.data.soLuongNhapKho;
        this.dataTable[0].soLuongChungTu = phieuKtraCl.data.soLuongDeNghiKt;
      }
    });
  }

  async loadChiTiet(id) {
    let res = await this.phieuNhapKhoMuaTrucTiepService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        const data = res.data;
        console.log(data)
        this.helperService.bidingDataInFormGroup(this.formData, data);
        this.dataTable = data.hhPhieuNhapKhoCtList;
        this.fileDinhKems = data.fileDinhKems
        this.formData.patchValue({
          soBangKeCanHang: data.hhBcanKeHangHdr?.soBangKeCanHang,
          trangThaiBk: data.hhBcanKeHangHdr?.trangThai,
          tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        })
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
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
      nzWidth: 500,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          let res =
            await this.phieuNhapKhoMuaTrucTiepService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quaiLai();
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
            await this.phieuNhapKhoMuaTrucTiepService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.quaiLai();
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

  quaiLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet: boolean) {
    await this.spinner.show();
    try {
      this.setValidator();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let pipe = new DatePipe('en-US');
      let body = this.formData.value;
      body.phieuNhapKhoCtList = this.dataTable;
      body.fileDinhKems = this.fileDinhKems;
      body.thoiGianGiaoNhan = pipe.transform(this.formData.value.thoiGianGiaoNhan, 'yyyy-MM-dd HH:mm')
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.phieuNhapKhoMuaTrucTiepService.update(body);
      } else {
        res = await this.phieuNhapKhoMuaTrucTiepService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
          this.id = res.data.id;
          this.pheDuyet();
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.quaiLai();
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.quaiLai();
          }
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, (e?.error?.message ?? MESSAGE.SYSTEM_ERROR));
      await this.spinner.hide();
    }
  }

  setValidator() {
    this.formData.controls["soPhieuKtraCluong"].setValidators([Validators.required]);
  }

  print() {

  }

  clearItemRow(i) {
    this.dataTable[i] = {};
  }

}
