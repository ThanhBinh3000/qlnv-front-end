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
import { DonviService } from "src/app/services/donvi.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep, sortBy } from 'lodash';
import { STATUS } from "src/app/constants/status";
import { ThongTinHangCanDieuChuyenCucComponent } from "../thong-tin-hang-can-dieu-chuyen-cuc/thong-tin-hang-can-dieu-chuyen-cuc.component";
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { AMOUNT_NO_DECIMAL } from "src/app/Utility/utils";
import { ThongTinHangCanDieuChuyenChiCucComponent } from "../thong-tin-hang-can-dieu-chuyen-chi-cuc/thong-tin-hang-can-dieu-chuyen-chi-cuc.component";

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

  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

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
  AMOUNT = AMOUNT_NO_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
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
      ngayTrinhDuyetTc: [],
      tongDuToanKp: [],
      loaiHinhNX: ["Nhập ĐC nội bộ Chi cục"],
      kieuNX: ["Nhập không chi tiền"],
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
    return this.userService.isTongCuc()
  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.danhSachKeHoach = []
      this.formData.patchValue(data);

      data.danhSachQuyetDinh.map(async (item, i) => {
        if (item.dcnbKeHoachDcHdr) {
          let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

          dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            this.danhSachKeHoach.push({
              ...element,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
            })
          });
        }
      })

      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;

      if (data.loaiDc !== "DCNB") this.loadDsQuyetDinh(data.loaiDc)

      if (data.loaiDc === "DCNB") {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDiemKhoNhan")
      }
      if (data.loaiDc === "CHI_CUC") {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      }
      if (data.loaiDc === "CUC" && !(this.isChiCuc() && data.loaiQdinh == '01')) {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
      }
      if (data.loaiDc === "CUC" && this.isChiCuc() && data.loaiQdinh == '01') {
        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")

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
        return (f.maDvi !== this.userInfo.MA_DVI) && f.trangThai == STATUS.BAN_HANH
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

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

    }
  }

  async onChangeCanCuQdTc(value) {
    if (value) {
      const qdTC = this.listQuyetDinh.find(item => item.id == value)

      if (qdTC) {
        this.formData.patchValue({
          soCanCuQdTc: qdTC.soQdinh,
          ngayTrinhDuyetTc: qdTC.ngayPduyet
        })
      }
      let tong = 0
      this.danhSachKeHoach = []
      this.danhSachQuyetDinh = []
      let dsHH = []
      const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)

      detail.data.danhSachQuyetDinh.map((qd) => {
        if (qd.dcnbKeHoachDcHdr) {
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
        }

      })

      this.dataTableView = this.formData.value.loaiDc === "CHI_CUC" ? this.buildTableViewChiCUC(dsHH, "maDvi") : this.buildTableViewChiCUC(dsHH, "maDvi")

      this.formData.patchValue({
        tongDuToanKp: tong,
        danhSachQuyetDinh: this.danhSachQuyetDinh
      })


    }
  }

  // buildTableViewNB(data: any[] = [], groupBy: string = "maDvi") {
  //   let dataView = chain(data)
  //     .groupBy(groupBy)
  //     ?.map((value, key) => {
  //       console.log('maDvi', key, value)
  //       let rs = chain(value)
  //         .groupBy("maDiemKho")
  //         ?.map((v, k) => {
  //           console.log('maDiemKho', k, v)
  //           let rss = chain(v)
  //             .groupBy("maLoKho")
  //             ?.map((vs, ks) => {
  //               console.log('maLoKho', ks, vs)
  //               const maLoKho = vs.find(s => s?.maLoKho == ks);

  //               const rssx = chain(vs).groupBy("maDiemKhoNhan")?.map((n, inx) => {
  //                 console.log('maDiemKhoNhan', inx, n)
  //                 const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
  //                 return {
  //                   ...maDiemKhoNhan,
  //                   children: n
  //                 }
  //               }).value()
  //               let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //               return {
  //                 ...maLoKho,
  //                 idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //                 children: rssx,
  //                 duToanKphi
  //               }
  //             }
  //             ).value();

  //           let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //           let rowDiemKho = v?.find(s => s.maDiemKho === k);

  //           return {
  //             ...rowDiemKho,
  //             idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //             duToanKphi: duToanKphi,
  //             children: rss,
  //             expand: true
  //           }
  //         }
  //         ).value();

  //       let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //       let rowChiCuc = value?.find(s => s[`${groupBy}`] === key);
  //       return {
  //         ...rowChiCuc,
  //         idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //         duToanKphi: duToanKphi,
  //         children: rs,
  //         expand: true
  //       };
  //     }).value();


  //   if (data?.length !== 0) {
  //     const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //     this.formData.patchValue({
  //       tongDuToanKp: tongDuToanChiPhi,
  //     })
  //   };
  //   return dataView
  // }

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
              .groupBy("maNganKho")
              ?.map((vs, ks) => {
                console.log('maNganKho', ks, vs)
                const maLoKho = vs.find(s => s?.maNganKho == ks);
                // const rsss = chain(vs).groupBy("id").map((x, ix) => {
                //   console.log('id', ix, x)
                //   const ids = x.find(f => f.id == ix);

                //   const hasmaChiCucNhan = x.some(f => f.maChiCucNhan);
                //   if (!hasmaChiCucNhan) return {
                //     ...ids
                //   }

                // }).value()


                const rsxx = (groupBy === "maChiCucNhan") ? chain(vs).groupBy("maDiemKhoNhan")?.map((n, inx) => {
                  console.log('maDiemKhoNhan', inx, n)
                  const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                  return {
                    ...maDiemKhoNhan,
                    children: n
                  }
                }).value() : chain(vs).groupBy("maChiCucNhan")?.map((m, im) => {

                  const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                  const hasMaDiemKhoNhan = m.some(f => f.maDiemKhoNhan);
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




                // return {
                //   ...maLoKho,
                //   children: rsxx
                // }
                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                return {
                  ...maLoKho,
                  idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: rsxx,
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
        let rowChiCuc = value?.find(s => s[groupBy] === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
          duToanKphi: duToanKphi,
          children: rs,
          expand: true
        };
      }).value();


    if (data?.length !== 0) {
      const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
      this.formData.patchValue({
        tongDuToanKp: tongDuToanChiPhi,
      })
    };
    return dataView
  }

  // buildTableViewCUC(data: any[] = [], groupBy: string = "maDvi") {
  //   let dataView = chain(data)
  //     .groupBy(groupBy)
  //     ?.map((value, key) => {
  //       console.log('maDvi', key, value)
  //       let rs = chain(value)
  //         .groupBy("maDiemKho")
  //         ?.map((v, k) => {
  //           console.log('maDiemKho', k, v)
  //           let rss = chain(v)
  //             .groupBy("maLoKho")
  //             ?.map((vs, ks) => {
  //               console.log('maLoKho', ks, vs)
  //               const maLoKho = vs.find(s => s?.maLoKho == ks);

  //               let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //               return {
  //                 ...maLoKho,
  //                 idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //                 children: vs,
  //                 duToanKphi
  //               }
  //             }
  //             ).value();

  //           let duToanKphi = v?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //           let rowDiemKho = v?.find(s => s.maDiemKho === k);

  //           return {
  //             ...rowDiemKho,
  //             idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //             duToanKphi: duToanKphi,
  //             children: rss,
  //             expand: true
  //           }
  //         }
  //         ).value();

  //       let duToanKphi = rs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //       let rowChiCuc = value?.find(s => s.maDvi === key);
  //       return {
  //         ...rowChiCuc,
  //         idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuidv4.v4() : uuidv4.v4(),
  //         duToanKphi: duToanKphi,
  //         children: rs,
  //         expand: true
  //       };
  //     }).value();


  //   if (data?.length !== 0) {
  //     const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //     this.formData.patchValue({
  //       tongDuToanKp: tongDuToanChiPhi,
  //     })
  //   };
  //   return dataView
  // }

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


  async add(row?: any) {
    await this.spinner.show();

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
        data: row ? row : undefined
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

        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maChiCucNhan")
        const groupChiCuc = this.groupBy(this.danhSachKeHoach, "maChiCucNhan")
        Object.keys(groupChiCuc).forEach(element => {
          this.danhSachQuyetDinh.push({
            danhSachKeHoach: groupChiCuc[`${element}`]
          })
        });


        this.formData.patchValue({
          danhSachQuyetDinh: this.danhSachQuyetDinh
        })



      }
    });
  }

  async addCC(row?: any) {
    await this.spinner.show();

    await this.spinner.hide();
    const param = {
      dsChiCuc: [{ key: row.maDvi, title: row.tenDvi }],
      maDvi: row ? row.maDvi : '',
      thoiGianDkDc: row ? row.thoiGianDkDc : '',
      maDiemKho: row ? row.maDiemKho : '',
      maNhaKho: row ? row.maNhaKho : '',
      maNganKho: row ? row.maNganKho : '',
      maLoKho: row ? row.maLoKho : '',
      soLuongDc: row ? row.soLuongDc : '',
      duToanKphi: row ? row.duToanKphi : '',
      // maDiemKhoNhan: data ? data.maDiemKhoNhan : '',
      // maNhaKhoNhan: data ? data.maNhaKhoNhan : '',
      // maNganKhoNhan: data ? data.maNganKhoNhan : '',
      // maLoKhoNhan: data ? data.maLoKhoNhan : '',
    }
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangCanDieuChuyenChiCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: param,
    });
    console.log('nzComponentParams', param, row)
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        if (data.isUpdate) {
          if (this.typeKeHoach === "LO_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== data.maLoKhoNhan)
          if (this.typeKeHoach === "DIEM_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== data.maDiemKhoNhan)
          this.danhSachKeHoach.push({
            ...data,
            maChiCucNhan: row.maChiCucNhan
          })

        } else this.danhSachKeHoach.push(data)

        this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
        console.log('modalQDdata', data)
        console.log('modalQDdanhSachKeHoach', this.danhSachKeHoach)
        console.log('modalQDdataTableView', this.dataTableView)
        const groupChiCuc = this.groupBy(this.danhSachKeHoach, "maDvi")
        Object.keys(groupChiCuc).forEach(element => {
          this.danhSachQuyetDinh.push({
            danhSachKeHoach: groupChiCuc[`${element}`]
          })
        });


        this.formData.patchValue({
          danhSachQuyetDinh: this.danhSachQuyetDinh
        })



      }
    });
  }

  xoaChiCuc(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maChiCucNhan !== row.maChiCucNhan)
    this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  xoaDiemKho(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKho !== row.maDiemKho)
    this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  themLoKho(row) {
    this.typeKeHoach = "ADD"
    const data = {
      maDvi: row ? row.maDvi : '',
      tenDvi: row ? row.tenDvi : '',
      maChiCucNhan: row ? row.maChiCucNhan : '',
      tenChiCucNhan: row ? row.tenChiCucNhan : '',
      maDiemKho: row ? row.maDiemKho : '',
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }

  xoaLoKho(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKho !== row.maLoKho)
    this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDiemKhoNhan")
  }

  themDiemKhoNhan(row) {
    this.typeKeHoach = "ADD"
    console.log('themLoKho', row)
    const data = {
      ...row,
      maDiemKhoNhan: "",
      tenDiemKhoNhan: "",
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      thuKhoNhan: "",
      thayDoiThuKho: "",
      slDcConLai: "",
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }

  xoaDiemKhoNhan(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== row.maDiemKhoNhan)
    if (this.isCuc()) {
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDiemKhoNhan")
    }

    if (this.isChiCuc()) {
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
    }
  }

  suaDiemKhoNhan(row) {
    this.typeKeHoach = "DIEM_KHO_NHAN"

    if (this.isCuc())
      this.add(row)
    if (this.isChiCuc())
      this.addCC(row)
  }

  themDiemKhoNhanChiCuc(row) {
    this.typeKeHoach = "ADD"
    const data = {
      maDvi: row ? row.maDvi : '',
      tenDvi: row ? row.tenDvi : '',
      maChiCucNhan: row ? row.maChiCucNhan : '',
      tenChiCucNhan: row ? row.tenChiCucNhan : '',
      maDiemKho: row ? row.maDiemKho : '',
      maNhaKho: row ? row.maNhaKho : '',
      maNganKho: row ? row.maNganKho : '',
      maLoKho: row ? row.maLoKho : '',
      // maDiemKhoNhan: row ? row.maDiemKhoNhan : '',
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }


  xoaLoKhoNhan(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== row.maLoKhoNhan)
    if (this.isCuc())
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDiemKhoNhan")
    if (this.isChiCuc())
      this.dataTableView = this.buildTableViewChiCUC(this.danhSachKeHoach, "maDvi")
  }

  suaLoKhoNhan(row) {
    this.typeKeHoach = "LO_KHO_NHAN"
    if (this.isCuc())
      this.add(row)
    if (this.isChiCuc())
      this.addCC(row)
  }

  isLuuVaGD() {
    return (!this.isView && this.formData.value.trangThai == STATUS.DU_THAO && this.isCuc()) || (this.isChiCuc() && this.formData.value.loaiQdinh == '01')
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    if (this.idInput) body.id = this.idInput

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

  isYCXDDiemNhap() {
    return this.formData.value.trangThai == STATUS.DU_THAO && this.formData.value.loaiQdinh == '01'
  }

  async ycXDDiemNhap() {
    await this.spinner.show();
    let body = this.formData.value;
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      let trangThai = STATUS.YC_CHICUC_PHANBO_DC;
      let mesg = 'Bạn muốn yêu cầu xác định điểm nhập?'
      this.approve(this.idInput, trangThai, mesg);
    }
    await this.spinner.hide();

  }

  async guiDuyet() {
    if (this.isCuc()) {
      let trangThai = STATUS.CHO_DUYET_TP;
      let mesg = 'Bạn muốn gửi duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }
    if (this.isChiCuc()) {
      let trangThai = STATUS.CHODUYET_TBP_TVQT;
      let mesg = 'Bạn muốn gửi duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }
  }

  isTuChoi() {
    if (this.isCuc()) {
      return this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_LDC
    }
    return false
  }

  async tuChoi() {
    if (this.isCuc()) {
      let trangThai = () => {
        if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
          return STATUS.TU_CHOI_TP
        if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
          return STATUS.TU_CHOI_LDC
        return STATUS.CHO_DUYET_TP;
      };
      this.reject(this.idInput, trangThai());
    }
    if (this.isChiCuc()) {
      let trangThai = () => {
        if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
          return STATUS.TUCHOI_TBP_TVQT
        if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
          return STATUS.TU_CHOI_LDCC
        return STATUS.CHODUYET_TBP_TVQT;
      };
      this.reject(this.idInput, trangThai());
    }
  }

  isPheDuyet() {
    if (this.isCuc()) {
      return this.formData.value.trangThai == STATUS.CHO_DUYET_TP
    }
    return false
  }

  async pheDuyet() {
    if (this.isCuc()) {
      let trangThai = this.formData.value.trangThai == STATUS.CHO_DUYET_TP ? STATUS.CHO_DUYET_LDC : STATUS.BAN_HANH;
      let mesg = 'Bạn muốn phê duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }
    if (this.isChiCuc()) {
      let trangThai = this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT ? STATUS.CHO_DUYET_LDCC : STATUS.DA_DUYET_LDCC;
      let mesg = 'Bạn muốn phê duyệt văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }

  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
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
