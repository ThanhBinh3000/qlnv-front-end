import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, divMoney, divNumber, LOAI_DE_NGHI, mulNumber, sumNumber, Utils } from 'src/app/Utility/utils';
import { BaoCao, ItemRequest } from '../../de-nghi-cap-von.constant';
import * as uuid from "uuid";

@Component({
  selector: 'dialog-tao-moi-de-nghi-cap-von',
  templateUrl: './dialog-tao-moi-de-nghi-cap-von.component.html',
  styleUrls: ['./dialog-tao-moi-de-nghi-cap-von.component.scss'],
})

export class DialogTaoMoiDeNghiCapVonComponent implements OnInit {
  @Input() obj: any;

  userInfo: any;
  response: BaoCao = new BaoCao();
  loaiDns: any[] = LOAI_DE_NGHI;
  canCuGias: any[] = CAN_CU_GIA;
  isRequestExist: number;
  isContractExist: boolean;
  idRequest!: string;

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private userService: UserService,
    private capVonNguonChiService: CapVonNguonChiService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if (this.userService.isChiCuc()) {
      this.canCuGias = this.canCuGias.filter(e => e.id == Utils.QD_DON_GIA);
    }
    if (!this.userService.isTongCuc()) {
      this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
    }
    this.response.dnghiCapvonCtiets = [];
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
  //lay ra chi tiet cua de nghi
  async getDetail() {
    if (!this.response.namBcao) {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập năm đề nghị');
      this.response.loaiDnghi = null;
      return;
    }
    await this.checkRequest();
    if (this.isRequestExist == 2) {
      this.notification.warning(MESSAGE.WARNING, 'Trạng thái đề nghị không cho phép đề nghị cấp vốn lần mới');
      return;
    }
    if (this.isRequestExist == 0) {
      this.response.maDvi = this.userInfo?.MA_DVI;
      this.response.ngayTao = new Date();
      this.response.soLan = 1;
      this.response.trangThai = Utils.TT_BC_1;
      this.response.maDviTien = '1';
      //bao cao chua ton tai
      if (this.response.canCuVeGia == Utils.HD_TRUNG_THAU) {
        if (this.response.loaiDnghi == Utils.MUA_VTU) {
          await this.getContractData();
        } else {
          if (this.userService.isCuc()) {
            await this.checkContract();
            if (!this.isContractExist) {
              this.notification.warning(MESSAGE.WARNING, 'Không tồn tại hợp đồng cho loại đề nghị đã chọn');
              return;
            } else {
              await this.syntheticContract();
            }
          } else {
            await this.callSynthetic();
          }
        }
      } else {
        //neu la chi cuc thi tao moi de nghi
        if (this.userService.isChiCuc()) {
          this.response.dnghiCapvonCtiets = [];
          this.response.dnghiCapvonCtiets.push({
            ... new ItemRequest(),
            id: uuid.v4() + 'FE',
            maDvi: this.userInfo?.MA_DVI,
            tenDvi: this.userInfo?.TEN_DVI,
            dnghiCapvonLuyKes: [],
          })
        } else {
          await this.callSynthetic();
          if (this.userService.isCuc()) {
            this.response.dnghiCapvonCtiets.push({
              ... new ItemRequest(),
              id: uuid.v4() + 'FE',
              maDvi: this.userInfo?.MA_DVI,
              tenDvi: this.userInfo?.TEN_DVI,
              dnghiCapvonLuyKes: [],
            })
          }
        }
      }
      await this.getMaDnghi();
    } else {
      //them lan moi cho de nghi
      await this.capVonNguonChiService.ctietDeNghi(this.idRequest).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.response = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
      this.response.dnghiCapvonCtiets.forEach(item => {
        if (item.maDvi == this.userInfo?.MA_DVI || !item.maDvi) {
          item.dnghiCapvonLuyKes.push({
            id: uuid.v4() + 'FE',
            soLan: this.response.soLan,
            trangThai: this.response.trangThai,
            vonDuyetCong: item.vonDuyetCong,
            vonDuyetCapUng: item.vonDuyetCapUng,
            vonDuyetCapVon: item.vonDuyetCapVon,
            uyNhchiNgay: item.uyNhchiNgay,
            uyNhchiMaNguonNs: item.uyNhchiMaNguonNs,
            uyNhchiNienDoNs: item.uyNhchiNienDoNs,
            uyNhchiNienSoTien: item.uyNhchiNienSoTien,
          })
          item.luyKeCong = sumNumber([item.luyKeCong, item.vonDuyetCong]);
          item.luyKeCapUng = sumNumber([item.luyKeCapUng, item.vonDuyetCapUng]);
          item.luyKeCapVon = sumNumber([item.luyKeCapVon, item.vonDuyetCapVon]);
          item.soTtLuyKe = sumNumber([item.soTtLuyKe, item.uyNhchiNienSoTien]);
          item.vonDuyetCong = 0;
          item.vonDuyetCapUng = 0;
          item.vonDuyetCapVon = 0;
          item.uyNhchiNgay = null;
          item.uyNhchiMaNguonNs = null;
          item.uyNhchiNienDoNs = null;
          item.uyNhchiNienSoTien = 0;
        }
      })
      if (this.response.loaiDnghi != Utils.MUA_VTU) {
        if ((this.response.canCuVeGia == Utils.HD_TRUNG_THAU && this.userService.isTongCuc()) ||
          (this.response.canCuVeGia == Utils.QD_DON_GIA && !this.userService.isChiCuc())) {
          this.callSynthetic();
        }
      }
      this.response.soLan += 1;
      this.response.trangThai = Utils.TT_BC_1;
    }
  }

