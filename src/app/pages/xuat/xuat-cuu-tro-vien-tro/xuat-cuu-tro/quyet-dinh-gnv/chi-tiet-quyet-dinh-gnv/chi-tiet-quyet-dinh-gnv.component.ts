import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { UserLogin } from "src/app/models/userlogin";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FormGroup, Validators } from "@angular/forms";
import { STATUS } from "src/app/constants/status";
import { MESSAGE } from "src/app/constants/message";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { Base2Component } from "src/app/components/base2/base2.component";
import { v4 as uuidv4 } from "uuid";
import { chain, cloneDeep } from 'lodash';
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import { NzTreeNodeOptions } from "ng-zorro-antd/core/tree";
import { DANH_MUC_LEVEL } from "src/app/pages/luu-kho/luu-kho.constant";
import { NzTreeSelectComponent } from "ng-zorro-antd/tree-select";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { PREVIEW } from 'src/app/constants/fileType';

@Component({
  selector: 'app-chi-tiet-quyet-dinh-gnv',
  templateUrl: './chi-tiet-quyet-dinh-gnv.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-gnv.component.scss']
})
export class ChiTietQuyetDinhGnvComponent extends Base2Component implements OnInit {
  @ViewChild('NzTreeSelectComponent', { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  @Input() isView: boolean;
  @Input() loaiXuat: any;
  formDataDtl: FormGroup;
  modalChiTiet: boolean = false;
  listDiaDanh: any[] = [];
  listDonVi: any[] = [];
  listVatTuHangHoa: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiaDiemKho: any[] = [];
  defaultSelectedKeys: any;
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  userInfo: UserLogin;
  listLoaiHinhNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  isQuyetDinh: boolean = false;
  phuongAnView: any;
  expandSetString = new Set<string>();
  listKieuNhapXuat: any;
  maHauTo: any;
  selectedNode: any;
  templateName: string = "Quyết định giao nhiệm vụ xuất cứu trợ, viện trợ";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBbQd: [, [Validators.required]],
      ngayKy: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      idQdPd: [],
      soQdPd: [, [Validators.required]],
      loaiVthh: [],
      cloaiVthh: [],
      tenVthh: [, [Validators.required]],
      soLuong: [],
      thoiGianGiaoNhan: [],
      trichYeu: [],
      trangThai: [],
      lyDoTuChoi: [],
      trangThaiXh: [],
      soBbHaoDoi: [],
      soBbTinhKho: [],
      tongSoLuong: [],
      thanhTien: [],
      type: [],
      ngayGduyet: [],
      nguoiGduyetId: [],
      ngayPduyet: [],
      nguoiPduyetId: [],
      loaiNhapXuat: [],
      kieuNhapXuat: [],
      mucDichXuat: [],
      tenDvi: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      tenTrangThai: [],
      tenTrangThaiXh: [],
      noiDungCuuTro: [],
      dataDtl: [new Array(), [Validators.required, Validators.minLength(1)]],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
    }
    );

