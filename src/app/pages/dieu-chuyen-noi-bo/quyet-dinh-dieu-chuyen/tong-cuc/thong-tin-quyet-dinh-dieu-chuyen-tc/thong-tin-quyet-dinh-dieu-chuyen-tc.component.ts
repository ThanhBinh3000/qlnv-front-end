import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as dayjs from "dayjs";
import { chain } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucDungChungService } from "src/app/services/danh-muc-dung-chung.service";
import { MaTongHopQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/ma-tong-hop-quyet-dinh-dieu-chinh.service";
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { SoDeXuatQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/so-de-xuat-quyet-dinh-dieu-chinh.service";
import { StorageService } from "src/app/services/storage.service";
import * as uuidv4 from "uuid";

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
  @Input()
  idTHop: number;
  @Input()
  qdDcId: number;
  @Input() isViewOnModal: boolean;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  canCu: any[] = [];
  quyetDinh: any[] = [];

  maQd: string = null;
  listDanhSachTongHop: any[] = [];
  listDanhSachDeXuat: any[] = [];
  danhsachDx: any[] = [];
  dataTableView: any[] = []
  dataDetail: any;

  selected: number = 0

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

  kieuNhapXuat: any[] = [
    {
      value: "01",
      text: "Nhập mua"
    },
    {
      value: "02",
      text: "Nhập không chi tiền"
    },
    {
      value: "03",
      text: "Xuất bán"
    },
    {
      value: "04",
      text: "Xuất không thu tiền"
    },
    {
      value: "05",
      text: "Khác"
    }
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private router: Router,
    private dmService: DanhMucDungChungService,
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
      ngayKyQdinh: [, [Validators.required]],
      ngayPduyet: [, [Validators.required]],
      idThop: [, [Validators.required]],
      maThop: [],
      idDxuat: [, [Validators.required]],
      maDxuat: [],
      soDeXuat: [],
      trichYeu: [],
      tongtien: [],
      type: ['TH', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [],
      tenLoaiHinhNhapXuat: [],
      tenKieuNhapXuat: [],
      ysKienVuKhac: [],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      danhSachQuyetDinh: [new Array<any>(),],
    }
    );

    if (this.isViewOnModal) this.isView = true
  }

  async ngOnInit() {

    await this.spinner.show();
    try {
      this.maQd = "DCNB"//this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
        this.getDataNX(this.formData.value.loaiDc)
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
  async getDataNX(loaiDC) {
    await this.spinner.show()
    const body = { loai: 'LOAI_HINH_NHAP_XUAT', ma: loaiDC === 'CHI_CUC' ? '94' : '144' }
    let res = await this.dmService.search(body);
    if (res.statusCode == 0) {
      const data = res.data.content
      if (data && data.length > 0) {
        const content = data[0]
        const knx = this.kieuNhapXuat.find(item => item.value === content.ghiChu)
        this.formData.patchValue({
          tenLoaiHinhNhapXuat: content.giaTri,
          tenKieuNhapXuat: !!knx ? knx?.text : ''
        });
      }
    }

    await this.spinner.hide();
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.dataDetail = data
      let listDeXuat = []
      let listHangHoa = []
      this.dataTableView = []
      if (data.danhSachQuyetDinh.length > 0) {
        data.danhSachQuyetDinh.forEach(async (item, i) => {
          listDeXuat.push(item)
        })

        let dcnbKeHoachDcHdr = data.danhSachQuyetDinh[0].danhSachQuyetDinhChiTiet
        if (!dcnbKeHoachDcHdr) return
        dcnbKeHoachDcHdr.forEach(dq => {
          if (dq.dcnbKeHoachDcHdr) {
            dq.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
              listHangHoa.push({
                ...element,
                maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
                maDvi: dq.dcnbKeHoachDcHdr.maDvi,
                tenDvi: dq.dcnbKeHoachDcHdr.tenDvi,
              })
            });
          }

        });
      }

      console.log('listDeXuat', listDeXuat)
      this.formData.patchValue({
        ...data,
        quyetDinhPdDtl: listDeXuat,
        soQdinh: data.soQdinh ? data.soQdinh.split('/')[0] : ''
      });

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
      this.dataTableView = this.buildTableView(listHangHoa)

    }
    await this.spinner.hide();
  }

  selectRow(index) {
    // debugger
    this.selected = index
    let listHangHoa = []
    this.dataTableView = []
    let itemQd = this.formData.value.quyetDinhPdDtl[index]

    let dcnbKeHoachDcHdr = itemQd.danhSachQuyetDinhChiTiet
    if (dcnbKeHoachDcHdr && dcnbKeHoachDcHdr.length > 0) {
      dcnbKeHoachDcHdr.forEach(dq => {
        // if (dq.danhSachKeHoach) {
        //   dq.danhSachKeHoach.forEach(element => {
        //     listHangHoa.push({
        //       ...element,
        //       maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
        //       maDvi: dcnbKeHoachDcHdr.maDvi,
        //       tenDvi: dcnbKeHoachDcHdr.tenDvi,
        //     })
        //   });
        // }

        if (dq.dcnbKeHoachDcHdr) {
          dq.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            listHangHoa.push({
              ...element,
              maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
              maDvi: dq.dcnbKeHoachDcHdr.maDvi,
              tenDvi: dq.dcnbKeHoachDcHdr.tenDvi,
            })
          });
        }

      });



    }


    // if (itemQd.danhSachHangHoa) {
    //   itemQd.danhSachHangHoa.forEach(element => {
    //     listHangHoa.push({
    //       ...element,
    //       maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
    //       maDvi: itemQd.maDvi,
    //       tenDvi: itemQd.tenDvi,
    //     })
    //   });
    // }

    if (itemQd.thKeHoachDieuChuyenCucHdr) {
      if (itemQd.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.length > 0) {
        itemQd.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.map(itemKH => {
          let dcnbKeHoachDcHdr = itemKH.dcnbKeHoachDcHdr
          if (!dcnbKeHoachDcHdr) return
          dcnbKeHoachDcHdr.danhSachHangHoa.map(async itemHH => {
            listHangHoa.push({
              ...itemHH,
              maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
            })
          })
        })

      }
    }

    if (itemQd.thKeHoachDieuChuyenCucKhacCucDtl) {

      if (itemQd.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.length > 0) {
        itemQd.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.map(async (itemKH) => {

          if (!itemKH.danhSachHangHoa) return
          itemKH.danhSachHangHoa.map(async itemHH => {
            listHangHoa.push({
              ...itemHH,
              maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
              maDvi: itemKH.maDvi,
              tenDvi: itemKH.tenDvi,
            })

          })


        })
      }

    }


    this.dataTableView = this.buildTableView(listHangHoa)
  }

  async onChangeLoaiDc(value) {
    if (value) {
      const loaiDC = this.listLoaiDC.find(item => item.value == value)

      if (loaiDC) {
        this.getDataNX(loaiDC.value)
        this.formData.patchValue({
          tenLoaiDc: loaiDC.text,
        })
      }
      this.formData.patchValue({
        idThop: this.idTHop || "",
        maThop: this.idTHop || "",
        idDxuat: undefined,
        maDxuat: undefined,
        soDeXuat: undefined,
        quyetDinhPdDtl: []
      })
      this.dataTableView = []
    }
  }


  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const res = await this.maTongHopQuyetDinhDieuChuyenService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        let listQD = []
        let listDeXuat = []
        let listHangHoa = []

        let loaiDC = data.loaiDieuChuyen || this.formData.value.loaiDc
        this.formData.patchValue({
          loaiDc: data.loaiDieuChuyen
        })


        data.thKeHoachDieuChuyenTongCucDtls.forEach(item => {
          listDeXuat.push(item)

          if (loaiDC === "CHI_CUC") {
            if (item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.length > 0) {
              item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.forEach(itemKH => {
                listQD.push({
                  keHoachDcHdrId: itemKH.dcKeHoachDcHdrId,
                })
              })
            }
          }

          if (loaiDC === "CUC") {
            if (item.thKeHoachDieuChuyenCucKhacCucDtl) {
              item.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.forEach(element => {
                listQD.push({
                  keHoachDcHdrId: element.id,
                })
              });

            }
          }


        })

        const item = data.thKeHoachDieuChuyenTongCucDtls[0]
        if (loaiDC === "CHI_CUC") {

          if (item.thKeHoachDieuChuyenCucHdr) {

            if (item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.length > 0) {
              item.thKeHoachDieuChuyenCucHdr.thKeHoachDieuChuyenNoiBoCucDtls.forEach(itemKH => {
                let dcnbKeHoachDcHdr = itemKH.dcnbKeHoachDcHdr
                // listQD.push({
                //   keHoachDcHdrId: dcnbKeHoachDcHdr.id,
                // })
                if (dcnbKeHoachDcHdr) {
                  dcnbKeHoachDcHdr.danhSachHangHoa.map(async itemHH => {
                    listHangHoa.push({
                      ...itemHH,
                      maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
                      maDvi: dcnbKeHoachDcHdr.maDvi,
                      tenDvi: dcnbKeHoachDcHdr.tenDvi,
                    })
                  })
                }


              })

            }

          }


        }

        if (loaiDC === "CUC") {
          if (item.thKeHoachDieuChuyenCucKhacCucDtl) {

            if (item.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.length > 0) {
              item.thKeHoachDieuChuyenCucKhacCucDtl.dcnbKeHoachDcHdr.forEach(async (itemKH, i) => {
                // listQD.push({
                //   keHoachDcHdrId: itemKH.id,
                // })
                itemKH.danhSachHangHoa.forEach(async itemHH => {
                  listHangHoa.push({
                    ...itemHH,
                    maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
                    maDvi: itemKH.maDvi,
                    tenDvi: itemKH.tenDvi,
                  })

                })


              })
            }

          }

        }

        this.dataTableView = this.buildTableView(listHangHoa)
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



  buildTableView(data: any[] = [], groupBy: string = "maDvi") {
    let dataView = chain(data)
      .groupBy("maDvi")
      ?.map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {
            let rss = chain(v)
              .groupBy("maLoNganKho")
              ?.map((vs, ks) => {
                const maNganKho = vs.find(s => s?.maLoNganKho == ks);


                const rsxx = chain(vs).groupBy("maChiCucNhan")?.map((m, im) => {

                  const maChiCucNhan = m.find(f => f.maChiCucNhan == im);
                  const hasMaDiemKhoNhan = vs.some(f => f.maDiemKhoNhan);
                  if (!hasMaDiemKhoNhan) return {
                    ...maChiCucNhan
                  }

                  const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

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
                let soLuongDc = vs?.reduce((prev, cur) => prev + cur.soLuongDc, 0);

                return {
                  ...maNganKho,
                  idVirtual: maNganKho ? maNganKho.idVirtual ? maNganKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: rsxx,
                  duToanKphi,
                  soLuongDc
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

    if (data?.length !== 0) {
      const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
      this.formData.patchValue({
        tongtien: tongDuToanChiPhi,
      })
    };
    console.log('dataView', data, dataView)
    return dataView
  }



  async save(isGuiDuyet?) {
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    await this.spinner.show();
    let body = this.formData.value;
    body.soQdinh = this.formData.value.soQdinh ? `${this.formData.value.soQdinh.toString().split("/")[0]}/${this.maQd}` : ''
    if (this.idInput) {
      body.id = this.idInput
    }

    body.canCu = this.canCu
    body.quyetDinh = this.quyetDinh

    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      this.selected = 0
      if (isGuiDuyet) {
        this.guiDuyet();
      }
      else {
        await this.loadChiTiet(this.idInput)
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
      if (this.formData.value.trangThai == STATUS.DA_DUYET_LDV)
        return STATUS.TU_CHOI_LDTC
      return STATUS.CHO_DUYET_LDV;
    };
    this.reject(this.idInput, trangThai());
  }

  async pheDuyet() {
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    let trangThai = this.formData.value.trangThai == STATUS.CHO_DUYET_LDV ? STATUS.DA_DUYET_LDV : STATUS.BAN_HANH;
    let mesg = this.formData.value.trangThai == STATUS.DA_DUYET_LDV ? 'Bạn muốn ban hành văn bản?' : 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.DA_DUYET_LDV && this.isTongCuc() && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_DUYET_LDTC')
  }

  async banHanh() {
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    await this.spinner.show();
    let body = this.formData.value;
    body.soQdinh = this.formData.value.soQdinh ? `${this.formData.value.soQdinh.toString().split("/")[0]}/${this.maQd}` : ''
    if (this.idInput) {
      body.id = this.idInput
    }

    body.canCu = this.canCu
    body.quyetDinh = this.quyetDinh

    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      await this.spinner.hide();
      let trangThai = STATUS.BAN_HANH;
      let mesg = 'Bạn muốn ban hành văn bản?'
      this.approve(this.idInput, trangThai, mesg);
    }

  }





  setValidator() {
    if (this.formData.get('trangThai').value !== STATUS.DA_DUYET_LDV) {
      this.formData.controls["soQdinh"].clearValidators();
      this.formData.controls["ngayKyQdinh"].clearValidators();
      this.formData.controls["ngayPduyet"].clearValidators();
    } else {
      this.formData.controls["soQdinh"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQdinh"].setValidators([Validators.required]);
      this.formData.controls["ngayPduyet"].setValidators([Validators.required]);
    }

    if (this.formData.get('type').value == 'TH') {
      this.formData.controls["idThop"].setValidators([Validators.required]);
      this.formData.controls["idDxuat"].clearValidators();
    }
    if (this.formData.get('type').value == 'TTr') {
      this.formData.controls["idThop"].clearValidators();
      this.formData.controls["idDxuat"].setValidators([Validators.required]);
    }
  }

  async openDialogTh() {
    if (this.formData.get('type').value != 'TH' || this.isView || !!this.idTHop) {
      return;
    }
    this.setValidator()
    // this.formData.patchValue({
    //   idDxuat: undefined
    // });
    await this.spinner.show();
    let bodyTh = {
      loaiDieuChuyen: this.formData.get('loaiDc').value,
      namKeHoach: this.formData.get('nam').value,
      qdtcId: this.dataDetail?.idThop,
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
      nzTitle: 'Danh sách tổng hợp kế hoạch điều chuyển',
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
          maThop: data.maTongHop,
          idDxuat: undefined,
          maDxuat: undefined,
          soDeXuat: undefined,
        });
      }
    });
  }


  async openDialogTr() {
    if (this.formData.get('type').value != 'TTr' || this.isView) {
      return
    }
    this.setValidator()
    // this.formData.patchValue({
    //   idThop: undefined
    // });
    await this.spinner.show();

    let bodyDx = {
      loaiDieuChuyen: this.formData.get('loaiDc').value,
      namKeHoach: this.formData.get('nam').value,
      qdtcId: this.dataDetail?.idDxuat,
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
      nzTitle: 'Danh sách số đề xuất/công văn',
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
          maDxuat: data.soDeXuat,
          soDeXuat: data.soDeXuat,
          idThop: undefined,
          maThop: undefined
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

            dcnbKeHoachDcHdr.forEach(element => {
              listDeXuat.push(element)
              listQD.push({
                keHoachDcHdrId: element.id,
              })
              element.danhSachHangHoa.map(async itemHH => {
                listHangHoa.push({
                  ...itemHH,
                  maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
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
                maLoNganKho: itemHH.maLoKho ? `${itemHH.maLoKho}${itemHH.maNganKho}` : itemHH.maNganKho,
                maDvi: dcnbKeHoachDcHdr.maDvi,
                tenDvi: dcnbKeHoachDcHdr.tenDvi,
              })

            })
          }

        })

        this.dataTableView = this.buildTableView(listHangHoa)



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

  quayLai() {
    if (this.idTHop || this.qdDcId)
      this.router.navigate(['dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen']);
    this.showListEvent.emit();
  }

}
