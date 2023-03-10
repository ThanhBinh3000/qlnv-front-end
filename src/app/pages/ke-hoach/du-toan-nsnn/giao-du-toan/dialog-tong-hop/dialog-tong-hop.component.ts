import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as dayjs from 'dayjs';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';

@Component({
  selector: 'app-dialog-tong-hop',
  templateUrl: './dialog-tong-hop.component.html',
  styleUrls: ['./dialog-tong-hop.component.scss']
})

export class DialogTongHopComponent implements OnInit {
  @Input() obj

  userInfo: any;
  response: any = {
    namHienTai: null,
    maDvi: null,
    lstCtietBcao: [],
    lstDviTrucThuoc: [],
    maBcao: null,
    loai: "3",
    maPa: null,
    maPaCha: null,
    idSoTranChi: null,
  };

  lstLoaiPa = [
    {
      id: "1",
      tenDm: 'Phương án phân bổ giao dự toán chi',
    },
    {
      id: "2",
      tenDm: 'Phương án giao, điều chỉnh dự toán chi',
    }
  ]
  lstNam: number[] = [];
  lstPa: any[] = [];
  lstPaLoai: any[] = [];
  checkReport: boolean;


  constructor(
    private _modalRef: NzModalRef,
    private userService: UserService,
    private giaoDuToanChiService: GiaoDuToanChiService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.response.maDvi = this.userInfo?.MA_DVI;

    const thisYear = dayjs().get('year');
    for (let i = -50; i < 30; i++) {
      this.lstNam.push(thisYear + i);
    }
  }
  // tong hop theo ma phuong an
  async tongHopPa() {
    const request = {
      maPa: this.response.maPa,
      maDvi: this.obj.maDvi,
      namPa: this.response.namHienTai
    }
    this.spinner.show();
    await this.giaoDuToanChiService.tongHopGiaoDuToan(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          console.log(data);
          this.response.lstCtietBcao = data.data.lstPa;
          this.response.lstDviTrucThuoc = data.data.lstGiaoDtoanDviTrucThuocs;
          this.response.maPaCha = data.data.maPaCha;
          this.response.lstCtietBcao.forEach(item => {
            if (!item.id) {
              item.id = uuid.v4() + 'FE';
            }
            item.lstCtietBcaos.forEach(itm => {
              if (!itm.id) {
                itm.id = uuid.v4() + 'FE';
              }
            });
          })
          // this.response.lstDviTrucThuoc.forEach(item => {
          //   item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
          //   item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          // })
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.spinner.hide();
  }

  changeModel() {
    this.getListPA();
  }



  //lay danh sach cac phuong an co the tong hop lai
  async getListPA() {
    this.spinner.show()
    const requestReport = {
      maDvi: this.obj.maDvi,
      namPa: this.response.namHienTai
    };
    this.lstPaLoai = []
    await this.giaoDuToanChiService.dsPaTongHop(requestReport).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.lstPa = res.data;
        // this.lstPa = this.lstPa.filter(item => item.listTtCtiet.every(e => e.trangThai == '1'));
        let lstPaTemp = []
        lstPaTemp = this.lstPa.filter(s => s.maLoaiDan == this.response.loai);
        if (this.userInfo.CAP_DVI == "1") {
          lstPaTemp.forEach(s => {
            this.lstPaLoai.push(
              {
                maPa: s.maPaCha
              }
            )
          })
        } else {
          lstPaTemp.forEach(s => {
            this.lstPaLoai.push(
              {
                maPa: s.maPa
              }
            )
          })
        }
        console.log(res.data);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide()
  }

  changeLoai() {
    let lstPaTemp = []
    this.lstPaLoai = []
    lstPaTemp = this.lstPa.filter(s => s.maLoaiDan == this.response.loai);
    if (this.userInfo.CAP_DVI == "1") {
      lstPaTemp.forEach(s => {
        this.lstPaLoai.push(
          {
            maPa: s.maPaCha
          }
        )
      })
    } else {
      lstPaTemp.forEach(s => {
        this.lstPaLoai.push(
          {
            maPa: s.maPa
          }
        )
      })
    }
  }

  async handleOk() {
    if (!this.response.loai) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    } else {
      if ((this.response.loai == 1 && !this.response.maPa) || (this.response.loai == 2 && !this.response.namHienTai)) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        return;
      }
    }
    await this.tongHopPa();
    if (this.response.lstDviTrucThuoc?.length == 0) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EXIST_REPORT);
      return;
    }

    const maPaCha = this.response.maPaCha
    let maBcao
    await this.giaoDuToanChiService.SinhMaBaoCao().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          maBcao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
          return;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        return;
      },
    );

    const request1 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstGiaoDtoanTrucThuocs: this.response.lstDviTrucThuoc,
      lstCtiets: this.response.lstCtietBcao,
      maDvi: this.response.maDvi,
      maDviTien: "1",
      maBcao: maBcao,
      maPa: this.response.maPa,
      maPaCha: this.response.maPaCha,
      namPa: this.response.namHienTai,
      // soQd: null,
      maPhanGiao: "2",
      maLoaiDan: '3',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: null,
      tabSelected: 'addBaoCao',
    };
    this._modalRef.close(request1);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
