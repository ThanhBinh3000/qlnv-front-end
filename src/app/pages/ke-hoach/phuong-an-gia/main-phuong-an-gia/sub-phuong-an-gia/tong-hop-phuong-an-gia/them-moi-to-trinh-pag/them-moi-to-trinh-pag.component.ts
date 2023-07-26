import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {TYPE_PAG} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopPhuongAnGiaService } from 'src/app/services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service';
import { ToTrinhPAGService } from 'src/app/services/ke-hoach/phuong-an-gia/toTrinhPAG.service';
import { Globals } from 'src/app/shared/globals';
import {UserService} from "../../../../../../../services/user.service";

@Component({
  selector: 'app-them-moi-to-trinh-pag',
  templateUrl: './them-moi-to-trinh-pag.component.html',
  styleUrls: ['./them-moi-to-trinh-pag.component.scss']
})
export class ThemMoiToTrinhPagComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input() idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  @Input() type: string;
  @Input() pagType: string;

  STATUS = STATUS;
  TYPE_PAG: any;
  expandSet = new Set<number>();
  formData: FormGroup;
  maSuffix: string = '/TCDT-KH';
  dataTable: any[] = [];
  dataTableView: any[] = [];
  dsLoaiGia: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    public userService: UserService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
    private toTrinhPAGService: ToTrinhPAGService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group(
      {
        soToTrinh: [null, [Validators.required]],
        qdGtdttBtc: [null],
        ttNgayKy: [null, [Validators.required]],
        trichYeu: [],

        namTongHop: [],
        id: [],
        tenLoaiVthh: [],
        loaiGia: [],
        tenCloaiVthh: [],
        trangThaiTt: [],
        tenTrangThaiTt: [],
        tchuanCluong: [null],

        giaKsTt: [],
        giaKsTtVat: [],
        kqTdVat: [],
        kqTd: [],
        giaDng: [],
        giaDngVat: [],

        ttLyDoTuChoi: [],
        ttGiaDn: [],
        ttGiaDnVat: [],
        ghiChu: [],

      })
    this.TYPE_PAG = TYPE_PAG
  }

  async ngOnInit() {
    await Promise.all([
      this.loadDsLoaiGia(),
      this.getDataDetail(this.idInput),
    ])
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.type == TYPE_PAG.GIA_MUA_TOI_DA) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
      }
      if (this.type == TYPE_PAG.GIA_CU_THE) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG03' || item.ma == 'LG04'
        );
      }
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.tongHopPhuongAnGiaService.getDetail(id);
      const data = res.data;
      this.bindingDataTongHop(data)
    }
  }

  bindingDataTongHop(data) {
    let giaKsTt = data.giaKsTtTu && data.giaKsTtDen ? Intl.NumberFormat('vi-VN').format(data.giaKsTtTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaKsTtDen) : null;
    let giaKsTtVat = data.giaKsTtVatTu && data.giaKsTtVatDen ? Intl.NumberFormat('vi-VN').format(data.giaKsTtVatTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaKsTtVatDen) : null;
    let kqTd = data.giaTdTu && data.giaTdDen ? Intl.NumberFormat('vi-VN').format(data.giaTdTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaTdDen) : null;
    let kqTdVat = data.giaTdVatTu && data.giaTdVatDen ? Intl.NumberFormat('vi-VN').format(data.giaTdVatTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaTdVatDen) : null;
    let giaDng = data.giaDnTu && data.giaDnDen ? Intl.NumberFormat('vi-VN').format(data.giaDnTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaDnDen) : null;
    let giaDngVat = data.giaDnVatTu && data.giaDnVatDen ? Intl.NumberFormat('vi-VN').format(data.giaDnVatTu) + " - " + Intl.NumberFormat('vi-VN').format(data.giaDnVatDen) : null;
    this.formData.patchValue({
      soToTrinh: data.soToTrinh ? data.soToTrinh.split("/")[0] : null,
      qdGtdttBtc: data.qdGtdttBtc,
      ttNgayKy: data.ttNgayKy,
      trichYeu: data.trichYeu,
      namTongHop: data.namTongHop,
      id: data.id,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      loaiGia: data.loaiGia,
      trangThaiTt: data.trangThaiTt,
      tenTrangThaiTt: data.tenTrangThaiTt ? data.tenTrangThaiTt : 'Dự thảo' ,
      ttLyDoTuChoi: data.ttLyDoTuChoi,
      giaKsTt: giaKsTt,
      giaKsTtVat: giaKsTtVat,
      kqTd: kqTd,
      kqTdVat: kqTdVat,
      giaDng: giaDng,
      giaDngVat: giaDngVat,
      ttGiaDn: data.ttGiaDn,
      ttGiaDnVat: data.ttGiaDnVat,
      ghiChu: data.ghiChu,

    })
    this.dataTable = data.pagChiTiets;
    this.buildTreePagCt();
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.convertTreeToList();
    let body = this.formData.value;
    body.type = this.type;
    body.soToTrinh = body.soToTrinh + this.maSuffix;
    if (this.dataTable && this.dataTable.length > 0) {
      if (this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03') {
        this.dataTable.forEach(item => {
          if (item.vat) {
            item.giaQdVatTcdtnn = item.giaQdTcdtnn + item.giaQdTcdtnn * item.vat
          }
        })
      }
    }
    body.pagChiTiets = this.dataTable
    let res = await this.toTrinhPAGService.update(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    this.spinner.hide();
  }

  async pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: ''
          };
          switch (this.formData.get('trangThaiTt').value) {
            case STATUS.DU_THAO:
            case STATUS.TU_CHOI_LDV: {
              body.trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.DA_DUYET_LDV;
              break;
            }
          }
          let res = await this.toTrinhPAGService.approve(body)
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: ''
          };
          switch (this.formData.get('trangThaiTt').value) {
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
          }
          let res = await this.toTrinhPAGService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.onClose.emit();
  }

  buildTreePagCt() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTableView = chain(this.dataTable)
        .groupBy("maDvi")
        .map((value, key) => {
          return {
            idVirtual: uuidv4(),
            tenVungMien: value && value[0] && value[0].tenVungMien ? value[0].tenVungMien : null,
            tenDvi: value && value[0] && value[0].tenDvi ? value[0].tenDvi : null,
            soDx : value && value[0] && value[0].soDx ? value[0].soDx : null,
            children: value
          };
        }).value();
    }
    console.log(this.dataTableView, 123123)
    this.expandAll()
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


  expandAll() {
    if (this.dataTableView && this.dataTableView.length > 0) {
      this.dataTableView.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  convertTreeToList() {
    if (this.dataTableView && this.dataTableView.length > 0 ) {
      this.dataTable = [];
      this.dataTableView.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            this.dataTable.push(child);
          })
        }
      })
    }
  }
}
