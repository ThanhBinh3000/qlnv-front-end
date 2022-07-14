import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-them-quyet-dinh-btc-giao-tcdt',
  templateUrl: './them-quyet-dinh-btc-giao-tcdt.component.html',
  styleUrls: ['./them-quyet-dinh-btc-giao-tcdt.component.scss'],
})
export class ThemQuyetDinhBtcGiaoTcdtComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Output('close') onClose = new EventEmitter<any>();

  quyetDinh: IQuyetDinhBTC = {
    id: null,
    soQd: null,
    namQd: null,
    ngayQd: new Date(),
    trichYeu: null,
    taiLieuDinhKem: null,
    keHoach: [],
  };
  namHienTai: number;
  taiLieuDinhKemList = [];
  dsNam: string[] = [];

  allChecked = false;
  indeterminate = false;

  searchInTable: any = {
    tenBo: null,
    keHoach: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.loadDsNam();
  }

  loadDsNam() {
    this.namHienTai = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((this.namHienTai - i).toString());
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) {}

  huy() {
    this.onClose.emit();
  }

  banHanh() {}

  luu() {}

  exportData() {}

  changePageIndex(event) {}

  changePageSize(event) {}

  xoaKeHoach() {}

  themKeHoach() {}
}

interface IQuyetDinhBTC {
  id: number;
  soQd: string;
  namQd: string;
  ngayQd: Date;
  trichYeu: string;
  taiLieuDinhKem: any;
  keHoach: any;
}
