import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';

export class ItemData {
  id!: any;
  levelDm!: number;
  loaiDm!: string;
  maCha!: number;
  tenDm!: string;
  thongTin!: string;
  trangThai!: string;
}


@Component({
  selector: 'app-danh-sach-danh-muc-goc',
  templateUrl: './danh-sach-danh-muc-goc.component.html',
  styleUrls: ['./danh-sach-danh-muc-goc.component.scss']
})
export class DanhSachDanhMucGocComponent implements OnInit {
  i = 0;
  danhMucGocs: ItemData[] = []
  editId: number | null = null;
  loaiDm!: string;
  tenDm!: string;
  id!: string;
  levelDm!: string;
  idGoc: number;
  levelDmGoc: number;
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  constructor(
    private danhMuc: DanhMucHDVService,
    private notification: NzNotificationService,
  ) {
  }

  async ngOnInit() {
    // load du lieu danh muc lan dau khi vao trang
    await this.danhMuc.dmGoc().toPromise().then(data => {
      if (data.statusCode == 0) {
        this.danhMucGocs = data.data?.content;
        this.status = true
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
      }
    })
  }

  // thêm mới danh mục
  async addDanhMucGoc() {
    // Thêm danh mục con
    if (this.idGoc) {
      let item = {
        id: 0,
        levelDm: Number(this.levelDmGoc) + 1,
        loaiDm: `${this.loaiDm}`,
        maCha: Number(this.idGoc),
        tenDm: `${this.tenDm}`,
        thongTin: "string",
        trangThai: "01",
      }

      await this.danhMuc.addDm(item).toPromise().then(
        data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
      let req = {
        "paggingReq": {
          "limit": 20,
          "page": 1
        },
        "str": "string",
        "trangThai": "string"
      }
      await this.danhMuc.danhSachDanhMucCon(req, this.idGoc).toPromise().then(
        data => {
          this.danhMucGocs = data.data?.content
        }
      )
      this.tenDm = ''
    }
    // Thêm danh mục cha
    else {
      let item = {
        id: 0,
        levelDm: 0,
        loaiDm: `${this.loaiDm}`,
        maCha: null,
        tenDm: `${this.tenDm}`,
        thongTin: "string",
        trangThai: "01",
      }
      await this.danhMuc.addDm(item).toPromise().then(
        data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })

      await this.danhMuc.dmGoc().toPromise().then(data => {
        if (data.statusCode == 0) {
          this.danhMucGocs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        }
      })
      this.tenDm = ''
    }
  }
  idCha!: any
  // lấy danh mục con và xem chi tiết danh mục cha
  async xemChiTiet(id: number) {
    this.idGoc = id;
    let req = {
      "paggingReq": {
        "limit": 20,
        "page": 1
      },
      "str": "string",
      "trangThai": "string"
    }
    await this.danhMuc.danhSachDanhMucCon(req, id).toPromise().then(
      data => {
        this.danhMucGocs = data.data?.content
        this.tenDm = ''
      }
    )

    await this.danhMuc.chiTietDmGoc(id).toPromise().then(
      data => {
        this.levelDmGoc = data.data?.levelDm
        this.loaiDm = data.data?.loaiDm
        this.idCha = data.data?.idCha
      }
    )
    if (this.levelDmGoc >= 0) {
      this.status = false
    }
    else {
      this.status = true;
    }
  }

  // Xóa danh mục
  async xoaDanhMuc(id: number) {
    debugger
    this.idGoc = id;

    await this.danhMuc.xoaDanhMuc(id).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.idCha = data.data?.idCha
          if (this.idCha) {
            this.idGoc = this.idCha?.id
          } else {
            this.idGoc = null
          }

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        }
      }
    )

    if (!this.idGoc) {
      await this.danhMuc.dmGoc().toPromise().then(data => {
        if (data.statusCode == 0) {
          this.danhMucGocs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        }
      })
    } else {
      let req = {
        "paggingReq": {
          "limit": 20,
          "page": 1
        },
        "str": "string",
        "trangThai": "string"
      }
      await this.danhMuc.danhSachDanhMucCon(req, this.idGoc).toPromise().then(
        data => {
          this.danhMucGocs = data.data?.content
          this.tenDm = ''
        }
      )

      await this.danhMuc.chiTietDmGoc(this.idGoc).toPromise().then(
        data => {
          this.levelDmGoc = data.data?.levelDm
          this.loaiDm = data.data?.loaiDm
        }
      )
    }

  }

  // hàm quay lại
  async roleBack() {
    if (this.levelDmGoc === 0) {
      await this.danhMuc.dmGoc().toPromise().then(data => {
        if (data.statusCode == 0) {
          this.danhMucGocs = data.data?.content;
          this.loaiDm = ''
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        }
      })
    }
    else if (this.levelDmGoc === 1) {
      await this.danhMuc.chiTietDmGoc(this.idGoc).toPromise().then(
        data => {
          this.loaiDm = data.data?.loaiDm
          this.idCha = data.data?.idCha
          if (this.idCha) {
            this.idGoc = this.idCha.id
          } else {
            this.idGoc = null
          }
        }
      )
      if (!this.idGoc) {
        await this.danhMuc.dmGoc().toPromise().then(data => {
          if (data.statusCode == 0) {
            this.danhMucGocs = data.data?.content;
            this.loaiDm = ''
            this.tenDm = ''
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          }
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
          }
        })
      } else {
        let req = {
          "paggingReq": {
            "limit": 20,
            "page": 1
          },
          "str": "string",
          "trangThai": "string"
        }
        await this.danhMuc.danhSachDanhMucCon(req, this.idGoc).toPromise().then(
          data => {
            this.danhMucGocs = data.data?.content
            this.tenDm = ''
          }
        )
      }
    }
  }
}
