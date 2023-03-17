import { Component, Input, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "../../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import { FileDinhKem } from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../../../constants/message";
import { chain,cloneDeep } from "lodash";
import * as uuid from "uuid";
import { v4 as uuidv4 } from "uuid";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { QuanLyHangTrongKhoService } from "../../../../../../services/quanLyHangTrongKho.service";
import {
  QuyetDinhXuatCapService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/quyet-dinh-xuat-cap.service";
import { LOAI_HANG_DTQG } from "../../../../../../constants/config";
import {
  QuyetDinhPdDtl
} from "../../quyet-dinh-phuong-an/thong-tin-quyet-dinh-phuong-an/thong-tin-quyet-dinh-phuong-an.component";

@Component({
  selector: "app-thong-tin-quyet-dinh-xuat-cap",
  templateUrl: "./thong-tin-quyet-dinh-xuat-cap.component.html",
  styleUrls: ["./thong-tin-quyet-dinh-xuat-cap.component.scss"]
})
export class ThongTinQuyetDinhXuatCapComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  deXuatPhuongAnCache: any[] = [];
  phuongAnView = [];
  phuongAnViewCache: any[] = [];
  phuongAnRow: any = {};
  maQd: string = null;
  isChonPhuongAn: boolean = false;
  isChecked: boolean = false;
  tongSoLuongDxuat = 0;
  expandSetString = new Set<string>();
  expandSetStringCache = new Set<string>();
  isVisible = false;
  listNoiDung = [];
  dsDonVi: any;
  listChiCuc: any[] = [];
  errorInputComponent: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listThanhTien: any;
  listSoLuong: any;
  isVisibleSuaNoiDung = false;
  listQdPaChuyenXc: any[] = [];
  quyetDinhPdDtl: any[]= [new Array<QuyetDinhPdDtl>()];
  deXuatSelected: any = []
  quyetDinhPdDtlCache: any[] = [];
  quyetDinhPdDx: Array<any> = [];
  deXuatPhuongAn: any[] = [];
  tenLoaiVthh: string = null;
  loaiNhapXuat: string = null;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhXuatCapService: QuyetDinhXuatCapService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhXuatCapService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    this.formData = this.fb.group({
        id: [0],
        nam: [dayjs().get("year"), [Validators.required]],
        soQd: [, [Validators.required]],
        ngayKy: [, [Validators.required]],
        ngayHluc: [, [Validators.required]],
        trichYeu: [],
        fileDinhKem: [FileDinhKem],
        canCu: [new Array<FileDinhKem>()],
        loaiVthh: [LOAI_HANG_DTQG.THOC],
        loaiNhapXuat: [],
        kieuNhapXuat: [],
        thoiHanXuat: [],
        tongSoLuongThoc: [],
        thanhTien: [],
        cloaiVthh: [],
        trangThai: [STATUS.DU_THAO],
        ngayPduyet: [],
        tenLoaiVthh: ["Thóc tẻ"],
        tenCloaiVthh: [],
        tenTrangThai: ["Dự thảo"],
        deXuatPhuongAn: [new Array()],
        qdPaXuatCapId: [],
        quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await this.loadChiTiet(this.idInput);
      await Promise.all([
        this.loadDsLoaiHinhNhapXuat(),
        this.loadDsKieuNhapXuat(),
        this.loadDsDonVi(),
        this.loadDsChungLoaiHangHoa(),
        this.loadDsQdPaChuyenXuatCap()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async changePhuongAn(event) {
    await this.spinner.show();
    if (event != null) {
      let data = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(event);
      this.formData.value.quyetDinhPdDtl = data.data.quyetDinhPdDtl;
      this.deXuatPhuongAnCache = data.data.quyetDinhPdDtl[0].quyetDinhPdDx;
      this.tenLoaiVthh = data.data.tenLoaiVthh;
      this.loaiNhapXuat = data.data.loaiNhapXuat;
      this.buildTableView()
    }
    await this.spinner.hide();
  }

  async loadDsQdPaChuyenXuatCap() {
    let body = {
      trangThai: this.globals.prop.NHAP_BAN_HANH,
      loaiVthh: LOAI_HANG_DTQG.GAO,
      xuatCap: true
    };
    await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDsQdPaChuyenXc(body).then((response) => {
      if (response.msg == MESSAGE.SUCCESS) {
        this.listQdPaChuyenXc = response.data;
      }
    });
  }

  async loadChiTiet(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhXuatCapService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
            if (res.data.isChonPhuongAn == true) {
              this.isChecked = true;
              this.isChonPhuongAn = true;
              this.changePhuongAn(res.data.qdPaXuatCapId);
            }
            this.buildTableView();
          }
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI
      });
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }

  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  async save() {
    this.formData.patchValue({
      deXuatPhuongAn: this.flattenTree(this.phuongAnView)
    });
    let result = await this.createUpdate(this.formData.value);
    if (result) {
      this.quayLai();
    }
  }

  async saveAndSend() {
    this.formData.patchValue({
      deXuatPhuongAn: this.flattenTree(this.phuongAnView)
    });
    if (this.userService.isTongCuc()) {
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_LDV, "Bạn có muốn gửi duyệt ?");
    } else {
      await this.createUpdate(this.formData.value);
      await this.approve(this.idInput, STATUS.CHO_DUYET_TP, "Bạn có muốn gửi duyệt ?");
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.phanLoai == "VIEN_TRO_CUU_TRO");
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung == "XUAT_CTVT");
    }
  }

  getNameFile(event?: any, item?: FileDinhKem) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          this.formData.patchValue({});
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
        });
    }
  }

  async selectRow(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
    this.formData.value.quyetDinhPdDtl.forEach(i => {
      i.selected = false
    });
    this.deXuatSelected.selected = true;
    let dataEdit = this.formData.value.quyetDinhPdDtl.find(s => s.idDx === this.deXuatSelected.idDx);
    dataEdit.quyetDinhPdDx.forEach(s => s.idVirtual = uuidv4());
    let dataCache = this.quyetDinhPdDtlCache.find(s => s.idDx === this.deXuatSelected.idDx);
    dataCache.quyetDinhPdDx.forEach(s => s.idVirtual = uuidv4());this.deXuatPhuongAnCache = cloneDeep(dataCache.quyetDinhPdDx);
    this.deXuatPhuongAn = cloneDeep(dataEdit.quyetDinhPdDx)
    this.deXuatPhuongAnCache = cloneDeep(dataCache.quyetDinhPdDx);
    await this.buildTableView();

  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
    this.phuongAnViewCache.forEach(s => {
      this.expandSetStringCache.add(s.idVirtual);
    });
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

  showModal(data?: any): void {
    this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];
    if (this.isChonPhuongAn == true && this.isChecked == true) {
      this.isChonPhuongAn = false;
    }
    this.isVisible = true;
    this.phuongAnRow.loaiVthh = this.formData.value.loaiVthh;
    if (this.userService.isCuc()) {
      this.phuongAnRow.maDviCuc = this.userInfo.MA_DVI;
      this.changeCuc(this.phuongAnRow.maDviCuc);
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let existRow = this.formData.value.deXuatPhuongAn
        .find(s => s.noiDung === this.phuongAnRow.noiDung && s.maDvi === this.phuongAnRow.maDvi);
      if (existRow) {
        this.phuongAnRow.soLuongXuatCuc = existRow.soLuongXuatCuc;
      } else {
        this.phuongAnRow.soLuongXuatCuc = 0;
      }

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
  }

  handleOk(): void {
    if (!this.phuongAnRow.maDviChiCuc) {
      this.errorInputComponent.push("inputChiCuc");
      return;
    }
    this.phuongAnRow.idVirtual = this.phuongAnRow.idVirtual ? this.phuongAnRow.idVirtual : uuid.v4();
    this.phuongAnRow.thanhTien = this.phuongAnRow.soLuongXuatChiCuc * this.phuongAnRow.donGiaKhongVat;
    this.phuongAnRow.tenCloaiVthh = this.listChungLoaiHangHoa.find(s => s.ma === this.phuongAnRow.cloaiVthh)?.ten;
    let index = this.formData.value.deXuatPhuongAn.findIndex(s => s.idVirtual === this.phuongAnRow.idVirtual);
    let table = this.formData.value.deXuatPhuongAn;
    table.filter(s => s.noiDung === this.phuongAnRow.noiDung && s.maDviCuc === this.phuongAnRow.maDviCuc)
      .forEach(s => s.soLuongXuatCuc = this.phuongAnRow.soLuongXuatCuc);

    if (index != -1) {
      table.splice(index, 1, this.phuongAnRow);
    } else {
      table = [...table, this.phuongAnRow];
    }
    this.formData.patchValue({
      deXuatPhuongAn: table
    });
    this.buildTableView();
    if (this.isChecked == true && this.isChonPhuongAn == false) {
      this.isChonPhuongAn = true
    }
    this.isVisible = false;
    this.errorInputComponent = [];
    this.phuongAnRow = {};
    this.listChiCuc = [];
  }

  handleCancel(): void {
    if (this.isChecked == true && this.isChonPhuongAn == false) {
      this.isChonPhuongAn = true
    }
    this.isVisible = false;
    this.errorInputComponent = [];
    this.phuongAnRow = {};
    this.listChiCuc = [];
  }

  buildTableView() {
    let dataViewCache = chain(this.deXuatPhuongAnCache)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
              let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
              let rowCuc = v.find(s => s.tenCuc === k);
              console.log(rowCuc, "rowCuc");
              return {
                idVirtual: uuidv4(),
                tenCuc: k,
                soLuongXuatCuc: rowCuc.soLuongXuatCuc,
                soLuongXuatCucThucTe: soLuongXuatCucThucTe,
                tenCloaiVthh: v[0].tenCloaiVthh,
                childData: v
              };
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
    console.log(JSON.stringify(this.formData.value.deXuatPhuongAn), "raw");
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
              let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
              let rowCuc = v.find(s => s.tenCuc === k);
              console.log(rowCuc, "rowCuc");
              return {
                idVirtual: uuid.v4(),
                tenCuc: k,
                soLuongXuatCuc: rowCuc.soLuongXuatCuc,
                soLuongXuatCucThucTe: soLuongXuatCucThucTe,
                tenCloaiVthh: v[0].tenCloaiVthh,
                childData: v
              };
            }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        return {
          idVirtual: uuid.v4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs
        };
      }).value();
    this.phuongAnView = dataView;
    this.expandAll();

    //
    if (this.formData.value.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.formData.value.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.formData.value.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
  }

  showModalSuaNoiDung(): void {
    if (this.isChonPhuongAn == true && this.isChecked == true) {
      this.isChonPhuongAn = false;
    }
    this.isVisibleSuaNoiDung = true;
  }

  handleOkSuaNoiDung(): void {
    let currentNoiDung = this.formData.value.deXuatPhuongAn.filter(s => s.noiDung == this.phuongAnRow.noiDung);
    currentNoiDung.forEach(s => {
      s.noiDung = this.phuongAnRow.noiDungEdit;
    });
    this.buildTableView();
    if (this.isChecked == true && this.isChonPhuongAn == false) {
      this.isChonPhuongAn = true
    }
    this.isVisibleSuaNoiDung = false;

    //clean
    this.phuongAnRow = {};
  }

  handleCancelSuaNoiDung(): void {
    if (this.isChecked == true && this.isChonPhuongAn == false) {
      this.isChonPhuongAn = true
    }
    this.isVisibleSuaNoiDung = false;
    this.phuongAnRow = {};
  }

  async changeChiCuc(event: any) {
    if (event) {
      let data = this.listChiCuc.find(s => s.maDvi == event);
      this.phuongAnRow.tenChiCuc = data.tenDvi;
      let body = {
        "maDvi": event,
        "loaiVthh": this.formData.value.loaiVthh
      };
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.tonKhoChiCuc = data[0].slHienThoi;
          }
        }
      });
    }
  }

  async loadDsChungLoaiHangHoa() {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: LOAI_HANG_DTQG.GAO });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeCloaiVthh(event: any) {
    let body = {
      maDvi: this.phuongAnRow.maDviChiCuc,
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: event
    };
    this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data.length > 0) {
          this.phuongAnRow.tonKhoChiCuc = data[0].slHienThoi;
        }

      }
    });
  }

  checkVld(inputName: string) {
    if (this.errorInputComponent.find(s => s === inputName)) {
      return "error";
    } else {
      return "";
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  suaPhuongAn(data: any) {
    let currentRow;
    if (data.id) {
      currentRow = this.formData.value.deXuatPhuongAn.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      currentRow = this.formData.value.deXuatPhuongAn.find(s => s.idVirtual == data.idVirtual);
    }
    this.phuongAnRow = currentRow;
    console.log(this.phuongAnRow, "current");
    this.changeCuc(this.phuongAnRow.maDviCuc);
    this.showModal();
  }

  suaNoiDung(data: any) {
    this.phuongAnRow.noiDung = data.noiDung;
    this.phuongAnRow.noiDungEdit = data.noiDung;
    this.showModalSuaNoiDung();
  }

  xoaPhuongAn(data: any) {
    let deXuatPhuongAn;
    if (data.id) {
      deXuatPhuongAn = this.formData.value.deXuatPhuongAn.filter(s => s.id != data.id);
    } else if (data.idVirtual) {
      deXuatPhuongAn = this.formData.value.deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual);
    }
    this.formData.patchValue({
      deXuatPhuongAn: deXuatPhuongAn
    });
    this.buildTableView();
  }

  checkChonPhuongAn() {
    this.isChecked = !this.isChecked
    this.isChonPhuongAn = !this.isChonPhuongAn;
    this.formData.get('qdPaXuatCapId').setValue(null);
    this.deXuatPhuongAnCache = null;
    this.phuongAnViewCache = null;
  }

}