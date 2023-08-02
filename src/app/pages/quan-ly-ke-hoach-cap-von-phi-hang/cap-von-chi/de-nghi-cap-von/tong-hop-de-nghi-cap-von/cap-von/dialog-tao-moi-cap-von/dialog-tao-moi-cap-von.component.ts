
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { divNumber, mulNumber, sumNumber } from 'src/app/Utility/func';
import { CAN_CU_GIA, LOAI_DE_NGHI, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { Dncv, ItemContract, Report } from '../../../de-nghi-cap-von.constant';

@Component({
  selector: 'app-dialog-tao-moi-cap-von',
  templateUrl: './dialog-tao-moi-cap-von.component.html',
  styleUrls: ['./dialog-tao-moi-cap-von.component.scss']
})

export class DialogTaoMoiCapVonComponent implements OnInit {
  @Input() request: any;

  userInfo: any;
  response: Report = new Report();
  loaiDns: any[] = LOAI_DE_NGHI;
  canCuGias: any[] = CAN_CU_GIA;

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private userService: UserService,
    private capVonNguonChiService: CapVonNguonChiService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.response.maLoai = this.request.maLoai;
    if (this.userService.isChiCuc()) {
      this.canCuGias = this.canCuGias.filter(e => e.id == Utils.QD_DON_GIA);
    }
    if (!this.userService.isTongCuc()) {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
    }
  }

  changeDnghi() {
    this.loaiDns = LOAI_DE_NGHI;
    if (this.userService.isTongCuc()) {
      if (this.response.canCuVeGia == Utils.QD_DON_GIA) {
        this.loaiDns = LOAI_DE_NGHI.filter(e => e.id != Utils.MUA_VTU);
      }
    } else {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
    }
    if (this.response.canCuVeGia == Utils.QD_DON_GIA) {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_GAO && e.id != Utils.MUA_MUOI);
    }
  }

  //neu la de nghi theo don gia mua can lay ra so quyet dinh chi tieu;
  getSoQdChiTieu() {
    if (!this.response.canCuVeGia) {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn căn cứ về giá');
      this.response.namBcao = null;
      return;
    }
    const request = {
      namKHoach: this.response.namBcao,
      maDvi: this.userInfo?.MA_DVI,
    }
    this.spinner.show();
    this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.response.soQdChiTieu = data.data[0];
          if (!this.response.soQdChiTieu) {
            this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy số quyết định chỉ tiêu cho năm ' + this.response.namBcao);
            this.response.namBcao = null;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          this.response.namBcao = null;
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        this.response.namBcao = null;
      }
    )
    this.spinner.hide();
  }

  async checkReport() {
    if (!this.response.namBcao || !this.response.canCuVeGia || !this.response.loaiDnghi) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this.request.namBcao = this.response.namBcao;
    this.request.canCuVeGia = this.response.canCuVeGia;
    this.request.loaiDnghi = this.response.loaiDnghi;
    this.spinner.show();
    await this.capVonNguonChiService.timKiemDeNghi(this.request.request()).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          let lstBcao = [];
          if (data.data.content?.length > 0) {
            lstBcao = data.data.content;
            lstBcao.sort((a, b) => b.dot - a.dot);
            if ([Status.TT_02, Status.TT_04, Status.TT_01].includes(lstBcao[0].trangThai)) {
              this.notification.warning(MESSAGE.WARNING, 'Trạng thái của đợt trước không cho phép tạo mới!')
              this.response.loaiDnghi = null;
              return;
            } else {
              const index = lstBcao.findIndex(e => !Status.check('reject', e.trangThai));
              if (index != -1) {
                this.initReport(lstBcao?.length + 1, lstBcao[index].id)
              }
            }
          } else {
            this.initReport(lstBcao?.length + 1);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          this.response.loaiDnghi = null;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        this.response.loaiDnghi = null;
      }
    );
    this.spinner.hide();
  }

  async initReport(soLan: number, id?: string) {
    this.response.ngayTao = new Date();
    this.response.maDvi = this.userInfo.MA_DVI;
    this.response.soLan = soLan;
    this.response.trangThai = Status.TT_01;
    this.response.nguoiTao = this.userInfo.sub;
    await this.getMaDnghi();
    if (!id) {
      if (this.response.canCuVeGia == Dncv.DON_GIA) {
        this.response.lstCtiets.push({
          ...new ItemContract(),
          id: uuid.v4() + 'FE',
          stt: '0.1',
          maDvi: this.userInfo.MA_DVI,
          tenDvi: this.userInfo?.TEN_DVI,
        })
        this.getTongHopData();
      } else {
        this.getContractData();
      }
    } else {
      await this.capVonNguonChiService.ctietDeNghi(id).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.response.lstCtiets = [];
            data.data.lstCtiets?.forEach(item => {
              this.response.lstCtiets.push({
                ...new ItemContract(),
                ...item,
                id: uuid.v4() + 'FE',
                luyKeCapUng: Operator.sum([item.luyKeCapUng, item.capUng]),
                luyKeCapVon: Operator.sum([item.luyKeCapVon, item.capVon]),
                luyKeCong: Operator.sum([item.luyKeCong, item.cong]),
                uncNgay: null,
                capUng: null,
                cap: null,
                cong: null,
              })
            })
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
            this.response.loaiDnghi = null;
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          this.response.loaiDnghi = null;
        },
      );
    }
  }

  async getTongHopData() {
    if (this.userService.isCuc()) {
      this.request.maLoai = '2';
      this.request.trangThai = '7';
      await this.capVonNguonChiService.timKiemDeNghi(this.request.request()).toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            const idRequest = data.data.content[0].id;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      )
    }
  }

  async getContractData() {
    const request = {
      namKHoach: this.response.namBcao,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: null,
    }
    switch (this.response.loaiDnghi) {
      case Dncv.THOC:
        request.loaiVthh = "0101"
        break;
      case Dncv.GAO:
        request.loaiVthh = "0102"
        break;
      case Dncv.MUOI:
        request.loaiVthh = "04"
        break;
      case Dncv.VTU:
        request.loaiVthh = "02"
        break;

      default:
        break;
    }
    await this.capVonNguonChiService.dsachHopDong(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          let unitId = uuid.v4() + 'FE';
          this.response.lstCtiets.push({
            ...new ItemContract(),
            id: unitId,
            stt: '0.1',
            maDvi: this.userInfo.MA_DVI,
            tenDvi: this.userInfo?.TEN_DVI
          })
          data.data.forEach(item => {
            if (this.response.lstCtiets.findIndex(e => e.qdPheDuyetKqNhaThau == item.soQdPdKhlcnt) == -1) {
              const temp: ItemContract = ({
                ...new ItemContract(),
                id: uuid.v4() + 'FE',
                maDvi: this.userInfo.MA_DVI,
                tenDvi: this.userInfo?.TEN_DVI,
                tenKhachHang: item.tenNhaThau,
                qdPheDuyetKqNhaThau: item.soQdPdKhlcnt,
              })
              this.response.lstCtiets = Table.addChild(unitId, temp, this.response.lstCtiets);
            }
            const temp: ItemContract = ({
              ... new ItemContract(),
              id: uuid.v4() + 'FE',
              qdPheDuyetKqNhaThau: item.tenGoiThau + '/' + item.soHd,
              slKeHoach: item.soLuongKehoach,
              slHopDong: item.soLuong,
              donGia: item.donGia,
              gtHopDong: Operator.mul(item.soLuong, item.donGia),
            })
            const index = this.response.lstCtiets.findIndex(e => e.qdPheDuyetKqNhaThau == item.soQdPdKhlcnt);
            this.response.lstCtiets = Table.addChild(this.response.lstCtiets[index].id, temp, this.response.lstCtiets);
            this.response.lstCtiets[index].slKeHoach = Operator.sum([this.response.lstCtiets[index].slKeHoach, temp.slKeHoach]);
            this.response.lstCtiets[index].slHopDong = Operator.sum([this.response.lstCtiets[index].slHopDong, temp.slHopDong]);
            this.response.lstCtiets[index].gtHopDong = Operator.sum([this.response.lstCtiets[index].gtHopDong, temp.gtHopDong]);
          })
        } else {
          this.notification.warning(MESSAGE.WARNING, data?.msg);
        }
      },
      (err) => {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  async getMaDnghi() {
    await this.capVonNguonChiService.maDeNghi().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.response.maDnghi = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  handleOk() {
    if (!this.response.namBcao || !this.response.canCuVeGia || !this.response.loaiDnghi) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }

    this._modalRef.close({
      baoCao: this.response,
      id: null,
      tabSelected: this.response.canCuVeGia == Dncv.DON_GIA ? 'dn-capvon' : 'denghi-hopdong-capvon',
    });
  }

  handleCancel() {
    this._modalRef.close();
  }
}

