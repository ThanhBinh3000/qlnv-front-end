import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {Base2Component} from '../../../../../../components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../../../../../../services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import * as uuid from 'uuid';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MESSAGE} from '../../../../../../constants/message';
import {STATUS} from '../../../../../../constants/status';
import {
  QuyetdinhpheduyetduandtxdService,
} from '../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetduandtxd.service';
import {KtQdXdHangNamService} from '../../../../../../services/kt-qd-xd-hang-nam.service';
import {DonviService} from '../../../../../../services/donvi.service';
import {AMOUNT_NO_DECIMAL} from '../../../../../../Utility/utils';
import {FILETYPE} from '../../../../../../constants/fileType';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-du-an-dtxd',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component.scss'],
})
export class ThongTinQuyetDinhPheDuyetDuAnDtxdComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  @Input('itemDuAn') itemDuAn: any;
  isVisiblePopTongMucDauTu = false;
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  listQdKhDtxd: any[] = [];
  listDuAnDtxd: any[] = [];
  formDataDetail: FormGroup;
  dataTreeTable: any[] = [];
  rowItemParent: TongMucDauTu = new TongMucDauTu();
  dataEdit: { [key: string]: { edit: boolean; data: TongMucDauTu } } = {};
  mapOfExpandedData: { [key: string]: TongMucDauTu[] } = {};
  AMOUNT = AMOUNT_NO_DECIMAL;
  @Output() dataItemDaDtxd = new EventEmitter<object>();
  tongGiaTri: number = 0;
  tongGiaTriChild: number = 0;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService,
    private ktQdXdHangNamService: KtQdXdHangNamService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetduandtxdService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      namKh: [null],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      ngayHieuLuc: [null, Validators.required],
      soQdKhDtxd: [null, Validators.required],
      idQdKhDtxd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenDuAn: [null, Validators.required],
      idDuAn: [null, Validators.required],
      chuDauTu: [this.userInfo.TEN_DVI, Validators.required],
      diaChi: [this.userInfo.DON_VI.diaChi],
      toChucTvtk: [null],
      chuNhiemDuAn: [null],
      mucTieuDt: [null],
      diaDiem: [null],
      dienTich: [null],
      paGpMb: [null],
      tongMucDt: [0],
      nguonVonDt: [null],
      hinhThucQlDa: [null],
      thoiGianThTu: [null, Validators.required],
      thoiGianThDen: [null, Validators.required],
      tgKhoiCong: [null],
      tgHoanThanh: [null],
      noiDung: [null],
      paXayDung: [null],
      loaiCapCt: [null],
      noiDungKhac: [null],
      vonNsTw: [0],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["ĐANG NHẬP DỮ LIỆU"],
      fileDinhKems: [null],
      listKtTdxdQuyetDinhPdDtxdDtl: null,
      loaiDuAn: [null],
      khoi: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      // await Promise.all([
      //   this.loadQdKhĐtxd(),
      //   this.loadListDuAn()
      // ]);
      if (this.idInput) {
        this.detail(this.idInput);
      } else {
        this.bindingData();
      }
      await this.convertListData();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  bindingData() {
    if (this.itemDuAn) {
      this.formData.patchValue({
        namKh: this.itemDuAn.namKeHoach,
        tenDuAn: this.itemDuAn.tenDuAn,
        idDuAn: this.itemDuAn.id,
        soQdKhDtxd: this.itemDuAn.soQdPdKhNam,
        idQdKhDtxd: this.itemDuAn.idType,
        loaiDuAn: this.itemDuAn.loaiDuAn,
        khoi: this.itemDuAn.khoi,
        diaDiem: this.itemDuAn.diaDiem,
        tgKhoiCong: this.itemDuAn.tgKhoiCong,
        tgHoanThanh: this.itemDuAn.tgHoanThanh,
        vonNsTw: this.itemDuAn.nstwDuKien,
        tongMucDt: this.itemDuAn.tmdtDuKien,
      });
    }
  }

  emitDataDaDtxd(data) {
    this.dataItemDaDtxd.emit(data);
  }

  goBack() {
    this.showListEvent.emit();
  }

  async loadQdKhĐtxd() {
    this.spinner.show();
    try {
      let body = {
        // "maDvi": this.userInfo.MA_DVI,
        'paggingReq': {
          'limit': 10,
          'page': this.page - 1,
        },
      };
      let res = await this.ktQdXdHangNamService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listQdKhDtxd = res.data.content;
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

  async loadListDuAn() {
    this.spinner.show();
    try {
      let body = {
        'maDvi': this.userInfo.CAP_DVI != '1' ? this.userInfo.MA_DVI : null,
        'trangThai': STATUS.BAN_HANH,
      };
      let res = await this.ktQdXdHangNamService.getDanhSachDmDuAn(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listDuAnDtxd = res.data;
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

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetduandtxdService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null,
            khoi: this.itemDuAn.tenKhoi,
            loaiDuAn: this.itemDuAn.loaiDuAn,
            loaiCapCt: this.itemDuAn.loaiCapCt,
            tgKhoiCong: this.itemDuAn.tgKhoiCong,
            tgHoanThanh: this.itemDuAn.tgHoanThanh,
            vonNsTw: this.itemDuAn.nstwDuKien,
            tongMucDt: this.itemDuAn.tmdtDuKien,
          });
          data.fileDinhKems.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.listFileDinhKem.push(item);
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.listCcPhapLy.push(item);
            }
          });
          this.listFile = data.fileDinhKems;
          this.dataTable = data.listKtTdxdQuyetDinhPdDtxdDtl;
          this.updateIdVirtual();
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


  updateIdVirtual() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        item.idVirtual = uuid.v4();
      });
    }
    this.dataTreeTable = this.dataTable;
    this.convertListData();
  }

  async save(isBanHanh?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFile.push(item);
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY;
        this.listFile.push(element);
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    this.formData.value.listKtTdxdQuyetDinhPdDtxdDtl = this.dataTable;
    if (isBanHanh) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Ban hành quyết định',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.createUpdate(this.formData.value);
            if (res) {
              let body = {
                id: res.id,
                trangThai: STATUS.BAN_HANH,
              };
              let res1 = await this.quyetdinhpheduyetduandtxdService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.NOTIFICATION, 'Ban hành quyết định thành công');
                this.formData.patchValue({
                  trangThai: STATUS.BAN_HANH,
                  tenTrangThai: 'Ban hành',
                });
                this.emitDataDaDtxd(res1.data);
                this.isViewDetail = true;
                this.spinner.hide();
              } else {
                this.notification.error(MESSAGE.ERROR, res1.msg);
                this.spinner.hide();
              }
            }
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      let res = await this.createUpdate(this.formData.value);
      if (res) {
        this.idInput = res.id;
        this.formData.patchValue({
          id: res.id,
        });
      }
    }
  }

  changeSoQdKhDtxd(event) {
    if (event) {
      let item = this.listQdKhDtxd.filter(item => item.soQd == event)[0];
      if (item) {
        this.formData.patchValue({
          idQdKhDtxd: item.id,
        });
      }
    }
  }

  changeDuAn(event) {
    if (event) {
      let item = this.listDuAnDtxd.filter(item => item.tenDuAn == event)[0];
      if (item) {
        this.formData.patchValue({
          idDuAn: item.id,
        });
      }
    }
  }

  async banHanh(id) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định';
    this.approve(id, trangThai, mesg);
  }

  initFormDataDetail() {
    this.formDataDetail = this.fb.group({
      id: [null],
      idVirtual: uuid.v4(),
      chiMuc: [null, Validators.required],
      noiDung: [null, Validators.required],
      chiMucCha: [null],
      capChiMuc: [null, Validators.required],
      giaTri: [null, Validators.required],
      expand: true,
      thueVat: 0,
      chiPhiSauThue: 0,
    });
  }

  async themMoiCtiet(item?) {
    if (item) {
      this.formDataDetail = this.fb.group({
        idVirtual: uuid.v4(),
        chiMuc: [null, Validators.required],
        noiDung: [null, Validators.required],
        chiMucCha: item.chiMuc,
        capChiMuc: item.capChiMuc + 1,
        giaTri: [null, Validators.required],
        expand: true,
        thueVat: 0,
        chiPhiSauThue: 0,
      });
      this.isVisiblePopTongMucDauTu = true;
    } else {
      let msgRequired = this.required(this.rowItemParent);
      if (msgRequired) {
        this.notification.error(MESSAGE.ERROR, msgRequired);
        this.spinner.hide();
        return;
      }
      this.rowItemParent.idVirtual = uuid.v4();
      this.rowItemParent.thueVat = this.rowItemParent.giaTri ? (this.rowItemParent.giaTri * 10) / 100 : this.rowItemParent.giaTri;
      this.rowItemParent.chiPhiSauThue = this.rowItemParent.thueVat + this.rowItemParent.giaTri;
      this.rowItemParent.expand = true;
      this.tongGiaTri = this.rowItemParent.chiPhiSauThue + cloneDeep(this.dataTable).reduce((a, b) => a += b.chiPhiSauThue, 0)
      if (this.tongGiaTri > this.formData.value.vonNsTw) {
        this.notification.warning(MESSAGE.WARNING, "TMĐT không được lớn hơn TMĐT vốn NSTW");
        return;
      }
      this.dataTable = [...this.dataTable, this.rowItemParent];
      this.dataTreeTable = this.dataTable;
      this.rowItemParent = new TongMucDauTu();
      this.convertListData();
    }
    // this.tinhTongMucDauTu();
  }

  async tinhTongMucDauTu() {
    let total = this.dataTable.reduce((accumulator, object) => {
      return accumulator + object.chiPhiSauThue;
    }, 0);
    this.formData.patchValue({
      tongMucDt: total,
    });
  }

  editRow(item) {
    if (item) {
      this.initFormDataDetail();
      this.formDataDetail.patchValue({
        id: item.id,
        idVirtual: item.idVirtual,
        chiMuc: item.chiMuc,
        noiDung: item.noiDung,
        chiMucCha: item.chiMucCha,
        capChiMuc: item.capChiMuc,
        giaTri: item.giaTri,
        expand: true,
        thueVat: item.thueVat,
        chiPhiSauThue: item.chiPhiSauThue,
      });
      this.isVisiblePopTongMucDauTu = true;
    }
  }

  required(item: TongMucDauTu) {
    let msgRequired = '';
    //validator
    if (!item.noiDung || !item.chiMuc || !item.giaTri) {
      msgRequired = 'Chỉ mục, nội dung, và giá trị không được để trống';
    }
    return msgRequired;
  }

  refresh() {
    this.rowItemParent = new TongMucDauTu();
  }

  convertListData() {
    if (this.dataTreeTable && this.dataTreeTable.length > 0) {
      let lv1 = this.dataTreeTable.filter(item => item.capChiMuc == 1);
      let lv2 = this.dataTreeTable.filter(item => item.capChiMuc == 2);
      let lv3 = this.dataTreeTable.filter(item => item.capChiMuc == 3);
      if (lv2 && lv2.length > 0) {
        lv2.forEach(it => {
          it.children = lv3 && lv3.length > 0 ? lv3.filter(lv3 =>
            lv3.chiMucCha == it.chiMuc,
          ) : [];
        });
      }
      if (lv1 && lv1.length > 0) {
        lv1.forEach(it => {
          it.children = lv2 && lv2.length > 0 ? lv2.filter(lv2 => lv2.chiMucCha == it.chiMuc,
          ) : [];
        });
      }
      this.dataTreeTable = lv1;
      lv1.forEach(item => {
        this.mapOfExpandedData[item.idVirtual] = this.convertTreeToList(item);
      });
    }
  }

  collapse(array: TongMucDauTu[], data: TongMucDauTu, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = true;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  visitNode(node: TongMucDauTu, hashMap: { [idVirtual: string]: boolean }, array: TongMucDauTu[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }

  convertTreeToList(root: TongMucDauTu): TongMucDauTu[] {
    const stack: TongMucDauTu[] = [];
    const array: TongMucDauTu[] = [];
    const hashMap = {};
    stack.push({...root, capChiMuc: 1, expand: true});
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], capChiMuc: node.capChiMuc! + 1, expand: true, parent: node});
        }
      }
    }
    return array;
  }

  deleteItem(data: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable = this.dataTable.filter(it => it.idVirtual != data.idVirtual);
          this.dataTreeTable = this.dataTable;
          this.convertListData();
          this.tinhTongMucDauTu();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  handleCancel(): void {
    this.isVisiblePopTongMucDauTu = false;
  }

  handleOk(): void {
    this.helperService.markFormGroupTouched(this.formDataDetail);
    if (this.formDataDetail.invalid) {
      return;
    }
    let itemChild = this.formDataDetail.value;
    if (itemChild) {
      if (itemChild.id && itemChild.id > 0) {
        this.dataTable = this.dataTable.map(obj => {
          if (obj.id == itemChild.id) {
            itemChild.thueVat = itemChild.giaTri ? (itemChild.giaTri * 10) / 100 : itemChild.giaTri;
            itemChild.chiPhiSauThue = itemChild.thueVat + itemChild.giaTri;
            itemChild.expand = true;
            return itemChild;
          }
          return obj;
        });
      } else {
        let limit = false;
        let tongGtLv2 = 0;
        let tongGtLv3 = 0;
        //check add hay edit
        let dataTableCopy = [...this.dataTable];
        let itemCheck = dataTableCopy.find(it => it.idVirtual === itemChild.idVirtual);
        if (itemCheck) {
          let giaTriGoc = itemCheck.giaTri;

          if (itemChild.giaTri > giaTriGoc) {
            this.notification.warning(MESSAGE.WARNING, "Giá trị chi tiết lớn hơn giá trị đã nhập");
            return;
          }
          itemChild.thueVat = itemChild.giaTri ? (itemChild.giaTri * 10) / 100 : itemChild.giaTri;
          itemChild.chiPhiSauThue = itemChild.thueVat + itemChild.giaTri;
          itemChild.expand = true;

          // Tìm chỉ mục của itemCheck trong bản sao và thay thế nó bằng itemChild
          const index = dataTableCopy.indexOf(itemCheck);
          if (index !== -1) {
            dataTableCopy[index] = itemChild;
            this.dataTable = dataTableCopy; // Gán trở lại giá trị của this.dataTable
          }
      } else {
          this.dataTreeTable.forEach(i => {
            if (itemChild.chiMucCha == i.chiMuc) {
              tongGtLv2 = itemChild.giaTri + i.children.reduce((a, b) => a += b.giaTri, 0)
              if (tongGtLv2 > i.giaTri) {
                limit = true;
              }
            }
            if (i.children && i.children.length > 0) {
              i.children.forEach(f => {
                if (itemChild.chiMucCha == f.chiMuc) {
                  tongGtLv3 = itemChild.giaTri + f.children.reduce((a, b) => a += b.giaTri, 0)
                  if (tongGtLv3 > f.giaTri) {
                    limit = true;
                  }
                }
              })
            }
          })
          if (limit) {
            this.notification.warning(MESSAGE.WARNING, "Giá trị chi tiết lớn hơn giá trị đã nhập");
            return;
          }
          itemChild.thueVat = itemChild.giaTri ? (itemChild.giaTri * 10) / 100 : itemChild.giaTri;
          itemChild.chiPhiSauThue = itemChild.thueVat + itemChild.giaTri;
          itemChild.expand = true;
          this.dataTable = [...this.dataTable, itemChild];
        }
      }
      this.dataTreeTable = this.dataTable;
      this.formDataDetail.reset();
      this.convertListData();
      this.tinhTongMucDauTu();
    }
    this.isVisiblePopTongMucDauTu = false;
  }

  xoa() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let res = await this.quyetdinhpheduyetduandtxdService.delete({id: this.idInput});
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.showListEvent.emit();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }
}


export class TongMucDauTu {
  idVirtual: string;
  id: number;
  chiMuc: string;
  noiDung: string;
  chiMucCha: string;
  expand: boolean;
  capChiMuc: number = 1;
  giaTri: number = 0;
  thueVat: number = 0;
  children?: TongMucDauTu[];
  parent?: TongMucDauTu;
  chiPhiSauThue: number = 0;
}
