import {Component, Input, OnInit,} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import {DANH_MUC_LEVEL} from "src/app/pages/luu-kho/luu-kho.constant";
import {DonviService} from "src/app/services/donvi.service";

@Component({
  selector: 'app-create-giao-xh',
  templateUrl: './create-giao-xh.component.html',
  styleUrls: ['./create-giao-xh.component.scss'],
})
export class CreateGiaoXh extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isDetail;

  maQd: string = null;
  dataInput: any;
  dataInputCache: any;
  formDataRow: FormGroup;
  listDiaDiem: any = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year'), Validators.required],
      soQd: ['',],
      maDvi: [''],
      tenDvi: [''],
      ngayKy: ['',],
      idHd: [],
      soHd: [''],
      ngayKyHd: [''],
      maDviTsan: [''],
      tenTtcn: ['',],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      donViTinh: [''],
      tgianGnhan: [''],
      trichYeu: [''],
      soLuong: [],
      trangThaiXh: [''],
      bbTinhKho: [''],
      bbHaoDoi: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      fileName: [],
      lyDoTuChoi: []
    });

    this.formDataRow = this.fb.group({
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      soLuong: [],
    })
  }

  setValidator(isGuiDuyet?) {
    // if (isGuiDuyet) {
    //   this.formData.controls["soQdPd"].setValidators([Validators.required]);
    //   this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    //   this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    // } else {
    //   this.formData.controls["soQdPd"].clearValidators();
    //   this.formData.controls["ngayKyQd"].clearValidators();
    //   this.formData.controls["ngayHluc"].clearValidators();
    // }
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await Promise.all([
        this.loadDiemKho()
      ]);
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async openDialogSoHopDong() {
    this.spinner.show();
    let dsQdPd = []
    let re = await this.hopDongXuatHangService.search({
        trangThai: STATUS.DA_KY,
        maDvi: this.formData.value.maDvi,
        nam: this.formData.value.nam
      }
    ).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          dsQdPd = data.content;
        }
      }
    });
    console.log(re, 1111)
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách căn cứ trên hợp đồng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsQdPd,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.hopDongXuatHangService.getDetail(data.id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              const data = res.data;
              this.formData.patchValue({
                soHd: data.soHd,
                idHd: data.id,
                ngayKyHd: data.ngayHluc,
                maDviTsan: data.maDviTsan,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
                moTaHangHoa: data.moTaHangHoa,
                soLuong: data.soLuong,
                donViTinh: data.donViTinh,
                tgianGnhan: data.tgianGnhan,
                trichYeu: data.trichYeu,
                tenTtcn: data.tenNguoiDdien
              })
              this.dataTable = data.children;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        })
      }
    });
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        this.goBack()
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
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
        msg = MESSAGE.BAN_HANH_CONFIRM;
        trangThai = STATUS.BAN_HANH;
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

  async loadChiTiet(id: number) {
    if (id > 0) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQd: data.soQd?.split('/')[0]
      })
      this.dataTable = data.children;
    }
    ;
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.BAN_HANH || trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  getNameFileQD($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({fileDinhKem: fileDinhKemQd, fileName: itemFile.name})
        });
    }
  }

  async loadDiemKho() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };
    this.listDiaDiem = await this.donviService.layDonViTheoCapDo(body);
    let res = this.listDiaDiem[DANH_MUC_LEVEL.DIEM_KHO];
    this.listDiemKho = res.filter(item => item.type == "MLK")
  }

  async changeDiemKho(maDiemKho: any) {
    this.formDataRow.patchValue({
      maNhaKho: null,
      maNganKho: null,
      maLoKho: null,
      tenNhaKho: null,
      tenNganKho: null,
      tenLoKho: null,
    })
    let res = this.listDiaDiem[DANH_MUC_LEVEL.NHA_KHO];
    this.listNhaKho = res.filter(item => item.type == "MLK" && item.maDviCha == maDiemKho)
  }
  async changeNhaKho(maNhaKho: any) {
    this.formDataRow.patchValue({
      maNganKho: null,
      maLoKho: null,
      tenNganKho: null,
      tenLoKho: null,
    })
    let res = this.listDiaDiem[DANH_MUC_LEVEL.NGAN_KHO];
    this.listNganKho = res.filter(item => item.type == "MLK" && item.maDviCha == maNhaKho)
  }
  async changeNganKho(maNganKho: any) {
    this.formDataRow.patchValue({
      maLoKho: null,
      tenLoKho: null,
    })
    let res = this.listDiaDiem[DANH_MUC_LEVEL.LO_KHO];
    this.listLoKho = res.filter(item => item.type == "MLK" && item.maDviCha == maNganKho)
  }

  clearRow() {

  }

  addRow() {

  }
}
