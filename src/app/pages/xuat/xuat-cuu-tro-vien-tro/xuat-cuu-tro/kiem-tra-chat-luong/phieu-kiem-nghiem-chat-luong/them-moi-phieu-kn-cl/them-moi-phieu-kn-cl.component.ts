import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {
  BienBanLayMauBanGiaoMauService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanLayMauBanGiaoMau.service';
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
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {
  PhieuKiemNghiemChatLuongService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
import {KhCnQuyChuanKyThuat} from "../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {PREVIEW} from "../../../../../../../constants/fileType";

;

@Component({
  selector: 'app-them-moi-phieu-kn-cl',
  templateUrl: './them-moi-phieu-kn-cl.component.html',
  styleUrls: ['./them-moi-phieu-kn-cl.component.scss']
})
export class ThemMoiPhieuKnClComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  dataTableChiTieu: any[] = [];
  listTieuChuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  maVthh: string;

  templateName = "Phiếu kiểm nghiệm chất lượng";
  templateNameVt = "Phiếu kiểm nghiệm chất lượng vật tư";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private bienBanLayMauBanGiaoMauService: BienBanLayMauBanGiaoMauService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        maQhNs: [],
        soPhieu: [],
        ngayLapPhieu: [],
        ngayKnMau: [],
        idBienBan: [],
        soBienBan: [],
        ngayLayMau: [],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: [],
        ngayQdGiaoNvXh: [],
        nguoiKn: [],
        truongPhong: [],
        thuKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        moTaHangHoa: [],
        maDiemKho: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        hinhThucBq: [],
        noiDung: [],
        ketLuan: [],
        trangThai: [STATUS.DU_THAO],
        ngayGduyet: [],
        nguoiGduyetId: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        lyDoTuChoi: [],
        type: [],
        soBbTinhKho: [],
        soBbXuatDocKho: [],
        ngayXuatDocKho: [],
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

      }
    );
    this.maPhieu = 'PKNCL-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();

      await Promise.all([
        this.loadBbLayMau(),
        this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
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
      await this.phieuKiemNghiemChatLuongService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.listFileDinhKem = data.fileDinhKems;
            this.dataTableChiTieu = data.ketQuaPhanTich;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_CTVT_PHIEU_KN_CL_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        nguoiKn: this.userInfo.TEN_DAY_DU,
        truongPhong: this.userInfo.MA_KTBQ,
        soPhieu: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
        ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
        loaiVthh: this.loaiVthh,
      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadBbLayMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
    }
    let res = await this.bienBanLayMauBanGiaoMauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listBbLayMau = res.data.content
      }
    }
  }

  openDialogBbLayMau() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBbLayMau,
        dataHeader: ['Số BB lấy mẫu/bàn giao mẫu', 'Ngày lấy mẫu', 'Số QĐ Giao NV XH',],
        dataColumn: ['soBienBan', 'ngayLayMau', 'soQdGiaoNvXh']
      },
    });

    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataBbLayMau(data.id, false);
      }
    });

  }

  async bindingDataBbLayMau(id, isChiTiet) {
    let res = await this.bienBanLayMauBanGiaoMauService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        soBienBan: data.soBienBan,
        idBienBan: data.id,
        soQdGiaoNvXh: data.soQdGiaoNvXh,
        idQdGiaoNvXh: data.idQdGiaoNvXh,
        ngayQdGiaoNvXh: data.ngayQdGiaoNvXh,
        ngayLayMau: data.ngayLayMau,
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


      })
      if (!isChiTiet) {
        let [dmTieuChuan] = await Promise.all([this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(data.cloaiVthh)])
        if (dmTieuChuan.data) {
          console.log(dmTieuChuan.data, "dmTieuChuan.data")
          this.dataTableChiTieu = Array.isArray(dmTieuChuan.data) ? dmTieuChuan.data.map(element => ({
            edit: false,
            chiSoXuat: element.mucYeuCauXuat,
            tenTchuan: element.tenChiTieu,
            maChiTieu: element.maChiTieu,
            danhGia: element.danhGia,
            hdrId: element.hdrId,
            id: element.id,
            ketQuaPt: element.ketQuaPt,
            phuongPhap: element.phuongPhapXd
          })) : [];
        }
      }
    }
  }

  async loadDanhMucPhuongThucBaoQuan() {
    let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.ketQuaPhanTich = this.dataTableChiTieu;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      }
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soBienBan"].setValidators([Validators.required]);
      this.formData.controls["soQdGiaoNvXh"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["tenDiemKho"].setValidators([Validators.required]);
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';

    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      } else {
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
