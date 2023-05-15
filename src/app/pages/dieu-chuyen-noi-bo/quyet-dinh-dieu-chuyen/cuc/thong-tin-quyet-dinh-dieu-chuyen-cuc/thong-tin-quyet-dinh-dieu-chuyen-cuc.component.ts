import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { DanhMucService } from "src/app/services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import { DonviService } from "src/app/services/donvi.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep, sortBy } from 'lodash';
import { STATUS } from "src/app/constants/status";
import { ThongTinHangCanDieuChuyenCucComponent } from "../thong-tin-hang-can-dieu-chuyen-cuc/thong-tin-hang-can-dieu-chuyen-cuc.component";
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";

export class QuyetDinhPdDtl {
  idVirtual: number;
  id: number;
  idHdr: number;
  idDx: number;
  soDx: string;
  maDviDx: string;
  ngayPduyetDx: Date;
  trichYeuDx: string;
  tongSoLuongDx: number;
  soLuongXuatCap: number;
  thanhTienDx: number;
  ngayKetThucDx: Date;
  tenDviDx: string;
  quyetDinhPdDx: Array<any> = [];
}

@Component({
  selector: 'app-thong-tin-quyet-dinh-dieu-chuyen-cuc',
  templateUrl: './thong-tin-quyet-dinh-dieu-chuyen-cuc.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-dieu-chuyen-cuc.component.scss']
})
export class ThongTinQuyetDinhDieuChuyenCucComponent extends Base2Component implements OnInit {

  // @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  // @Input() idTongHop: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  // @Input() id: number;
  // @Input() dataTongHop: any;

  canCu: any[] = [];
  quyetDinh: any[] = [];

  listQuyetDinh: any[] = [];

  maQd: string = null;
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean;
  load: boolean = false;
  listDanhSachTongHop: any[] = [];
  listDanhSachDeXuat: any[] = [];
  danhSachTongHop: any[] = [];
  // danhsachDx: any[] = [];

  deXuatPhuongAn: any[] = [];
  deXuatPhuongAnCache: any[] = [];
  phuongAnView: any[] = [];
  phuongAnViewCache: any[] = [];
  listThanhTien: number[];
  listSoLuong: number[];
  listThanhTienCache: number[];
  listSoLuongCache: number[];
  expandSetString = new Set<string>();
  expandSetStringCache = new Set<string>();
  tongSoLuongDxuat = 0;
  tongThanhTienDxuat = 0;
  phuongAnRow: any = {};
  dsDonVi: any;
  listChiCuc: any[] = [];
  listChiCucNhan: any[] = [];
  isVisible = false;
  listNoiDung = []
  listChungLoaiHangHoa: any[] = [];
  quyetDinhPdDtlCache: any[] = [];
  deXuatSelected: any = []

  listDiemKho: any[] = [];
  listDiemKhoNhan: any[] = [];

  listLoaiQD: any[] = [
    {
      value: "00",
      text: "Nhập điều chuyển"
    },
    {
      value: "01",
      text: "Xuất điều chuyển"
    }
  ];

  listLoaiDC: any[] = [
    {
      value: "DCNB",
      text: "Trong nội bộ Chi cục"
    },
    {
      value: "CHI_CUC",
      text: "Giữa 2 chi cục trong cùng 1 cục"
    },
    {
      value: "CUC",
      text: "Giữa 2 cục DTNN KV"
    }
  ];

