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
import * as uuidv4 from "uuid";
import { chain, cloneDeep, sortBy } from 'lodash';
import { STATUS } from "src/app/constants/status";
import { ThongTinHangCanDieuChuyenCucComponent } from "../thong-tin-hang-can-dieu-chuyen-cuc/thong-tin-hang-can-dieu-chuyen-cuc.component";
import { QuyetDinhDieuChuyenTCService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { AMOUNT_NO_DECIMAL } from "src/app/Utility/utils";
import { ThongTinHangCanDieuChuyenChiCucComponent } from "../thong-tin-hang-can-dieu-chuyen-chi-cuc/thong-tin-hang-can-dieu-chuyen-chi-cuc.component";
import { DialogTableSelectionComponent } from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { DanhMucDungChungService } from "src/app/services/danh-muc-dung-chung.service";

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
  @Input() isViewOnModal: boolean;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  canCu: any[] = [];
  quyetDinh: any[] = [];

  listQuyetDinh: any[] = [];

  maQd: string = null;
  listChiCucNhan: any[] = [];

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
  nzActive: boolean = true
  selected: number = 0
  danhSachKeHoach: any[] = []
  typeKeHoach: string = "ADD"
  danhSachQuyetDinh: any[] = []
  dataTableView: any[] = []
  AMOUNT = AMOUNT_NO_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dmService: DanhMucDungChungService,
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
      loaiQdinh: [, [Validators.required]],
      tenLoaiQdinh: [],
      ngayKyQdinh: [, [Validators.required]],
      ngayHieuLuc: [, [Validators.required]],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [],
      soCanCuQdTc: [, [Validators.required]],
      canCuQdTc: [],
      soDxuat: [],
      ngayTrinhDuyetTc: [],
      tongDuToanKp: [],
      tenLoaiHinhNhapXuat: [],
      tenKieuNhapXuat: [],
      quyetDinhPdDtl: [new Array<any>(),],
      danhSachQuyetDinh: [new Array<any>(),],

    }
    );
  }

  async ngOnInit() {
    await this.spinner.show();

    this.loadDsChiCuc()
    this.getDataNX(this.formData.value.loaiDc)
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

  getTitle() {
    if (this.formData.value.loaiDc === "DCNB")
      return "QUYẾT ĐỊNH ĐIỀU CHUYỂN NỘI BỘ HÀNG TRONG CÙNG 1 CHI CỤC DTNN"
    if (this.formData.value.loaiDc === "CHI_CUC")
      return "QUYẾT ĐỊNH ĐIỀU CHUYỂN NỘI BỘ GIỮA CÁC CHI CỤC DTNN TRONG CÙNG 1 CỤC DTNN KV"
    if (this.formData.value.loaiDc === "CUC")
      return "QUYẾT ĐỊNH ĐIỀU CHUYỂN NỘI BỘ GIỮA 2 CỤC DTNN KV"
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.danhSachKeHoach = []
      this.formData.patchValue({
        ...data,
        soQdinh: data.soQdinh.split('/')[0]
      });
      this.canCu = data.canCu;
      this.quyetDinh = data.quyetDinh;

      if (data.loaiDc !== "DCNB") this.loadDsQuyetDinh(data.loaiDc, data.loaiQdinh)

      if (data.danhSachQuyetDinh.length == 0) return
      let dsDX = []
      if (data.loaiDc === "CUC") {
        data.danhSachQuyetDinh.map(async (item, i) => {
          if (item.dcnbKeHoachDcHdr) {
            let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr
            dsDX.push(dcnbKeHoachDcHdr)
          }
        })
        this.formData.patchValue({
          quyetDinhPdDtl: dsDX,
        })
        let dcnbKeHoachDcHdr = data.danhSachQuyetDinh[0].dcnbKeHoachDcHdr
        if (dcnbKeHoachDcHdr) {
          dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            this.danhSachKeHoach.push({
              ...element,
              maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
              soDxuat: dcnbKeHoachDcHdr.soDxuat
            })
          });
        }

      } else {
        data.danhSachQuyetDinh.map(async (item, i) => {
          if (item.dcnbKeHoachDcHdr) {
            let dcnbKeHoachDcHdr = item.dcnbKeHoachDcHdr

            dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
              this.danhSachKeHoach.push({
                ...element,
                maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
                maDvi: dcnbKeHoachDcHdr.maDvi,
                tenDvi: dcnbKeHoachDcHdr.tenDvi,
                soDxuat: dcnbKeHoachDcHdr.soDxuat
              })
            });
          }
        })
      }



      if (data.loaiDc === "DCNB") {
        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")
      } else {
        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")
      }

    }
    await this.spinner.hide();
  }

  async getDataNX(loaiDC, loaiQdinh?) {
    await this.spinner.show()
    let ma = () => {
      if (loaiDC == "CUC") {
        if (loaiQdinh && loaiQdinh === "00") {
          return '85'
        } else
          return '144'

      }
      if (loaiDC == "CHI_CUC")
        return '94'
      return '90';
    }
    const body = { loai: 'LOAI_HINH_NHAP_XUAT', ma: ma() }
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

  selectRow(index) {
    this.selected = index
    this.dataTableView = []
    let itemQd = this.formData.value.quyetDinhPdDtl[index]
    this.danhSachKeHoach = []

    if (itemQd.danhSachQuyetDinhChiTiet) {
      itemQd.danhSachQuyetDinhChiTiet.forEach(itemHH => {
        const dcnbKeHoachDcHdr = itemHH.dcnbKeHoachDcHdr
        if (dcnbKeHoachDcHdr) {
          dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            this.danhSachKeHoach.push({
              ...element,
              maLoNganKho: itemHH.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
              soDxuat: dcnbKeHoachDcHdr.soDxuat
            })
          });
        }

      })
    }

    if (itemQd.danhSachHangHoa) {
      itemQd.danhSachHangHoa.forEach(element => {
        this.danhSachKeHoach.push({
          ...element,
          maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
          maDvi: itemQd.maDvi,
          tenDvi: itemQd.tenDvi,
          soDxuat: itemQd.soDxuat
        })
      });
    }



    this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")
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

  async loadDsQuyetDinh(loaiDc, loaiQdinh?) {
    let body = {
      loaiDc,
      loaiQdinh,
      qDinhCucId: this.idInput
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
      this.formData.patchValue({
        canCuQdTc: "",
        soCanCuQdTc: "",
        soDxuat: "",
        ngayTrinhDuyetTc: "",
        tongDuToanKp: "",
      })

      if (loaiDC) {
        this.getDataNX(loaiDC.value)
        this.formData.patchValue({
          tenLoaiDc: loaiDC.text,
        })
      }
      if (value === "CHI_CUC") this.loadDsQuyetDinh(value)


      this.dataTableView = []
    }
  }

  async onChangeLoaiQdinh(value) {
    if (value) {
      const loaiQD = this.listLoaiQD.find(item => item.value == value)
      this.loadDsQuyetDinh(this.formData.value.loaiDc, value)
      if (loaiQD) {
        this.formData.patchValue({
          tenLoaiQdinh: loaiQD.text,
        })
        this.getDataNX(this.formData.value.loaiDc, value)
      }

    }
  }

  async openDialogQD() {
    if (this.isView) return
    await this.spinner.show();
    // Get data tờ trình
    // let body = {
    //   trangThai: STATUS.BAN_HANH,
    //   loaiVthh: ['0101', '0102'],
    //   loaiDc: "DCNB",
    //   maDvi: this.userInfo.MA_DVI
    //   // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    // }
    // let resSoDX = this.isCuc() ? await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenCuc(body) : await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    // if (resSoDX.msg == MESSAGE.SUCCESS) {
    //   this.listDanhSachQuyetDinh = resSoDX.data;
    // }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQuyetDinh,
        dataHeader: ['Số quyết định'],
        dataColumn: ['soQdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        const soDxuat = data.danhSachQuyetDinh[0].soDxuat
        this.formData.patchValue({
          soCanCuQdTc: data.soQdinh,
          canCuQdTc: data.id,
          soDxuat,
          ngayTrinhDuyetTc: data.ngayHieuLuc
        })
        this.onChangeCanCuQdTc(data.id)
      }
    });
  }

  async onChangeCanCuQdTc(id) {
    if (id) {

      this.danhSachKeHoach = []
      this.danhSachQuyetDinh = []
      let dsHH = []
      const detail = await this.quyetDinhDieuChuyenTCService.getDetail(id)
      const data = detail.data
      if (!data) return
      console.log('onChangeCanCuQdTc', detail)
      let dsDX = []
      if (this.formData.value.loaiQdinh === "01") {
        dsDX = data.danhSachQuyetDinh.filter((dvn) => dvn.maCucXuat === this.userInfo.MA_DVI)
      } else {
        dsDX = data.danhSachQuyetDinh.filter((dvn) => dvn.maCucNhan === this.userInfo.MA_DVI)
      }

      dsDX.forEach(element => {
        element.danhSachQuyetDinhChiTiet.forEach(itemQD => {
          this.danhSachQuyetDinh.push({
            dcnbKeHoachDcHdr: { danhSachHangHoa: itemQD.dcnbKeHoachDcHdr.danhSachHangHoa }
          })

        })
      });

      const hanghoa = dsDX[0]
      hanghoa.danhSachQuyetDinhChiTiet.forEach(itemHH => {
        const dcnbKeHoachDcHdr = itemHH.dcnbKeHoachDcHdr
        if (dcnbKeHoachDcHdr) {
          dcnbKeHoachDcHdr.danhSachHangHoa.forEach(element => {
            dsHH.push({
              ...element,
              maLoNganKho: itemHH.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho,
              maDvi: dcnbKeHoachDcHdr.maDvi,
              tenDvi: dcnbKeHoachDcHdr.tenDvi,
              soDxuat: dcnbKeHoachDcHdr.soDxuat
            })
          });
        }

      })



      this.dataTableView = this.buildTableView(dsHH, "maDvi")
      let tongDuToanKp = dsDX?.reduce((prev, cur) => prev + cur.tongDuToanKp, 0);

      this.formData.patchValue({
        tongDuToanKp,
        quyetDinhPdDtl: dsDX,
        danhSachQuyetDinh: this.danhSachQuyetDinh
      })


    }
  }



  buildTableView(data: any[] = [], groupBy: string = "maDvi") {
    let dataView = chain(data)
      .groupBy(groupBy)
      ?.map((value, key) => {

        let rs = chain(value)
          .groupBy("maDiemKho")
          ?.map((v, k) => {

            let rss = chain(v)
              .groupBy("maLoNganKho")
              ?.map((vs, ks) => {

                const maLoKho = vs.find(s => s?.maLoNganKho == ks);


                const rsxx = (groupBy === "maChiCucNhan") ? chain(vs).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                  const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                  let soLuongNhap = n?.reduce((prev, cur) => prev + cur.soLuongPhanBo, 0);

                  return {
                    ...maDiemKhoNhan,
                    soLuongNhap,
                    children: n
                  }
                }).value() : chain(vs).groupBy("maChiCucNhan")?.map((m, im) => {

                  const maChiCucNhan = m.find(f => f.maChiCucNhan == im);

                  const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                    const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                    let soLuongNhap = n?.reduce((prev, cur) => prev + cur.soLuongPhanBo, 0);

                    return {
                      ...maDiemKhoNhan,
                      soLuongNhap,
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
                  ...maLoKho,
                  idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: rsxx,
                  duToanKphi,
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


    if (data?.length > 0) {
      const tongDuToanChiPhi = data.reduce((prev, cur) => prev + cur.duToanKphi, 0);
      this.formData.patchValue({
        tongDuToanKp: tongDuToanChiPhi,
      })
    };
    console.log('dataView', dataView)
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

  nzActiveChange(value) {
    this.nzActive = value
    console.log('nzActiveChange', value, this.nzActive)
  }

  async add(row?: any) {
    await this.spinner.show();

    await this.spinner.hide();
    if (!row) this.typeKeHoach = "ADD"

    const keHoachDcHdrId = row ? row.hdrId : undefined

    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
      nzContent: ThongTinHangCanDieuChuyenCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        danhSachKeHoach: this.danhSachKeHoach,
        dsChiCuc: this.listChiCucNhan,
        data: row ? row : undefined,
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.nzActive = true
      if (data) {
        if (data.isUpdate) {
          if (this.typeKeHoach === "LO_KHO_NHAN")
            this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => `${kh.maLoKhoNhan}${kh.maNganKhoNhan}${kh.maLoKho}${kh.maNganKho}` !== `${row.maLoKhoNhan}${row.maNganKhoNhan}${row.maLoKho}${row.maNganKho}`)

          this.danhSachKeHoach.push({
            ...data,
            maLoNganKho: data.maLoKho ? `${data.maLoKho}${data.maNganKho}` : data.maNganKho,
            hdrId: row.hdrId,
            id: this.typeKeHoach === "LO_KHO_NHAN" ? row.id : undefined
          })

        } else
          this.danhSachKeHoach.push({
            ...data,
            maLoNganKho: data.maLoKho ? `${data.maLoKho}${data.maNganKho}` : data.maNganKho,
          })

        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")

        if (this.idInput) {
          if (keHoachDcHdrId) {
            const qdinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId == keHoachDcHdrId)

            if (qdinh) {
              const dsHH = this.typeKeHoach === "LO_KHO_NHAN" ? qdinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.id !== row.id) : qdinh.dcnbKeHoachDcHdr.danhSachHangHoa
              dsHH.push({
                ...data,
                id: this.typeKeHoach === "LO_KHO_NHAN" ? row.id : undefined,
                hdrId: qdinh.keHoachDcHdrId
              })

              qdinh.dcnbKeHoachDcHdr = {
                danhSachHangHoa: dsHH
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== keHoachDcHdrId)
              dsQuyetDinh.push(qdinh)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
          } else {
            if (this.typeKeHoach === "ADD") {
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                dcnbKeHoachDcHdr: { danhSachHangHoa: [data] }
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "THEM_LO_KHO") {
              const dsHH = this.danhSachKeHoach.filter(kh => kh.maDiemKho === data.maDiemKho)
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                dcnbKeHoachDcHdr: { danhSachHangHoa: dsHH }
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "THEM_DIEM_KHO_NHAN") {
              const dsHH = this.danhSachKeHoach.filter(kh => kh.maNganKho === data.maNganKho)
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                dcnbKeHoachDcHdr: { danhSachHangHoa: dsHH }
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                dcnbQuyetDinhDcCHdr: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "THEM_LO_KHO_NHAN") {
              const dsHH = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan === data.maDiemKhoNhan)
              dsHH.push(data)
              const qd = {
                maChiCucNhan: data.maChiCucNhan,
                dcnbKeHoachDcHdr: { danhSachHangHoa: dsHH }
              }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }
            if (this.typeKeHoach === "LO_KHO_NHAN") {
              const qd = this.formData.value.danhSachQuyetDinh.find(item => item.maChiCucNhan === data.maChiCucNhan)
              if (!qd) return
              const dsHH = qd.danhSachKeHoach.filter(item => item.maNganKhoNhan !== data.maNganKhoNhan)
              dsHH.push(data)
              qd.dcnbKeHoachDcHdr = { danhSachHangHoa: dsHH }
              const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.maChiCucNhan !== data.maChiCucNhan)
              dsQuyetDinh.push(qd)
              this.formData.patchValue({
                danhSachQuyetDinh: dsQuyetDinh
              })
            }

          }

        } else {
          const groupChiCuc = this.groupBy(this.danhSachKeHoach, "maChiCucNhan")
          const dsQD = []
          Object.keys(groupChiCuc).forEach(element => {
            dsQD.push({
              dcnbKeHoachDcHdr: {
                danhSachHangHoa: groupChiCuc[`${element}`]
              }
            })
          });

          this.formData.patchValue({
            danhSachQuyetDinh: dsQD
          })
        }

      }
    });
  }

  async addCC(row?: any) {
    await this.spinner.show();
    console.log('addCC', row)
    await this.spinner.hide();
    const keHoachDcHdrId = row.hdrId
    const param = {
      danhSachKeHoach: this.danhSachKeHoach,
      dsChiCuc: [{ key: row.maDvi, title: row.tenDvi }],
      data: row
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
    modalQD.afterClose.subscribe(async (data) => {
      debugger
      // this.danhSachKeHoach = this.danhSachKeHoach.filter(item => !!item.maDiemKhoNhan)
      const diemKho = this.danhSachKeHoach.find(item => `${item.maLoKho}${item.maNganKho}${item.maNhaKho}${item.maDiemKho}${item.maDvi}` !== `${row.maLoKho}${row.maNganKho}${row.maNhaKho}${row.maDiemKho}${row.maDvi}`)
      console.log('danhSachKeHoach', this.danhSachKeHoach)
      console.log('diemKho', diemKho)
      if (data) {
        if (this.typeKeHoach === "LO_KHO_NHAN")
          this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => `${kh.maLoKhoNhan}${kh.maNganKhoNhan}` !== `${row.maLoKhoNhan}${row.maNganKhoNhan}`)
        // if (this.typeKeHoach === "THEM_LO_KHO_NHAN")
        //   this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maLoKhoNhan !== data.maLoKhoNhan)

        // if (this.typeKeHoach === "THEM_DIEM_KHO_NHAN")
        //   this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKhoNhan !== data.maDiemKhoNhan)

        this.danhSachKeHoach.push({
          ...data,
          maLoNganKho: `${data.maLoKho}${data.maNganKho}`,
          hdrId: keHoachDcHdrId
        })

        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")

        const qdinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId == keHoachDcHdrId)

        if (qdinh) {
          const dsHH = qdinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => !!item.maDiemKhoNhan)
          dsHH.push({
            ...data,
            id: row.maDiemKhoNhan ? undefined : row.id,
            hdrId: qdinh.keHoachDcHdrId
          })

          qdinh.dcnbKeHoachDcHdr.danhSachHangHoa = dsHH
          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== keHoachDcHdrId)
          dsQuyetDinh.push(qdinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })
        }





      }
    });
  }

  xoaChiCuc(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maChiCucNhan !== row.maChiCucNhan)
    this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")
    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maChiCucNhan !== row.maChiCucNhan)
      qDinh.dcnbKeHoachDcHdr.danhSachHangHoa = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }
  }

  xoaDiemKho(row) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.danhSachKeHoach = this.danhSachKeHoach.filter(kh => kh.maDiemKho !== row.maDiemKho)
        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")

        if (this.idInput) {
          const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
          const dsKH = qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maDiemKho !== row.maDiemKho)
          qDinh.dcnbKeHoachDcHdr.danhSachHangHoa = dsKH
          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
          dsQuyetDinh.push(qDinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })
        }
      },
    });

  }

  themDiemKho(row) {
    this.typeKeHoach = "THEM_DIEM_KHO"
    const data = {
      hdrId: row ? row.hdrId : '',
      maDvi: row ? row.maDvi : '',
      tenDvi: row ? row.tenDvi : '',
      maChiCucNhan: row ? row.maChiCucNhan : '',
      tenChiCucNhan: row ? row.tenChiCucNhan : '',
      // maDiemKho: row ? row.maDiemKho : '',
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }

  themLoKho(row) {
    this.typeKeHoach = "THEM_LO_KHO"
    const data = {
      // ...row,
      hdrId: row ? row.hdrId : '',
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
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
          !(kh.maChiCucNhan === row.maChiCucNhan &&
            kh.maDiemKho === row.maDiemKho &&
            kh.maNhaKho === row.maNhaKho &&
            kh.maNganKho === row.maNganKho &&
            (row.maLoKho ? kh.maLoKho === row.maLoKho : true))
        )

        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")

        if (this.idInput) {
          const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
          const dsKH = row.maLoKho ? qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maLoKho !== row.maLoKho) : qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maNganKho !== row.maNganKho)
          qDinh.dcnbKeHoachDcHdr.danhSachHangHoa = dsKH
          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
          dsQuyetDinh.push(qDinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })
        }
      },
    });

  }

  themDiemKhoNhan(row) {
    this.typeKeHoach = "THEM_DIEM_KHO_NHAN"

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
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(data)
  }

  xoaDiemKhoNhan(row) {
    this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
      !(kh.maChiCucNhan === row.maChiCucNhan &&
        kh.maDiemKho === row.maDiemKho &&
        kh.maNhaKho === row.maNhaKho &&
        kh.maNganKho === row.maNganKho &&
        (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
        kh.maDiemKhoNhan === row.maDiemKhoNhan)
    )
    if (this.isCuc()) {
      this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")
    }

    if (this.isChiCuc()) {
      this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")
    }

    if (this.idInput) {
      const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
      const dsKH = qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maDiemKhoNhan !== row.maDiemKhoNhan)
      qDinh.dcnbKeHoachDcHdr.danhSachHangHoa = dsKH
      const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
      dsQuyetDinh.push(qDinh)
      this.formData.patchValue({
        danhSachQuyetDinh: dsQuyetDinh
      })
    }
  }

  xoaDiemKhoNhanCC(row) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        const dsDelete = this.danhSachKeHoach.filter(kh =>
        (kh.maChiCucNhan === row.maChiCucNhan &&
          kh.maDiemKho === row.maDiemKho &&
          kh.maNhaKho === row.maNhaKho &&
          kh.maNganKho === row.maNganKho &&
          (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
          kh.maDiemKhoNhan === row.maDiemKhoNhan)
        )

        this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
          !(kh.maChiCucNhan === row.maChiCucNhan &&
            kh.maDiemKho === row.maDiemKho &&
            kh.maNhaKho === row.maNhaKho &&
            kh.maNganKho === row.maNganKho &&
            (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
            kh.maDiemKhoNhan === row.maDiemKhoNhan)
        )

        if (dsDelete.length == 1) {
          this.danhSachKeHoach.push({
            ...row,
            tenDiemKhoNhan: "",
            maDiemKhoNhan: "",
            tenNhaKhoNhan: "",
            maNhaKhoNhan: "",
            tenNganKhoNhan: "",
            maNganKhoNhan: "",
            tenLoKhoNhan: "",
            maLoKhoNhan: "",
            tichLuongKd: "",
            soLuongPhanBo: "",
          })
        }

        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")



        if (this.idInput) {
          const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
          const keHoach = qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.find(item => item.maDiemKhoNhan === row.maDiemKhoNhan)
          let dsKH = qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maDiemKhoNhan !== row.maDiemKhoNhan)
          dsKH.push({
            ...keHoach,
            tenDiemKhoNhan: "",
            maDiemKhoNhan: "",
            tenNhaKhoNhan: "",
            maNhaKhoNhan: "",
            tenNganKhoNhan: "",
            maNganKhoNhan: "",
            tenLoKhoNhan: "",
            maLoKhoNhan: "",
            tichLuongKd: "",
            soLuongPhanBo: "",
          })
          qDinh.dcnbKeHoachDcHdr = { danhSachHangHoa: dsKH }

          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
          dsQuyetDinh.push(qDinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })
        }
      },
    });

  }

  suaDiemKhoNhan(row) {
    this.typeKeHoach = "DIEM_KHO_NHAN"
    const data = {
      ...row,
      // maDiemKhoNhan: "",
      // tenDiemKhoNhan: "",
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      thuKhoNhan: "",
      thayDoiThuKho: "",
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(row)
  }


  themLoKhoNhan(row) {
    this.typeKeHoach = "THEM_LO_KHO_NHAN"

    const data = {
      ...row,
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      thuKhoNhan: "",
      thayDoiThuKho: "",
      tichLuongKd: "",
      soLuongPhanBo: "",
    }
    if (this.isCuc())
      this.add(data)
    if (this.isChiCuc())
      this.addCC(data)
  }


  xoaLoKhoNhan(row) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
          !(kh.maChiCucNhan === row.maChiCucNhan &&
            kh.maDiemKho === row.maDiemKho &&
            kh.maNhaKho === row.maNhaKho &&
            kh.maNganKho === row.maNganKho &&
            (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
            kh.maDiemKhoNhan === row.maDiemKhoNhan &&
            kh.maNhaKhoNhan === row.maNhaKhoNhan &&
            kh.maNganKhoNhan === row.maNganKhoNhan &&
            (row.maLoKhoNhan ? kh.maLoKhoNhan === row.maLoKhoNhan : true))
        )
        if (this.isCuc())
          this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maChiCucNhan")
        if (this.isChiCuc())
          this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")

        if (this.idInput) {
          const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
          const dsKH = row.maLoKhoNhan ? qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maLoKhoNhan !== row.maLoKhoNhan) : qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maNganKhoNhan !== row.maNganKhoNhan)
          qDinh.dcnbKeHoachDcHdr = { danhSachHangHoa: dsKH }
          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
          dsQuyetDinh.push(qDinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })
        }
      },
    });



  }

  xoaLoKhoNhanCC(row) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        const dsDelete = this.danhSachKeHoach.filter(kh =>
        (kh.maChiCucNhan === row.maChiCucNhan &&
          kh.maDiemKho === row.maDiemKho &&
          kh.maNhaKho === row.maNhaKho &&
          kh.maNganKho === row.maNganKho &&
          (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
          kh.maDiemKhoNhan === row.maDiemKhoNhan &&
          kh.maNhaKhoNhan === row.maNhaKhoNhan &&
          kh.maNganKhoNhan === row.maNganKhoNhan &&
          (row.maLoKhoNhan ? kh.maLoKhoNhan === row.maLoKhoNhan : true))
        )

        this.danhSachKeHoach = this.danhSachKeHoach.filter(kh =>
          !(kh.maChiCucNhan === row.maChiCucNhan &&
            kh.maDiemKho === row.maDiemKho &&
            kh.maNhaKho === row.maNhaKho &&
            kh.maNganKho === row.maNganKho &&
            (row.maLoKho ? kh.maLoKho === row.maLoKho : true) &&
            kh.maDiemKhoNhan === row.maDiemKhoNhan &&
            kh.maNhaKhoNhan === row.maNhaKhoNhan &&
            kh.maNganKhoNhan === row.maNganKhoNhan &&
            (row.maLoKhoNhan ? kh.maLoKhoNhan === row.maLoKhoNhan : true))
        )



        if (dsDelete.length == 1) {
          this.danhSachKeHoach.push({
            ...row,
            tenNhaKhoNhan: "",
            maNhaKhoNhan: "",
            tenNganKhoNhan: "",
            maNganKhoNhan: "",
            tenLoKhoNhan: "",
            maLoKhoNhan: "",
            tichLuongKd: "",
            soLuongPhanBo: "",
          })
        }

        this.dataTableView = this.buildTableView(this.danhSachKeHoach, "maDvi")

        if (this.idInput) {
          const qDinh = this.formData.value.danhSachQuyetDinh.find(item => item.keHoachDcHdrId === row.hdrId)
          const keHoach = row.maLoKhoNhan ? qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.find(item => item.maLoKhoNhan === row.maLoKhoNhan) : qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maNganKhoNhan === row.maNganKhoNhan)
          let dsKH = row.maLoKhoNhan ? qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maLoKhoNhan !== row.maLoKhoNhan) : qDinh.dcnbKeHoachDcHdr.danhSachHangHoa.filter(item => item.maNganKhoNhan !== row.maNganKhoNhan)
          dsKH.push({
            ...keHoach,
            tenNhaKhoNhan: "",
            maNhaKhoNhan: "",
            tenNganKhoNhan: "",
            maNganKhoNhan: "",
            tenLoKhoNhan: "",
            maLoKhoNhan: "",
            tichLuongKd: "",
            soLuongPhanBo: "",
          })
          qDinh.dcnbKeHoachDcHdr = {
            danhSachHangHoa: dsKH
          }
          const dsQuyetDinh = this.formData.value.danhSachQuyetDinh.filter(item => item.keHoachDcHdrId !== row.hdrId)
          dsQuyetDinh.push(qDinh)
          this.formData.patchValue({
            danhSachQuyetDinh: dsQuyetDinh
          })

          console.log('xoaLoKhoNhanCC', dsQuyetDinh)
        }
      },
    });

  }

  suaLoKhoNhan(row) {
    this.typeKeHoach = "LO_KHO_NHAN"
    if (this.isCuc())
      this.add(row)
    if (this.isChiCuc())
      this.addCC(row)
  }

  isLuuVaGD() {
    return !this.isYCXDDiemNhap() && (!this.isView && this.formData.value.trangThai == STATUS.DU_THAO && this.isCuc()) || (this.isChiCuc() && this.formData.value.loaiQdinh == '00' && this.formData.value.trangThai == STATUS.YC_CHICUC_PHANBO_DC)
  }

  setValidator() {
    if (this.formData.value.loaiDc === "DCNB") {
      this.formData.controls["loaiQdinh"].clearValidators();
      this.formData.controls["soCanCuQdTc"].clearValidators();
    }
    if (this.formData.value.loaiDc === "CHI_CUC") {
      this.formData.controls["loaiQdinh"].clearValidators();
    }
  }

  async save(isGuiDuyet?) {
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return

    let body = this.formData.value;
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    body.soQdinh = `${this.formData.value.soQdinh.toString().split("/")[0]}/${this.maQd}`




    if (this.idInput) {
      body.id = this.idInput
    }
    console.log('save', body)
    // return
    await this.spinner.show();
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      if (isGuiDuyet) {
        body.danhSachQuyetDinh.forEach((item) => {
          const ds = item.dcnbKeHoachDcHdr.danhSachHangHoa
          const diemnhap = ds.find((nhap) => nhap.maNganKhoNhan !== null && nhap.maNganKhoNhan !== "")
          if (!diemnhap) {
            this.notification.error(MESSAGE.ERROR, "Bạn chưa xác định điểm nhập");
            return
          }

        })

        this.guiDuyet();
      }
      else {
        await this.loadChiTiet(this.idInput)
      }
    }
    await this.spinner.hide();
  }

  isYCXDDiemNhap() {
    return this.formData.value.trangThai == STATUS.DU_THAO && this.formData.value.loaiQdinh == '00' && !this.isTongCuc()
  }

  async ycXDDiemNhap() {
    await this.spinner.show();
    let body = this.formData.value;
    body.canCu = this.canCu;
    body.quyetDinh = this.quyetDinh;
    body.soQdinh = `${this.formData.value.soQdinh.toString().split("/")[0]}/${this.maQd}`
    if (this.idInput) body.id = this.idInput

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
      return this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
    }
    if (this.isChiCuc()) {
      return this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
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
      return (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC) //&& userService.isAccessPermisson('DCNB_QUYETDINHDC_DUYET_LDVU')
    }
    if (this.isChiCuc()) {
      return this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
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
