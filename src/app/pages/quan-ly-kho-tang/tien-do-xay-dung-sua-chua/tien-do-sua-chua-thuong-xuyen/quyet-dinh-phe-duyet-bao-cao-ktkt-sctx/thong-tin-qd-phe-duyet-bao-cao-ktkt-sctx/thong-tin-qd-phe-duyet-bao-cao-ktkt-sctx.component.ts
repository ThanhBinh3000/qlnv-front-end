import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import * as uuid from "uuid";
import { MESSAGE } from "../../../../../../constants/message";
import { STATUS } from "../../../../../../constants/status";
import { FILETYPE } from "../../../../../../constants/fileType";
import { AMOUNT_NO_DECIMAL } from "../../../../../../Utility/utils";
import {
  DuToanXayDung
} from "../../../tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-tktc-tdt/thong-tin-quyet-dinh-phe-duyet-tktc-tdt/thong-tin-quyet-dinh-phe-duyet-tktc-tdt.component";
import {
  QdPheDuyetBaoCaoKtktService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-bao-cao-ktkt.service";
import { cloneDeep} from "lodash";
@Component({
  selector: 'app-thong-tin-qd-phe-duyet-bao-cao-ktkt-sctx',
  templateUrl: './thong-tin-qd-phe-duyet-bao-cao-ktkt-sctx.component.html',
  styleUrls: ['./thong-tin-qd-phe-duyet-bao-cao-ktkt-sctx.component.scss']
})
export class ThongTinQdPheDuyetBaoCaoKtktSctxComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output() dataItemTktcTdt = new EventEmitter<object>();
  @Input()
  idInput: number;
  @Input('itemDuAn') itemDuAn: any;
  isVisiblePopDuToanXayDung = false;
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listQdPdDtxd: any[] = []
  formDataDetail: FormGroup;
  dataTreeTable: any[] = [];
  rowItemParent: DuToanXayDung = new DuToanXayDung();
  dataEdit: { [key: string]: { edit: boolean; data: DuToanXayDung } } = {};
  mapOfExpandedData: { [key: string]: DuToanXayDung[] } = {};
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  AMOUNT = AMOUNT_NO_DECIMAL;
  tongGiaTri:number;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPheDuyetBaoCaoKtktService: QdPheDuyetBaoCaoKtktService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPheDuyetBaoCaoKtktService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      idDuAn: [null],
      namKh: [null],
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenCongTrinh: [null, Validators.required],
      idQdPdKhScl: [null],
      soQdPdKhScl: [null],
      chuDauTu: [null],
      diaDiem: [null],
      nhaThauBc: [null, Validators.required],
      khoi: [null],
      tenLoaiCongTrinh: [null],
      loaiCongTrinh: [null],
      nhaThauTk: [null],
      hinhThucQl: [null],
      nguonVonDt: [null],
      tenNguonVon: [null],
      tieuChuanDm: [null],
      giaTriDt: [0],
      noiDung: [null],
      quyMo: [null],
      loaiCapCt: [null],
      noiDungKhac: [null],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["ĐANG NHẬP DỮ LIỆU"],
      fileDinhKems: [null],
      child: [null],
      listKtTdscQuyetDinhPdBcKtktDtl: null,
      loai: ['01']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.idInput) {
        this.detail(this.idInput)
      } else {
        this.bindingData();
      }
      this.convertListData();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  emitDataTktcTdt(data) {
    this.dataItemTktcTdt.emit(data);
  }

  bindingData() {
    if (this.itemDuAn) {
      this.formData.patchValue({
        idDuAn: this.itemDuAn.id,
        namKh: this.itemDuAn.namKh,
        tenCongTrinh: this.itemDuAn.tenCongTrinh,
        idQdPdKhScl: this.itemDuAn.idQdTcdt,
        soQdPdKhScl: this.itemDuAn.soQdScTx,
        loaiCongTrinh: this.itemDuAn.loaiCongTrinh,
        tenLoaiCongTrinh: this.itemDuAn.tenLoaiCongTrinh,
        loaiCapCt: this.itemDuAn.loaiCapCt,
        khoi: this.itemDuAn.tenKhoi,
        nguonVonDt: this.itemDuAn.nguonVon,
        tenNguonVon: this.itemDuAn.tenNguonVon,
        diaDiem: this.itemDuAn.diaDiem,
        giaTriDt: this.itemDuAn.tmdt,
        tieuChuanDm: this.itemDuAn.tieuChuan,
        chuDauTu: this.userInfo.TEN_DVI
      })
    }
  }
  goBack() {
    this.showListEvent.emit();
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qdPheDuyetBaoCaoKtktService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null,
            namKh: this.itemDuAn.namKh
          })
          data.fileDinhKems.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.listFileDinhKem.push(item)
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.listCcPhapLy.push(item)
            }
          })
          this.listFile = data.fileDinhKems;
          this.dataTable = data.listKtTdscQuyetDinhPdBcKtktDtl;
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
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    if (this.dataTable && this.dataTable.length > 0) {
      this.formData.value.listKtTdscQuyetDinhPdBcKtktDtl = this.dataTable;
    } else {
      this.notification.warning(MESSAGE.WARNING, "Chưa nhập chi tiết sửa chữa lớn!");
      return;
    }
    if (isBanHanh) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Ban hành quyết định",
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
              }
              let res1 = await this.qdPheDuyetBaoCaoKtktService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.NOTIFICATION, "Ban hành quyết định thành công");
                this.formData.patchValue({
                  trangThai: STATUS.BAN_HANH,
                  tenTrangThai: "Ban hành",
                })
                this.emitDataTktcTdt(res1.data);
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
      let res = await this.createUpdate(this.formData.value)
      if (res) {
        this.formData.patchValue({
          id: res.id,
        });
        this.idInput = res.id;
      }
    }
  }

  async banHanh(id) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
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
      giaTri: [0],
      expand: true,
      kyHieu: null,
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
        kyHieu: [null],
      });
      this.isVisiblePopDuToanXayDung = true;
    } else {
      let msgRequired = this.required(this.rowItemParent);
      if (msgRequired) {
        this.notification.error(MESSAGE.ERROR, msgRequired);
        this.spinner.hide();
        return;
      }
      this.rowItemParent.idVirtual = uuid.v4();
      this.rowItemParent.expand = true;
      this.tongGiaTri = this.rowItemParent.giaTri + cloneDeep(this.dataTable).reduce((a, b) => a += b.giaTri, 0)
      if (this.tongGiaTri > this.formData.value.giaTriDt) {
        this.notification.warning(MESSAGE.WARNING, "Tổng dự toán sửa chưa công trình không được lớn hơn TMĐT");
        return;
      }
      this.dataTable = [...this.dataTable, this.rowItemParent];
      this.dataTreeTable = this.dataTable;
      this.rowItemParent = new DuToanXayDung();
      this.convertListData();
    }
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
        kyHieu: item.kyHieu,
      });
      this.isVisiblePopDuToanXayDung = true;
    }
  }

  required(item: DuToanXayDung) {
    let msgRequired = '';
    //validator
    if (!item.noiDung || !item.chiMuc || !item.giaTri) {
      msgRequired = "Chỉ mục, nội dung, và giá trị không được để trống";
    }
    return msgRequired;
  }

  refresh() {
    this.rowItemParent = new DuToanXayDung();
  }

  convertListData() {
    if (this.dataTreeTable && this.dataTreeTable.length > 0) {
      let lv1 = this.dataTreeTable.filter(item => item.capChiMuc == 1);
      let lv2 = this.dataTreeTable.filter(item => item.capChiMuc == 2);
      let lv3 = this.dataTreeTable.filter(item => item.capChiMuc == 3);
      if (lv2 && lv2.length > 0) {
        lv2.forEach(it => {
          it.children = lv3 && lv3.length > 0 ? lv3.filter(lv3 =>
            lv3.chiMucCha == it.chiMuc
          ) : [];
        });
      }
      if (lv1 && lv1.length > 0) {
        lv1.forEach(it => {
          it.children = lv2 && lv2.length > 0 ? lv2.filter(lv2 => lv2.chiMucCha == it.chiMuc
          ) : [];
        });
      }
      this.dataTreeTable = lv1;
      lv1.forEach(item => {
        this.mapOfExpandedData[item.idVirtual] = this.convertTreeToList(item);
      });
    }
  }

  collapse(array: DuToanXayDung[], data: DuToanXayDung, $event: boolean): void {
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

  visitNode(node: DuToanXayDung, hashMap: { [idVirtual: string]: boolean }, array: DuToanXayDung[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }

  convertTreeToList(root: DuToanXayDung): DuToanXayDung[] {
    const stack: DuToanXayDung[] = [];
    const array: DuToanXayDung[] = [];
    const hashMap = {};
    stack.push({ ...root, capChiMuc: 1, expand: true });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], capChiMuc: node.capChiMuc! + 1, expand: true, parent: node });
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
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  handleCancel(): void {
    this.isVisiblePopDuToanXayDung = false;
  }

  handleOk(): void {
    this.helperService.markFormGroupTouched(this.formDataDetail)
    if (this.formDataDetail.invalid) {
      return;
    }
    let itemChild = this.formDataDetail.value;
    if (itemChild) {
      if (itemChild.id && itemChild.id > 0) {
        this.dataTable = this.dataTable.map(obj => {
          if (obj.id == itemChild.id) {
            itemChild.expand = true;
            return itemChild;
          }
          return obj;
        });
      } else {
        itemChild.expand = true;
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
          // Tìm chỉ mục của itemCheck trong bản sao và thay thế nó bằng itemChild
          const index = dataTableCopy.indexOf(itemCheck);
          if (index !== -1) {
            dataTableCopy[index] = itemChild;
            this.dataTable = dataTableCopy; // Gán trở lại giá trị của this.dataTable
          }
        } else {
          itemChild.expand = true;
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
          this.dataTable = [...this.dataTable, itemChild];
        }
      }
      this.dataTreeTable = this.dataTable;
      this.formDataDetail.reset();
      this.convertListData();
    }
    this.isVisiblePopDuToanXayDung = false;
  }
}
