import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {
  HopDongThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HopDongThanhLy.service";
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-thong-tin-hop-dong-thanh-ly',
  templateUrl: './thong-tin-hop-dong-thanh-ly.component.html',
  styleUrls: ['./thong-tin-hop-dong-thanh-ly.component.scss']
})
export class ThongTinHopDongThanhLyComponent extends Base2Component implements OnInit, OnChanges {
  @Input() id: number;
  @Input() idKqTl: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  sendListAllDviTsan = new EventEmitter<any>();
  listLoaiHopDong: any[] = [];
  maHopDongSuffix: string = '';
  listDviTsanFilter: any[] = [];
  listToChucTrungDg: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongThanhLyService: HopDongThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongThanhLyService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: [''],
        tenDvi: [''],
        idQdKqTl: [],
        soQdKqTl: [''],
        ngayKyQdkqTl: [''],
        soQdTl: [''],
        toChucCaNhan: [''],
        maDviTsan: [''],
        listMaDviTsan: [null, [Validators.required]],
        thoiHanXuatKho: [''],
        loaiHinhNx: [''],
        kieuNx: [''],
        soHd: [''],
        tenHd: [''],
        ngayHieuLuc: [''],
        ghiChuNgayHluc: [''],
        loaiHdong: [''],
        ghiChuLoaiHdong: [''],
        tgianThienHd: [],
        tgianBhanh: [],
        diaChiBenBan: [''],
        mstBenBan: [''],
        daiDienBenBan: [''],
        chucVuBenBan: [''],
        sdtBenBan: [''],
        faxBenBan: [''],
        stkBenBan: [''],
        moTaiBenBan: [''],
        thongTinUyQuyen: [''],
        diaChiBenMua: [''],
        mstBenMua: [''],
        daiDienBenMua: [''],
        chucVuBenMua: [''],
        sdtBenMua: [''],
        faxBenMua: [''],
        stkBenMua: [''],
        moTaiBenMua: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        soLuong: [],
        thanhTien: [],
        ghiChu: [''],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  save() {
  }

  openDialogKqTlBdg() {
  }

  maDviTsan($event) {
  }

  selectMaDviTsan($event) {
  }

  isDisabled() {
    return false;
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }
}

