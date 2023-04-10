import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {STATUS} from "../../../../../../../constants/status";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import dayjs from 'dayjs';
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKqLcnt.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {HopdongService} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/hopdong.service";
import {
  CongViec
} from "../../../quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt.component";

@Component({
  selector: 'app-them-moi-hop-dong',
  templateUrl: './them-moi-hop-dong.component.html',
  styleUrls: ['./them-moi-hop-dong.component.scss']
})
export class ThemMoiHopDongComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  @Input()
  flagThemMoi: string;
  STATUS = STATUS;
  idPhuLuc: number;
  isViewPl: boolean
  isViewHd: boolean = false;
  hauToSoHd = "/" + dayjs().get('year') + "/HĐMB";
  listQdPdKhlcnt: any[] = [];
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listGoiThau: any[] = [];
  listFile: any[] = []
  listPhuLuc: any[] = [];
  listKlcv: any[] = [];
  rowItemKlcv: KhoiLuongCongViec = new KhoiLuongCongViec();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService,
    private hopdongService: HopdongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      idQdPdKqlcnt: [null, Validators.required],
      soQdPdKqlcnt: [null, Validators.required],
      ngayKyKqlcnt: [],
      idQdPdKhlcnt: [null, Validators.required],
      soQdPdKhlcnt: [null, Validators.required],
      tenGoiThau: [],
      idGoiThau: [],
      soHd: [null, Validators.required],
      tenHd: [null, Validators.required],
      ngayHieuLuc: [],
      ghiChuHieuLuc: [],
      loaiHopDong: [null, Validators.required],
      ghiChuLoaiHd: [],
      thoiGianThHd: [],
      thoiGianBh: [],
      loai: ['00'],
      ghiChu: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      cdtTen: [],
      cdtDiaChi: [],
      cdtMst: [],
      cdtNguoiDaiDien: [],
      cdtChucVu: [],
      cdtSdt: [],
      cdtStk: [],
      dvccTen: [],
      dvccDiaChi: [],
      dvccMst: [],
      dvccNguoiDaiDien: [],
      dvccChucVu: [],
      dvccSdt: [],
      dvccStk: [],
      thanhTien: [],
      thanhTienBangChu: [],
      fileDinhKems: [null],
      listKtXdscTdxdHopDongKlcv: [[]]
    });
  }

  ngOnInit(): void {
  }


  async save(isKy?) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.formData.value.soHd = this.formData.value.soHd + this.hauToSoHd;
    if (this.listGoiThau && this.listGoiThau.length > 0) {
      // this.listGoiThau.forEach(item => {
      //   item.id = null
      // })
      this.formData.value.listKtXdscQuyetDinhPdKqlcntDsgt = this.listGoiThau;
      this.formData.value.listKtXdscQuyetDinhPdKqlcntDsgt.forEach(item => {
        item.idGoiThau = item.id;
        item.id = null
      })
    } else {
      this.notification.success(MESSAGE.ERROR, "Kết quả lựa chọn nhà thầu không được để trống.");
      return;
    }
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    if (isKy) {
      let res = await this.createUpdate(this.formData.value)
      if (res.msg == MESSAGE.SUCCESS) {
        this.approve(res.id, STATUS.DA_KY, 'Ký hợp đồng');
      }
    } else {
      this.createUpdate(this.formData.value)
    }
  }

  changeGoiThau(event) {

  }

  chonQdPdKqLCNT() {

  }

  redirectToPhuLuc(isView: boolean, id: number) {
    this.idPhuLuc = id;
    this.isViewHd = true;
    this.isViewPl = isView;
  }

  goBackPl(event) {
    this.isViewHd = false;
    if (event) {
      this.detail(this.idInput)
    }
  }

  async detail(id) {
    //   this.spinner.show();
    //   try {
    //     let res = await this.hopDongService.getDetail(id);
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (res.data) {
    //         const data = res.data;
    //         this.changeSoQdMs(data.soQdpdKhMuaSam);
    //         this.helperService.bidingDataInFormGroup(this.formData, data);
    //         this.formData.patchValue({
    //           soHopDong: this.formData.value.soHopDong ? this.formData.value.soHopDong.split('/')[0] : null
    //         })
    //         this.fileDinhKem = data.listFileDinhKems;
    //         this.dataTable = data.listQlDinhMucHdLoaiHh;
    //         this.listPhuLuc = data.listPhuLuc
    //         this.listDiaDiem = data.listQlDinhMucHdDiaDiemNh;
    //         this.buildDiaDiemTc()
    //         this.updateEditCache()
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //       this.spinner.hide();
    //     }
    //   } catch (e) {
    //     this.notification.error(MESSAGE.ERROR, e);
    //     this.spinner.hide();
    //   } finally {
    //     this.spinner.hide();
    //   }
  }

  deleteDetail(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopdongService.delete(body).then(async () => {
            await this.detail(this.idInput);
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
}

export class KhoiLuongCongViec {
  id: number;
  tenCongViec: string;
  donViTinh: string;
  khoiLuong: number;
  donGia: string;
  thanhTien: string;
  ghiChu: string;
}
