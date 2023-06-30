import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanChuanBiKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-chuan-bi-kho";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-thong-tin-bien-ban-chuan-bi-kho',
  templateUrl: './thong-tin-bien-ban-chuan-bi-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-chuan-bi-kho.component.scss']
})
export class ThongTinBienBanChuanBiKhoComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listNhomCcdc: any[] = [];

  dsKeHoach: any[] = []

  danhSach: any[] = []
  dsHangTH = []
  objHangTH: any
  iHangTH: number
  dsHangPD = []
  objHangPD: any
  iHangPD: number
  typeData: string;
  typeAction: string;
  dviTinh: string;
  thanhTienTrongNam: number;
  tongGiaTri: number;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanChuanBiKhoService: BienBanChuanBiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanChuanBiKhoService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBban: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      ngayKetThucNt: [],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      ktvBaoQuan: [],
      thuKho: [],
      keToan: [],
      thuTruong: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      idKeHoachDtl: [],
      loaiHinhKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      tichLuongKhaDung: [],
      tenDonViTinh: [],
      dsPhieuNhapKho: [],
      slThucNhapDc: [],
      hthucKlot: [],
      pthucBquan: [],
      dinhMucDuocGiao: [],
      dinhMucTT: [],
      tenLoKhoXuat: [],
      maLoKhoXuat: [],
      tenNganKhoXuat: [],
      maNganKhoXuat: [],
      tenNhaKhoXuat: [],
      maNhaKhoXuat: [],
      tenDiemKhoXuat: [],
      maDiemKhoXuat: [],
      tongKinhPhiDaTh: [],
      tongKinhPhiDaThBc: [],
      dcnbBBNTBQDtl: [new Array<any>(),],
      nhanXet: [],
      type: ["01"],
      loaiDc: ["DCNB"],

      noiDung: [],
      soLuongTrongNam: [],
      donGiaTrongNam: [],
      soLuongNamTruoc: [],
      thanhTienNamTruoc: [],
    });
  }

  async ngOnInit() {
    this.maBb = 'BBNT-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soBban: `${id}/${this.formData.get('nam').value}/${this.maBb}`,

    })
    await this.getListNhomCcdc()
    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue(data);
      this.dsHangTH = data.children.filter(item => item.type === "TH")
      this.dsHangPD = data.children.filter(item => item.type === "PD")
      this.fileDinhKemReq = data.fileDinhKems;
      await this.loadDataBaoQuan(data.cloaiVthh)
    }
    await this.spinner.hide();
  }

  async loadDataBaoQuan(cloaiVthh) {
    if (cloaiVthh) {
      this.listPhuongThucBaoQuan = []
      this.listHinhThucBaoQuan = []
      let res = await this.danhMucService.getDetail(cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
      console.log('loadDataBaoQuan', res)
    }
  }

  async getListNhomCcdc() {
    this.listNhomCcdc = [];
    const body = {
      nhomCcdc: 3
    }
    let res = await this.danhMucService.getDSMatHang(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNhomCcdc = res.data.content;
    }
  }

  onnoiDung(value) {
    const hang = this.listNhomCcdc.find(item => item.tenCcdc === value)
    if (hang)
      this.dviTinh = hang.donViTinh
  }

  onsoLuongTrongNam(value) {
    if (this.formData.value.donGiaTrongNam) {
      this.thanhTienTrongNam = Number(this.formData.value.donGiaTrongNam) * Number(value)
    }
  }

  ondonGiaTrongNam(value) {
    if (this.objHangTH) {
      const thanhTienTrongNam = Number(this.objHangTH.soLuongTrongNam) * Number(value)
      this.dsHangTH[this.iHangTH].thanhTienTrongNam = thanhTienTrongNam
      return
    }
    if (this.formData.value.soLuongTrongNam) {
      this.thanhTienTrongNam = Number(this.formData.value.soLuongTrongNam) * Number(value)
    }
    console.log('ondonGiaTrongNam', value)
  }

  onsoLuongNamTruoc(value) {
    // if (this.formData.value.soLuongTrongNam) {
    //   this.thanhTienTrongNam = Number(this.formData.value.soLuongTrongNam) * Number(value)
    // }
  }

  onthanhTienNamTruoc(value) {
    if (this.thanhTienTrongNam) {
      this.tongGiaTri = this.thanhTienTrongNam + Number(value)
    }
  }

  async addTH() {
    if (this.formData.value.soLuongTrongNam)
      this.dsHangTH.push({
        idVirtual: uuidv4.v4(),
        type: "TH",
        edit: false,
        noiDung: this.formData.value.noiDung,
        dviTinh: this.dviTinh,
        soLuongTrongNam: this.formData.value.soLuongTrongNam,
        donGiaTrongNam: this.formData.value.donGiaTrongNam,
        thanhTienTrongNam: this.thanhTienTrongNam,
        soLuongNamTruoc: this.formData.value.soLuongNamTruoc,
        thanhTienNamTruoc: this.formData.value.thanhTienNamTruoc,
        tongGiaTri: this.tongGiaTri,
      })
    const tongKinhPhiDaTh = this.dsHangTH.reduce((previous, current) => previous + current.tongGiaTri, 0);
    const tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh)
    this.dsHangTH = cloneDeep(this.dsHangTH)
    this.formData.patchValue({
      noiDung: "",
      soLuongTrongNam: "",
      donGiaTrongNam: "",
      soLuongNamTruoc: "",
      thanhTienNamTruoc: "",
      tongKinhPhiDaTh,
      tongKinhPhiDaThBc
    })
    this.dviTinh = ""
    this.thanhTienTrongNam = null
    this.tongGiaTri = null
  }

  isDisableField() {
    return false;
  }

  cancelEdit(index: number): void {
    this.objHangTH = null
    this.iHangTH = null
    this.dsHangTH[index].edit = false;
  }

  saveEdit(index: number): void {
    this.objHangTH = null
    this.iHangTH = null
    this.dsHangTH[index].edit = false;
  }

  deleteRow(data: any) {
    this.dsHangTH = this.dsHangTH.filter(x => x.idVirtual != data.idVirtual);
    const tongKinhPhiDaTh = this.dsHangTH.reduce((previous, current) => previous + current.tongGiaTri, 0);
    const tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh)
    this.dsHangTH = cloneDeep(this.dsHangTH)
    this.formData.patchValue({
      noiDung: "",
      soLuongTrongNam: "",
      donGiaTrongNam: "",
      soLuongNamTruoc: "",
      thanhTienNamTruoc: "",
      tongKinhPhiDaTh,
      tongKinhPhiDaThBc
    })
  }

  editRow(index: number) {
    this.iHangTH = index
    this.objHangTH = this.dsHangTH[index]
    this.dsHangTH[index].edit = true;
  }

  async addPD() {
    if (this.formData.value.soLuongTrongNam)
      this.dsHangPD.push({
        idVirtual: uuidv4.v4(),
        type: "PD",
        edit: false,
        noiDung: this.formData.value.noiDung,
        dviTinh: this.dviTinh,
        soLuongTrongNam: this.formData.value.soLuongTrongNam,
        donGiaTrongNam: this.formData.value.donGiaTrongNam,
        thanhTienTrongNam: this.thanhTienTrongNam,
        soLuongNamTruoc: this.formData.value.soLuongNamTruoc,
        thanhTienNamTruoc: this.formData.value.thanhTienNamTruoc,
        tongGiaTri: this.tongGiaTri,
      })
    // const tongKinhPhiDaTh = this.dsHangPD.reduce((previous, current) => previous + current.tongGiaTri, 0);
    // const tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh)
    this.dsHangPD = cloneDeep(this.dsHangPD)
    this.formData.patchValue({
      noiDung: "",
      soLuongTrongNam: "",
      donGiaTrongNam: "",
      soLuongNamTruoc: "",
      thanhTienNamTruoc: "",
      // tongKinhPhiDaTh,
      // tongKinhPhiDaThBc
    })
    this.dviTinh = ""
    this.thanhTienTrongNam = null
    this.tongGiaTri = null
  }

  async add(row?: any) {
    // await this.spinner.show();

    // await this.spinner.hide();

    // if (!row) this.typeAction = "ADD"

    // const modalQD = this.modal.create({
    //   nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
    //   nzContent: ThongTinHangDtqgComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '1200px',
    //   nzFooter: null,
    //   nzComponentParams: {
    //     // danhSachKeHoach: this.danhSachKeHoach,
    //     // dsChiCuc: this.listChiCucNhan,
    //     // data: row ? row : undefined,
    //   },
    // });
    // modalQD.afterClose.subscribe(async (data) => {
    //   if (data) {
    //     if (this.typeData === "TH") {
    //       if (data.isMatHang) {
    //         const parent = {
    //           ...data,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         }
    //         this.dsHangTH.push({
    //           danhMuc: parent.danhMuc,
    //           nhomHang: parent.nhomHang,
    //           donViTinh: parent.donViTinh,
    //           tongGiaTri: parent.tongGiaTri,
    //           idVirtual: parent.idVirtual,
    //           isParent: true
    //         })
    //         this.dsHangTH.push({
    //           ...data,
    //           danhMuc: "",
    //           nhomHang: "",
    //           donViTinh: "",
    //           idParent: parent.idVirtual,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       } else {
    //         this.dsHangTH.push({
    //           ...data,
    //           tongGiaTri: data.thanhTienTrongNam,
    //           isParent: true,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       }

    //       let tongKinhPhiDaTh = this.dsHangTH.reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    //       let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
    //       this.formData.patchValue({
    //         tongKinhPhiDaTh,
    //         tongKinhPhiDaThBc
    //       })

    //       this.dsHangTH = cloneDeep(this.dsHangTH)
    //     }

    //     if (this.typeData === "PD") {
    //       if (data.isMatHang) {
    //         const parent = {
    //           ...data,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         }
    //         this.dsHangPD.push({
    //           danhMuc: parent.danhMuc,
    //           nhomHang: parent.nhomHang,
    //           donViTinh: parent.donViTinh,
    //           tongGiaTri: parent.tongGiaTri,
    //           idVirtual: parent.idVirtual,
    //           isParent: true
    //         })
    //         this.dsHangPD.push({
    //           ...data,
    //           danhMuc: "",
    //           nhomHang: "",
    //           donViTinh: "",
    //           idParent: parent.idVirtual,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       } else {
    //         this.dsHangPD.push({
    //           ...data,
    //           tongGiaTri: data.thanhTienTrongNam,
    //           isParent: true,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       }
    //       this.dsHangPD = cloneDeep(this.dsHangPD)

    //     }
    //     this.danhSach = []
    //     this.danhSach = this.danhSach.concat(this.dsHangTH)
    //     this.danhSach = this.danhSach.concat(this.dsHangPD)
    //     this.formData.patchValue({
    //       dcnbBBNTBQDtl: this.danhSach
    //     })


    //   }
    // });
  }



  them(row) {

  }

  sua(row) {

  }

  xoa(row) {
    // if (row.isParent)
    //   this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual || item.idParent !== row.idVirtual)
    // else
    //   this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual)
    // this.formData.patchValue({
    //   dcnbBBNTBQDtlList: this.dsHangTH
    // })
  }




  async openDialogQD() {
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let resSoDX = this.isCuc() ? await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenCuc(body) : await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số quyết định'],
        dataColumn: ['soQdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdDcCuc: data.soQdinh,
          ngayQdDcCuc: data.ngayKyQdinh,
          qdDcCucId: data.id,
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          tenLoKhoXuat: "",
          maLoKhoXuat: "",
          tenNganKhoXuat: "",
          maNganKhoXuat: "",
          tenNhaKhoXuat: "",
          maNhaKhoXuat: "",
          tenDiemKhoXuat: "",
          maDiemKhoXuat: "",
          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          tenDonViTinh: "",
        });
        this.listPhuongThucBaoQuan = []
        this.listHinhThucBaoQuan = []
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogKhoNhap() {
    await this.spinner.show();

    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kho nhập',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsKeHoach,
        dataHeader: ['Lô kho nhập', 'Ngăn kho nhập', 'Nhà kho nhập', 'Điểm kho nhập'],
        dataColumn: ['tenLoKhoNhan', 'tenNganKhoNhan', 'tenNhaKhoNhan', 'tenDiemKhoNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenLoKho: data.tenLoKhoNhan,
          maLoKho: data.maLoKhoNhan,
          tenNganKho: data.tenNganKhoNhan,
          maNganKho: data.maNganKhoNhan,
          tenNhaKho: data.tenNhaKhoNhan,
          maNhaKho: data.maNhaKhoNhan,
          tenDiemKho: data.tenDiemKhoNhan,
          maDiemKho: data.maDiemKhoNhan,
          tenLoKhoXuat: data.tenLoKho,
          maLoKhoXuat: data.maLoKho,
          tenNganKhoXuat: data.tenNganKho,
          maNganKhoXuat: data.maNganKho,
          tenNhaKhoXuat: data.tenNhaKho,
          maNhaKhoXuat: data.maNhaKho,
          tenDiemKhoXuat: data.tenDiemKho,
          maDiemKhoXuat: data.maDiemKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          tenDonViTinh: data.tenDonViTinh,
          idKeHoachDtl: data.id
        });
        await this.loadDataBaoQuan(data.cloaiVthh)
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data

      this.dsKeHoach = []
      if (data.danhSachQuyetDinh.length == 0) return
      data.danhSachQuyetDinh.map(qdinh => {
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.danhSachKeHoach)
      })

    }
  }

  // onChangeDiemKhoNhan(maDiemKhoNhan) {
  //   this.dsNhaKhoNhan = this.dsKeHoach.filter(kh => kh.maDiemKhoNhan === maDiemKhoNhan)
  // }

  // onChangeNhaKhoNhan(maNhaKhoNhan) {
  //   this.dsNganKhoNhan = this.dsKeHoach.filter(kh => kh.maNhaKhoNhan === maNhaKhoNhan)
  // }

  // onChangeNganKhoNhan(maNganKhoNhan) {
  //   this.dsLoKhoNhan = this.dsKeHoach.filter(kh => kh.maNganKhoNhan === maNganKhoNhan)
  // }

  // onChangeLoKhoNhan(maLoKhoNhan) {
  //   const loKhoNhan = this.dsKeHoach.find(kh => kh.maLoKhoNhan === maLoKhoNhan)
  //   if (!loKhoNhan) return
  //   this.formData.patchValue({
  //     tenLoKhoXuat: loKhoNhan.tenLoKho,
  //     maLoKhoXuat: loKhoNhan.maLoKho,
  //     tenNganKhoXuat: loKhoNhan.tenNganKho,
  //     maNganKhoXuat: loKhoNhan.maNganKho,
  //     tenNhaKhoXuat: loKhoNhan.tenNhaKho,
  //     maNhaKhoXuat: loKhoNhan.maNhaKho,
  //     tenDiemKhoXuat: loKhoNhan.tenDiemKho,
  //     maDiemKhoXuat: loKhoNhan.maDiemKho,
  //     loaiVthh: loKhoNhan.tenLoaiVthh,
  //     tenCloaiVthh: loKhoNhan.tenCloaiVthh,
  //     tichLuongKhaDung: loKhoNhan.tichLuongKd,
  //     tenDonViTinh: loKhoNhan.tenDonViTinh,
  //   });
  // }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {

    let body = this.formData.value;
    const children = [...this.dsHangTH, ...this.dsHangPD]
    body.fileDinhKemReq = this.fileDinhKemReq
    body.children = children
    if (this.idInput) {
      body.id = this.idInput
    }
    console.log('save', body)

    await this.spinner.show();
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



  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    // if (this.isCuc()) {
    //   let trangThai = STATUS.CHO_DUYET_TP;
    //   let mesg = 'Bạn muốn gửi duyệt văn bản?'
    //   this.approve(this.idInput, trangThai, mesg);
    // }
    // if (this.isChiCuc()) {
    let trangThai = STATUS.CHO_DUYET_TK;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
    // }
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_TK || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async tuChoi() {
    // if (this.isCuc()) {
    //   let trangThai = () => {
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
    //       return STATUS.TU_CHOI_TP
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
    //       return STATUS.TU_CHOI_LDC
    //     return STATUS.CHO_DUYET_TP;
    //   };
    //   this.reject(this.idInput, trangThai());
    // }
    // if (this.isChiCuc()) {
    //   let trangThai = () => {
    //     if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
    //       return STATUS.TUCHOI_TBP_TVQT
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
    //       return STATUS.TU_CHOI_LDCC
    //     return STATUS.CHODUYET_TBP_TVQT;
    //   };
    //   this.reject(this.idInput, trangThai());
    // }
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_TK || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TK)
        return STATUS.CHO_DUYET_LDCC
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.DA_DUYET_LDCC
    };
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai(), mesg);

  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async banHanh() {
    let trangThai = STATUS.DA_DUYET_LDCC;
    let mesg = 'Bạn muốn ban hành văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

}
