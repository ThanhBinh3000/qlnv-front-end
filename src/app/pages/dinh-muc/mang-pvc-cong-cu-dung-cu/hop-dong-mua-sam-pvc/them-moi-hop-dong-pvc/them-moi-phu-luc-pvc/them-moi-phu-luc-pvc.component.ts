import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import {HopDongPvcService} from "../../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/hop-dong-pvc.service";

@Component({
  selector: 'app-them-moi-phu-luc-pvc',
  templateUrl: './them-moi-phu-luc-pvc.component.html',
  styleUrls: ['./them-moi-phu-luc-pvc.component.scss']
})
export class ThemMoiPhuLucPvcComponent extends Base2Component implements OnInit {
  @Input() id: number
  @Input() isView: boolean
  @Input() dataHdr: any
  @Input() tablePl: any
  @Input() listDiaDiem: any
  @Output()
  goBackEvent = new EventEmitter<any>();
  checkDtl: boolean
  itemRowEdit: string;
  soLuong: number;
  expandSetString = new Set<string>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongService: HopDongPvcService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      soPhuLuc: [null, Validators.required],
      soHopDong: [null],
      tenHopDong: [null],
      ngayKy: [null, Validators.required],
      ngayKyTruoc: [null],
      ngayKyDc: [null],
      veViec: [null, Validators.required],
      noiDung: [null],
      ghiChu: [null],
      thoiGianThucHien: [null],
      thoiGianThucHienDc: [null],
      listFileDinhKems: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      hdHdrId: [null],
      loai: ['01']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.expandAll()
      if (this.id > 0) {
        await this.detail(this.id);
      } else {
        this.initForm()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goBackHdr(is: boolean) {
    this.checkDtl = is
    this.goBackEvent.emit(this.checkDtl);
  }

  initForm() {
    if (this.dataHdr) {
      this.formData.patchValue({
        tenHopDong: this.dataHdr.tenHopDong,
        soHopDong: this.dataHdr.soHopDong,
        ngayKyTruoc: this.dataHdr.ngayKy,
        thoiGianThucHien: this.dataHdr.thoiGianThucHien
      })
      this.convertListDiaDiem()
      this.buildDiaDiemTc()
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.hopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listDiaDiem = []
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.listDiaDiem = data.listQlDinhMucPvcHdDiaDiemNh
          this.formData.patchValue({
            ngayKyTruoc: this.dataHdr.ngayKy
          })
          this.buildDiaDiemTc()
          this.expandAll()
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


  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.convertListDiaDiem()
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.listFileDinhKems = this.fileDinhKem;
    }
    this.formData.value.maDvi = this.userInfo.MA_DVI
    this.formData.value.capDvi = this.userInfo.CAP_DVI
    this.formData.value.hdHdrId = this.dataHdr.id
    this.formData.value.listQlDinhMucPvcHdDiaDiemNh = this.listDiaDiem
    let body = this.formData.value
    let data = await this.createUpdate(body);
    if(isGuiDuyet){
    this.id = data.id;
      await this.pheDuyet();
    }
    if (data && !isGuiDuyet) {
      this.goBackHdr(true)
    }
    this.buildDiaDiemTc();
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ký?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: STATUS.DA_KY,
          }
          let res = await this.hopDongService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, 'Ký thành công!');
            this.spinner.hide();
            this.goBackHdr(true);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
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
  }


  expandAll() {
    if (this.listDiaDiem && this.listDiaDiem.length > 0) {
      this.listDiaDiem.forEach(s => {
        this.expandSetString.add(s.idVirtual);
        if (s.childData && s.childData.length > 0) {
          s.childData.forEach(item => {
            this.expandSetString.add(item.idVirtual);
          })
        }
      })
    }
  }

  convertListDiaDiem() {
    let arr = [];
    if (this.listDiaDiem) {
      this.listDiaDiem.forEach(item => {
        if (item.childData && item.childData.length > 0) {
          item.childData.forEach(data => {
            if (data.childData && data.childData.length > 0) {
              data.childData.forEach(dtl => {
                dtl.id = null
                arr.push(dtl)
              })
            }
          })
        }
      })
      this.listDiaDiem = arr
    }
  }

  buildDiaDiemTc() {
    if (this.listDiaDiem && this.listDiaDiem.length > 0) {
      this.listDiaDiem = chain(this.listDiaDiem)
        .groupBy("tenCcdc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenDviCha")
            .map((v, k) => {
                return {
                  idVirtual: uuid.v4(),
                  tenDviCha: k,
                  childData: v
                }
              }
            ).value();
          return {
            idVirtual: uuid.v4(),
            tenTaiSan: key,
            childData: rs
          };
        }).value();
    }

    this.expandAll()
  }

  editRow(i: any, i1: any, i2: any, soLuong: number) {
    this.itemRowEdit = ((i + 1) + '.' + (i1 + 1) + '.' + (i2 + 1));
    this.soLuong = soLuong;
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
          let index = this.getIndxDataEdit(data);
          this.convertListDiaDiem()
          this.listDiaDiem.splice(index, 1);
          this.buildDiaDiemTc()
        } catch (e) {
          console.log('error', e);
        }
      }
    });
  }

  saveEdit() {
    this.itemRowEdit = '';
  }

  cancelEdit(data: any) {
    this.itemRowEdit = '';
    data.soLuong = this.soLuong
  }

  getIndxDataEdit(item: any): number {
    this.convertListDiaDiem()
    let result = this.listDiaDiem.filter(s => s.tenCcdc == item.tenCcdc && s.maDvi == item.maDvi);
    let data = result[0];
    let index = this.listDiaDiem.indexOf(data)
    this.buildDiaDiemTc();
    return index
  }
}
