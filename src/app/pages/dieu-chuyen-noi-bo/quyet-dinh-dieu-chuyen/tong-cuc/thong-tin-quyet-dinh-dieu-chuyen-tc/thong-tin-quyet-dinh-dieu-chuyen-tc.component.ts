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
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { MaTongHopQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/ma-tong-hop-quyet-dinh-dieu-chinh.service";
import { SoDeXuatQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/so-de-xuat-quyet-dinh-dieu-chinh.service";
import { KeHoachDieuChuyenService } from "../../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service";

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
  selector: 'app-thong-tin-quyet-dinh-dieu-chuyen-tc',
  templateUrl: './thong-tin-quyet-dinh-dieu-chuyen-tc.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-dieu-chuyen-tc.component.scss']
})
export class ThongTinQuyetDinhDieuChuyenTCComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  canCu: any[] = [];
  quyetDinh: any[] = [];

  maQd: string = null;
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean;
  load: boolean = false;
  listDanhSachTongHop: any[] = [];
  listDanhSachDeXuat: any[] = [];
  danhSachTongHop: any[] = [];
  danhsachDx: any[] = [];

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
  isVisible = false;
  listNoiDung = []
  listChungLoaiHangHoa: any[] = [];
  quyetDinhPdDtlCache: any[] = [];
  deXuatSelected: any = []

  listOfMapData: any[] = [
    // {
    //   key: `1`,
    //   name: '1 John Brown sr.',
    //   age: 60,
    //   address: 'New York No. 1 Lake Park',
    //   isEx: true,
    //   children: [
    //     {
    //       key: `1-1`,
    //       name: '1-1 John Brown',
    //       age: 42,
    //       address: 'New York No. 2 Lake Park',
    //       isCol: false,
    //     },
    //     {
    //       key: `1-2`,
    //       name: '1-2 John Brown jr.',
    //       age: 30,
    //       address: 'New York No. 3 Lake Park',
    //       isCol: true,
    //       children: [
    //         {
    //           key: `1-2-1`,
    //           name: '1-2-1 Jimmy Brown',
    //           age: 16,
    //           address: 'New York No. 3 Lake Park'
    //         }
    //       ]
    //     },
    //     {
    //       key: `1-3`,
    //       name: '1-3 Jim Green sr.',
    //       age: 72,
    //       address: 'London No. 1 Lake Park',
    //       isCol: true,
    //       children: [
    //         {
    //           key: `1-3-1`,
    //           name: '1-3-1 Jim Green',
    //           age: 42,
    //           address: 'London No. 2 Lake Park',
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
    //   name: '2 Joe Black',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    //   isEx: false
    // },
    // {
    //   key: `3`,
    //   name: '2 Joe Black',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
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
    private soDeXuatQuyetDinhDieuChuyenService: SoDeXuatQuyetDinhDieuChuyenService,
    private maTongHopQuyetDinhDieuChuyenService: MaTongHopQuyetDinhDieuChuyenService,
    private keHoachDieuChuyenService: KeHoachDieuChuyenService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);
    this.formData = this.fb.group({
      loaiDc: ['CHI_CUC', [Validators.required]],
      nam: [dayjs().get("year"), [Validators.required]],
      soQdinh: [, [Validators.required]],
      ngayKyQdinh: [],
      ngayPduyet: [],
      idThop: [, [Validators.required]],
      idDxuat: [, [Validators.required]],
      trichYeu: [],
      type: ['TH', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
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
      // lyDoTuChoi: [],
      // type: ['TH', [Validators.required]],
      // xuatCap: [false],
      // ngayPduyet: [],
      // fileDinhKem: [FileDinhKem],
      // canCu: [new Array<FileDinhKem>()],
      // tenDvi: [],
      // tenLoaiVthh: [],
      // tenCloaiVthh: [],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      // danhSachHangHoa: [new Array<any>(),],
      // danhSachQuyetDinh: [new Array<any>(),],
      listOfMapData: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {

    console.log('isDisabled', this.isDisabled())

    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
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
    return true//this.userService.isTongCuc()
  }

  isCuc() {
    return false//this.userService.isCuc()
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


  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      let listDeXuat = []
      data.danhSachQuyetDinh.map(async (item, i) => {

        listDeXuat.push(item.dcnbKeHoachDcHdr)
        let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

        let children = []

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
        quyetDinhPdDtl: listDeXuat,
        listOfMapData: this.listOfMapData
      });

      console.log('loadChiTiet', listDeXuat, this.listOfMapData)

      this.formData.patchValue(data);

      if (data.idThop) {
        this.formData.patchValue({
          type: "TH",
        })
        // await this.selectMaTongHop(data.idThop);
      } else {
        this.formData.patchValue({
          type: "TTr",
        })
        // await this.onChangeIdTrHdr(data.idDxuat);
      }

      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;


    }
    await this.spinner.hide();
  }

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }




  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const res = await this.maTongHopQuyetDinhDieuChuyenService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        let listDeXuat = []
        let listHangHoa = []
        let listQD = []

        data.thKeHoachDieuChuyenTongCucDtls.map(async item => {
          if (item.thKeHoachDieuChuyenCucHdr) {

            if (item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenCucKhacCucDtls.length > 0) {
              item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenCucKhacCucDtls.map(async itemKH => {
                listDeXuat.push(itemKH.dcnbKeHoachDcHdr)
                listQD.push({
                  keHoachDcHdrId: itemKH.dcnbKeHoachDcHdr.id,
                })
                itemKH.dcnbKeHoachDcHdr.danhSachHangHoa.map(async itemHH => {
                  listHangHoa.push(itemHH)
                })
                let dcnbKeHoachDcHdr = itemKH.dcnbKeHoachDcHdr
                let children = dcnbKeHoachDcHdr.danhSachHangHoa.map(itemHH => {
                  return {
                    ...itemHH,
                    key: itemHH.id
                  }
                })

                this.listOfMapData.push({
                  ...dcnbKeHoachDcHdr,
                  key: `${item.dcnbKeHoachDcHdr.id}`,
                  isEx: children.length > 0,
                  children: children,
                })
              })
            }

            if (item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.length > 0) {
              item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.map(async (itemKH, i) => {
                listDeXuat.push(itemKH.dcnbKeHoachDcHdr)
                listQD.push({
                  keHoachDcHdrId: itemKH.dcnbKeHoachDcHdr.id,
                })
                let dcnbKeHoachDcHdr = itemKH.dcnbKeHoachDcHdr
                dcnbKeHoachDcHdr.danhSachHangHoa.map(async itemHH => {
                  listHangHoa.push(itemHH)
                })


                let children = []

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

                this.listOfMapData.push({
                  ...dcnbKeHoachDcHdr,
                  key: `${dcnbKeHoachDcHdr.id}`,
                  isEx: children.length > 0,
                  children: children,
                })
              })
            }

          }

        })
        this.listOfMapData.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });

        this.formData.patchValue({
          quyetDinhPdDtl: listDeXuat,
          listOfMapData: this.listOfMapData
        });


      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator()
    let body = this.formData.value;
    if (this.idInput) body.id = this.idInput
    body.canCu = this.canCu
    body.quyetDinh = this.quyetDinh

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
    let trangThai = STATUS.CHO_DUYET_LDV;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV)
        return STATUS.TU_CHOI_LDV
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC)
        return STATUS.TU_CHOI_LDTC
      return STATUS.CHO_DUYET_LDV;
    };
    this.reject(this.idInput, trangThai());
  }

  async pheDuyet() {
    let trangThai = this.formData.value.trangThai == STATUS.CHO_DUYET_LDV ? STATUS.CHO_DUYET_LDTC : STATUS.BAN_HANH;
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
      this.formData.controls["idThop"].setValidators([Validators.required]);
      // this.formData.controls["maThop"].setValidators([Validators.required]);
      this.formData.controls["idDxuat"].clearValidators();
      // this.formData.controls["maDxuat"].clearValidators();
      // this.formData.controls["ngayDx"].clearValidators();
    }
    if (this.formData.get('type').value == 'TTr') {
      this.formData.controls["idThop"].clearValidators();
      // this.formData.controls["maThop"].clearValidators();
      // this.formData.controls["ngayThop"].clearValidators();
      this.formData.controls["idDxuat"].setValidators([Validators.required]);
      // this.formData.controls["maDxuat"].setValidators([Validators.required]);
    }
  }

  isDisabled() {
    if (this.isView) return true
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  async openDialogTh() {
    if (this.formData.get('type').value != 'TH') {
      return;
    }

    await this.spinner.show();
    let bodyTh = {
      loaiDieuChuyen: this.formData.get('loaiDc').value,
      namKeHoach: this.formData.get('nam').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }

    let resTh = await this.maTongHopQuyetDinhDieuChuyenService.dsMaTH(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data;
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
        dataColumn: ['id', 'noiDung']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.setValidator()
        this.listOfMapData = []
        await this.selectMaTongHop(data.id);
        this.formData.patchValue({
          idThop: data.id,
          idDxuat: undefined
        });
      }
    });
  }


  async openDialogTr() {
    if (this.formData.get('type').value != 'TTr') {
      return
    }
    await this.spinner.show();
    // Get data tờ trình
    let bodyDx = {
      loaiDieuChuyen: this.formData.get('loaiDc').value,
      namKeHoach: this.formData.get('nam').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resSoDX = await this.soDeXuatQuyetDinhDieuChuyenService.dsSoDX(bodyDx);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachDeXuat = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách mã tổng hợp',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachDeXuat,
        dataHeader: ['Số đề xuất/công văn'],
        dataColumn: ['id']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.setValidator()
        this.formData.patchValue({
          idDxuat: data.id,
          idThop: undefined
        });
        await this.onChangeIdTrHdr(data);
      }
    });
  }

  async onChangeIdTrHdr(data) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.soDeXuatQuyetDinhDieuChuyenService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        let listDeXuat = []
        let listQD = []
        data.thKeHoachDieuChuyenCucKhacCucDtls.map(async item => {
          listDeXuat.push(item.dcnbKeHoachDcHdr)
          listQD.push({
            keHoachDcHdrId: item.dcnbKeHoachDcHdr.id,
          })
          let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr
          let children = dcnbKeHoachDcHdr.danhSachHangHoa.map(item => {
            return {
              ...item,
              key: item.id
            }
          })
          this.listOfMapData.push({
            ...dcnbKeHoachDcHdr,
            key: `${item.dcnbKeHoachDcHdr.id}`,
            isEx: children.length > 0,
            children: children,
          })
        })
        data.thKeHoachDieuChuyenNoiBoCucDtls.map(async (item, i) => {
          listDeXuat.push(item.dcnbKeHoachDcHdr)
          listQD.push({
            keHoachDcHdrId: item.dcnbKeHoachDcHdr.id,
          })
          let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr


          let children = []

          const grouped = this.groupBy(dcnbKeHoachDcHdr.danhSachHangHoa, "maDiemKho");
          const keyarr = Object.keys(grouped);

          keyarr.map((k, j) => {
            const valuearr = grouped[k].map(v => {
              return {
                ...v,
                key: v.id
              }
            })
            const itemv: any = valuearr[0]
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

          this.listOfMapData.push({
            ...dcnbKeHoachDcHdr,
            key: `${item.dcnbKeHoachDcHdr.id}`,
            isEx: children.length > 0,
            children: children,
          })
        })
        this.listOfMapData.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
        this.formData.patchValue({
          quyetDinhPdDtl: listDeXuat,
          danhSachQuyetDinh: listQD,
          listOfMapData: this.listOfMapData
        });

      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }



}
