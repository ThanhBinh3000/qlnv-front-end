import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './../../../../../services/storage.service';
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from './../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service';
import {
  DeXuatPhuongAnCuuTroService
} from './../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service';
import {
  TongHopPhuongAnCuuTroService
} from './../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service';
import {STATUS} from 'src/app/constants/status';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {chain} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {DonviService} from 'src/app/services/donvi.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';

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
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() idTongHop: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
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
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({
        id: [],
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
        ngayDx: [, [Validators.required]],
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
        ngayPduyet: [],
        fileDinhKem: [FileDinhKem],
        canCu: [new Array<FileDinhKem>()],
        tenDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự thảo'],
        quyetDinhPdDtl: [new Array<QuyetDinhPdDtl>(),],
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
      }
      await Promise.all([
        this.bindingDataTongHop(this.dataTongHop),
        this.loadDsDonVi(),
      ]);
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
      if (data.type == 'TH') {
        await this.selectMaTongHop(data.idTongHop);
      } else {
      }
      this.formData.patchValue(data);
      this.formData.patchValue({
        soQd: data.soQd?.split('/')[0]
      })
      this.fileDinhKem = data.fileDinhKem;
      await this.buildTableView();
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
        let listDeXuat = await Promise.all(data.deXuatCuuTro.map(async item => {
          let res1 = await this.deXuatPhuongAnCuuTroService.getDetail(item.idDx);
          if (res1.msg === MESSAGE.SUCCESS) {
            return Object.assign(item, {quyetDinhPdDx: res1.data.deXuatPhuongAn});
          } else {
            console.log(MESSAGE.ERROR, res1.msg);
          }
        }));
        //truong hop tao moi
        if (!this.idInput) {
          console.log("hahaha")
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
        this.quyetDinhPdDtlCache = Object.assign(this.quyetDinhPdDtlCache, listDeXuat);
        this.deXuatSelected = this.formData.value.quyetDinhPdDtl[0];
        console.log(this.formData.value, 28282);
        await this.selectRow();
        // this.dataInput = null;
        // this.dataInputCache = null;
        this.summaryData();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
    body.fileDinhKems = this.fileDinhKem;
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
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Văn bản sẵn sàng ban hành ?'
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

  async openDialogTh() {
    if (this.formData.get('type').value != 'TH') {
      return;
    }
    await this.spinner.show();
    let bodyTh = {
      trangThai: STATUS.DA_DUYET_LDV,
      nam: this.formData.get('nam').value,
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
      trangThaiList: [STATUS.DA_DUYET_LDV, STATUS.DA_DUYET_LDC],
      maTongHop: "Chưa tổng hợp",
      nam: this.formData.get('nam').value,
      loaiVthh: this.loaiVthh,
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
        await this.onChangeIdTrHdr(data);
        this.tongSoLuongDxuat = data.tongSoLuong;
        this.tongThanhTienDxuat = data.thanhTien;
      }
    });
  }

  async onChangeIdTrHdr(data) {
    /*await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.deXuatPhuongAnCuuTroService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        dataRes.idDxHdr = dataRes.id;
        this.danhsachDx.push(dataRes);
        this.danhsachDx.forEach(item => {
          item.tenDviDx = item.tenDvi;
          item.ngayPduyetDx = item.ngayPduyet;
          item.trichYeuDx = item.trichYeu;
          item.tongSoLuongDx = item.tongSoLuong;
          item.thanhTienDx = item.thanhthanhTienTienDx
        })
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          loaiNhapXuat: data.loaiNhapXuat,
          idTongHop: null,
          maTongHop: null,
          tongSoLuongDx: data.tongSoLuong,
          soLuongXuaCap: data.soLuongXuatCap,
          idDx: data.id,
          soDx: data.soDx,
          quyetDinhPdDtl: data
        })
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();*/
  }


  async selectHangHoa(event: any) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
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

    this.deXuatPhuongAn = table

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

    console.log(this.formData.value.quyetDinhPdDtl, 11111);
    await this.spinner.show();
    if (item) {
      this.deXuatSelected = item;
    }
    this.formData.value.quyetDinhPdDtl.forEach(i => {
      i.selected = false
    });
    this.deXuatSelected.selected = true;
    console.log(this.deXuatSelected, 222222)
    let dataEdit = this.formData.value.quyetDinhPdDtl.find(s => s.idDx === this.deXuatSelected.idDx);
    let dataCache = this.quyetDinhPdDtlCache.find(s => s.idDx !== this.deXuatSelected.idDx);
    dataEdit.quyetDinhPdDx.forEach(s => s.idVirtual = uuidv4());
    dataCache.quyetDinhPdDx.forEach(s => s.idVirtual = uuidv4());
    Object.assign(this.deXuatPhuongAn, dataEdit.quyetDinhPdDx);
    Object.assign(this.deXuatPhuongAnCache, dataCache.quyetDinhPdDx);
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
          .map((v, k) => ({
              idVirtual: uuidv4(),
              tenCuc: k,
              // soLuongGiao: v[0].soLuongGiao,
              // tenCloaiVthh: v[0].tenCloaiVthh,
              childData: v
            })
          ).value();
        return {idVirtual: uuidv4(), noiDung: key, childData: rs};
      }).value();
    this.phuongAnViewCache = dataViewCache;
    //
    console.log(this.deXuatPhuongAn, "this.deXuatPhuongAn")
    let dataView = chain(this.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => ({
              idVirtual: uuidv4(),
              tenCuc: k,
              // soLuongGiao: v[0].soLuongGiao,
              // tenCloaiVthh: v[0].tenCloaiVthh,
              childData: v
            })
          ).value();
        return {idVirtual: uuidv4(), noiDung: key, childData: rs};
      }).value();
    this.phuongAnView = dataView;
    this.expandAll()
    if (this.deXuatPhuongAnCache.length !== 0) {
      this.listThanhTienCache = this.deXuatPhuongAnCache.map(s => s.thanhTien);
      this.listSoLuongCache = this.deXuatPhuongAnCache.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTienCache = [0];
      this.listSoLuongCache = [0];
    }

    if (this.deXuatPhuongAn.length !== 0) {
      this.listThanhTien = this.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
    }
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
    Object.assign(this.deXuatPhuongAn, this.deXuatSelected.quyetDinhPdDx);
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

}
