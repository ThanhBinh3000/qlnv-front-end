import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {
  QuyetDinhThanhLyService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
import {QuanLyHangTrongKhoService} from "src/app/services/quanLyHangTrongKho.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "src/app/constants/status";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {
  BaoCaoKqDtl
} from "src/app/pages/xuat/xuat-thanh-ly/quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly.component";

@Component({
  selector: 'app-chi-tiet-ho-so-thanh-ly',
  templateUrl: './chi-tiet-ho-so-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-ho-so-thanh-ly.component.scss']
})
export class ChiTietHoSoThanhLyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donViService: DonviService,
              private danhMucService: DanhMucService,
              private quyetDinhThanhLyService: QuyetDinhThanhLyService,
              private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
              private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhThanhLyService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    this.formData = this.fb.group({

      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBaoCao: ['', [Validators.required]],
      ngayBaoCao: [],
      idQd: ['', [Validators.required]],
      soQd: ['', [Validators.required]],
      noiDung: ['', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tongSoLuongTl: [],
      tongSoLuongCon: [],
      tongThanhTien: [],
      ngayTao: [],
      nguoiTaoId: [],
      ngaySua: [],
      nguoiSuaId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      lyDoTuChoi: [],
      tenDvi: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      baoCaoKqDtl: [new Array<BaoCaoKqDtl>()],

    });
  }

  ngOnInit(): void {
  }

}
