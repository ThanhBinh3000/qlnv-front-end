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
import { BbNghiemThuBaoQuanService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import * as uuidv4 from "uuid";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { DANH_MUC_LEVEL } from "src/app/pages/luu-kho/luu-kho.constant";
import { ThongTinHangDtqgComponent } from "../../bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-hang-dtqg/thong-tin-hang-dtqg.component";

@Component({
  selector: 'app-thong-tin-bien-ban-chuan-bi-kho',
  templateUrl: './thong-tin-bien-ban-chuan-bi-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-chuan-bi-kho.component.scss']
})
export class ThongTinBienBanChuanBiKhoComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
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
  previewName: string = "nhap_lt_bien_ban_chuan_bi_kho"
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private bienBanChuanBiKhoService: BienBanChuanBiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanChuanBiKhoService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBban: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      ngayKetThucNt: [, [Validators.required]],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      thoiGianNhapMuonNhat: [],
      qdDcCucId: [],
      soLuongQdDcCuc: [],
      ktvBaoQuan: [],
      tenKyThuatVien: [],
      tenThuKho: [],
      thuKho: [],
      tenKeToan: [],
      keToan: [],
      thuTruong: [],
      tenLanhDao: [],
      tenLoNganKho: [],
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
      tichLuong: [],
      tichLuongKhaDung: [],
      donViTinh: [],
      duToanKphi: [0],
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
      // dcnbBBNTBQDtl: [new Array<any>(),],
      nhanXet: [],
      type: ["01"],
      loaiDc: ["DCNB"],
      isVatTu: [true],
      loaiQdinh: [],
      thayDoiThuKho: [],
      lyDoTuChoi: [],
      noiDung: [],
      soLuongTrongNam: [],
      donGiaTrongNam: [],
      soLuongNamTruoc: [],
      thanhTienNamTruoc: [],
      keHoachDcDtlId: [, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.maBb = 'BBCBK-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      tenKyThuatVien: this.userInfo.TEN_DAY_DU,
      soBban: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      loaiDc: this.loaiDc,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: true
    })
    await this.getListNhomCcdc()
    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      console.log('this.data', this.data)
      this.formData.patchValue({
        soQdDcCuc: this.data.soQdinh,
        ngayQdDcCuc: this.data.ngayKyQd,
        qdDcCucId: this.data.qdinhDccId,
        thoiGianNhapMuonNhat: this.data.thoiGianNhapKhoMuonNhat,
        tenLoNganKho: `${this.data.tenLoKho || ""} ${this.data.tenNganKho}`,
        tenLoKho: this.data.tenLoKho,
        maLoKho: this.data.maLoKho,
        tenNganKho: this.data.tenNganKho,
        maNganKho: this.data.maNganKho,
        tenNhaKho: this.data.tenNhaKho,
        maNhaKho: this.data.maNhaKho,
        tenDiemKho: this.data.tenDiemKho,
        maDiemKho: this.data.maDiemKho,
        loaiVthh: this.data.maHangHoa,
        tenLoaiVthh: this.data.tenHangHoa,
        cloaiVthh: this.data.maChLoaiHangHoa,
        tenCloaiVthh: this.data.tenChLoaiHangHoa,
        tichLuongKhaDung: this.data.tichLuongKd,
        tichLuong: this.data.tichLuongKd,
        donViTinh: this.data.donViTinh,
        duToanKphi: this.data.duToanKphi || 0,
        soLuongQdDcCuc: this.data.soLuongQdDcCuc,
        keHoachDcDtlId: this.data.keHoachDcDtlId
      });
      await this.loadChiTietQdinh(this.data.qdinhDccId);
      await this.getTLKD()
      await this.loadDataBaoQuan(this.data.maChLoaiHangHoa)
      await this.getDataKho(this.data.maLoKho || this.data.maNganKho)
      if (this.data.maLoKho)
        await this.loadThuKho(this.data.maLoKho, DANH_MUC_LEVEL.LO_KHO)
      else
        await this.loadThuKho(this.data.maNganKho, DANH_MUC_LEVEL.NGAN_KHO)
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

  async getTLKD() {
    let body = {
      maDvi: this.formData.value.maLoKho || this.formData.value.maNganKho,
      capDvi: this.formData.value.maLoKho ? "7" : "6"
    }
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (!this.formData.value.cloaiVthh) return
    const tichLuongKhaDung = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
    this.formData.patchValue({
      tichLuongKhaDung,
      tichLuong: tichLuongKhaDung
    })
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho}`, });
      this.dsHangTH = data.children.filter(item => item.type === "TH")
      this.dsHangPD = data.children.filter(item => item.type === "PD")
      this.fileDinhKemReq = data.fileDinhKems;
      await this.loadDataBaoQuan(data.cloaiVthh)
      await this.getDataKho(data.maLoKho || data.maNganKho)
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
      nhomCcdc: [3]
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



  async addTH(row?: any) {
    this.typeData = "TH"
    this.typeAction = "ADD"
    await this.add(row)
  }

  async updateTH(row) {
    this.typeData = "TH"
    this.typeAction = "UPDATE"
    await this.add(row)
  }

  async addRowTH(row?: any) {
    this.typeData = "TH"
    this.typeAction = "ADD"
    await this.add(row, true)
  }

  async addPD(row?: any) {
    this.typeData = "PD"
    this.typeAction = "ADD"
    await this.add(row)
  }

  async updatePD(row) {
    this.typeData = "PD"
    this.typeAction = "UPDATE"
    await this.add(row)
  }

  async addRowPD(row?: any) {
    this.typeData = "PD"
    this.typeAction = "ADD"
    await this.add(row, true)
  }

  async add(row?: any, isChildren?) {
    await this.spinner.show();

    await this.spinner.hide();

    if (!row) this.typeAction = "ADD"

    const modalQD = this.modal.create({
      nzTitle: 'MẶT HÀNG SỐ LƯỢNG VÀ GIÁ TRỊ HÀNG DỰ TRỮ QUỐC GIA',
      nzContent: ThongTinHangDtqgComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: row,
        typeData: this.typeData,
        typeAction: this.typeAction,
        isChildren: isChildren
      },
    });
    modalQD.afterClose.subscribe(async (data) => {

      if (data) {
        if (this.typeData === "TH") {
          if (this.typeAction === "ADD") {
            if (isChildren) {
              this.addDataTH({
                ...row,
                ...data
              })
            } else this.addDataTH(data)
          } else
            this.updateDataTH({
              ...row,
              ...data
            })
        }

        if (this.typeData === "PD") {
          if (this.typeAction === "ADD") {
            if (isChildren) {
              this.addDataPD({
                ...row,
                ...data
              })
            } else this.addDataPD(data)
          }
          else
            this.updateDataPD({
              ...row,
              ...data
            })
        }

      }
    });
  }

  addDataTH(data) {
    if (data.isChildren) {
      this.dsHangTH.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idVirtual: uuidv4.v4(),
        edit: false,
        isParent: false,
        type: this.typeData
      })
      const hangTH = this.dsHangTH.find(item => item.idParent === data.idParent)
      const index = this.dsHangTH.findIndex(item => item.idParent === data.idParent)
      const tongGiaTri = Number(hangTH.tongGiaTri) + Number(data.tongGiaTri)
      this.dsHangTH[index].tongGiaTri = tongGiaTri;

      this.viewTableTH()

      return
    }
    if (data.isMatHang) {
      const parent = {
        ...data,
        idVirtual: uuidv4.v4(),
        type: this.typeData
      }
      this.dsHangTH.push({
        danhMuc: parent.danhMuc,
        nhomHang: parent.nhomHang,
        donViTinh: parent.donViTinh,
        tongGiaTri: parent.tongGiaTri,
        idVirtual: parent.idVirtual,
        idParent: parent.idVirtual,
        isParent: true,
        edit: false,
        type: this.typeData
      })
      this.dsHangTH.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idParent: parent.idVirtual,
        idVirtual: uuidv4.v4(),
        edit: false,
        type: this.typeData
      })
    } else {
      const uuid = uuidv4.v4()
      this.dsHangTH.push({
        ...data,
        tongGiaTri: data.thanhTienTrongNam,
        isParent: true,
        idVirtual: uuid,
        idParent: uuid,
        edit: false,
        type: this.typeData
      })
    }



    this.viewTableTH()
  }

  updateDataTH(data) {
    const index = this.dsHangTH.findIndex(item => data.id ? item.id == data.id : item.idVirtual === data.idVirtual)
    this.dsHangTH[index] = data

    const iParent = this.dsHangTH.findIndex(item => (item.idParent === data.idParent) && item.isParent)
    const tongGiaTri = this.dsHangTH.filter(item => (item.idParent === data.idParent) && !item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    this.dsHangTH[iParent].tongGiaTri = tongGiaTri;

    this.viewTableTH()

  }

  viewTableTH() {
    let tableTHs = []
    this.dsHangTH.forEach(element => {
      if (element.isParent) {
        const dsChildren = this.dsHangTH.filter(item => item.idParent === element.idParent)
        tableTHs = tableTHs.concat(dsChildren)
      }
    });
    let tongKinhPhiDaTh = this.dsHangTH.filter(item => item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
    this.formData.patchValue({
      tongKinhPhiDaTh,
      tongKinhPhiDaThBc
    })
    this.dsHangTH = cloneDeep(tableTHs)
  }

  cancelEdit(index: number): void {
    this.dsHangTH[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dsHangTH[index].edit = false;
  }

  addDataPD(data) {
    if (data.isChildren) {
      this.dsHangPD.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idVirtual: uuidv4.v4(),
        edit: false,
        isParent: false,
        type: this.typeData
      })
      const hangPD = this.dsHangPD.find(item => item.idParent === data.idParent)
      const index = this.dsHangPD.findIndex(item => item.idParent === data.idParent)
      const tongGiaTri = Number(hangPD.tongGiaTri) + Number(data.tongGiaTri)
      this.dsHangPD[index].tongGiaTri = tongGiaTri;

      this.viewTablePD()

      return
    }
    if (data.isMatHang) {
      const parent = {
        ...data,
        idVirtual: uuidv4.v4(),
        type: this.typeData
      }
      this.dsHangPD.push({
        danhMuc: parent.danhMuc,
        nhomHang: parent.nhomHang,
        donViTinh: parent.donViTinh,
        tongGiaTri: parent.tongGiaTri,
        idVirtual: parent.idVirtual,
        idParent: parent.idVirtual,
        isParent: true,
        edit: false,
        type: this.typeData
      })
      this.dsHangPD.push({
        ...data,
        danhMuc: "",
        nhomHang: "",
        donViTinh: "",
        idParent: parent.idVirtual,
        idVirtual: uuidv4.v4(),
        edit: false,
        type: this.typeData
      })
    } else {
      const uuid = uuidv4.v4()
      this.dsHangPD.push({
        ...data,
        tongGiaTri: data.thanhTienTrongNam,
        isParent: true,
        idVirtual: uuid,
        idParent: uuid,
        edit: false,
        type: this.typeData
      })
    }
    this.viewTablePD()
  }

  updateDataPD(data) {
    const index = this.dsHangPD.findIndex(item => data.id ? item.id == data.id : item.idVirtual === data.idVirtual)
    this.dsHangPD[index] = data

    const iParent = this.dsHangPD.findIndex(item => (item.idParent === data.idParent) && item.isParent)
    const tongGiaTri = this.dsHangPD.filter(item => (item.idParent === data.idParent) && !item.isParent).reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    this.dsHangPD[iParent].tongGiaTri = tongGiaTri;

    this.viewTablePD()
  }

  viewTablePD() {
    let tablePDs = []
    this.dsHangPD.forEach(element => {
      if (element.isParent) {
        const dsChildren = this.dsHangPD.filter(item => item.idParent === element.idParent)
        tablePDs = tablePDs.concat(dsChildren)
      }
    });
    this.dsHangPD = cloneDeep(tablePDs)
  }



  xoa(row, type) {
    if (type === "TH") {
      if (row.id)
        this.dsHangTH = this.dsHangTH.filter(item => item.id !== row.id)
      else
        this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual)


      if (row.isParent)
        this.dsHangTH = this.dsHangTH.filter(item => item.idParent !== row.idParent)

      let tongKinhPhiDaTh = this.dsHangTH.reduce((prev, cur) => prev + cur.tongGiaTri, 0);
      if (tongKinhPhiDaTh > 0) {
        let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
        this.formData.patchValue({
          tongKinhPhiDaTh,
          tongKinhPhiDaThBc
        })
      } else {
        this.formData.patchValue({
          tongKinhPhiDaTh: "",
          tongKinhPhiDaThBc: ""
        })
      }

      this.dsHangTH = cloneDeep(this.dsHangTH)
    }
    if (type === "PD") {
      if (row.id)
        this.dsHangPD = this.dsHangPD.filter(item => item.id !== row.id)
      else
        this.dsHangPD = this.dsHangPD.filter(item => item.idVirtual !== row.idVirtual)


      if (row.isParent)
        this.dsHangPD = this.dsHangPD.filter(item => item.idParent !== row.idParent)

      this.dsHangPD = cloneDeep(this.dsHangPD)
    }

  }

  async openDialogQD() {
    await this.spinner.show();

    let body = {
      trangThai: STATUS.BAN_HANH,
      thayDoiThuKho: true,
      isVatTu: true,
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI,
      type: this.formData.value.type
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
          thoiGianNhapMuonNhat: data.ngayHieuLuc,
          qdDcCucId: data.id,
          tenLoNganKho: "",
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",

          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuong: "",
          tichLuongKhaDung: "",
          donViTinh: "",
          keHoachDcDtlId: ""
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
          tenLoNganKho: `${data.tenLoKhoNhan || ""} ${data.tenNganKhoNhan}`,
          tenLoKho: data.tenLoKhoNhan,
          maLoKho: data.maLoKhoNhan,
          tenNganKho: data.tenNganKhoNhan,
          maNganKho: data.maNganKhoNhan,
          tenNhaKho: data.tenNhaKhoNhan,
          maNhaKho: data.maNhaKhoNhan,
          tenDiemKho: data.tenDiemKhoNhan,
          maDiemKho: data.maDiemKhoNhan,
          soLuongQdDcCuc: data.soLuongPhanBo,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuong: data.tichLuongKd,
          tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.donViTinh,
          duToanKphi: data.duToanKphi || 0,
          keHoachDcDtlId: data.id
        });
        await this.loadDataBaoQuan(data.cloaiVthh)
        await this.getDataKho(data.maLoKhoNhan || data.maNganKhoNhan)
      }
    });
  }

  async getDataKho(maDvi: any) {
    if (maDvi) {
      let res = await this.bbNghiemThuBaoQuanService.getDataKho(maDvi);
      this.formData.patchValue({
        loaiHinhKho: res.data.lhKho
      });
    }
  }

  async loadThuKho(ma, cap) {
    let body = {
      maDvi: ma,
      capDvi: cap
    }
    const res = await this.mangLuoiKhoService.getDetailByMa(body);
    if (res.statusCode == 0) {
      const detail = res.data.object.detailThuKho
      if (this.formData.value.cloaiVthh) {
        const tichLuong = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
        this.formData.patchValue({
          tichLuong
        })
      }
    }
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data

      this.dsKeHoach = []
      if (data.danhSachQuyetDinh.length == 0) return
      data.danhSachQuyetDinh.map(qdinh => {
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.dcnbKeHoachDcHdr.danhSachHangHoa)
      })

    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    let body = this.formData.value;
    const children = [...this.dsHangTH, ...this.dsHangPD]
    body.fileDinhKemReq = this.fileDinhKemReq
    body.children = children
    if (this.idInput) {
      body.id = this.idInput
    }
    await this.spinner.show();
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBban: data.soBban })
      if (isGuiDuyet) {
        this.guiDuyet();
      }
    }
    await this.spinner.hide();
  }



  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_TK;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isIN() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_BBCBK_IN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_BBCBK_IN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_BBCBK_IN'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_BBCBK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_BBCBK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_BBCBK_THEM'))
  }

  isDuyetTK() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_BBCBK_DUYET_THUKHO') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_BBCBK_DUYET_THUKHO') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_BBCBK_DUYET_THUKHO'))
  }

  isDuyetLD() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_BBCBK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_BBCBK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_BBCBK_DUYET_LDCCUC'))
  }

  isTuChoi() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_TK && this.isDuyetTK()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TK)
        return STATUS.TU_CHOI_TK
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.TU_CHOI_LDCC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_TK && this.isDuyetTK()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
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