    this.formDataDtl = this.fb.group(
      {
        idVirtual: [''],
        id: [],
        idDx: [],
        idQdPdDtl: [],
        soLuongDx: [],
        soLuongGiao: [],
        loaiNhapXuat: [],
        kieuNhapXuat: [],
        mucDichXuat: [],
        noiDungDx: [],
        loaiVthh: [],
        cloaiVthh: [],
        maDvi: [, [Validators.required]],
        soLuong: [],
        tonKhoDvi: [],
        tonKhoLoaiVthh: [],
        tonKhoCloaiVthh: [],
        donViTinh: [],
        trangThai: [],
        mapVthh: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        mapDmucDvi: [],
        tenDvi: [],
        tenCuc: [],
        tenChiCuc: [],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        edit: [],
        mId: [],
      });

    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({ type: this.loaiXuat });
      this.maHauTo = '/QĐGNV-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsDiaDanh(),
        this.loadDsVthh(),
      ]);
      await this.loadDetail();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail() {
    if (this.idSelected > 0) {
      await this.quyetDinhGiaoNvCuuTroService.getDetail(this.idSelected)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            // res.data.dataDtl.forEach(s => s.idVirtual = uuidv4());
            res.data.dataDtl.forEach(s => s.mId = uuidv4());
            this.formData.patchValue({ ...res.data, trangThaiXh: res.data.trangThaiXh ? res.data.trangThaiXh : STATUS.CHUA_THUC_HIEN });
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        tenDvi: this.userInfo.TEN_DVI,
      });
    }
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

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      // maDviCha: '01010201',
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsDiemKho(maDvi: any, loaiVthh: string, cloaiVthh: string) {
    this.listDiaDiemKho = [];
    if (loaiVthh.startsWith("01") || loaiVthh.startsWith("04")) {
      cloaiVthh = undefined;
    }
    let body = {
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: loaiVthh,
      cloaiVthh: cloaiVthh,
    };
    let res = await this.donViService.getDonViHangTree(body);
    // const body = {
    //   maDvi: this.userInfo.MA_DVI,
    //   listCloaiVthh: [cloaiVthh]
    // }
    // const res = await this.mangLuoiKhoService.dsNganLoKhoTheoCloaiVthh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDiaDiemKho = [...this.listDiaDiemKho, res.data];
      this.listDiaDiemKho[0].expanded = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.loadDanhMucHangHoaAsync();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
      let listLuongThuc = this.listVatTuHangHoa.find(s => s.key == '01');
      let filterLuongThuc = cloneDeep(listLuongThuc.children.filter(s => s.key == '0101' || s.key == '0102'));
      let listVatTu = cloneDeep(this.listVatTuHangHoa.find(s => s.key == '02'));
      let listMuoi = cloneDeep(this.listVatTuHangHoa.find(s => s.key == '04'));
      this.listLoaiHangHoa = [...filterLuongThuc, ...listVatTu.children, ...listMuoi.children];
    }
  }

  async changeLoaiVthh($event) {
    try {
      await this.spinner.show();
      if ($event) {
        this.listChungLoaiHangHoa = [];
        let filter = cloneDeep(this.listLoaiHangHoa.find(s => s.key == $event));
        if (filter.children) {
          this.listChungLoaiHangHoa = filter.children;
        }
        let item = this.listLoaiHangHoa.find(s => s.ma === $event);
        this.formDataDtl.patchValue({
          tenLoaiVthh: item.ten
        })
      }
      if (this.formDataDtl.value.cloaiVthh) {
        let item = this.listChungLoaiHangHoa.find(s => s.ma === this.formDataDtl.value.cloaiVthh);
        if (!item) {
          this.formDataDtl.patchValue({
            cloaiVthh: '',
            tenCloaiVthh: ''
          });
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save() {
    // await this.helperService.ignoreRequiredForm(this.formData);
    this.helperService.markFormGroupTouched(this.formData);
    // this.formData.controls.soQdGnv.setValidators([Validators.required]);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = { ...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo }
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async updateProcess(trangThai: string) {
    this.formData.value.dataDtl.forEach(s => {
      if (s.maDvi.match(this.userInfo.MA_DVI + ".*")) {
        s.trangThai = trangThai;
      }
    });
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.buildTableView();
  }


  async openDialogQdPd() {
    try {
      await this.spinner.show();
      let res;
      if (this.formData.value.type == 'XC') {
        res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDanhSach({
          trangThai: STATUS.BAN_HANH,
          types: ["XC"],
          paggingReq: {
            limit: this.globals.prop.MAX_INTERGER,
            page: 0
          },
        });
      } else {
        res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDanhSach({
          trangThai: STATUS.BAN_HANH,
          types: ['TH', 'TTr'],
          paggingReq: {
            limit: this.globals.prop.MAX_INTERGER,
            page: 0
          },
        });
      }

      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định phê duyệt cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.content,
            dataHeader: ['Số quyết định', 'Ngày phê duyệt', 'Trích yếu'],
            dataColumn: ['soBbQd', 'ngayPduyet', 'trichYeu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            let res = await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(data.id);
            let detail = res.data;
            detail.quyetDinhPdDtl.forEach(s => {
              s.idQdPdDtl = s.id;
              s.soLuongDx = s.soLuong;
              s.soLuong = 0;
              s.mId = uuidv4();
              delete s.id;
            });

            this.formData.patchValue({
              idQdPd: detail.id,
              soQdPd: detail.soBbQd,
              loaiNhapXuat: detail.loaiNhapXuat,
              kieuNhapXuat: detail.kieuNhapXuat,
              tenVthh: detail.tenVthh,
              dataDtl: detail.quyetDinhPdDtl,
              type: detail.type
            })
            await this.buildTableView();
          }
        });
      }
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }

  async buildTableView() {
    this.formData.value.dataDtl.forEach(s => {
      if (s.tenDiemKho) {
        s.tenDiaDiem = (s.tenDiemKho ? s.tenDiemKho + ' - ' : '') +
          (s.tenNhaKho ? s.tenNhaKho + ' - ' : '') +
          (s.tenNganKho ? s.tenNganKho + ' - ' : '') +
          (s.tenLoKho ?? '');
      }
      s.tenHang = s.tenCloaiVthh ? s.tenLoaiVthh + " - " + s.tenCloaiVthh : s.tenLoaiVthh;
    });
    let data = this.formData.value.dataDtl;
    if (this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CHI_CUC || this.userInfo.CAP_DVI == DANH_MUC_LEVEL.CUC) {
      data = this.formData.value.dataDtl.filter(s => s.maDvi.match(this.userInfo.MA_DVI + ".*"));
    };
    this.phuongAnView = chain(data)
      .groupBy("noiDungDx")
      .map((value, key) => {
        let noiDungDxRow = value.find(s => key && s.noiDungDx === key);
        let rs = chain(value)
          .groupBy("tenHang")
          .map((v, k) => {
            let tenLoaiVthhRow = v.find(s => k && s.tenHang === k);
            let rs = chain(v)
              .groupBy("tenChiCuc")
              .map((v1, k1) => {
                let tenChiCucRow = v1.find(s => k1 && s.tenChiCuc === k1);
                if (!tenChiCucRow) return;
                let soLuong = v1.reduce((prev, next) => prev + next.soLuong, 0);
                return {
                  idVirtual: uuidv4(),
                  tenChiCuc: tenChiCucRow.tenChiCuc || '',
                  maDvi: tenChiCucRow.maDvi,
                  soLuongGiao: tenChiCucRow.soLuongGiao || 0,
                  soLuongDx: tenChiCucRow.soLuongDx,
                  soLuong: soLuong,
                  tonKhoDvi: tenChiCucRow.tonKhoDvi || 0,
                  tonKhoCloaiVthh: tenChiCucRow.tonKhoCloaiVthh,
                  tenHang: tenChiCucRow.tenHang,
                  tenTrangThai: tenChiCucRow.tenTrangThai || 'Đang thực hiện',
                  childData: v1.filter(f => !!f.tenDiaDiem),
                  noiDungDx: tenChiCucRow.noiDungDx,
                  loaiVthh: tenChiCucRow.loaiVthh,
                  cloaiVthh: tenChiCucRow.cloaiVthh,
                  tenLoaiVthh: tenChiCucRow.tenLoaiVthh,
                  tenCloaiVthh: tenChiCucRow.tenCloaiVthh,
                  donViTinh: tenChiCucRow.donViTinh,
                  mId: tenChiCucRow.mId
                }
              }).value().filter(f => !!f);
            if (!tenLoaiVthhRow || !k) return;
            let soLuong = rs.reduce((prev, next) => prev + next.soLuong, 0);
            let soLuongGiao = rs.reduce((prev, next) => prev + next.soLuongGiao, 0);
            return {
              idVirtual: uuidv4(),
              tenHang: k,
              noiDungDx: tenLoaiVthhRow.noiDungDx,
              loaiVthh: tenLoaiVthhRow.loaiVthh || '',
              tenLoaiVthh: tenLoaiVthhRow.tenLoaiVthh || '',
              cloaiVthh: tenLoaiVthhRow.cloaiVthh || '',
              tenCloaiVthh: tenLoaiVthhRow.tenCloaiVthh || '',
              tonKhoLoaiVthh: tenLoaiVthhRow.tonKhoLoaiVthh || 0,
              soLuongGiao: soLuongGiao,
              soLuongDx: tenLoaiVthhRow.soLuongDx || 0,
              soLuong: soLuong,
              donViTinh: tenLoaiVthhRow.donViTinh || '',
              childData: rs,
              mId: tenLoaiVthhRow.mId,
            }
          }).value().filter(f => !!f);
        if (!noiDungDxRow) return;
        const soLuong = rs.reduce((sum, cur) => sum += cur.soLuong, 0);
        const soLuongDx = rs.reduce((sum, cur) => sum += cur.soLuongDx, 0);
        return {
          idVirtual: uuidv4(),
          noiDungDx: key,
          soLuong,
          soLuongDx: soLuongDx,
          childData: rs,
          mId: noiDungDxRow.mId
        };
      }).value().filter(f => !!f);
    this.expandAll();
  }

  expandAll() {
    this.phuongAnView.forEach(s => {
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

  async themPhuongAn(data?: any, level?: any, editRow?: boolean) {
    this.formDataDtl.reset();
    if (data) {
      let edit = editRow;
      if (level == 1) {
        // let baseData = data.childData[0].childData[0];
        // if (!data.childData[0].tenChiCuc) {
        //   edit = true
        // }
        if (data.childData.length < 1) {
          edit = true
        }
        this.formDataDtl.patchValue({
          noiDungDx: data.noiDungDx,
          tenHang: data.tenHang,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          soLuongDx: data.soLuongDx,
          tonKhoDvi: data.tonKhoDvi,
          donViTinh: data.donViTinh,
          idQdPdDtl: data.idQdPdDtl,
          edit,
          mId: edit ? data.mId : uuidv4()
        });
      } else if (level == 2) {
        if (edit) {
          this.formDataDtl.patchValue({
            noiDungDx: data.noiDungDx,
            loaiVthh: data.loaiVthh,
            tenHang: data.tenHang,
            cloaiVthh: data.cloaiVthh,
            soLuongDx: data.soLuongDx,
            tonKhoDvi: data.tonKhoDvi,
            donViTinh: data.donViTinh,
            tenChiCuc: data.tenChiCuc,
            soLuongGiao: data.soLuongGiao,
            maDvi: data.maDvi,
            idQdPdDtl: data.idQdPdDtl,
            edit,
            mId: edit ? data.mId : uuidv4()
          });
          this.kiemTraTonKho();
        } else {

          // let baseData = data.childData[0];
          // if (!data.childData[0].tenDiaDiem) {
          //   edit = true
          // }
          if (data.childData.length < 1) {
            edit = true
          }
          this.formDataDtl.patchValue({
            noiDungDx: data.noiDungDx,
            tenHang: data.tenHang,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            soLuongDx: data.soLuongDx,
            tonKhoDvi: data.tonKhoDvi,
            donViTinh: data.donViTinh,
            tenChiCuc: data.tenChiCuc,
            soLuongGiao: data.soLuongGiao,
            idQdPdDtl: data.idQdPdDtl,
            edit,
            mId: edit ? data.mId : uuidv4()
          });
        }
      } else if (level === 3) {
        this.formDataDtl.patchValue({
          noiDungDx: data.noiDungDx,
          loaiVthh: data.loaiVthh,
          tenHang: data.tenHang,
          cloaiVthh: data.cloaiVthh,
          soLuongDx: data.soLuongDx,
          tonKhoDvi: data.tonKhoDvi,
          donViTinh: data.donViTinh,
          tenChiCuc: data.tenChiCuc,
          soLuongGiao: data.soLuongGiao,
          idQdPdDtl: data.idQdPdDtl,
          soLuong: data.soLuong,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
          maDvi: data.maDvi,
          edit,
          mId: edit ? data.mId : uuidv4()
        });
        this.selectedNode = data.maDvi;
        this.kiemTraTonKho();
      }
    }
    this.listDonVi.forEach(s => {
      // s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi.match("^" + s.maDvi)) && !(s.maDvi === data.maDvi && editRow);
      s.disable = this.formData.value.dataDtl.some(s1 => s1.maDvi === s.maDvi && s1.noiDungDx === data.noiDungDx && s1.tenHang === data.tenHang) && !(s.maDvi === data.maDvi && editRow);

    })
    await this.changeLoaiVthh(this.formDataDtl.value.loaiVthh);
    await this.loadDsDiemKho(this.userInfo.MA_DVI, this.formDataDtl.value.loaiVthh, this.formDataDtl.value.cloaiVthh);
    this.modalChiTiet = true;
  }

  async luuPhuongAn() {
    await this.helperService.markFormGroupTouched(this.formDataDtl);
    if (this.formDataDtl.invalid) {
      return;
    }
    let row = this.formDataDtl.value;
    row.tenChiCuc = row.tenChiCuc || this.listDonVi.find(s => s.maDvi == row.maDvi)?.tenDvi;
    row.tenCloaiVthh = row.tenCloaiVthh || this.listChungLoaiHangHoa.find(s => s.ma == row.cloaiVthh)?.ten;
    // if (!row.idVirtual) {
    //   row.idVirtual = uuidv4();
    //   if (row.edit) {
    //     this.formData.value.dataDtl[0] = row;
    //   } else {
    //     this.formData.value.dataDtl = [...this.formData.value.dataDtl, row]
    //   }
    // }
    const dataDtl = this.formData.value.dataDtl;
    if (row.edit) {
      const findIndex = dataDtl.findIndex(f => f.mId === row.mId);
      if (findIndex >= 0) {
        dataDtl[findIndex] = { ...dataDtl[findIndex], ...row };
      }
    } else {
      dataDtl.push(row);
    };
    this.formData.patchValue({ dataDtl })
    await this.buildTableView();
    await this.huyPhuongAn();
  }

  async huyPhuongAn() {
    this.formDataDtl.reset();
    this.modalChiTiet = false;
    this.selectedNode = null; // Clear the selected node
  }

  async xoaPhuongAn(data: any, parent?: any, lv?: any) {
    // if (lv == 2) {
    //   this.formData.value.dataDtl = this.formData.value.dataDtl.filter!(s => s.noiDungDx == data.noiDungDx && s.tenHang == data.tenHang && s.tenChiCuc == data.tenChiCuc);
    //   if (parent.childData.length == 1) {
    //     let baseData = data.childData[0];
    //     let dataTmp = {
    //       noiDungDx: baseData.noiDungDx,
    //       loaiVthh: baseData.loaiVthh,
    //       cloaiVthh: baseData.cloaiVthh,
    //       soLuongDx: baseData.soLuongDx,
    //       tonKhoDvi: baseData.tonKhoDvi,
    //       donViTinh: baseData.donViTinh,
    //     };
    //     this.formData.value.dataDtl = [...this.formData.value.dataDtl, dataTmp]
    //   }
    // } else if (lv == 3) {
    //   this.formData.value.dataDtl = this.formData.value.dataDtl.filter(s => s.mId != data.mId);
    //   if (parent.childData.length == 1) {
    //     data.soLuong = null;
    //     data.maDvi = data.maDvi.substring(0, 8);
    //     data.tenDiemKho = '';
    //     data.tenNhaKho = '';
    //     data.tenNganKho = '';
    //     data.tenLoKho = '';
    //     data.cloaiVthh = '';
    //     data.tenCloaiVthh = '';
    //     this.formData.value.dataDtl = [...this.formData.value.dataDtl, data]
    //   }
    // }
    if (parent.childData.length > 1) {
      const findIndex = this.formData.value.dataDtl.findIndex(f => f.mId === data.mId);
      if (findIndex >= 0) {
        this.formData.value.dataDtl.splice(findIndex, 1)
      }
    }
    else if (parent.childData.length == 1 && lv === 2) {
      this.formData.value.dataDtl = this.formData.value.dataDtl.map(s => {
        if (s.mId === data.mId) {
          s.tenChiCuc = '';
          s.soLuongGiao = 0;
          s.maDvi = '';
        }
        return s
      });
    } else if (parent.childData.length == 1 && lv === 3) {
      this.formData.value.dataDtl = this.formData.value.dataDtl.map(s => {
        if (s.mId === data.mId) {
          s.soLuong = null;
          s.maDvi = data.maDvi.substring(0, 8);
          s.tenDiemKho = '';
          s.tenNhaKho = '';
          s.tenNganKho = '';
          s.tenLoKho = '';
          s.tenDiaDiem = '';
        }
        return s
      });
    }
    await this.buildTableView();
  }
  updateTonKhoDvi(slTonKho: number, maDvi) {
    const tongSlPhanBo = this.formData.value.dataDtl.reduce((sum, cur) => {
      if (cur.maDvi === maDvi) {
        sum += cur.soLuong;
        return sum;
      }
    }, 0);
    return slTonKho - tongSlPhanBo
  }

  selectDiaDiem(node: NzTreeNodeOptions) {
    if (node.isLeaf) {
      let current = node.origin;
      //chon lo
      let diemKhoNode = this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 10));
      let nhaKhoNode = this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 12));
      if (node.level == 4) {
        let nganKhoNode = this.nzTreeSelectComponent.getTreeNodeByKey(current.maDvi.substring(0, 14));
        this.formDataDtl.patchValue({
          maDvi: current.maDvi,
          tenDiemKho: diemKhoNode.origin.tenDvi,
          tenNhaKho: nhaKhoNode.origin.tenDvi,
          tenNganKho: nganKhoNode.origin.tenDvi,
          tenLoKho: current.tenDvi,
          cloaiVthh: current.cloaiVthh,
          tenCloaiVthh: current.tenCloaiVthh
        });
      }
      //chon ngan
      else if (node.level == 3) {
        this.formDataDtl.patchValue({
          maDvi: current.maDvi,
          tenDiemKho: diemKhoNode.origin.tenDvi,
          tenNhaKho: nhaKhoNode.origin.tenDvi,
          tenNganKho: current.tenDvi,
          cloaiVthh: current.cloaiVthh,
          tenCloaiVthh: current.tencLoaiVthh
        });
      }
      this.kiemTraTonKho();
    } else {
      node.isSelectable = false;
      node.isExpanded = !node.isExpanded;
    }
  }

  async kiemTraTonKho() {
    let maDvi = this.formDataDtl.value.maDvi;
    let loaiVthh = this.formDataDtl.value.loaiVthh;
    let cloaiVthh = this.formDataDtl.value.cloaiVthh;
    let soLuongGiao = this.formDataDtl.value.soLuongGiao;
    let soLuongDx = this.formDataDtl.value.soLuongDx;
    if (maDvi) {
      // await this.quanLyHangTrongKhoService.getTrangThaiHt({
      //   maDvi: maDvi,
      //   loaiVthh: loaiVthh,
      //   cloaiVthh: cloaiVthh ?? null
      // }).then((res) => {
      //   if (res.msg == MESSAGE.SUCCESS) {
      //     let data = res.data;
      //     if (data.length > 0) {
      //       // if (loaiVthh == '0101' || loaiVthh == '0102') {
      //       //   this.formDataDtl.patchValue({
      //       //     cloaiVthh: data[0].cloaiVthh,
      //       //     // tonKhoCloaiVthh:data[0].slHienThoi
      //       //   });
      //       // }
      //       let tonKhoDvi = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
      //       let dataCloai = data.filter(s => s.cloaiVthh == cloaiVthh);
      //       if (dataCloai.length == 0) {
      //         dataCloai = data;
      //       }
      //       let tonKhoCloaiVthh = dataCloai.reduce((prev, cur) => prev + cur.slHienThoi, 0);
      //       this.formDataDtl.patchValue({
      //         tonKhoDvi: tonKhoDvi,
      //         tonKhoCloaiVthh: tonKhoCloaiVthh
      //       });
      //       if (this.userService.isCuc()) {
      //         cloaiVthh ? this.formDataDtl.controls['soLuongGiao'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongDx, tonKhoCloaiVthh))]) :
      //           this.formDataDtl.controls['soLuongGiao'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongDx, tonKhoDvi))]);
      //         this.formDataDtl.controls['soLuongGiao'].updateValueAndValidity();
      //       }
      //       if (this.userService.isChiCuc()) {
      //         cloaiVthh ?
      //           this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, tonKhoCloaiVthh))]) :
      //           this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, tonKhoDvi))]);
      //         this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      //       }
      //     } else {
      //       this.formDataDtl.patchValue({ tonKhoDvi: 0, tonKhoCloaiVthh: 0 });
      //     }
      //   }
      // });
      const body = {
        maDvi, loaiVthh, cloaiVthh

      }
      let tonKhoDvi: number = 0;
      let tonKhoCloaiVthh: number = 0;
      const res = await this.mangLuoiKhoService.slTon(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const slTon = res.data;
        tonKhoDvi = slTon;
        tonKhoCloaiVthh = slTon;
        this.formDataDtl.patchValue({
          tonKhoDvi: slTon,
          tonKhoCloaiVthh: slTon
        })
        if (this.userService.isCuc()) {
          cloaiVthh ? this.formDataDtl.controls['soLuongGiao'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongDx, tonKhoCloaiVthh))]) :
            this.formDataDtl.controls['soLuongGiao'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongDx, tonKhoDvi))]);
          this.formDataDtl.controls['soLuongGiao'].updateValueAndValidity();
        }
        if (this.userService.isChiCuc()) {
          cloaiVthh ?
            this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, tonKhoCloaiVthh))]) :
            this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, tonKhoDvi))]);
          this.formDataDtl.controls['soLuong'].updateValueAndValidity();
        }
      }
      else {
        this.formDataDtl.patchValue({
          tonKhoDvi: 0,
          tonKhoCloaiVthh: 0
        });
        cloaiVthh ?
          this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, 0))]) :
          this.formDataDtl.controls['soLuong'].setValidators([Validators.required, Validators.min(1), Validators.max(Math.min(soLuongGiao, 0))]);
        this.formDataDtl.controls['soLuong'].updateValueAndValidity();
      }
    }
  }
  isVthhGao() {
    if (this.formData.value.tenVthh === "Gạo tẻ") {
      return true
    }
    return false
  }
  isVthhVatuThietBi() {
    if (this.formData.value.tenVthh === "Vật tư thiết bị") {
      return true
    }
    return false
  }
  showAction(): boolean {
    if (this.userService.isCuc() && this.formData.value.trangThai === STATUS.DU_THAO && !this.isView) {
      return true;
    }
    else if (this.userService.isChiCuc() && [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN].includes(this.formData.value.trangThaiXh)) {
      return true;
    }
    return false
  }
  async xemTruocPd(id: number) {
    await this.service.preview({
      id: id,
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }
}
