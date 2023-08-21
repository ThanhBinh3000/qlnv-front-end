import {Component, Input, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import {FormGroup, Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../../../constants/message";
import {chain, cloneDeep} from "lodash";
import {v4 as uuidv4} from "uuid";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {QuanLyHangTrongKhoService} from "../../../../../../services/quanLyHangTrongKho.service";
import {
  QuyetDinhXuatCapService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/quyet-dinh-xuat-cap.service";
import {LOAI_HANG_DTQG} from "../../../../../../constants/config";

import {
  ModalInput
} from "../../../xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";

export class QuyetDinhPdDtl {
  idVirtual: string;
  id: number;
  idDx: number;
  soDx: string;
  maDviDx: string;
  ngayPduyetDx: Date;
  trichYeuDx: string;
  tongSoLuongDx: number;
  soLuongXuatCap: number;
  tenDviDx: string;
  quyetDinhPdDx: Array<any> = [];
}

export class QuyetDinhPdDx {
  idVirtual: string = '';
  id: number = null;
  noiDung: string = '';
  soLuongXuat: number = 0;
  soLuongXuatCuc: number = 0;
  maDviCuc: string = '';
  tonKhoCuc: number = 0;
  soLuongCon: number = 0;
  maDviChiCuc: string = '';
  tonKhoChiCuc: number = 0;
  loaiVthh: string = '';
  cloaiVthh: string = '';
  tonKhoCloaiVthh: number = 0;
  soLuongXuatChiCuc: number = 0;
  donViTinh: string = '';
  donGiaKhongVat: number = 0;
  thanhTien: number = 0;
  tenCloaiVthh: string = '';
  tenCuc: string = '';
  tenChiCuc: string = '';

  soLuongXuatDeXuat: number = 0;
  soLuongXuatThucTe: number = 0;
  level: number = 0;
}

@Component({
  selector: "app-thong-tin-quyet-dinh-xuat-cap",
  templateUrl: "./thong-tin-quyet-dinh-xuat-cap.component.html",
  styleUrls: ["./thong-tin-quyet-dinh-xuat-cap.component.scss"],
  providers: [QuyetDinhPdDx]
})
export class ThongTinQuyetDinhXuatCapComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  deXuatPhuongAnCache: any[] = [];
  phuongAnView = [];
  phuongAnViewCache: any[] = [];
  phuongAnRow: FormGroup;
  quyetDinhPdDtlCache: any[] = [];
  tongSoLuongDxuat = 0;
  expandSetString = new Set<string>();
  isVisible = false;
  listDonVi: any;
  listDiaDanh: any;
  listChiCuc: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listThanhTien: any;
  listSoLuong: any;
  isVisibleSuaNoiDung = false;
  listQdPaChuyenXc: any[] = [];
  deXuatSelected: any = QuyetDinhPdDtl;
  deXuatSelectedIndex: any;
  deXuatPhuongAn: any[] = [];
  tenLoaiVthh: string = null;
  loaiNhapXuat: string = null;
  kieuNhapXuat: string = null;
  disableInputComponent: ModalInput = new ModalInput();
  maHauTo: any;
  defaultCloaiVthh: any;
  checkXuatGao: any = false;
  initModal: boolean = true;

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
      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soQd: [, [Validators.required]],
      ngayKy: [],
      ngayHluc: [],
      ngayHlucQdPd: [],
      idQdGiaoNv: [],
      soQdGiaoNv: [],
      idQdPd: [],
      soQdPd: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      loaiVthh: [LOAI_HANG_DTQG.THOC],
      loaiNhapXuat: [],
      kieuNhapXuat: [],
      thoiHanXuat: [],
      tongSoLuongThoc: [],
      tongSoLuongGao: [],
      thanhTien: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      lyDoTuChoi: [],
      tenLoaiVthh: ['Thóc tẻ'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
      tenDvi: [],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>()],
      ngayTao: [],
      nguoiTaoId: [],
      ngaySua: [],
      nguoiSuaId: [],
      checkXuatGao: [false]
    });
    this.phuongAnRow = this.fb.group(new QuyetDinhPdDx());

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadDsLoaiHinhNhapXuat(),
        this.loadDsKieuNhapXuat(),
        this.loadDsDonVi(),
        this.loadDsChungLoaiHangHoa(),
        this.loadDsQdPaChuyenXuatCap(),
        this.loadDsDiaDanh()
      ]);
      await this.loadChiTiet(this.idInput);

      // tao qd tu qd ctvt
      if (Object.keys(this.dataInit).length > 0) {
        // this.checkChonPhuongAn();
        this.checkXuatGao = true;
        this.formData.patchValue({idQdPd: this.dataInit.id})
        await this.changeQdPd(this.dataInit.id);
      }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }


  async loadChiTiet(idInput: number) {
    if (idInput) {
      await this.quyetDinhXuatCapService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.setValue({
              ...res.data,
              soQd: res.data.soQd?.split('/')[0] ?? null,
              checkXuatGao: !!res.data.idQdPd
            }, {emitEvent: false});

            this.formData.value.quyetDinhPdDtl.forEach(s => {
              s.idVirtual = uuidv4();
            });
            this.changeQdPd(res.data.idQdPd);
            this.checkXuatGao = cloneDeep(!!res.data.idQdPd);
          }
          console.log(this.formData.value)
        })
        .catch((e) => {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
      // this.formData.controls['idQdPd'].disable();
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        loaiNhapXuat: this.listLoaiHinhNhapXuat[0].giaTri,
        kieuNhapXuat: this.listKieuNhapXuat[0].giaTri,
      });
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }

  }

  async save() {
    this.formData.disable({emitEvent: false});
    let body = {
      ...this.formData.value,
      soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : this.maHauTo
    };
    let rs = await this.createUpdate(body);
    this.formData.enable({emitEvent: false});
    this.formData.patchValue({id: rs.id})
    // this.checkXuatGao = true
    // this.formData.controls['idQdPd'].disable();
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    body = {...body, soQd: this.formData.value.soQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  quayLai() {
    this.showListEvent.emit();
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

  async changeQdPd(event) {
    await this.spinner.show();
    if (event) {
      let data = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(event);
      this.quyetDinhPdDtlCache = cloneDeep(data.data.quyetDinhPdDtl);
      this.tenLoaiVthh = data.data.tenLoaiVthh;
      this.loaiNhapXuat = data.data.loaiNhapXuat;
      this.kieuNhapXuat = data.data.kieuNhapXuat;
      if (this.formData.value.id) {

      } else {
        this.formData.patchValue({
          soQdPd: data.data.soQd,
          quyetDinhPdDtl: data.data.quyetDinhPdDtl
        })
        this.formData.value.quyetDinhPdDtl.forEach(s => {
          s.id = null;
          s.quyetDinhPdDx = s.quyetDinhPdDx.reduce((acc, item) => {
            const index = acc.findIndex(obj => obj.noiDung === item.noiDung);
            if (index === -1) {
              let addData = new QuyetDinhPdDx();
              addData.noiDung = item.noiDung;
              addData.soLuongXuat = item.soLuongXuatCap * 2;
              acc.push(addData);
            }
            return acc;
          }, []);

        });
      }
    }
    await this.selectRow(this.formData.value.quyetDinhPdDtl[0]);
    await this.spinner.hide();
  }

  async selectRow(item?: any) {
    try {
      await this.spinner.show();
      if (item) {
        this.deXuatSelected = item;
        this.deXuatSelectedIndex = this.formData.value.quyetDinhPdDtl.findIndex(s => s.idVirtual === item.idVirtual);
      }
      this.formData.value.quyetDinhPdDtl.forEach(i => i.selected = false);
      this.deXuatSelected.selected = true;

      let dataEdit = this.formData.value.quyetDinhPdDtl.find(s => s.idDx === this.deXuatSelected.idDx);
      dataEdit.quyetDinhPdDx = dataEdit.quyetDinhPdDx.map(s => {
        s.tenCuc = s.tenCuc ?? '';
        return {...s, idVirtual: uuidv4()}
      });

      this.deXuatPhuongAn = cloneDeep(dataEdit.quyetDinhPdDx)
      let dataCache = this.quyetDinhPdDtlCache.find(s => s.idDx === this.deXuatSelected.idDx);
      if (dataCache) {
        dataCache.quyetDinhPdDx = dataCache.quyetDinhPdDx.map(s => ({...s, idVirtual: uuidv4()}));
        this.deXuatPhuongAnCache = cloneDeep(dataCache.quyetDinhPdDx);
      }
      await this.buildTableView();
    } catch (e) {
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
    this.phuongAnViewCache.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async showModal(data?: any) {

    console.log(data)
    this.isVisible = true;
    if (data) {
      await this.changeCuc(data.maDviCuc);
      //truong hop la ban ghi dau tien cua 1 noi dung
      if (data.level == 1 && !data.childData[0].tenCuc) {
        data.id = data.childData[0].childData[0].id
      }
      await this.phuongAnRow.patchValue(data, {emitEvent: false});
    } else {
      this.phuongAnRow.patchValue({
        idVirtual: uuidv4(),
        loaiVthh: LOAI_HANG_DTQG.THOC
      });
    }
    this.initModal = false;
  }

  handleOk(): void {
    //truong hop tao truc tiep thi sinh 1 ban ghi dtl
    if (this.checkXuatGao == false && this.formData.value.quyetDinhPdDtl.length == 0) {
      this.formData.patchValue({
        quyetDinhPdDtl: [{
          idVirtual: uuidv4(),
          selected: true
        }]
      })
      this.deXuatSelectedIndex = 0;
    }
    //
    this.phuongAnRow.patchValue({
      thanhTien: this.phuongAnRow.value.soLuongXuatChiCuc * this.phuongAnRow.value.donGiaKhongVat,
      tenCloaiVthh: this.listChungLoaiHangHoa.find(s => s.ma === this.phuongAnRow.value.cloaiVthh)?.ten,
      soLuongXuatCuc: this.formData.value.idQdPd ? this.phuongAnRow.value.soLuongXuatChiCuc : this.phuongAnRow.value.soLuongXuatCuc
    });
    if (this.phuongAnRow.value.level == 1 || this.phuongAnRow.value.level == 2) {
      let index = this.deXuatPhuongAn.findIndex(s => s.noiDung === this.phuongAnRow.value.noiDung)
      let exists = this.deXuatPhuongAn.findIndex(s =>
        s.noiDung === this.phuongAnRow.value.noiDung &&
        s.tenChiCuc === this.phuongAnRow.value.tenChiCuc &&
        s.tenCloaiVthh === this.phuongAnRow.value.tenCloaiVthh
      )
      if (this.deXuatPhuongAn[index]?.tenCuc && exists == -1) {
        this.deXuatPhuongAn = [...this.deXuatPhuongAn, this.phuongAnRow.value];
      } else if (exists == -1) {
        this.deXuatPhuongAn[index] = this.phuongAnRow.value;
      } else {
        this.deXuatPhuongAn[exists] = this.phuongAnRow.value;
      }
    } else {
      let index = this.deXuatPhuongAn.findIndex(s => s.idVirtual === this.phuongAnRow.value.idVirtual);
      if (index != -1) {
        this.deXuatPhuongAn[index] = this.phuongAnRow.value;
      } else {
        this.deXuatPhuongAn = [...this.deXuatPhuongAn, this.phuongAnRow.value];
      }
    }
    this.formData.value.quyetDinhPdDtl[this.deXuatSelectedIndex].quyetDinhPdDx = this.deXuatPhuongAn;
    this.selectRow();

    this.isVisible = false;
    this.phuongAnRow.reset();
    this.initModal = true;
  }

  handleCancel(): void {

    this.isVisible = false;
    this.phuongAnRow.reset({}, {emitEvent: true});
    this.initModal = true;
    this.listChiCuc = [];
  }

  buildTableView() {
    try {
      this.phuongAnViewCache = chain(this.deXuatPhuongAnCache)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenCuc")
            .map((v, k) => {
                let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
                let rowCuc = v.find(s => s.tenCuc === k);
                return {
                  idVirtual: uuidv4(),
                  level: 2,
                  tenCuc: k,
                  soLuongXuatCuc: rowCuc?.soLuongXuatCuc ?? 0,
                  soLuongXuatCucThucTe: soLuongXuatCucThucTe ?? 0,
                  tenCloaiVthh: v[0].tenCloaiVthh,

                  childData: v
                };
              }
            ).value();
          let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
          let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
          return {
            idVirtual: uuidv4(),
            level: 1,
            noiDung: key,
            soLuongXuat: soLuongXuat ?? 0,
            soLuongXuatThucTe: soLuongXuatThucTe ?? 0,
            childData: rs
          };
        }).value();
      this.phuongAnView = chain(this.deXuatPhuongAn)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenCuc")
            .map((v, k) => {
                let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
                let rowCuc = v.find(s => s.tenCuc === k);
                return {
                  idVirtual: uuidv4(),
                  level: 2,
                  maDviCuc: rowCuc?.maDviCuc,
                  tenCuc: k,
                  soLuongXuatCuc: rowCuc?.soLuongXuatCuc ?? 0,
                  soLuongXuatCucThucTe: soLuongXuatCucThucTe ?? 0,
                  tenCloaiVthh: v[0].tenCloaiVthh,
                  tonKhoCuc: rowCuc?.tonKhoCuc ?? 0,
                  noiDung: rowCuc?.noiDung,
                  childData: v
                };
              }
            ).value();
          let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
          let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
          let rowDiaPhuong = value.find(s => s.noiDung === key);
          return {
            idVirtual: uuidv4(),
            level: 1,
            noiDung: key,
            soLuongXuat: rowDiaPhuong?.soLuongXuat ?? 0,
            soLuongXuatThucTe: soLuongXuatThucTe ?? 0,
            childData: rs
          };
        }).value();
      this.summaryData();
      this.expandAll();
    } catch (e) {
      console.log(e);
    } finally {
      console.log(this.phuongAnView, 'this.phuongAnView');
      console.log(this.phuongAnViewCache, 'this.phuongAnViewCache');
      console.log(this.deXuatPhuongAn);
      console.log(this.deXuatPhuongAnCache);
    }
  }


  showModalSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = true;
  }

  handleOkSuaNoiDung(): void {
    let currentNoiDung = this.formData.value.deXuatPhuongAn.filter(s => s.noiDung == this.phuongAnRow.value.noiDung);
    currentNoiDung.forEach(s => {
      s.noiDung = this.phuongAnRow.value.noiDungEdit;
    });
    this.buildTableView();

    this.isVisibleSuaNoiDung = false;

    //clean
    this.phuongAnRow.reset();
  }

  handleCancelSuaNoiDung(): void {

    this.isVisibleSuaNoiDung = false;
    this.phuongAnRow.reset();
  }

  async changeCuc(event?: any) {
    //clean
    if (!this.initModal) {
      this.phuongAnRow.patchValue({
        maDviChiCuc: null,
        tonKhoChiCuc: 0,
      })
    }
    if (event) {
      /*     let existRow = this.formData.value.deXuatPhuongAn
             .find(s => s.noiDung === this.phuongAnRow.value.noiDung && s.maDviCuc === this.phuongAnRow.value.maDviCuc);
           if (existRow) {
             this.phuongAnRow.value.soLuongXuatCuc = existRow.soLuongXuatCuc;
           } else {
             this.phuongAnRow.value.soLuongXuatCuc = 0
           }
     */
      let data = this.listDonVi.find(s => s.maDvi == event);
      this.phuongAnRow.patchValue({tenCuc: data.tenDvi}, {emitEvent: false});
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

      //lay ton kho
      if (this.userService.isTongCuc()) {
        let body = {
          'maDvi': event,
          'loaiVthh': this.formData.value.loaiVthh
        }
        this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data.length > 0) {
              this.phuongAnRow.patchValue(
                {tonKhoCuc: data.reduce((prev, cur) => prev + cur.slHienThoi, 0)},
                {emitEvent: false});
            }
          }
        });
      }
    } else {
      this.phuongAnRow.patchValue({tonKhoCuc: 0});
    }
  }

  async changeChiCuc(event?: any) {
    //clean
    if (!this.initModal) {
      this.phuongAnRow.patchValue({
        cloaiVthh: null,
        tonKhoChiCuc: 0,
        tonKhoCloaiVthh: 0,
      });
    }
    if (event) {
      let data = this.listChiCuc.find(s => s.maDvi == event);
      this.phuongAnRow.patchValue({tenChiCuc: data.tenDvi}, {emitEvent: false});
      let body = {
        'maDvi': event,
        'loaiVthh': this.formData.value.loaiVthh
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.patchValue(
              {tonKhoChiCuc: data.reduce((prev, cur) => prev + cur.slHienThoi, 0)},
              {emitEvent: false});
          }
        }
      });
    }
  }


  async changeCloaiVthh(event?: any) {
    if (event) {
      let body = {
        maDvi: this.phuongAnRow.value.maDviChiCuc,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: event
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.patchValue(
              {tonKhoCloaiVthh: data.reduce((prev, cur) => prev + cur.slHienThoi, 0)},
              {emitEvent: false});
          }
        }
      });
    } else {
      this.phuongAnRow.patchValue({
        tonKhoCloaiVthh: 0,
      });
    }
    //disable ds cloai hh da ton tai
    // this.listChungLoaiHangHoa.forEach(s => {
    //   s.disable = false;
    //   if (this.defaultCloaiVthh !== s.ma && this.formData.value.deXuatPhuongAn.find(s1 => s1.cloaiVthh === s.ma && s1.maDviChiCuc === this.phuongAnRow.value.maDviChiCuc)) {
    //     s.disable = true;
    //   }
    // })
  }

  /* suaPhuongAn(data: any) {
     let currentRow;
     if (data.id) {
       currentRow = this.formData.value.deXuatPhuongAn.find(s => s.id == data.id);
     } else if (data.idVirtual) {
       currentRow = this.formData.value.deXuatPhuongAn.find(s => s.idVirtual == data.idVirtual);
     }
     this.phuongAnRow = currentRow;
     console.log(this.phuongAnRow, "current");
     this.changeCuc(this.phuongAnRow.value.maDviCuc);
     this.showModal(data);
   }*/

  suaNoiDung(data: any) {
    this.phuongAnRow.value.noiDung = data.noiDung;
    this.phuongAnRow.value.noiDungEdit = data.noiDung;
    this.showModalSuaNoiDung();
  }

  xoaPhuongAn(data: any, dataParent?: any) {
    if (data.noiDung && data.childData) {
      this.deXuatPhuongAn = cloneDeep(this.formData.value.quyetDinhPdDtl[this.deXuatSelectedIndex].quyetDinhPdDx.filter(s => s.noiDung != data.noiDung));
    } else if (data.tenCuc && dataParent) {
      this.deXuatPhuongAn = cloneDeep(this.formData.value.quyetDinhPdDtl[this.deXuatSelectedIndex].quyetDinhPdDx.filter(s => !(s.tenCuc === data.tenCuc && s.noiDung === dataParent.noiDung)));
    } else if (data.id) {
      this.deXuatPhuongAn = cloneDeep(this.formData.value.quyetDinhPdDtl[this.deXuatSelectedIndex].quyetDinhPdDx.filter(s => s.id != data.id));
    } else if (data.idVirtual) {
      this.deXuatPhuongAn = cloneDeep(this.formData.value.quyetDinhPdDtl[this.deXuatSelectedIndex].quyetDinhPdDx.filter(s => s.idVirtual != data.idVirtual));
    }
    this.formData.patchValue({
      quyetDinhPdDtl: this.deXuatPhuongAn
    })

    this.buildTableView();
  }

  changeCheckXuatGao($event) {
    this.checkXuatGao = $event;
    if (!$event) {
      this.formData.patchValue({
        idQdPd: null,
        quyetDinhPdDtl: []
      });
      // this.deXuatPhuongAnCache = null;
      this.buildTableView();
    }
  }


  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  async loadDsDiaDanh() {
    let body = {
      capDiaDanh: 1
    };
    let res = await this.danhMucService.loadDsDiaDanhByCap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDiaDanh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsQdPaChuyenXuatCap() {
    await this.quyetDinhPheDuyetPhuongAnCuuTroService.search({
      trangThai: STATUS.BAN_HANH,
      nam: this.formData.value.nam,
      xuatCap: true,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then((response) => {
      if (response.msg == MESSAGE.SUCCESS) {
        if (this.idInput) {
          this.listQdPaChuyenXc = response.data.content;
        } else {
          this.listQdPaChuyenXc = response.data.content.filter(s => !s.idXc);
        }

      }
    });
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.apDung?.includes('XUAT_CAP'));
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung?.includes('XUAT_CAP'));
    }
  }

  async loadDsChungLoaiHangHoa() {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: LOAI_HANG_DTQG.THOC});
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
      this.listDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async summaryData() {
    if (!this.formData.value.idQdPd) {
      this.formData.value.quyetDinhPdDtl.forEach(s => {
        s.tongSoLuongDx = s.quyetDinhPdDx.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0)
        s.soLuongXuatCap = s.quyetDinhPdDx.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0)
      })
    }
  }
}
