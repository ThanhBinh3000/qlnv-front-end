import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {DanhMucTieuChuanService} from "../../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  PhieuKiemNghiemChatLuongService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service";
import {
  BienBanLayMauBanGiaoMauService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanLayMauBanGiaoMau.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-chi-tiet-ho-so-ky-thuat',
  templateUrl: './chi-tiet-ho-so-ky-thuat.component.html',
  styleUrls: ['./chi-tiet-ho-so-ky-thuat.component.scss']
})
export class ChiTietHoSoKyThuatComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output() showListEvent = new EventEmitter<any>();
  private flagInit = false;
  public dsQdPd: any;
  public dsNoiDung: any;
  public dsDonVi: any;
  listLoaiHangHoa: any[] = []
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  expandSetString = new Set<string>();
  noiDungCuuTroView = [];
  noiDungRow: any = {};
  isVisible = false;
  listNoiDung: any;
  listChungLoaiHangHoa: any[] = [];
  statusForm: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private bienBanLayMauBanGiaoMauService: BienBanLayMauBanGiaoMauService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        maQhNs: [],
        soPhieu: [],
        ngayLapPhieu: [],
        ngayKnMau: [],
        idBienBan: [],
        soBienBan: ['', [Validators.required]],
        ngayLayMau: [],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
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
  }

  ngOnInit(): void {
  }

}
