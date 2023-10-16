import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {UserLogin} from 'src/app/models/userlogin';
import {BaseService} from 'src/app/services/base.service';
import {HelperService} from 'src/app/services/helper.service';
import {StorageService} from 'src/app/services/storage.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {DialogTuChoiComponent} from '../dialog/dialog-tu-choi/dialog-tu-choi.component';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {endOfMonth} from 'date-fns';
import {ActivatedRoute, Router} from '@angular/router';
import {PREVIEW} from 'src/app/constants/fileType';
import printJS from 'print-js';

@Component({
  selector: 'app-base3',
  templateUrl: './base3.component.html',
})
export class Base3Component implements OnInit {

  @Output()
  showListEvent = new EventEmitter<any>();

  // User Info
  userInfo: UserLogin;

  // Const
  listNam: any[] = [];
  listTrangThai: any = [];
  fileDinhKem: any[] = [];

  fileCanCu: any[] = [];
  STATUS = STATUS

  // Form search and dataTable
  formData: FormGroup
  dataTable: any[] = [];
  dataTableView: any[] = [];
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;
  defaultURL: string = '';
  defaultPermisson: string = '';

  @Input() isDetail: boolean = false;
  @Input() dataInit: any = {};
  idSelected: number = 0;
  id: number;

  // Service
  modal: NzModalService
  filterTable: any = {}
  fb: FormBuilder = new FormBuilder();
  globals: Globals = new Globals();
  helperService: HelperService
  userService: UserService
  spinner: NgxSpinnerService
  notification: NzNotificationService
  uploadFileService: UploadFileService
  route: ActivatedRoute
  router: Router
  ranges = { 'Hôm nay': [new Date(), new Date()], 'Tháng hiện tại': [new Date(), endOfMonth(new Date())] };

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private service: BaseService,
  ) {
    this.notification = notification
    this.spinner = spinner;
    this.modal = modal
    this.helperService = new HelperService(httpClient, notification);
    this.userService = new UserService(httpClient, storageService);
    this.userInfo = this.userService.getUserLogin();
    this.uploadFileService = new UploadFileService(httpClient);
    this.route = route;
    this.router = router;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  ngOnInit(): void {
  }

  // SEARCH
  async search(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.service.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  clearForm(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.search();
  }

  showList() {
    this.isDetail = false;
    this.search();
    this.showListEvent.emit();
  }

  goBack() {
    this.showListEvent.emit();
  }

  goDetail(id: number, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.idSelected = id;
    this.isDetail = true;
  }

  async changePageIndex(event) {
    this.page = event;
    await this.search();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.search();
  }

  onExpandChange(item: any, checked: boolean): void {
    item.expandSet = checked
  }

  filterInTable(key: string, value: string, type?: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (type == 'date') {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else {
            if (type) {
              if ('eq' == type) {
                if (item[key] && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
                  temp.push(item)
                }
              } else {
                if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                  temp.push(item)
                }
              }
            } else {
              if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.DU_THAO) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }


  // DELETE 1 item table
  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.service.delete(body).then(async (res) => {
            this.spinner.hide();
            if (res.msg == MESSAGE.SUCCESS) {
              await this.search();
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  // DELETE 1 multi
  deleteMulti(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
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
            let res = await this.service.deleteMuti({ idList: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
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
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  // Export data
  exportData(fileName?: string, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.service
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
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

  // Save
  async createUpdate(body, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.FORM_REQUIRED_ERROR);
        this.spinner.hide();
        return;
      }
      let res = null;
      if (body.id && body.id > 0) {
        res = await this.service.update(body);
      } else {
        res = await this.service.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (body.id && body.id > 0) {
          this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        } else {
          this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.ADD_SUCCESS);
          return res.data;
        }
        this.formData.patchValue({ id: res.data.id });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
    } finally {
      await this.spinner.hide();
    }

  }

  async detail(id, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.spinner.show();
    try {
      let res = await this.service.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKem;
          this.fileCanCu = data.fileCanCu;
          return data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

  }

  // Approve
  async approve(id: number, trangThai: string, msg: string, roles?: any, msgSuccess?: string) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id,
            trangThai: trangThai,
          }
          let res = await this.service.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.NOTIFICATION, msgSuccess ? msgSuccess : MESSAGE.UPDATE_SUCCESS);
            this.spinner.hide();
            this.redirectDefault();
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

  async reject(id: number, trangThai: string, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối phê duyệt',
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
            id: id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.service.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.spinner.hide();
            this.redirectDefault();
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
      }
    });
  }


  checkPermission(roles): boolean {
    if (roles) {
      let type = typeof (roles);
      if (type == 'object') {
        roles.forEach(x => {
          if (!this.userService.isAccessPermisson(x)) {
            console.error(x);
            this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
            return false;
          }
        })
      }
      if (type == 'string') {
        if (!this.userService.isAccessPermisson(roles)) {
          console.error(roles);
          this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
          return false;
        }
      }
      return true
    }
    return true;
  }

  // Approve
  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          this.helperService.markFormGroupTouched(this.formData);
          if (this.formData.invalid) {
            return;
          }
          let res: any = {};
          if (body.id && body.id > 0) {
            res = await this.service.update(body);
          } else {
            res = await this.service.create(body);
          }
          if (res.msg == MESSAGE.SUCCESS) {
            let res1 = await this.service.approve({ id: res.data.id, trangThai: trangThai });
            if (res1.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.NOTIFICATION, msgSuccess ? msgSuccess : MESSAGE.SUCCESS);
              this.goBack();
              return res1;
            } else {
              this.notification.error(MESSAGE.ERROR, res1.msg);
              return null;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            return null;
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          return null;
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  nvl(item: number) {
    if (item == undefined || item == null) {
      return 0;
    }
    return item;
  }

  convertToRoman(number) {
    var romanNumerals = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' }
    ];

    var romanNumber = '';

    for (var i = 0; i < romanNumerals.length; i++) {
      while (number >= romanNumerals[i].value) {
        romanNumber += romanNumerals[i].symbol;
        number -= romanNumerals[i].value;
      }
    }

    return romanNumber;
  }

  onExpandChangeItem(item: any, checked: boolean): void {
    item.expandSet = checked
  }

  disabledNgayTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayTu) {
      return startValue.getTime() > this.formData.value.ngayTu.getTime();
    }
    return false;
  };

  disabledNgayDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDen) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDen.getTime();
  };

  redirectCreate(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.router.navigate([this.defaultURL + '/them-moi']);
  }

  redirectUrl(url) {
    this.router.navigate([url]);
  }

  redirectDetail(idDetail, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.router.navigate([this.defaultURL + '/chi-tiet', idDetail]);
  }

  redirectDefault() {
    this.router.navigate([this.defaultURL]);
  }

  getId() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id && +id > 0) {
      this.id = +id
    }
  }




  showDlgPreview = false;
  pdfSrc: any;
  printSrc: any;
  wordSrc: any;
  reportTemplate: any = {
    typeFile: "",
    fileName: "",
    tenBaoCao: "",
    trangThai: ""
  };
  previewName: string = '';
  async preview(fileName: string, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.spinner.show();
    let body = this.formData.value;
    this.reportTemplate.fileName = fileName + '.docx';
    body.reportTemplateRequest = this.reportTemplate;
    await this.service.preview(body).then(async s => {
      this.spinner.hide();
      if (s.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
        this.printSrc = s.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.TEMPLATE_NULL);
      }

    });
  }
  downloadPdf(fileName: string) {
    saveAs(this.pdfSrc, fileName + '.pdf');
  }

  downloadWord(fileName: string) {
    saveAs(this.wordSrc, fileName + '.docx');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true })
  }

  isAccessPermisson(roles){
    return this.userService.isAccessPermisson(roles);
  }

  showLyDoTuChoi(): boolean {
    let trangThaiTc = [STATUS.TU_CHOI_TP,STATUS.TU_CHOI_LDC,STATUS.TU_CHOI_LDCC,STATUS.TU_CHOI_LDTC,STATUS.TU_CHOI_LDV,STATUS.TU_CHOI_CBV,STATUS.TUCHOI_BTC]
    if (this.formData.controls.hasOwnProperty('trangThai')) {
      let trangThai = this.formData.value.trangThai;
      return trangThaiTc.includes(trangThai);
    }
    return false;
  }

  showDelete(data?){
    if(data){
      return data.trangThai == STATUS.DU_THAO && this.isAccessPermisson(this.defaultPermisson+"_XOA");
    }
    return this.isAccessPermisson(this.defaultPermisson+"_XOA");
  }

  showExport(){
    return this.isAccessPermisson(this.defaultPermisson+"_EXP");
  }

  showCreate(){
    return this.isAccessPermisson(this.defaultPermisson+"_THEM");
  }

  showSaveUpdate(){
    if (this.formData.controls.hasOwnProperty('trangThai')) {
      let trangThai = this.formData.value.trangThai;
      let result = false
      if (this.userService.isCuc()) {
        let listTrangThai = [STATUS.TU_CHOI_TP,STATUS.TU_CHOI_LDC,STATUS.TU_CHOI_LDCC,STATUS.TU_CHOI_LDTC,STATUS.TU_CHOI_LDV,STATUS.TU_CHOI_CBV,STATUS.TUCHOI_BTC]
        result = listTrangThai.includes(trangThai);
      }
      if (this.userService.isTongCuc()) {
        let listTrangThai = [STATUS.DU_THAO,STATUS.DA_DUYET_LDC,STATUS.DANG_DUYET_CB_VU]
        result = listTrangThai.includes(trangThai);
      }
      return result && this.userService.isAccessPermisson(this.defaultPermisson+"_THEM");
    }
  }

  showApproveReject(trangThai){
    if(this.userService.isCuc()){
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson(this.defaultPermisson+'_DUYETTP')) ||
        (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson(this.defaultPermisson+'_DUYETLDC'));
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson(this.defaultPermisson+'_DUYETLDV')) ||
        (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson(this.defaultPermisson+'_DUYETLDTC')) ||
        (trangThai == STATUS.CHODUYET_BTC && this.userService.isAccessPermisson(this.defaultPermisson+'_DUYETBTC'));
    }
  }

  showEdit(data){
    if(data){
      let trangThai = data.trangThai;
      let result;
      if (this.userService.isCuc()) {
        let listTrangThai = [STATUS.DU_THAO,STATUS.TU_CHOI_TP,STATUS.TU_CHOI_LDC,STATUS.TU_CHOI_CBV,STATUS.TU_CHOI_LDV]
        result = listTrangThai.includes(trangThai);
      }
      if (this.userService.isTongCuc()) {
        let listTrangThai = [STATUS.DU_THAO,STATUS.DA_DUYET_LDC,STATUS.DANG_DUYET_CB_VU]
        result = listTrangThai.includes(trangThai);
      }
      return result && this.isAccessPermisson(this.defaultPermisson+"_THEM");
    }
    return false
  }


}
