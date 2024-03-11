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
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";
import { ThongTinHangDtqgComponent } from "../thong-tin-hang-dtqg/thong-tin-hang-dtqg.component";
import { BbNghiemThuBaoQuanService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";


@Component({
  selector: 'app-thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component.scss']
})
export class ThongTinBienBanNghiemThuBaoQuanLanDauComponent extends Base2Component implements OnInit {
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
  listLoaiHinhBaoQuan: any[] = [];

  dsKeHoach: any[] = []

  danhSach: any[] = []
  dsHangTH = []
  dsHangPD = []
  typeData: string;
  typeAction: string;
  previewName: string = "nhap_lt_bien_ban_nghiem_thu_bao_quan_lan_dau"
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private bbNghiemThuBaoQuanLanDauService: BienBanNghiemThuBaoQuanLanDauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bbNghiemThuBaoQuanLanDauService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      id: [],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year")],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBban: [],
      ngayLap: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayKetThucNt: [],
      soQdDcCuc: [, [Validators.required]],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      ktvBaoQuan: [],
      thuKho: [],
      keToan: [],
      ldChiCuc: [],
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
      tichLuongKhaDung: [],
      donViTinh: [],
      dsPhieuNhapKho: [],
      slThucNhapDc: [],
      hinhThucBaoQuan: [],
      loaiHinhBaoQuan: [],
      phuongThucBaoQuan: [],
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
      loaiQdinh: [],
      lyDoTuChoi: [],
      thayDoiThuKho: [],
      keHoachDcDtlId: [, [Validators.required]],
      soBbNhapDayKho: []
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
      loaiDc: this.loaiDc,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: true
    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      this.formData.patchValue({
        soQdDcCuc: this.data.soQdinh,
        ngayQdDcCuc: this.data.ngayHieuLuc,
        qdDcCucId: this.data.qdinhDccId,
        tenLoNganKho: `${this.data.tenLoKhoNhan || ""} ${this.data.tenNganKhoNhan}`,
        tenLoKho: this.data.tenLoKhoNhan,
        maLoKho: this.data.maLoKhoNhan,
        tenNganKho: this.data.tenNganKhoNhan,
        maNganKho: this.data.maNganKhoNhan,
        tenNhaKho: this.data.tenNhaKhoNhan,
        maNhaKho: this.data.maNhaKhoNhan,
        tenDiemKho: this.data.tenDiemKhoNhan,
        maDiemKho: this.data.maDiemKhoNhan,
        tenLoKhoXuat: this.data.tenLoKhoXuat,
        maLoKhoXuat: this.data.maLoKhoXuat,
        tenNganKhoXuat: this.data.tenNganKhoXuat,
        maNganKhoXuat: this.data.maNganKhoXuat,
        tenNhaKhoXuat: this.data.tenNhaKhoXuat,
        maNhaKhoXuat: this.data.maNhaKhoXuat,
        tenDiemKhoXuat: this.data.tenDiemKhoXuat,
        maDiemKhoXuat: this.data.maDiemKhoXuat,
        loaiVthh: this.data.loaiVthh,
        tenLoaiVthh: this.data.tenLoaiVthh,
        cloaiVthh: this.data.cloaiVthh,
        tenCloaiVthh: this.data.tenCloaiVthh,
        tichLuongKhaDung: this.data.tichLuongKd,
        donViTinh: this.data.donViTinh,
        idKeHoachDtl: this.data.qdinhDccId,
        keHoachDcDtlId: this.data.keHoachDcDtlId
      });
      await this.loadChiTietQdinh(this.data.qdinhDccId);
      await this.loadDataBaoQuan(this.data.cloaiVthh)
      await this.getDataKho(this.data.maLoKhoNhan || this.data.maNganKhoNhan)
      await this.getTLKD()
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
    const tichLuongKhaDung = (this.formData.value.cloaiVthh.startsWith("01") || this.formData.value.cloaiVthh.startsWith("04")) ? detail.data.object.tichLuongKdLt : detail.data.object.tichLuongKdVt
    this.formData.patchValue({
      tichLuongKhaDung
    })
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho}`, });
      this.dsHangTH = data.dcnbBBNTBQDtl.filter(item => item.type === "TH")
      this.dsHangPD = data.dcnbBBNTBQDtl.filter(item => item.type === "PD")
      this.fileDinhKemReq = data.fileDinhKems
      await this.loadDataBaoQuan(data.cloaiVthh)
      await this.dsPhieuNhapKho(data)
    }
    await this.spinner.hide();
  }

  async dsPhieuNhapKho(data) {
    const body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      qdDcCucId: data.qdDcCucId,
      soQdDcCuc: data.soQdDcCuc,
      maLoKho: data.maLoKho,
      maNganKho: data.maNganKho,
      isVatTu: false
    }
    let res = await this.phieuNhapKhoService.getDanhSach(body);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log('phieuNhapKhoService', res)
    }
  }

  async loadDataBaoQuan(cloaiVthh) {
    if (cloaiVthh) {
      this.listPhuongThucBaoQuan = []
      this.listHinhThucBaoQuan = []
      let res = await this.danhMucService.getDetail(cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
        this.listLoaiHinhBaoQuan = res.data?.loaiHinhBq
      }
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

        this.updateDataTable()

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

  updateDataTable() {
    this.danhSach = []
    this.danhSach = this.danhSach.concat(this.dsHangTH)
    this.danhSach = this.danhSach.concat(this.dsHangPD)
    this.formData.patchValue({
      dcnbBBNTBQDtl: this.danhSach
    })
  }

  xoa(row, type) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: `Bạn chắc chắn muốn xoá dữ liệu?`,
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
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


        this.updateDataTable()
      },
    });

  }




  async openDialogQD() {
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI,
      type: this.formData.value.type,
      thayDoiThuKho: true
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
          donViTinh: data.donViTinh,
          idKeHoachDtl: data.id,
          keHoachDcDtlId: data.id
        });
        await this.loadDataBaoQuan(data.cloaiVthh)
        await this.getDataKho(data.maLoKhoNhan || data.maNganKhoNhan)
        await this.getTLKD()
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

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.dsKeHoach = []
      this.formData.patchValue({
        ngayQdDcCuc: data.ngayKyQdinh
      })
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

  setValidator() {
    if (this.formData.get('type').value == 'TH') {
      this.formData.controls["idThop"].setValidators([Validators.required]);
      this.formData.controls["idDxuat"].clearValidators();
    }
    if (this.formData.get('type').value == 'TTr') {
      this.formData.controls["idThop"].clearValidators();
      this.formData.controls["idDxuat"].setValidators([Validators.required]);
    }
  }

  async save(isGuiDuyet?) {
    // this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    await this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKemReq;

    if (this.idInput) {
      body.id = this.idInput
    }

    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBban: data.soBban
      })
      if (isGuiDuyet) {
        this.guiDuyet();
      }
    }
    await this.spinner.hide();
  }

  isIn() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_IN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_IN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_IN'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_THEM'))
  }

  isDuyetTK() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_DUYET_THUKHO') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_DUYET_THUKHO') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_DUYET_THUKHO'))
  }

  isDuyetKT() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_DUYET_KETOAN'))
  }

  isDuyetLD() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_DUYET_LDCCUC'))
  }


  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_TK;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_TK || this.formData.value.trangThai == STATUS.CHO_DUYET_KT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TK)
        return STATUS.TU_CHOI_TK
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KT)
        return STATUS.TU_CHOI_KT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.TU_CHOI_LDCC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_TK && this.isDuyetTK()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.isDuyetKT()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TK)
        return STATUS.CHO_DUYET_KT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KT)
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