  listOfMapData: any[] = [
    // {
    //   key: `1`,
    //   chicuc: 'chicuc',
    //   dtkp: 'dtkp',
    //   isEx: true,
    //   children: [
    //     {
    //       key: `1-1`,
    //       diemkho: 'diemkho',
    //       lokho: 'lokho',
    //       loaihh: 'loaihh',
    //       clhh: 'clhh',
    //       dvt: 'dvt',
    //       tonkho: 'tonkho',
    //       sldc: 'sldc',
    //       dtkp: 'dtkp',
    //       thoigian: 'thoigian',
    //       diemkhoden: 'diemkhoden',
    //       nhakhoden: 'nhakhoden',
    //       ngankhoden: 'ngankhoden',
    //       lokhoden: 'lokhoden',
    //       tdthukho: 'tdthukho',
    //       tlkd: 'tlkd',
    //       slpb: 'slpb',
    //       isCol: false,
    //     },
    //     {
    //       key: `1-2`,
    //       diemkho: 'diemkho',
    //       isCol: true,
    //       children: [
    //         {
    //           key: `1-2-1`,
    //           lokho: 'lokho',
    //           loaihh: 'loaihh',
    //           clhh: 'clhh',
    //           dvt: 'dvt',
    //           tonkho: 'tonkho',
    //           sldc: 'sldc',
    //           dtkp: 'dtkp',
    //           thoigian: 'thoigian',
    //           diemkhoden: 'diemkhoden',
    //           nhakhoden: 'nhakhoden',
    //           ngankhoden: 'ngankhoden',
    //           lokhoden: 'lokhoden',
    //           tdthukho: 'tdthukho',
    //           tlkd: 'tlkd',
    //           slpb: 'slpb',
    //         },
    //         {
    //           key: `1-2-2`,
    //           lokho: 'lokho',
    //           loaihh: 'loaihh',
    //           clhh: 'clhh',
    //           dvt: 'dvt',
    //           tonkho: 'tonkho',
    //           sldc: 'sldc',
    //           dtkp: 'dtkp',
    //           thoigian: 'thoigian',
    //           diemkhoden: 'diemkhoden',
    //           nhakhoden: 'nhakhoden',
    //           ngankhoden: 'ngankhoden',
    //           lokhoden: 'lokhoden',
    //           tdthukho: 'tdthukho',
    //           tlkd: 'tlkd',
    //           slpb: 'slpb',
    //         },
    //         {
    //           key: `1-2-3`,
    //           lokho: 'lokho',
    //           loaihh: 'loaihh',
    //           clhh: 'clhh',
    //           dvt: 'dvt',
    //           tonkho: 'tonkho',
    //           sldc: 'sldc',
    //           dtkp: 'dtkp',
    //           thoigian: 'thoigian',
    //           diemkhoden: 'diemkhoden',
    //           nhakhoden: 'nhakhoden',
    //           ngankhoden: 'ngankhoden',
    //           lokhoden: 'lokhoden',
    //           tdthukho: 'tdthukho',
    //           tlkd: 'tlkd',
    //           slpb: 'slpb',
    //         }
    //       ]
    //     },
    //     {
    //       key: `1-3`,
    //       diemkho: 'diemkho',
    //       isCol: true,
    //       children: [
    //         {
    //           key: `1-3-1`,
    //           lokho: 'lokho',
    //           loaihh: 'loaihh',
    //           clhh: 'clhh',
    //           dvt: 'dvt',
    //           tonkho: 'tonkho',
    //           sldc: 'sldc',
    //           dtkp: 'dtkp',
    //           thoigian: 'thoigian',
    //           diemkhoden: 'diemkhoden',
    //           nhakhoden: 'nhakhoden',
    //           ngankhoden: 'ngankhoden',
    //           lokhoden: 'lokhoden',
    //           tdthukho: 'tdthukho',
    //           tlkd: 'tlkd',
    //           slpb: 'slpb',
    //           // children: [
    //           //   {
    //           //     key: `1-3-1-1`,
    //           //     name: '1-3-1-1 Jim Green jr.',
    //           //     age: 25,
    //           //     address: 'London No. 3 Lake Park'
    //           //   },
    //           //   {
    //           //     key: `1-3-1-2`,
    //           //     name: '1-3-1-2 Jimmy Green sr.',
    //           //     age: 18,
    //           //     address: 'London No. 4 Lake Park'
    //           //   }
    //           // ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   key: `2`,
    //   chicuc: 'chicuc',
    //   dtkp: 'dtkp',
    //   isEx: false
    // }
  ];
  mapOfExpandedData: { [key: string]: any[] } = {};
  danhSachKeHoach: any[] = []
  typeKeHoach: string = "ADD"
  danhSachQuyetDinh: any[] = []
  dataTableView: any[] = [
    // { "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "00222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "idVirtual": "7cc45619-d7a4-4d05-8c41-1510e80fa301", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "0222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "idVirtual": "561c3c8a-40eb-40d3-b474-2b4125f862f4", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "0222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "idVirtual": "a0ab431c-0b28-4db4-8ca9-e14f5d515e4b", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333", "children": [{ "maChiCucNhan": "01010202", "tenChiCucNhan": "Chi cục Dự trữ Nhà nước Phong Châu", "maDiemKho": "0101020201", "tenDiemKho": "Điểm kho Dục Mỹ", "maNhaKho": "010102020101", "tenNhaKho": "Nhà kho C1", "maNganKho": "01010202010101", "tenNganKho": "Ngăn kho C1/1", "maLoKho": "0101020201010111", "tenLoKho": "Lô kho test cũ", "thuKho": null, "loaiVthh": null, "cloaiVthh": null, "tonKho": null, "soLuongDc": "111", "duToanKphi": "222", "thoiGianDkDc": "2023-05-15T04:48:26.266Z", "maDiemKhoNhan": "0101020201", "tenDiemKhoNhan": "Điểm kho Dục Mỹ", "maNhaKhoNhan": "010102020105", "tenNhaKhoNhan": "Nhà kho Q.a", "maNganKhoNhan": "01010202010501", "tenNganKhoNhan": "Ngăn kho test", "maLoKhoNhan": "0101020201050107", "tenLoKhoNhan": "lô kho 6", "thuKhoNhan": null, "thayDoiThuDo": null, "slDcConLai": null, "tichLuongKd": null, "slNhapDc": "333" }] }] }], "expand": true }], "expand": true }
  ]

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenCucService);
    this.formData = this.fb.group({
      loaiDc: ['DCNB', [Validators.required]],
      tenLoaiDc: ['Trong nội bộ Chi cục'],
      nam: [dayjs().get("year"), [Validators.required]],
      soQdinh: [, [Validators.required]],
      loaiQdinh: [],
      tenLoaiQdinh: [],
      ngayKyQdinh: [],
      ngayPduyet: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      canCuQdTc: [],
      soCanCuQdTc: [],
      ngayCanCuQdTc: [],
      tongDuToanKp: [],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      listOfMapData: [new Array<any>(),],
      danhSachQuyetDinh: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {
    await this.spinner.show();

    this.loadDsChiCuc()

    try {
      this.maQd = 'DCNB'//this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
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

  }

  isTongCuc() {
    return false//this.userService.isTongCuc()
  }

  isCuc() {
    return true//this.userService.isCuc()
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.danhSachKeHoach = []
      this.formData.patchValue(data);
      data.danhSachQuyetDinh.map(qd => (
        this.danhSachKeHoach = this.danhSachKeHoach.concat(qd.danhSachKeHoach)
      ))
      console.log('loadChiTiet', this.danhSachKeHoach)
      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;
      if (data.loaiDc === "DCNB") {
        this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
      }
      if (data.loaiDc === "CHI_CUC") {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      }
      if (data.loaiDc === "CUC") {
        this.dataTableView = this.buildTableViewCUC(this.danhSachKeHoach, "maDvi")
      }
    }
    await this.spinner.hide();
  }

  collapse(array: any[], data: any, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  async loadDsQuyetDinh(loaiDc) {
    let body = {
      // soQdinh: this.formData.value.soQdinh,
      // loaiDc
    };
    let res = await this.quyetDinhDieuChuyenTCService.dsQuyetDinh(body);

    if (res.msg == MESSAGE.SUCCESS) {
      this.listQuyetDinh = Array.isArray(res.data) ? res.data.filter(f => {
        return (f.maDvi !== this.userInfo.MA_DVI && f.trangThai == STATUS.BAN_HANH)
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    console.log('loadDsQuyetDinh', res, this.listQuyetDinh)
  }

  async loadDsChiCuc(value?) {
    let body = {
      trangThai: "01",
      maDviCha: value ? value.maCucNhan ? value.maCucNhan : this.userInfo.MA_DVI.substring(0, 6) : this.userInfo.MA_DVI.substring(0, 6),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCucNhan = Array.isArray(res.data) ? res.data.filter(f => {
        return f.maDvi !== this.userInfo.MA_DVI
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }



  async onChangeLoaiDc(value) {
    if (value) {
      const loaiDC = this.listLoaiDC.find(item => item.value == value)

      if (loaiDC) {
        this.formData.patchValue({
          tenLoaiDc: loaiDC.text,
        })
      }
      if (value !== "DCNB") this.loadDsQuyetDinh(value)
      // const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)
      console.log('onChangeLoaiDc', value, loaiDC)
      // this.dsNganKhoNhan = Array.isArray(this.dsNhaKhoNhan) ? this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children : [];
      this.dataTableView = []
    }
  }

  async onChangeLoaiQdinh(value) {
    if (value) {
      const loaiQD = this.listLoaiQD.find(item => item.value == value)

      if (loaiQD) {
        this.formData.patchValue({
          tenLoaiQdinh: loaiQD.text,
        })
      }
      // const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)
      console.log('onChangeLoaiQdinh', value, loaiQD)
      // this.dsNganKhoNhan = Array.isArray(this.dsNhaKhoNhan) ? this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children : [];
    }
  }

  async onChangeCanCuQdTc(value) {
    if (value) {
      const qdTC = this.listQuyetDinh.find(item => item.id == value)

      if (qdTC) {
        this.formData.patchValue({
          soCanCuQdTc: qdTC.soQdinh,
          ngayCanCuQdTc: qdTC.ngayPduyet
        })
      }
      let tong = 0
      this.danhSachKeHoach = []
      this.danhSachQuyetDinh = []
      let dsHH = []
      const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)
      // detail.data.danhSachQuyetDinh.map(async (item, i) => {
      //   let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr
      //   this.danhSachQuyetDinh.push({
      //     danhSachKeHoach: dcnbKeHoachDcHdr.danhSachHangHoa
      //   })

      //   const dsHH = dcnbKeHoachDcHdr.danhSachHangHoa.map(hh => {
      //     this.danhSachKeHoach.push({
      //       ...hh,
      //       maChiCucNhan: dcnbKeHoachDcHdr.maDvi,
      //       tenChiCucNhan: dcnbKeHoachDcHdr.tenDvi,
      //     })
      //   })
      //   // this.danhSachKeHoach.concat(dsHH)
      //   console.log('dsHHthis.danhSachKeHoach', dsHH, this.danhSachKeHoach)
      //   dcnbKeHoachDcHdr.danhSachHangHoa.map(itemHH => {
      //     tong = tong + itemHH.duToanKphi
      //   })


      //   let children = []
      //   if (dcnbKeHoachDcHdr.danhSachHangHoa.length > 0) {
      //     const grouped = this.groupBy(dcnbKeHoachDcHdr.danhSachHangHoa, "maDiemKho");
      //     const keyarr = Object.keys(grouped);

      //     keyarr.map((k, j) => {
      //       const valuearr = grouped[k].map(v => {
      //         return {
      //           ...v,
      //           tenChiCucNhan: '',
      //           key: v.id
      //         }
      //       })
      //       console.log('keyarr', k, valuearr)
      //       const itemv: any = valuearr[0]
      //       // console.log('grouped', grouped, valuearr.length, itemv, valuearr)
      //       if (valuearr.length > 1) {
      //         children.push({
      //           tenDiemKho: itemv.tenDiemKho,
      //           key: `${i}-${j}`,
      //           isDiemKho: true,
      //           children: valuearr
      //         })
      //       } else {
      //         children.push({ ...itemv, key: itemv.id })
      //       }
      //     })
      //   }

      //   this.listOfMapData.push({
      //     ...dcnbKeHoachDcHdr,
      //     tenChiCucNhan: dcnbKeHoachDcHdr.tenDvi,
      //     key: `${dcnbKeHoachDcHdr.id}`,
      //     isChiCuc: children.length > 0,
      //     children: children,
      //   })

      // })
      console.log('this.danhSachQuyetDinh', detail.data)


      const newTree = detail.data.danhSachQuyetDinh.map((qd) => {
        const item = qd.dcnbKeHoachDcHdr

        this.danhSachQuyetDinh.push({
          danhSachKeHoach: item.danhSachHangHoa
        })
        item.danhSachHangHoa.map(itemHH => {
          dsHH.push({
            ...itemHH,
            maDvi: item.maDvi,
            tenDvi: item.tenDvi
          })
          tong = tong + itemHH.duToanKphi
        })
        let children = []

        const grouped = this.groupBy(item.danhSachHangHoa, "maDiemKho");
        const keyarr = Object.keys(grouped);
        keyarr.map((k, j) => {
          const valuearr = grouped[k].map(v => {
            return {
              ...v,
              tenChiCucNhan: '',
              key: v.id
            }
          })
          console.log('keyarr', k, valuearr)
          const itemv: any = valuearr[0]

          if (valuearr.length > 1) {
            children.push({
              tenDiemKhoChuyen: itemv.tenDiemKho,
              key: uuidv4(),
              isDiemKho: true,
              children: valuearr
            })
          } else {
            children.push({ ...itemv, key: itemv.id })
          }
        })
        return {
          ...item,
          key: uuidv4(),
          isChiCuc: item.danhSachHangHoa.length > 0,
          children: children
        }
      })

      this.dataTableView = this.formData.value.loaiDc === "CHI_CUC" ? this.buildTableViewChiCUC(dsHH, "maDvi") : this.buildTableViewCUC(dsHH, "maDvi")
      // this.listOfMapData = newTree
      console.log('dataTableView', this.dataTableView, dsHH)

      this.formData.patchValue({
        tongDuToanKp: tong,
        danhSachQuyetDinh: this.danhSachQuyetDinh
      })

      // this.listOfMapData.forEach(item => {
      //   this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      // });

      // this.formData.patchValue({
      //   listOfMapData: this.listOfMapData
      // });
      // console.log('onChangeCanCuQdTc', this.listOfMapData)
      // this.dsNganKhoNhan = Array.isArray(this.dsNhaKhoNhan) ? this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children : [];
    }
  }

  buildTableViewNB(data: any[] = [], groupBy: string = "maDvi") {
    let dataView = chain(data)
      .groupBy(groupBy)
      ?.map((value, key) => {
        console.log('maDvi', key, value)
        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {
            console.log('maDiemKho', k, v)
            let rss = chain(v)
              .groupBy("maLoKho")
              ?.map((vs, ks) => {
                console.log('maLoKho', ks, vs)
                const maLoKho = vs.find(s => s?.maLoKho == ks);
                // const rsss = chain(vs).groupBy("id").map((x, ix) => {
                //   console.log('id', ix, x)
                //   const ids = x.find(f => f.id == ix);

                //   const hasmaChiCucNhan = x.some(f => f.maChiCucNhan);
                //   if (!hasmaChiCucNhan) return {
                //     ...ids
                //   }
                //   const rsxx = chain(x).groupBy("maChiCucNhan")?.map((m, im) => {
                //     console.log('maChiCucNhan', ix, x)
                //     const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                //     const hasMaDiemKhoNhan = x.some(f => f.maDiemKhoNhan);
                //     if (!hasMaDiemKhoNhan) return {
                //       ...maChiCucNhan
                //     }

                //     const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {
                //       console.log('maDiemKhoNhan', inx, n)
                //       const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                //       return {
                //         ...maDiemKhoNhan,
                //         children: n
                //       }
                //     }).value()
                //     return {
                //       ...maChiCucNhan,
                //       children: rssx
                //     }
                //   }).value()
                //   //

                //   return {
                //     ...ids,
                //     children: rsxx
                //   }
                // }).value()
                const rssx = chain(vs).groupBy("maDiemKhoNhan")?.map((n, inx) => {
                  console.log('maDiemKhoNhan', inx, n)
                  const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                  return {
                    ...maDiemKhoNhan,
                    children: n
                  }
                }).value()
                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                return {
                  ...maLoKho,
                  idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: rssx,
                  duToanKphi
                }
              }
              ).value();

            let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
            let rowDiemKho = v?.find(s => s.maDiemKho === k);

            return {
              ...rowDiemKho,
              idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
              duToanKphi: duToanKphi,
              children: rss,
              expand: true
            }
          }
          ).value();

        let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let rowChiCuc = value?.find(s => s[`${groupBy}`] === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
          duToanKphi: duToanKphi,
          children: rs,
          expand: true
        };
      }).value();
    // this.tableView = dataView;
    // this.expandAll()

    // if (data?.length !== 0) {
    //   this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    // };
    return dataView
  }

  buildTableViewChiCUC(data: any[] = [], groupBy: string = "maDvi") {
    let dataView = chain(data)
      .groupBy(groupBy)
      ?.map((value, key) => {
        console.log('maDvi', key, value)
        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {
            console.log('maDiemKho', k, v)
            let rss = chain(v)
              .groupBy("maLoKho")
              ?.map((vs, ks) => {
                console.log('maLoKho', ks, vs)
                const maLoKho = vs.find(s => s?.maLoKho == ks);
                const rsss = chain(vs).groupBy("id").map((x, ix) => {
                  console.log('id', ix, x)
                  const ids = x.find(f => f.id == ix);

                  const hasmaChiCucNhan = x.some(f => f.maChiCucNhan);
                  if (!hasmaChiCucNhan) return {
                    ...ids
                  }
                  const rsxx = chain(x).groupBy("maChiCucNhan")?.map((m, im) => {
                    console.log('maChiCucNhan', ix, x)
                    const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                    const hasMaDiemKhoNhan = x.some(f => f.maDiemKhoNhan);
                    if (!hasMaDiemKhoNhan) return {
                      ...maChiCucNhan
                    }

                    const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {
                      console.log('maDiemKhoNhan', inx, n)
                      const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                      return {
                        ...maDiemKhoNhan,
                        children: n
                      }
                    }).value()
                    return {
                      ...maChiCucNhan,
                      children: rssx
                    }
                  }).value()
                  //

                  return {
                    ...ids,
                    children: rsxx
                  }
                }).value()
                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                return {
                  ...maLoKho,
                  idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: rsss,
                  duToanKphi
                }
              }
              ).value();

            let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
            let rowDiemKho = v?.find(s => s.maDiemKho === k);

            return {
              ...rowDiemKho,
              idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
              duToanKphi: duToanKphi,
              children: rss,
              expand: true
            }
          }
          ).value();

        let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let rowChiCuc = value?.find(s => s.maDvi === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
          duToanKphi: duToanKphi,
          children: rs,
          expand: true
        };
      }).value();
    // this.tableView = dataView;
    // this.expandAll()

    // if (data?.length !== 0) {
    //   this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    // };
    return dataView
  }

  buildTableViewCUC(data: any[] = [], groupBy: string = "maDvi") {
    let dataView = chain(data)
      .groupBy(groupBy)
      ?.map((value, key) => {
        console.log('maDvi', key, value)
        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {
            console.log('maDiemKho', k, v)
            let rss = chain(v)
              .groupBy("maLoKho")
              ?.map((vs, ks) => {
                console.log('maLoKho', ks, vs)
                const maLoKho = vs.find(s => s?.maLoKho == ks);
                // const rsss = chain(vs).groupBy("id").map((x, ix) => {
                //   console.log('id', ix, x)
                //   const ids = x.find(f => f.id == ix);

                //   const hasmaChiCucNhan = x.some(f => f.maChiCucNhan);
                //   if (!hasmaChiCucNhan) return {
                //     ...ids
                //   }
                //   const rsxx = chain(x).groupBy("maChiCucNhan")?.map((m, im) => {
                //     console.log('maChiCucNhan', ix, x)
                //     const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                //     const hasMaDiemKhoNhan = x.some(f => f.maDiemKhoNhan);
                //     if (!hasMaDiemKhoNhan) return {
                //       ...maChiCucNhan
                //     }

                //     const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {
                //       console.log('maDiemKhoNhan', inx, n)
                //       const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                //       return {
                //         ...maDiemKhoNhan,
                //         children: n
                //       }
                //     }).value()
                //     return {
                //       ...maChiCucNhan,
                //       children: rssx
                //     }
                //   }).value()
                //   //

                //   return {
                //     ...ids,
                //     children: rsxx
                //   }
                // }).value()
                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                return {
                  ...maLoKho,
                  idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: vs,
                  duToanKphi
                }
              }
              ).value();

            let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
            let rowDiemKho = v?.find(s => s.maDiemKho === k);

            return {
              ...rowDiemKho,
              idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
              duToanKphi: duToanKphi,
              children: rss,
              expand: true
            }
          }
          ).value();

        let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let rowChiCuc = value?.find(s => s.maDvi === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
          duToanKphi: duToanKphi,
          children: rs,
          expand: true
        };
      }).value();
    // this.tableView = dataView;
    // this.expandAll()

    // if (data?.length !== 0) {
    //   this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    // };
    return dataView
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }


  async add(data?: any) {
    await this.spinner.show();
    // let bodyTh = {
    //   trangThai: STATUS.DA_DUYET_LDV,
    //   nam: this.formData.get('nam').value,
    //   paggingReq: {
    //     limit: this.globals.prop.MAX_INTERGER,
    //     page: 0
    //   },
    // }
    // let resTh = await this.tongHopPhuongAnCuuTroService.search(bodyTh);
    // if (resTh.msg == MESSAGE.SUCCESS) {
    //   this.listDanhSachTongHop = resTh.data.content;
    // }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangCanDieuChuyenCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dsChiCuc: this.listChiCucNhan,
        maChiCucNhan: data ? data.maChiCucNhan : '',
        maDiemKho: data ? data.maDiemKho : '',
        maNhaKho: data ? data.maNhaKho : '',
        maNganKho: data ? data.maNganKho : '',
        maLoKho: data ? data.maLoKho : '',
        maDiemKhoNhan: data ? data.maDiemKhoNhan : '',
        maNhaKhoNhan: data ? data.maNhaKhoNhan : '',
        maNganKhoNhan: data ? data.maNganKhoNhan : '',
        maLoKhoNhan: data ? data.maLoKhoNhan : '',
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        if (data.isUpdate) {
          if (this.typeKeHoach === "LO_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== data.maLoKhoNhan)
          if (this.typeKeHoach === "DIEM_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== data.maDiemKhoNhan)
          this.danhSachKeHoach.push(data)

        } else this.danhSachKeHoach.push(data)

        this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
        console.log('modalQD', data, JSON.stringify(this.dataTableView))
        const groupChiCuc = this.groupBy(this.danhSachKeHoach, "maChiCucNhan")
        Object.keys(groupChiCuc).forEach(element => {
          this.danhSachQuyetDinh.push({
            danhSachKeHoach: groupChiCuc[`${element}`]
          })
        });


        this.formData.patchValue({
          danhSachQuyetDinh: this.danhSachQuyetDinh
        })

        // this.listOfMapData = await this.buildTableView()
        // this.listOfMapData.forEach(item => {
        //   this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        // });

        // this.formData.patchValue({
        //   listOfMapData: this.listOfMapData
        // })

        // await this.selectMaTongHop(data.id);
        // this.listOfMapData.push({
        //   ...data,
        //   key: `${data.chiCucDC}`
        // })

        // this.listOfMapData.forEach(item => {
        //   this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        // });

        // this.formData.patchValue({
        //   listOfMapData: this.listOfMapData
        // })

      }
    });
  }

  xoaChiCuc(row) {
    console.log('xoaChiCuc', row)
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maChiCucNhan !== row.maChiCucNhan)
    this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  xoaDiemKho(row) {
    console.log('xoaDiemKho', row)
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKho !== row.maDiemKho)
    this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  themDiemKho(row) {
    this.typeKeHoach = "ADD"
    console.log('themDiemKho', row)
    const data = {
      maChiCucNhan: row ? row.maChiCucNhan : '',
      maDiemKho: row ? row.maDiemKho : '',
    }
    this.add(data)
  }

  xoaLoKho(row) {
    console.log('xoaLoKho', row)
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKho !== row.maLoKho)
    this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  themLoKho(row) {
    this.typeKeHoach = "ADD"
    console.log('themLoKho', row)
    const data = {
      maChiCucNhan: row ? row.maChiCucNhan : '',
      maDiemKho: row ? row.maDiemKho : '',
      maNhaKho: row ? row.maNhaKho : '',
      maNganKho: row ? row.maNganKho : '',
      maLoKho: row ? row.maLoKho : '',
    }
    this.add(data)
  }

  xoaDiemKhoNhan(row) {
    console.log('xoaDiemKhoNhan', row)
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== row.maDiemKhoNhan)
    this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  suaDiemKhoNhan(row) {
    this.typeKeHoach = "DIEM_KHO_NHAN"
    console.log('suaDiemKhoNhan', row)
    const data = {
      maChiCucNhan: row ? row.maChiCucNhan : '',
      maDiemKho: row ? row.maDiemKho : '',
      maNhaKho: row ? row.maNhaKho : '',
      maNganKho: row ? row.maNganKho : '',
      maLoKho: row ? row.maLoKho : '',
      maDiemKhoNhan: row ? row.maDiemKhoNhan : '',
    }
    this.add(data)
  }

  xoaLoKhoNhan(row) {
    console.log('xoaLoKhoNhan', row)
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== row.maLoKhoNhan)
    this.dataTableView = this.buildTableViewNB(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  suaLoKhoNhan(row) {
    console.log('suaLoKhoNhan', row)
    this.typeKeHoach = "LO_KHO_NHAN"
    this.add(row)
  }


  async save(isGuiDuyet?) {
    // const buildTableView = this.buildTableView()
    // return
    await this.spinner.show();
    let body = this.formData.value;
    console.log('save', body, this.canCu, this.quyetDinh)
    // return
    // if (this.formData.value.soQd) {
    //   body.soQd = this.formData.value.soQd + "/" + this.maQd;
    // }
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    if (this.idInput) this.idInput
    // if (this.idInput) {
    //   body.id = this.idInput
    //   let dsQDItem = body.danhSachQuyetDinh[0]
    //   dsQDItem.danhSachKeHoach = this.danhSachKeHoach
    //   body.danhSachQuyetDinh = [dsQDItem]
    // } else {
    //   body.danhSachQuyetDinh = [{
    //     danhSachKeHoach: this.danhSachKeHoach
    //   }]
    // }




    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        this.quayLai();
      }
    }
    await this.spinner.hide();
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_TP;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
        return STATUS.TU_CHOI_TP
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
        return STATUS.TU_CHOI_LDC
      return STATUS.CHO_DUYET_TP;
    };
    this.reject(this.idInput, trangThai());
  }

  async pheDuyet() {
    let trangThai = this.formData.value.trangThai == STATUS.CHO_DUYET_TP ? STATUS.CHO_DUYET_LDC : STATUS.BAN_HANH;
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  async banHanh() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Bạn muốn ban hành văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

}
