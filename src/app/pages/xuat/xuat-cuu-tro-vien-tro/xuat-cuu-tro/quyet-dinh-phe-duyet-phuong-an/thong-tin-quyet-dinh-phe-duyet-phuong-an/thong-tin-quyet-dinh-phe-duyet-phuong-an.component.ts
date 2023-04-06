import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service';
import {
  DeXuatPhuongAnCuuTroService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service';
import {
  TongHopPhuongAnCuuTroService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service';
import { STATUS } from 'src/app/constants/status';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { chain, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { DonviService } from 'src/app/services/donvi.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';

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
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-phuong-an',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-phuong-an.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-phuong-an.component.scss']
})
export class ThongTinQuyetDinhPheDuyetPhuongAnComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idTongHop: number;
  @Input() idSelected;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() dataTongHop: any;
  maQd: string = null;
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean;
  load: boolean = false;
  listDanhSachTongHop: any[] = [];
  listDanhSachDeXuat: any[] = [];
  danhSachTongHop: any[] = [];
  // danhsachDx: any[] = [];
  fileList: any[] = [];
  deXuatPhuongAn: any[] = [];
  deXuatPhuongAnCache: any[] = [];
  phuongAnView: any[] = [];
  phuongAnViewCache: any[] = [];
  listThanhTien: number[] = [0];
  listSoLuong: number[] = [0];
  listSoLuongDx: number[] = [0];
  listThanhTienCache: number[] = [0];
  listSoLuongCache: number[] = [0];
  listSoLuongDxCache: number[] = [0];
  slXuatCap: number = 0;
  slXuatCapCache: number = 0;
  expandSetString = new Set<string>();
  expandSetStringCache = new Set<string>();
  tongSoLuongDxuat = 0;
  tongSlDx = 0;
  soLuongXuatKho = 0;
  tongThanhTienDxuat = 0;
  phuongAnRow: any = {};
  dsDonVi: any;
  listChiCuc: any[] = [];
  isVisible = false;
  listNoiDung = []
  listChungLoaiHangHoa: any[] = [];
  quyetDinhPdDtlCache: any[] = [];
  deXuatSelected: any = []
  firstInit = true;
  canCu: any[] = [];
  dxPaId: number = 0;
  openDxPa = false;
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
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
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({

      id: [0],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soQd: [, [Validators.required]],
      ngayKy: [, [Validators.required]],
      ngayHluc: [, [Validators.required]],
      idTongHop: [, [Validators.required]],
      maTongHop: [, [Validators.required]],
      ngayThop: [, [Validators.required]],
      idDx: [, [Validators.required]],
      soDx: [, [Validators.required]],
      ngayDx: [],
      tongSoLuongDx: [],
      tongSoLuong: [],
      soLuongXuaCap: [],
      loaiVthh: [],
      cloaiVthh: [],
      loaiNhapXuat: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      lyDoTuChoi: [],
      type: ['TH', [Validators.required]],
      xuatCap: [false],
      ngayPduyet: [],
      fileDinhKem: [FileDinhKem],
      canCu: [new Array<FileDinhKem>()],
      tenDvi: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: ['Dự thảo'],
      quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
      donViTinh: []
    }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await Promise.all([
        // this.bindingDataTongHop(this.dataTongHop),
        this.loadDsDonVi(),
        this.loadDsVthh(),

      ]);
      await this.loadChiTiet(this.idSelected)
      this.firstInit = false;
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {

  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue(data);
      this.formData.patchValue({
        soQd: data.soQd?.split('/')[0],
        quyetDinhPdDtl: this.formData.value.quyetDinhPdDtl
      })
      if (data.type == 'TH') {
        await this.selectMaTongHop(data.idTongHop);
      } else {
        await this.selectMaDeXuat(data.idDx);
      }
      await this.selectRow(this.formData.value.quyetDinhPdDtl[0])
      this.fileDinhKem = data.fileDinhKem;
      this.canCu = data.canCu;
      await this.buildTableView();
    } else {

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
        console.log(data, "data");
        let listDeXuat = await Promise.all(data.deXuatCuuTro.map(async item => {
          let res1 = await this.deXuatPhuongAnCuuTroService.getDetail(item.idDx);
          if (res1.msg === MESSAGE.SUCCESS) {
            return Object.assign(item, { quyetDinhPdDx: res1.data.deXuatPhuongAn });
          } else {
            console.log(MESSAGE.ERROR, res1.msg);
          }
        }));
        //truong hop tao moi

        if (this.firstInit === false) {
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
        await this.changeHangHoa(data.loaiVthh)
        this.quyetDinhPdDtlCache = Object.assign(this.quyetDinhPdDtlCache, listDeXuat);
        this.quyetDinhPdDtlCache.forEach(f => {
          let tong = f.quyetDinhPdDx.reduce((tong, s) => {
            return tong + s.soLuongXuat;
          }, 0);
          this.tongSlDx = tong;
        })
        this.deXuatSelected = listDeXuat[0];
        this.summaryData();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async selectMaDeXuat(event) {
    await this.spinner.show()
    if (event) {
      let res = await this.deXuatPhuongAnCuuTroService.getDetail(event);
      if (res.msg === MESSAGE.SUCCESS) {
        let data = res.data;
        data.deXuatPhuongAn.forEach(s => {
          delete s.id;
          delete s.idHdr;
        });

        let listDeXuat = [...[], Object.assign({
          idDx: data.id,
          maDviDx: data.maDvi,
          tenDviDx: data.tenDvi,
          soDx: data.soDx,
          ngayPduyetDx: data.ngayPduyet,
          ngayDx: data.ngayDx,
          ngayKetThucDx: data.ngayKetThuc,
          trichYeuDx: data.trichYeu,
          tongSoLuongDx: data.tongSoLuong,
          soLuongXuatCap: data.soLuongXuatCap,
          thanhTienDx: data.thanhTien
        }, { quyetDinhPdDx: data.deXuatPhuongAn })];
        //truong hop tao moi
        this.formData.patchValue({ soDx: data.soDx })
        if (this.firstInit === false) {
          this.formData.patchValue({
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            loaiNhapXuat: data.loaiNhapXuat,
            idTongHop: null,
            maTongHop: data.maTongHop,
            tongSoLuongDx: data.tongSlCtVt,
            soLuongXuaCap: data.tongSlXuatCap,
            idDx: event,
            soDx: data.soDx,
            ngayDx: data.ngayDx,
            quyetDinhPdDtl: listDeXuat
          });

        }
        await this.changeHangHoa(data.loaiVthh)
        this.quyetDinhPdDtlCache = Object.assign(this.quyetDinhPdDtlCache, listDeXuat);
        this.quyetDinhPdDtlCache.forEach(f => {
          let tong = f.quyetDinhPdDx.reduce((tong, s) => {
            return tong + s.soLuongXuat;
          }, 0);
          this.tongSlDx = tong;
        })
        this.deXuatSelected = listDeXuat[0];
        this.summaryData();
      } else {
        console.log(MESSAGE.ERROR, res.msg);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide()
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.tongSoLuongDx = this.tongSlDx;
    body.tongSoLuong = this.tongSoLuongDxuat;

    body.canCu = this.canCu;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idSelected = data.id;
        this.guiDuyet();
      } else {
        this.quayLai();
      }
    }
    await this.spinner.hide();
  }

  async guiDuyet() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Văn bản sẵn sàng ban hành ?'
    this.approve(this.idSelected, trangThai, mesg);
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
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async changeHangHoa(event: any) {
    if (event) {
      this.formData.patchValue({ donViTinh: this.listHangHoaAll.find(s => s.ma == event)?.maDviTinh })

      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  async openDialogTh() {
    if (this.formData.get('type').value != 'TH') {
      return;
    }
    await this.spinner.show();
    let bodyTh = {
      trangThai: STATUS.DA_DUYET_LDV,
      nam: this.formData.get('nam').value,
      idQdPdNull: true,
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
        await this.selectRow();
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
      trangThaiList: [STATUS.DA_DUYET_LDV, STATUS.DA_DUYET_LDC, STATUS.DA_TAO_CBV],
      maTongHop: "Chưa tổng hợp",
      nam: this.formData.get('nam').value,
      loaiVthh: this.loaiVthh,
      idQdPdNull: true,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.deXuatPhuongAnCuuTroService.search(bodyDx);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachDeXuat = resToTrinh.data.content;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachDeXuat,
        dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'loại hình nhập xuất'],
        dataColumn: ['soDx', 'tenLoaiVthh', 'loaiNhapXuat']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaDeXuat(data.id);
        await this.selectRow();
      }
    });
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
    if (!quyetDinhPdDtlFormData) {
      quyetDinhPdDtlFormData = this.formData.value.quyetDinhPdDtl.find(s => s.idDx === this.deXuatSelected.idDx);
    }
    quyetDinhPdDtlFormData.quyetDinhPdDx = table;
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
            let thanhTienCuc = v.reduce((prev, cur) => prev + cur.thanhTien, 0);
            let rowCuc = v.find(s => s.tenCuc === k);
            return {
              idVirtual: uuidv4(),
              tenCuc: k,
              soLuongXuatCuc: rowCuc.soLuongXuatCuc,
              soLuongXuatCucThucTe: soLuongXuatCucThucTe,
              tenCloaiVthh: v[0].tenCloaiVthh,
              thanhTienCuc: thanhTienCuc,
              childData: v
            }
          }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        let thanhTien = rs.reduce((prev, cur) => prev + cur.thanhTienCuc, 0);
        return {
          idVirtual: uuidv4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs,
          thanhTien: thanhTien,
        };
      }).value();
    this.phuongAnViewCache = dataViewCache;
    let dataView = chain(this.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
            let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
            let thanhTienCuc = v.reduce((prev, cur) => prev + cur.thanhTien, 0);
            let rowCuc = v.find(s => s.tenCuc === k);
            return {
              idVirtual: uuidv4(),
              tenCuc: k,
              soLuongXuatCuc: rowCuc.soLuongXuatCuc,
              soLuongXuatCucThucTe: soLuongXuatCucThucTe,
              tenCloaiVthh: v[0].tenCloaiVthh,
              thanhTienCuc: thanhTienCuc,
              childData: v
            }
          }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        let thanhTien = rs.reduce((prev, cur) => prev + cur.thanhTienCuc, 0);
        return {
          idVirtual: uuidv4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          childData: rs,
          thanhTien: thanhTien,
        };
      }).value();
    this.phuongAnView = dataView;

    this.expandAll()
    console.log(this.deXuatPhuongAnCache, "deXuatPhuongAnCache");
    if (this.deXuatPhuongAnCache.length !== 0) {
      this.listThanhTienCache = this.deXuatPhuongAnCache.map(s => s.thanhTien);
      this.listSoLuongCache = this.deXuatPhuongAnCache.map(s => s.soLuongXuatChiCuc);
      this.deXuatPhuongAnCache.map(s => this.listSoLuongDxCache = s.soLuongXuat);
    } else {
      this.listThanhTienCache = [0];
      this.listSoLuongCache = [0];
    }

    if (this.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
      this.deXuatPhuongAn.map(s => this.listSoLuongDx = s.soLuongXuat);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
    this.tinhXuatCap();
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

  async xoaPhuongAn(data: any) {
    this.deXuatPhuongAn = [];
    this.deXuatSelected.quyetDinhPdDx = this.deXuatSelected.quyetDinhPdDx.filter(qd => qd.id !== data.id);
    this.deXuatPhuongAn = cloneDeep(this.deXuatSelected.quyetDinhPdDx);
    await this.buildTableView();
    /*if (data.id) {
      this.formData.value.quyetDinhPdDtl.forEach(s => {
        s.quyetDinhPdDx = s.quyetDinhPdDx.filter(qd => qd.id !== data.id);
      });
    } else if (data.idVirtual) {
      this.formData.value.quyetDinhPdDtl.forEach(s => {
        s.quyetDinhPdDx = s.quyetDinhPdDx.filter(qd => qd.idVirtual !== data.idVirtual);
      });
    }
    this.deXuatSelected =
    await this.selectRow();*/
  }

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

  tinhXuatCap() {
    let tongSoLuongXuat = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuat, 0)
    let tongSoLuongXuatThucTe = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuatThucTe, 0)
    if (tongSoLuongXuat > tongSoLuongXuatThucTe) {
      this.slXuatCap = tongSoLuongXuat - tongSoLuongXuatThucTe;
    } else {
      this.slXuatCap = null;
    }
    this.tongSoLuongDxuat = tongSoLuongXuatThucTe;
    this.formData.patchValue({
      soLuongXuaCap: this.slXuatCap,
    })
    let tongSoLuongXuatCache = this.phuongAnViewCache.reduce((prev, cur) => prev + cur.soLuongXuat, 0)
    let tongSoLuongXuatThucTeCache = this.phuongAnViewCache.reduce((prev, cur) => prev + cur.soLuongXuatThucTe, 0)
    if (tongSoLuongXuatCache > tongSoLuongXuatThucTeCache) {
      this.slXuatCapCache = tongSoLuongXuatCache - tongSoLuongXuatThucTeCache;
    } else {
      this.slXuatCapCache = null;
    }

  }

  openDxPaModal(id: number) {
    this.dxPaId = id;
    this.openDxPa = true;
  }
  closeDxPaModal() {
    this.dxPaId = null;
    this.openDxPa = false;
  }

}
