import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain, cloneDeep} from "lodash";
import * as uuid from "uuid";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {CHUC_NANG, STATUS} from "../../../../../../constants/status";
import {StorageService} from "../../../../../../services/storage.service";
import {
  PhieuXuatNhapKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service";
import {Validators} from "@angular/forms";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {FILETYPE} from "../../../../../../constants/fileType";
import {
  QuyetDinhXuatGiamVtBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QuyetDinhXuatGiamVtBaoHanh.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  BaoCaoKdmVtTbTrongThoiGianBaoHanh
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BaoCaoKdmVtTbTrongThoiGianBaoHanh.service";
import {DonviService} from "../../../../../../services/donvi.service";


@Component({
  selector: 'app-thong-tin-quyet-dinh-xuat-giam-vat-tu-bao-hanh',
  templateUrl: './thong-tin-quyet-dinh-xuat-giam-vat-tu-bao-hanh.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-xuat-giam-vat-tu-bao-hanh.component.scss']
})
export class ThongTinQuyetDinhXuatGiamVatTuBaoHanhComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listSoBaoCao: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  checked: boolean = false;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  listPhieuXuatKho: any[] = [];
  listLoaiHinhNhapXuat: any[] = [
    {value: 'XUAT_GIAM', label: "Xuất mẫu bị hủy khỏi kho"},
  ]
  dataThTree: any[] = [];
  expandSetString = new Set<string>();
  LIST_DANH_GIA: any[] = [
    {value: 0, label: "Không đạt"},
    {value: 1, label: "Đạt"}
  ]
  maQd: string;
  dviNhan: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private quyetDinhXuatGiamVtBaoHanhService: QuyetDinhXuatGiamVtBaoHanhService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private baoCaoKdmVtTbTrongThoiGianBaoHanh: BaoCaoKdmVtTbTrongThoiGianBaoHanh,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhXuatGiamVtBaoHanhService);
    this.formData = this.fb.group({
      id: [],
      tenDvi: [null, [Validators.required]],
      namKeHoach: [dayjs().get("year")],
      maDvi: [null, [Validators.required]],
      maDviNhan: [],
      tenTrangThai: ['Dự Thảo'],
      trangThai: [STATUS.DU_THAO],
      tenDviNhan: [],
      soQuyetDinh: [],
      loai: ["XUAT_GIAM"],
      trichYeu: [],
      soCanCu: [null, [Validators.required]],
      idCanCu: [null, [Validators.required]],
      ngayKy: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      thoiHanXuatGiam: [],
      listSoQdGiaoNvXh: [],
      listIdQdGiaoNvXh: [],
      qdXuatGiamVtDtl: [new Array()],
      fileDinhKems: [new Array()],
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.maQd = "/" + this.userInfo.MA_QD
      await Promise.all([
        this.loadDsCuc()
      ])
      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhXuatGiamVtBaoHanhService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            if (dataDetail) {
              this.formData.patchValue({
                soQuyetDinh: dataDetail.soQuyetDinh?.split('/')[0],
              })
              this.listFile = dataDetail.fileDinhKems;
              if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
                dataDetail.fileDinhKems.forEach(item => {
                  if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                    this.listFileDinhKem.push(item)
                  } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                    this.listCcPhapLy.push(item)
                  }
                })
              }
              this.dataTable = cloneDeep(dataDetail.qdXuatGiamVtDtl);
              this.buildTableView(this.dataTable);
            }

          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
    }
  }


  async save(isGuiDuyet?) {
    let body = this.formData.value;
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    this.formData.value.soQuyetDinh = this.formData.value.soQuyetDinh + this.maQd;
    if (!body.qdXuatGiamVtDtl || body.qdXuatGiamVtDtl.length <= 0) {
      this.notification.warning(MESSAGE.WARNING, 'Danh sách hàng hóa xuất giảm trống.');
      return;
    }
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id
      })
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let mess = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mess = 'Bạn có muốn gửi duyệt?'
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        mess = 'Bạn có chắc chắn muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.BAN_HANH;
        mess = 'Bạn có chắc chắn muốn ban hành ?'
        break;
      }
    }
    this.approve(this.idInput, trangThai, mess);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.TU_CHOI_LDTC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  expandAll() {
    this.dataThTree.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async loadSoBaoCao() {
    let body = {
      nam: this.formData.get("namKeHoach").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
    }
    let res = await this.baoCaoKdmVtTbTrongThoiGianBaoHanh.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoBaoCao = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoBaoCao();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số báo cáo kết quả kiểm định mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoBaoCao,
        dataHeader: ['Năm', 'Số báo cáo', 'Ngày báo cáo',],
        dataColumn: ['nam', 'soBaoCao', 'ngayBaoCao',],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataBaoCao(data);
      }
    });
  };


  async bindingDataBaoCao(data) {
    try {
      await this.spinner.show();
      let dataRes = await this.baoCaoKdmVtTbTrongThoiGianBaoHanh.getDetail(data.id)
      const responseData = dataRes.data;
      this.dataTable = responseData.baoCaoDtl.map(m => {
        return m.qdGiaonvXhDtl
          .filter(i=> i.mauBiHuy==true);
      }).flat();

      this.formData.patchValue({
        soCanCu: responseData.soBaoCao,
        idCanCu: responseData.id,
        listSoQdGiaoNvXh: responseData.soCanCu,
        listIdQdGiaoNvXh: responseData.idCanCu,
        maDviNhan: responseData.maDvi,
        qdXuatGiamVtDtl:this.dataTable,
      });
      this.buildTableView(this.dataTable)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }
  async loadDsCuc() {
    const dsTong = await this.donviService.layTatCaDonViByLevel(2);
    this.dviNhan = dsTong && Array.isArray(dsTong.data) ? dsTong.data.filter(item => item.type != "PB") : []
    console.log(this.dviNhan,"111")
  }
  buildTableView(data) {
    let dataView = chain(this.dataTable)
      .groupBy("maDiaDiem")
      .map((value, key) => {
        let tenChiCuc = value.find(f => f.maDiaDiem === key)
        return {
          idVirtual: uuid.v4(),
          maDiaDiem: key != "null" ? key : '',
          tenChiCuc: tenChiCuc ? tenChiCuc.tenChiCuc : null,
          childData: value
        };
      }).value();
    this.dataThTree = dataView
    this.expandAll()
  }



}
