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
import { chain, cloneDeep } from 'lodash';
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
      value: "NOi_BO",
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
      loaiDc: ['NOi_BO', [Validators.required]],
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
      // idTongHop: [, [Validators.required]],
      // maTongHop: [, [Validators.required]],
      // id: [0],
      // maDvi: [],
      // nam: [dayjs().get("year"), [Validators.required]],
      // soQd: [, [Validators.required]],
      // ngayKy: [, [Validators.required]],
      // ngayHluc: [, [Validators.required]],
      // idTongHop: [, [Validators.required]],
      // maTongHop: [, [Validators.required]],
      // ngayThop: [, [Validators.required]],
      // idDx: [, [Validators.required]],
      // soDx: [, [Validators.required]],
      // ngayDx: [, [Validators.required]],
      // tongSoLuongDx: [],
      // tongSoLuong: [],
      // soLuongXuaCap: [],
      // loaiVthh: [],
      // cloaiVthh: [],
      // loaiNhapXuat: [],
      // trichYeu: [],
      // trangThai: [STATUS.DU_THAO],
      // lyDoTuChoi: [],
      // type: ['TH', [Validators.required]],
      // xuatCap: [false],
      // ngayPduyet: [],
      // fileDinhKem: [FileDinhKem],
      // canCu: [new Array<FileDinhKem>()],
      // tenDvi: [],
      // tenLoaiVthh: [],
      // tenCloaiVthh: [],
      // tenTrangThai: ['Dự thảo'],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      listOfMapData: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {
    // this.listOfMapData.forEach(item => {
    //   this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    // });
    await this.spinner.show();

    // this.loadDsChiCuc()
    // this.getListDiemKho(this.userInfo.MA_DVI)
    // this.getListDiemKhoNhan(this.userInfo.MA_DVI)

    this.loadDsQuyetDinh()

    try {
      this.maQd = 'DCNB'//this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
      // await Promise.all([
      //   this.bindingDataTongHop(this.dataTongHop),
      //   this.loadDsDonVi(),
      // ]);
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
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
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

  async loadDsQuyetDinh() {
    let body = {
      // soQdinh: this.formData.value.soQdinh,
      // loaiDc: this.formData.value.loaiDc
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

  async getListDiemKho(maDvi) {
    if (maDvi) {
      try {
        let body = {
          maDviCha: maDvi,
          trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {

          if (res.data && res.data.length > 0) {
            res.data.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.listDiemKho = [];
                this.listDiemKho = [
                  ...this.listDiemKho,
                  ...element.children
                ]
                console.log('getListDiemKho', this.listDiemKho)
              }
            });
          }
        }

      } catch (error) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  async getListDiemKhoNhan(maDvi) {
    if (maDvi) {
      try {
        let body = {
          maDviCha: maDvi,
          trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data && res.data.length > 0) {
            res.data.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.listDiemKhoNhan = [
                  ...this.listDiemKhoNhan,
                  ...element.children
                ]
              }
            });
          }
        }

      } catch (error) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
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
      // const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)
      console.log('onChangeLoaiDc', value, loaiDC)
      // this.dsNganKhoNhan = Array.isArray(this.dsNhaKhoNhan) ? this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children : [];
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
      const detail = await this.quyetDinhDieuChuyenTCService.getDetail(value)
      detail.data.danhSachQuyetDinh.map(async (item, i) => {
        let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

        let children = []
        if (dcnbKeHoachDcHdr.danhSachHangHoa.length > 0) {
          const grouped = this.groupBy(dcnbKeHoachDcHdr.danhSachHangHoa, "maDiemKho");
          const keyarr = Object.keys(grouped);

          keyarr.map((k, j) => {
            const valuearr = grouped[k].map(v => {
              return {
                ...v,
                key: v.id
              }
            })
            console.log('keyarr', k, valuearr)
            const itemv: any = valuearr[0]
            // console.log('grouped', grouped, valuearr.length, itemv, valuearr)
            if (valuearr.length > 1) {
              children.push({
                tenDiemKho: itemv.tenDiemKho,
                key: `${i}-${j}`,
                isCol: true,
                children: valuearr
              })
            } else {
              children.push({ ...itemv, key: itemv.id })
            }
          })
        }

        this.listOfMapData.push({
          ...dcnbKeHoachDcHdr,
          key: `${dcnbKeHoachDcHdr.id}`,
          isEx: children.length > 0,
          children: children,
        })

      })

      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

      this.formData.patchValue({
        listOfMapData: this.listOfMapData
      });
      console.log('onChangeCanCuQdTc', this.listOfMapData)
      // this.dsNganKhoNhan = Array.isArray(this.dsNhaKhoNhan) ? this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children : [];
    }
  }

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }


  async add() {
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
        // dataTable: this.listDanhSachTongHop,
        // dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        // dataColumn: ['id', 'noiDungThop']
        dsChiCuc: this.listChiCucNhan,
        dsDiemKho: this.listDiemKho,
        dsDiemKhoNhan: this.listDiemKhoNhan
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        console.log('modalQD', data)
        // await this.selectMaTongHop(data.id);
        this.listOfMapData.push({
          ...data,
          key: `${data.chiCucDC}`
        })

        this.listOfMapData.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });

        this.formData.patchValue({
          listOfMapData: this.listOfMapData
        })

      }
    });
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      // if (data.type == 'TH') {
      //   await this.selectMaTongHop(data.idTongHop);
      // } else {
      // }
      this.formData.patchValue(data);
      // this.formData.patchValue({
      //   soQd: data.soQd?.split('/')[0],
      //   quyetDinhPdDtl: this.formData.value.quyetDinhPdDtl
      // })
      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;
      // await this.buildTableView();
    }
    await this.spinner.hide();
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        idTongHop: dataTongHop.id,
        type: 'TH',
      })
      await this.selectMaTongHop(dataTongHop.id);
    }
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const res = await this.tongHopPhuongAnCuuTroService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        let listDeXuat = await Promise.all(data.deXuatCuuTro.map(async item => {
          let res1 = await this.deXuatPhuongAnCuuTroService.getDetail(item.idDx);
          if (res1.msg === MESSAGE.SUCCESS) {
            return Object.assign(item, { quyetDinhPdDx: res1.data.deXuatPhuongAn });
          } else {
            console.log(MESSAGE.ERROR, res1.msg);
          }
        }));
        //truong hop tao moi
        if (!this.idInput) {
          this.formData.patchValue({
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            loaiNhapXuat: data.loaiNhapXuat,
            idTongHop: event,
            maTongHop: data.maTongHop,
            tongSoLuongDx: data.tongSlCtVt,
            soLuongXuaCap: data.tongSlXuatCap,
            idDx: null,
            soDx: null,
            ngayThop: data.ngayThop,
            quyetDinhPdDtl: listDeXuat
          });
        }
        this.quyetDinhPdDtlCache = Object.assign(this.quyetDinhPdDtlCache, listDeXuat);
        this.deXuatSelected = this.formData.value.quyetDinhPdDtl[0];
        await this.selectRow();
        // this.dataInput = null;
        // this.dataInputCache = null;
        this.summaryData();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    if (this.idInput) body.id = this.idInput
    console.log('save', body, this.canCu, this.quyetDinh)
    // return
    // if (this.formData.value.soQd) {
    //   body.soQd = this.formData.value.soQd + "/" + this.maQd;
    // }
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
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

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  setValidator(isGuiDuyet?) {
    if (this.formData.get('type').value == 'TH') {
      this.formData.controls["idTongHop"].setValidators([Validators.required]);
      this.formData.controls["maTongHop"].setValidators([Validators.required]);
      this.formData.controls["idDx"].clearValidators();
      this.formData.controls["soDx"].clearValidators();
      this.formData.controls["ngayDx"].clearValidators();
    }
    if (this.formData.get('type').value == 'TTr') {
      this.formData.controls["idTongHop"].clearValidators();
      this.formData.controls["maTongHop"].clearValidators();
      this.formData.controls["ngayThop"].clearValidators();
      this.formData.controls["idDx"].setValidators([Validators.required]);
      this.formData.controls["soDx"].setValidators([Validators.required]);
    }
  }

  isDisabled() {
    return false
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  async openDialogTh() {
    // if (this.formData.get('type').value != 'TH') {
    //   return;
    // }
    await this.spinner.show();
    let bodyTh = {
      trangThai: STATUS.DA_DUYET_LDV,
      nam: this.formData.get('nam').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopPhuongAnCuuTroService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp đề xuất kế hoạch bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDungThop']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);

      }
    });
  }


  // async openDialogTr() {
  //   if (this.formData.get('type').value != 'TTr') {
  //     return
  //   }
  //   await this.spinner.show();
  //   // Get data tờ trình
  //   let bodyDx = {
  //     trangThaiList: [STATUS.DA_DUYET_LDV, STATUS.DA_DUYET_LDC],
  //     maTongHop: "Chưa tổng hợp",
  //     nam: this.formData.get('nam').value,
  //     loaiVthh: this.loaiVthh,
  //     paggingReq: {
  //       limit: this.globals.prop.MAX_INTERGER,
  //       page: 0
  //     },
  //   }
  //   let resToTrinh = await this.deXuatPhuongAnCuuTroService.search(bodyDx);
  //   if (resToTrinh.msg == MESSAGE.SUCCESS) {
  //     this.listDanhSachDeXuat = resToTrinh.data.content;
  //   }
  //   await this.spinner.hide();

  //   const modalQD = this.modal.create({
  //     nzTitle: 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu',
  //     nzContent: DialogTableSelectionComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '900px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       dataTable: this.listDanhSachDeXuat,
  //       dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'loại hình nhập xuất'],
  //       dataColumn: ['soDx', 'tenLoaiVthh', 'loaiNhapXuat']
  //     },
  //   });
  //   modalQD.afterClose.subscribe(async (data) => {
  //     if (data) {
  //       await this.onChangeIdTrHdr(data);
  //       this.tongSoLuongDxuat = data.tongSoLuong;
  //       this.tongThanhTienDxuat = data.thanhTien;
  //     }
  //   });
  // }

  async onChangeIdTrHdr(data) {
    /*await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.deXuatPhuongAnCuuTroService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        dataRes.idDxHdr = dataRes.id;
        this.danhsachDx.push(dataRes);
        this.danhsachDx.forEach(item => {
          item.tenDviDx = item.tenDvi;
          item.ngayPduyetDx = item.ngayPduyet;
          item.trichYeuDx = item.trichYeu;
          item.tongSoLuongDx = item.tongSoLuong;
          item.thanhTienDx = item.thanhthanhTienTienDx
        })
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          loaiNhapXuat: data.loaiNhapXuat,
          idTongHop: null,
          maTongHop: null,
          tongSoLuongDx: data.tongSoLuong,
          soLuongXuaCap: data.soLuongXuatCap,
          idDx: data.id,
          soDx: data.soDx,
          quyetDinhPdDtl: data
        })
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();*/
  }


  async selectHangHoa(event: any) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  handleOk(): void {
    this.phuongAnRow.idVirtual = this.phuongAnRow.idVirtual ? this.phuongAnRow.idVirtual : uuidv4();
    this.phuongAnRow.thanhTien = this.phuongAnRow.soLuongXuatChiCuc * this.phuongAnRow.donGiaKhongVat;
    let index = this.deXuatPhuongAn.findIndex(s => s.idVirtual === this.phuongAnRow.idVirtual);
    let table = this.deXuatPhuongAn;
    if (index != -1) {
      table.splice(index, 1, this.phuongAnRow);
    } else {
      table = [...table, this.phuongAnRow]
    }
    // this.deXuatPhuongAn = table
    let quyetDinhPdDtlFormData = this.formData.value.quyetDinhPdDtl.find(s => s.id === this.deXuatSelected.id);
    quyetDinhPdDtlFormData.quyetDinhPdDx = table
    this.buildTableView();
    this.isVisible = false;

    //clean
    this.phuongAnRow = {}
    this.listChiCuc = []
  }

  handleCancel(): void {
    this.isVisible = false;
    this.phuongAnRow = {}
  }

  async selectRow(item?: any) {

    await this.spinner.show();
    if (item) {
      this.deXuatSelected = item;
    }
    this.formData.value.quyetDinhPdDtl.forEach(i => {
      i.selected = false
    });
    this.deXuatSelected.selected = true;
    let dataEdit = this.formData.value.quyetDinhPdDtl.find(s => s.idDx === this.deXuatSelected.idDx);
    let dataCache = this.quyetDinhPdDtlCache.find(s => s.idDx === this.deXuatSelected.idDx);
    dataEdit.quyetDinhPdDx.forEach(s => s.idVirtual = uuidv4());
    dataCache.quyetDinhPdDx.forEach(s => s.idVirtual = uuidv4());
    this.deXuatPhuongAn = cloneDeep(dataEdit.quyetDinhPdDx)
    this.deXuatPhuongAnCache = cloneDeep(dataCache.quyetDinhPdDx);
    await this.buildTableView();
    await this.spinner.hide();
  }

  async buildTableView() {
    //case cho de xuat
    let dataViewCache = chain(this.deXuatPhuongAnCache)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
            let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
            let rowCuc = v.find(s => s.tenCuc === k);
            console.log(rowCuc, 'rowCuc');
            return {
              idVirtual: uuidv4(),
              tenCuc: k,
              soLuongXuatCuc: rowCuc.soLuongXuatCuc,
              soLuongXuatCucThucTe: soLuongXuatCucThucTe,
              tenCloaiVthh: v[0].tenCloaiVthh,
              childData: v
            }
          }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        return {
          idVirtual: uuidv4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs
        };
      }).value();
    this.phuongAnViewCache = dataViewCache;
    //
    let dataView = chain(this.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
            let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
            let rowCuc = v.find(s => s.tenCuc === k);
            console.log(rowCuc, 'rowCuc');
            return {
              idVirtual: uuidv4(),
              tenCuc: k,
              soLuongXuatCuc: rowCuc.soLuongXuatCuc,
              soLuongXuatCucThucTe: soLuongXuatCucThucTe,
              tenCloaiVthh: v[0].tenCloaiVthh,
              childData: v
            }
          }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        return {
          idVirtual: uuidv4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs
        };
      }).value();
    this.phuongAnView = dataView;
    this.expandAll()
    if (this.deXuatPhuongAnCache.length !== 0) {
      this.listThanhTienCache = this.deXuatPhuongAnCache.map(s => s.thanhTien);
      this.listSoLuongCache = this.deXuatPhuongAnCache.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTienCache = [0];
      this.listSoLuongCache = [0];
    }

    if (this.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
    this.phuongAnViewCache.forEach(s => {
      this.expandSetStringCache.add(s.idVirtual);
    })
  }


  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
      this.expandSetStringCache.add(id);
    } else {
      this.expandSetString.delete(id);
      this.expandSetStringCache.delete(id);
    }
  }

  suaPhuongAn(data: any) {
    let currentRow;
    if (data.id) {
      currentRow = this.deXuatPhuongAn.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      currentRow = this.deXuatPhuongAn.find(s => s.idVirtual == data.idVirtual)
    }
    this.phuongAnRow = currentRow;
    this.changeCuc(this.phuongAnRow.maDviCuc);
    this.showModal();
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeCuc(event: any) {
    let data = this.dsDonVi.find(s => s.maDvi == event);
    this.phuongAnRow.tenCuc = data.tenDvi;
    let body = {
      trangThai: "01",
      maDviCha: event,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCuc = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeChiCuc(event: any) {
    let data = this.listChiCuc.find(s => s.maDvi == event);
    this.phuongAnRow.tenChiCuc = data.tenDvi;
  }


  showModal(): void {
    this.isVisible = true;
    this.listNoiDung = [...new Set(this.deXuatPhuongAn.map(s => s.noiDung))];
    this.phuongAnRow.loaiVthh = this.formData.value.loaiVthh;
  }

  // async xoaPhuongAn(data: any) {
  //   this.deXuatPhuongAn = [];
  //   this.deXuatSelected.quyetDinhPdDx = this.deXuatSelected.quyetDinhPdDx.filter(qd => qd.id !== data.id);
  //   this.deXuatPhuongAn = cloneDeep(this.deXuatSelected.quyetDinhPdDx);
  //   await this.buildTableView();
  // }

  summaryData() {
    this.tongSoLuongDxuat = this.formData.value.quyetDinhPdDtl.reduce((prev, cur) => prev + cur.tongSoLuongDx, 0)
    this.tongThanhTienDxuat = this.formData.value.quyetDinhPdDtl.reduce((prev, cur) => prev + cur.thanhTienDx, 0)
  }

  getNameFile(event?: any, item?: FileDinhKem) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          this.formData.patchValue({})
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
        });
    }
  }
}