  async callSynthetic() {
    const request = {
      canCuVeGia: this.response.canCuVeGia,
      loaiDnghi: this.response.loaiDnghi,
      maDvi: this.userInfo?.MA_DVI,
      namBcao: this.response.namBcao,
    }
    await this.capVonNguonChiService.tongHopDeNghi(request).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          res.data.forEach(item => {
            const temp = item;
            const id = this.response.dnghiCapvonCtiets.find(e => e.maDvi == temp.maDvi)?.id;
            temp.id = id ? id : uuid.v4() + 'FE';
            this.response.dnghiCapvonCtiets = this.response.dnghiCapvonCtiets.filter(e => e.maDvi != temp.maDvi);
            this.response.dnghiCapvonCtiets.push(temp);
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  async getContractData() {
    const request = {
      namKHoach: this.response.namBcao,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: "02",
    }
    await this.capVonNguonChiService.dsachHopDong(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          data.data.forEach(item => {
            const temp: ItemRequest = {
              ... new ItemRequest(),
              id: uuid.v4() + 'FE',
              tenKhachHang: item.tenNhaThau,
              isParent: false,
              qdPheDuyetKqNhaThau: item.soHd,
              slKeHoach: item.soLuongKehoach,
              slHopDong: item.soLuong,
              donGia: item.donGia,
              gtHopDong: mulNumber(item.soLuong, item.donGia),
              dnghiCapvonLuyKes: [],
            }
            this.response.dnghiCapvonCtiets.push(temp);
            const index = this.response.dnghiCapvonCtiets.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
            if (index == -1) {
              this.response.dnghiCapvonCtiets.push({
                ...temp,
                id: uuid.v4() + 'FE',
                isParent: true,
                qdPheDuyetKqNhaThau: item.soQdPdKhlcnt,
              })
            } else {
              if (this.response.dnghiCapvonCtiets[index].qdPheDuyetKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
                this.response.dnghiCapvonCtiets[index].qdPheDuyetKqNhaThau += ', ' + item.sosoQdPdKhlcnt;
              }
              this.response.dnghiCapvonCtiets[index].slHopDong = sumNumber([this.response.dnghiCapvonCtiets[index].slHopDong, temp.slHopDong]);
              this.response.dnghiCapvonCtiets[index].slKeHoach = sumNumber([this.response.dnghiCapvonCtiets[index].slKeHoach, temp.slKeHoach]);
              this.response.dnghiCapvonCtiets[index].gtHopDong = sumNumber([this.response.dnghiCapvonCtiets[index].gtHopDong, temp.gtHopDong]);
              this.response.dnghiCapvonCtiets[index].donGia = divNumber(this.response.dnghiCapvonCtiets[index].gtHopDong, this.response.dnghiCapvonCtiets[index].slHopDong);
            }
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

  async syntheticContract() {
    console.log(this.response)
    const request = {
      loaiDnghi: this.response.loaiDnghi,
      maDvi: this.userInfo?.MA_DVI,
      namHdong: this.response.namBcao,
    }
    await this.capVonNguonChiService.tongHopHd(request).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          res.data.forEach(item => {
            this.response.dnghiCapvonCtiets.push({
              ...new ItemRequest(),
              id: uuid.v4() + 'FE',
              slKeHoach: item.slKeHoach,
              slHopDong: item.slHopDong,
              slThucHien: item.slThucHien,
              gtHopDong: item.gtHopDong,
              donGia: item.donGia,
              gtriThucHien: item.gtriThucHien,
              duToanDaGiao: item.daGiaoDuToan,
              dnghiCapvonLuyKes: [],
              maDvi: item.maDvi,
              tenDvi: item.tenDvi,
              tenKhachHang: item.tenKhachHang,
              isParent: item.isParent,
              qdPheDuyetKqNhaThau: item.qdPheDuyetKqNhaThau,
            })
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  async checkRequest() {
    this.isRequestExist = 0;
    const request = {
      maDvi: this.userInfo?.MA_DVI,
      namBcao: this.response.namBcao,
      loaiDnghi: this.response.loaiDnghi,
      canCuVeGia: this.response.canCuVeGia,
      paggingReq: {
        limit: 10,
        page: 1,
      },
    }
    await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          if (data.data.content?.length > 0) {
            if (data.data.content[0].trangThai == Utils.TT_BC_7) {
              this.isRequestExist = 1;
              this.idRequest = data.data.content[0].id;
            } else {
              this.isRequestExist = 2;
            }
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

  async checkContract() {
    this.isContractExist = false;
    const request = {
      maDvi: this.userInfo?.MA_DVI,
      namHdong: this.response.namBcao,
      loaiDnghi: this.response.loaiDnghi,
      paggingReq: {
        limit: 10,
        page: 1,
      },
      trangThai: Utils.TT_BC_7,
    }
    await this.capVonNguonChiService.timKiemHopDong(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          if (data.data.content?.length > 0) {
            this.isContractExist = true;
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
  }

  handleOk() {
    if (!this.response.canCuVeGia) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (!this.response.namBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }

    if (!this.response.loaiDnghi) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
