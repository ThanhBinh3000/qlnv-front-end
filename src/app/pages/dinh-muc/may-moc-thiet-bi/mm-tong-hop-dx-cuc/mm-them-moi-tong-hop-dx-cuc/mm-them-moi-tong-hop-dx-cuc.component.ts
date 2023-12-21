import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import { saveAs } from 'file-saver';
import { MESSAGE } from "../../../../../constants/message";
import { STATUS } from "../../../../../constants/status";
import {
  MmThongTinNcChiCuc
} from "../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import { MmDxChiCucService } from "../../../../../services/mm-dx-chi-cuc.service";

@Component({
  selector: 'app-mm-them-moi-tong-hop-dx-cuc',
  templateUrl: './mm-them-moi-tong-hop-dx-cuc.component.html',
  styleUrls: ['./mm-them-moi-tong-hop-dx-cuc.component.scss']
})
export class MmThemMoiTongHopDxCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listDxCuc: any[] = [];
  listDxCucList: any[] = [];
  detailCtieuKh: any
  isTongHop: boolean = false;
  rowItem: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  dataEdit: { [key: string]: { edit: boolean; data: MmThongTinNcChiCuc } } = {};
  expandSet = new Set<number>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year')],
      ngayDx: [],
      ngayDxTu: [null],
      ngayDxDen: [null],
      listSoCv: [null],
      klLtBaoQuan: [null],
      klLtNhap: [null],
      klLtXuat: [null],
      klLtBaoQuanCuc: [0],
      slGaoDangBaoQuan: [0],
      slThocDangBaoQuan: [0],
      slGaoXuat: [0],
      slThocXuat: [0],
      slGaoNhap: [0],
      slThocNhap: [0],
      klLtNhapCuc: [null],
      klLtXuatCuc: [null],
      trichYeu: [null, Validators.required],
      ngayKy: [null],
      ngayTongHopNgayTrinh:[null, Validators.required],
      soToTrinh:[null, Validators.required],
      soQdGiaoCt: [null],
      trangThai: ['78'],
      trangThaiTh: [],
      tenTrangThai: ['Đang nhập dữ liệu'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadDsDxCc(this.formData.value.namKeHoach);
      // await this.getCtieuKhTc(this.formData.value.namKeHoach);
      if (this.id > 0) {
        await this.detail(this.id);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getCtieuKhTc(event) {
    let res = await this.dxChiCucService.getCtieuKhTc({
      namKeHoach: event
    });
    if (res.data) {
      this.formData.patchValue({
        soQdGiaoCt: res.data.soQuyetDinh
      })
      this.detailCtieuKh = res.data;
    }
    this.loadDsDxCc(event);
  }

  async tongHop() {
    let body = this.formData.value;
    if (!body.listSoCv || body.listSoCv.length == 0) {
      let arr = [];
      if (this.listDxCuc && this.listDxCuc.length > 0) {
        this.listDxCuc.forEach(item => {
          arr.push(item.soCv);
        })
      }
      body.listSoCv = arr.toString();
    } else {
      const foundObjects = this.listDxCuc.filter(obj => body.listSoCv.includes(obj.id));
      const soDeXuats = foundObjects.map(obj => obj.soCv);
      body.listSoCv = soDeXuats.toString();
    }
    body.ngayDxTu = body.ngayDx ? body.ngayDx[0] : null;
    body.ngayDxDen = body.ngayDx ? body.ngayDx[1] : null;
    body.trangThai = STATUS.DA_DUYET_CBV;
    body.trangThaiTh = STATUS.CHUA_TONG_HOP;
    body.maDvi = this.userInfo.MA_DVI;
    let res = await this.dxChiCucService.tongHopDxCc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data;
      if (detail && detail.listQlDinhMucDxTbmmTbcdDtl) {
        this.formData.patchValue({
          ngayDxTu: body.ngayDx ? body.ngayDx[0] : null,
          ngayDxDen: body.ngayDx ? body.ngayDx[1] : null,
          slGaoDangBaoQuan: detail.slGaoDangBaoQuan,
          slThocDangBaoQuan: detail.slThocDangBaoQuan,
          slGaoNhap: detail.slGaoNhap,
          slGaoXuat: detail.slGaoXuat,
          slThocNhap: detail.slThocNhap,
          slThocXuat: detail.slThocXuat,
        })
        this.dataTable = detail.listQlDinhMucDxTbmmTbcdDtl
        if (detail && detail.listQlDinhMucDxTbmmTbcd && detail.listQlDinhMucDxTbmmTbcd.length > 0) {
          this.listDxCuc = [];
          this.listDxCuc = detail.listQlDinhMucDxTbmmTbcd.map(item => item.maDvi)
          // await this.changeSoQdGiaoCt()
          // await this.getDinhMuc()
        }
        this.dataTable.forEach(item => {
          this.loadSlThuaThieu(item)
          let arr = detail.listQlDinhMucDxTbmmTbcd;
          if (arr && arr.length > 0) {
            arr.forEach(dtl => {
              if (dtl.id == item.dxTbmmTbcdId) {
                item.maDvi = dtl.maDvi
              }
            })
          }
          item.id = null;
          item.ghiChu = null;
          idVirtual: uuidv4();
        })
        this.convertListData();
      }
      this.isTongHop = true;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
      return;
    }
  }

  async loadDsDxCc(namKh) {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "2",
        "namKeHoach": namKh,
        "trangThaiTh" : "24",
        "paggingReq": {
          "limit": 10,
          "page": 0
        }
      }
      let res = await this.dxChiCucService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.formData.patchValue({
          listSoCv : []
        })
        let data = res.data;
        this.listDxCuc = data.content;
        if (this.listDxCuc) {
          this.listDxCuc = this.listDxCuc.filter(item => item.trangThai == this.STATUS.DA_DUYET_CBV)
          this.listDxCucList = [...this.listDxCuc];
        }
      } else {
        this.listDxCuc = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (!this.validateSlTc()) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập số lượng của TC')
      this.spinner.hide();
      return;
    }
    this.conVertTreToList();
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let body = this.formData.value;
    body.listSoCv = this.listDxCucList
      .filter(obj => body.listSoCv.includes(obj.id))
      .map(obj => ({ soDeXuat: obj.soCv, deXuatId: obj.id }));
    let data = await this.createUpdate(body);
    if (data) {
      this.goBack()
    }
    else {
      this.convertListData()
    }
  }

  validateSlTc(): boolean {
    let flag = true;
    if (this.dataTable && this.dataTable.length > 0)
      this.dataTable.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            if (!data.soLuongTc || data.soLuongTc == 0) {
              flag = false;
            }
          })
        }
      })
    return flag;
  }


  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.dxChiCucService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.isTongHop = true;
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          let ngayDx = [];
          ngayDx[0] = res.data.ngayDxTu
          ngayDx[1] = res.data.ngayDxDen;
          this.listDxCuc = [...data.listSoCv].map(item => ({id:item.deXuatId, soCv:item.soDeXuat }));
          this.listDxCucList = [...data.listSoCv].map(item => ({id:item.deXuatId, soCv:item.soDeXuat }));
          this.formData.patchValue({
            ngayDx: ngayDx,
            listSoCv: data.listSoCv.map(obj => obj.deXuatId)
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          this.dataTable.forEach(item => {
            this.loadSlThuaThieu(item)
          })
          this.convertListData()
          this.expandAll();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DANG_NHAP_DU_LIEU:
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.DA_DUYET_LDTC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenTaiSan').map((value, key) => ({
        tenTaiSan: key,
        dataChild: value,
        idVirtual: uuidv4(),
      })
      ).value()
    }
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        if (item && item.dataChild && item.dataChild.length > 0) {
          item.dataChild.forEach(data => {
            item.donViTinh = data.donViTinh
            item.donGiaTd = data.donGiaTd
          })
        }
      })
    }
    this.expandAll();
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          data.thanhTienNc = data.donGiaTd * data.soLuong
          arr.push(data)
        })
      }
    })
    this.dataTable = arr
    console.log(this.dataTable)
  }

  sumSoLuong(data: any, type: string) {
    let sl = 0;
    let slTc = 0;
    if (data && data.dataChild && data.dataChild.length > 0) {
      data.dataChild.forEach(item => {
        sl = sl + item.soLuong
        slTc = slTc + item.soLuongTc
      })
    }
    if (type == 'tong') {
      return slTc
    } else {
      return sl
    }
  }

  async loadSlThuaThieu(item: MmThongTinNcChiCuc) {
    /// tong cuc
    if ((item.slTieuChuanTc - item.slNhapThem - item.slHienCo) >= 0) {
      item.chenhLechThieuTc = item.slTieuChuanTc - item.slNhapThem - item.slHienCo
    } else {
      item.chenhLechThieu = 0
    }
    if ((item.slNhapThem + item.slHienCo - item.slTieuChuanTc) >= 0) {
      item.chenhLechThuaTc = item.slNhapThem + item.slHienCo - item.slTieuChuanTc
    } else {
      item.chenhLechThuaTc = 0
    }
    //// cuc
    if ((item.slTieuChuan - item.slNhapThem - item.slHienCo) >= 0) {
      item.chenhLechThieu = item.slTieuChuan - item.slNhapThem - item.slHienCo
    } else {
      item.chenhLechThieu = 0
    }
    if ((item.slNhapThem + item.slHienCo - item.slTieuChuan) >= 0) {
      item.chenhLechThua = item.slNhapThem + item.slHienCo - item.slTieuChuan
    } else {
      item.chenhLechThua = 0
    }
  }

  disableForm() {
    let check = false;
    if (this.isView) {
      check = true
    } else {
      if (this.id > 0) {
        check = true
      } else {
        check = false;
      }
    }
    return check;
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    })
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  // changeSoQdGiaoCt() {
  //   let ctieuKhNhap = 0
  //   let ctieuKhXuat = 0
  //   let ctieuTkdn = 0
  //   let ctieuKhBq = 0
  //   if (this.detailCtieuKh) {
  //     if (this.detailCtieuKh.khLuongThuc && this.detailCtieuKh.khLuongThuc.length > 0) {
  //       let listLt = this.detailCtieuKh.khLuongThuc.filter(item => this.listDxCuc.includes(item.maDonVi))
  //       if (listLt && listLt.length > 0) {
  //         let detailLt = listLt[0]
  //         ctieuKhNhap = detailLt.ntnTongSoQuyThoc ? detailLt.ntnTongSoQuyThoc : 0
  //         ctieuKhXuat = detailLt.xtnTongSoQuyThoc ? detailLt.xtnTongSoQuyThoc : 0
  //         ctieuTkdn = detailLt.tkdnTongSoQuyThoc ? detailLt.tkdnTongSoQuyThoc : 0
  //         ctieuKhBq = ctieuTkdn + ctieuKhNhap - ctieuKhXuat
  //       }
  //     }
  //   }
  //   this.formData.patchValue({
  //     klLtBaoQuan: ctieuKhBq,
  //     klLtNhap: ctieuKhNhap,
  //     klLtXuat: ctieuKhXuat,
  //   })
  // }

  // async getDinhMuc() {
  //   if (this.dataTable && this.dataTable.length > 0) {
  //     for (const item of this.dataTable) {
  //       let body = {
  //         maHangHoa: item.maTaiSan
  //       }
  //       let res = await this.dxChiCucService.getDinhMuc(body);
  //       if (res.data) {
  //         let detail = res.data;
  //         let tongKl = 0;
  //         let listLoaiHinh = detail.loaiHinh.split(",")
  //         if (listLoaiHinh && listLoaiHinh.length > 0) {
  //           if (listLoaiHinh.includes("00")) {
  //             tongKl = tongKl + this.formData.value.klLtNhap
  //           }
  //           if (listLoaiHinh.includes("01")) {
  //             tongKl = tongKl + this.formData.value.klLtXuat
  //           }
  //           if (listLoaiHinh.includes("02")) {
  //             tongKl = tongKl + this.formData.value.klLtBaoQuan
  //           }
  //         }
  //         item.slTieuChuanTc = tongKl * detail.slChiCuc / detail.klChiCuc
  //       }
  //     }
  //   }
  // }

  exportDataDetail() {
    if (this.dataTable.length > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.dxChiCucService
          .exportDetail(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tiet-tong-hop-nhu-cau-mmtb-va-ccdc.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }
}
