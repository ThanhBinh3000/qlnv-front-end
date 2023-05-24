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
import * as uuid from "uuid";

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
  selector: 'app-thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component.scss']
})
export class ThongTinBienBanNghiemThuBaoQuanLanDauComponent extends Base2Component implements OnInit {

  @Input()
  idTHop: number;
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
  dataTableView: any[] = []
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
  listLoaiDC: any[] = [
    {
      value: "CHI_CUC",
      text: "Giữa 2 chi cục trong cùng 1 cục"
    },
    {
      value: "CUC",
      text: "Giữa 2 cục DTNN KV"
    }
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private soDeXuatQuyetDinhDieuChuyenService: SoDeXuatQuyetDinhDieuChuyenService,
    private maTongHopQuyetDinhDieuChuyenService: MaTongHopQuyetDinhDieuChuyenService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);
    this.formData = this.fb.group({
      loaiDc: ['CHI_CUC', [Validators.required]],
      tenLoaiDc: ['Giữa 2 chi cục trong cùng 1 cục'],
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
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      danhSachQuyetDinh: [new Array<any>(),],
    }
    );
  }

  async ngOnInit() {

    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
        if (this.idTHop) {
          this.formData.patchValue({
            idThop: this.idTHop
          })
          this.selectMaTongHop(this.idTHop)
        }
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

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      let listDeXuat = []
      let listHangHoa = []
      this.dataTableView = []
      data.danhSachQuyetDinh.map(async (item, i) => {
        if (item.dcnbKeHoachDcHdr) {
          listDeXuat.push(item.dcnbKeHoachDcHdr)
          let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

          dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            listHangHoa.push({
              ...element,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
            })
          });
        }
      })

      console.log('loadChiTiet', data.loaiDc, listHangHoa, this.dataTableView)
      this.formData.patchValue({
        quyetDinhPdDtl: listDeXuat,
      });


      this.formData.patchValue(data);

      if (data.idThop) {
        this.formData.patchValue({
          type: "TH",
        })
      } else {
        this.formData.patchValue({
          type: "TTr",
        })
      }

      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;
      if (data.loaiDc === "CHI_CUC") {
        this.dataTableView = this.buildTableViewChiCUC(listHangHoa)
      }

      if (data.loaiDc === "CUC") {
        this.dataTableView = this.buildTableViewChiCUC(listHangHoa)
      }

    }
    await this.spinner.hide();
  }


  async onChangeLoaiDc(value) {
    if (value) {
      const loaiDC = this.listLoaiDC.find(item => item.value == value)

      if (loaiDC) {
        this.formData.patchValue({
          tenLoaiDc: loaiDC.text,
        })
      }
      this.dataTableView = []
    }
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
        let loaiDC = data.loaiDieuChuyen || this.formData.value.loaiDc
        this.formData.patchValue({
          loaiDc: data.loaiDieuChuyen
        })


        data.thKeHoachDieuChuyenTongCucDtls.map(async item => {
          if (loaiDC === "CHI_CUC") {
            if (item.thKeHoachDieuChuyenCucHdr) {

              if (item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.length > 0) {
                item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.map(async (itemKH, i) => {
                  if (itemKH.dcnbKeHoachDcHdr) {
                    listDeXuat.push(itemKH.dcnbKeHoachDcHdr)
                    listQD.push({
                      keHoachDcHdrId: itemKH.dcnbKeHoachDcHdr.id,
                    })
                    let dcnbKeHoachDcHdr = itemKH.dcnbKeHoachDcHdr
                    dcnbKeHoachDcHdr.danhSachHangHoa.map(async itemHH => {
                      listHangHoa.push({
                        ...itemHH,
                        maDvi: dcnbKeHoachDcHdr.maDvi,
                        tenDvi: dcnbKeHoachDcHdr.tenDvi,
                      })
                    })
                  }

                })
              }

            }

            this.dataTableView = this.buildTableViewChiCUC(listHangHoa)
          }

          if (loaiDC === "CUC") {
            listDeXuat.push(item)
            if (item.thKeHoachDieuChuyenCucKhacCucDtl) {

              if (item.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.length > 0) {
                item.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.map(async (itemKH, i) => {

                  listQD.push({
                    keHoachDcHdrId: itemKH.id,
                  })
                  itemKH.danhSachHangHoa.map(async itemHH => {
                    listHangHoa.push({
                      ...itemHH,
                      maDvi: itemKH.maDvi,
                      tenDvi: itemKH.tenDvi,
                    })

                  })


                })
              }

            }
            this.dataTableView = this.buildTableViewChiCUC(listHangHoa)

          }



        })
        console.log('buildTableView', this.dataTableView, listDeXuat)
        this.formData.patchValue({
          quyetDinhPdDtl: listDeXuat,
          danhSachQuyetDinh: listQD,
        });


      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
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
              .groupBy("maNganKho")
              ?.map((vs, ks) => {
                console.log('maNganKho', ks, vs)
                const maNganKho = vs.find(s => s?.maNganKho == ks);
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

                //   return {
                //     ...ids,
                //     children: rsxx
                //   }
                // }).value()

                const rsxx = chain(vs).groupBy("maChiCucNhan")?.map((m, im) => {
                  console.log('maChiCucNhan', im, m)
                  const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                  const hasMaDiemKhoNhan = vs.some(f => f.maDiemKhoNhan);
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

                let duToanKphi = vs?.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                return {
                  ...maNganKho,
                  idVirtual: maNganKho ? maNganKho.idVirtual ? maNganKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
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

    if (data?.length !== 0) {
      const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
      this.formData.patchValue({
        tongtien: tongDuToanChiPhi,
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
  //   // this.tableView = dataView;
  //   // this.expandAll()

  //   // if (data?.length !== 0) {
  //   //   this.tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
  //   // };
  //   return dataView
  // }

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

  // flattenTree(tree) {
  //   return tree.flatMap((item) => {
  //     return item.childData ? this.flattenTree(item.childData) : item;
  //   });
  // }

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
        dataHeader: ['Mã tổng hợp'],
        dataColumn: ['id']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.setValidator()
        this.dataTableView = []
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
        dataColumn: ['soDeXuat']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.setValidator()
        this.formData.patchValue({
          idDxuat: data.id,
          idThop: undefined
        });
        this.dataTableView = []
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
        let loaiDC = dataRes.loaiDieuChuyen || this.formData.value.loaiDc
        let listDeXuat = []
        let listQD = []
        let listHangHoa = []
        dataRes.thKeHoachDieuChuyenCucKhacCucDtls.map(async item => {
          if (item.dcnbKeHoachDcHdr) {
            let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr
            console.log('dcnbKeHoachDcHdr', item, dcnbKeHoachDcHdr)

            dcnbKeHoachDcHdr.forEach(element => {
              listDeXuat.push(element)
              listQD.push({
                keHoachDcHdrId: element.id,
              })
              element.danhSachHangHoa.map(async itemHH => {
                listHangHoa.push({
                  ...itemHH,
                  maDvi: element.maDvi,
                  tenDvi: element.tenDvi,
                })

              })
            });
          }



        })
        dataRes.thKeHoachDieuChuyenNoiBoCucDtls.map(async (item, i) => {
          if (item.dcnbKeHoachDcHdr) {
            listDeXuat.push(item.dcnbKeHoachDcHdr)
            listQD.push({
              keHoachDcHdrId: item.dcnbKeHoachDcHdr.id,
            })
            let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr
            dcnbKeHoachDcHdr.danhSachHangHoa.map(async itemHH => {
              listHangHoa.push({
                ...itemHH,
                maDvi: dcnbKeHoachDcHdr.maDvi,
                tenDvi: dcnbKeHoachDcHdr.tenDvi,
              })

            })
          }

        })

        if (loaiDC === "CHI_CUC") {
          this.dataTableView = this.buildTableViewChiCUC(listHangHoa)
        }

        if (loaiDC === "CUC") {
          this.dataTableView = this.buildTableViewChiCUC(listHangHoa)
        }

        console.log('onChangeIdTrHdr', listDeXuat, listHangHoa, this.dataTableView)

        this.formData.patchValue({
          quyetDinhPdDtl: listDeXuat,
          danhSachQuyetDinh: listQD,
        });

      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

}
