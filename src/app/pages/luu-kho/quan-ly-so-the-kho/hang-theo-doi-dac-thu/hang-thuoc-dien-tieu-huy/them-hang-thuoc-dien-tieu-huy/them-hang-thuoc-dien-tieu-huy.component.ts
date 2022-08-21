import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { QuanLyChatLuongLuuKhoService } from 'src/app/services/quanLyChatLuongLuuKho.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-them-hang-thuoc-dien-tieu-huy',
    templateUrl: './them-hang-thuoc-dien-tieu-huy.component.html',
    styleUrls: ['./them-hang-thuoc-dien-tieu-huy.component.scss'],
})
export class ThemHangThuocDienTieuHuyComponent implements OnInit {
    @Input('dsTong') dsTong;
    @Input('dsLoaiHangHoa') dsLoaiHangHoa: any[];
    @Input('editList') editList: boolean;
    @Input('detail') detail: boolean;
    @Input('dataEditList') dataEditList: any;
    formData: FormGroup;
    dataTable: any = [];
    rowItem: IHangTieuHuy = {
        id: null,
        idLoaiHangHoa: null,
        loaiHangHoa: null,
        idHangHoa: null,
        chungLoaiHangHoa: null,
        idDiemKho: null,
        tenDiemKho: null,
        idNhaKho: null,
        tenNhaKho: null,
        idNganKho: null,
        tenNganKho: null,
        idLoKho: null,
        tenLoKho: null,
        soLuongTon: null,
        soLuongThanhLy: null,
        donVi: null,
        lyDo: null,
    };
    page: number = 1;
    pageSize: number = PAGE_SIZE_DEFAULT;
    totalRecord: number = 10;
    dataEdit: any = [];
    dsDonVi = [];
    dsDonViDataSource = [];
    dsDiemKho = [];
    dsDiemKhoDataSource = [];
    dsNhaKho = [];
    dsNhaKhoDataSource = [];
    dsNganLo = [];
    dsNganLoDataSource = [];
    dsNganKho = [];
    dsChungLoaiHangHoa = [];
    dsLoKho = [];
    @Output('close') onClose = new EventEmitter<any>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly donviService: DonviService,
        private readonly quanlyChatLuongService: QuanLyChatLuongLuuKhoService,
        private notification: NzNotificationService,
        private readonly spinner: NgxSpinnerService,
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.initData();
    }

    initForm(): void {
        if (this.detail) {
            const donvi = this.dsDonVi.find((item) => item.tenDvi == this.dataEditList.tenDonvi)
            this.formData = this.fb.group({
                idDonVi: [{ value: donvi ? donvi.id : null, disabled: this.editList }],
                maDvi: [{ value: donvi ? donvi.maDvi : null, disabled: this.editList }],
                idDanhSach: [{ value: this.dataEditList.maDanhSach, disabled: this.editList }],
                ngayTao: [{ value: this.dataEditList.ngayTao, disabled: this.editList }],
            });
            this.dataEdit = [];
            this.dataEditList.ds.map((item: IHangTieuHuy, index: number) => {
                item['id'] = index + 1;
                const obj = {
                    edit: false,
                    data: item,
                }
                this.dataEdit.push(obj)
            })
            this.dataTable = this.dataEditList.ds;
        } else {
            this.formData = this.fb.group({
                idDonVi: [null],
                maDvi: [null],
                tenDonVi: [null],
                idDanhSach: [null],
                ngayTao: [new Date()],
            });
        }
    }

    initData() {
        this.loadDsTong();
    }

    onChangeLoaiVthh(event) {
        this.dsChungLoaiHangHoa = [];
        const loaiVthh = this.dsLoaiHangHoa.filter(item => item.id == event);
        if (loaiVthh.length > 0) {
            this.dsChungLoaiHangHoa = loaiVthh[0].child;
        }
    }

    onChangeChungLoai(event) {
        const chungLoai = this.dsChungLoaiHangHoa.filter(item => item.ma == event)
        if (chungLoai) {
            this.rowItem.donVi = chungLoai[0].maDviTinh;
        }
    }

    loadDsTong() {
        if (!isEmpty(this.dsTong)) {
            this.dsDonVi = this.dsTong[DANH_MUC_LEVEL.CHI_CUC];
            this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
            this.dsDiemKho = this.dsTong[DANH_MUC_LEVEL.DIEM_KHO];
            this.dsDiemKhoDataSource = this.dsDiemKho.map((item) => item.tenDvi);
            this.dsNhaKho = this.dsTong[DANH_MUC_LEVEL.NHA_KHO];
            this.dsNhaKhoDataSource = this.dsNhaKho.map((item) => item.tenDvi);
            this.dsNganLo = this.dsTong[DANH_MUC_LEVEL.NGAN_LO];
            this.dsNganLoDataSource = this.dsNganLo.map((item) => item.tenDvi);
        }
    }

    onChangeDonVi(id) {
        this.dsDonVi.map((item) => {
            if (item.id === Number(id)) {
                this.formData.controls.maDvi.setValue(item.maDvi)
            }
        })
        const chiCuc = this.dsDonVi.find((item) => item.id === Number(id));
        if (chiCuc) {
            const result = {
                ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
            };
            this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
        } else {
            this.dsDiemKho = [];
        }
    }

    onChangeDiemKho(id) {
        const diemKho = this.dsDiemKho.find((item) => item.id === Number(id));
        if (diemKho) {
            const result = {
                ...this.donviService.layDsPhanTuCon(this.dsTong, diemKho),
            };
            this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
        } else {
            this.dsNhaKho = [];
        }
    }

    onChangeNhaKho(id) {
        const nhaKho = this.dsNhaKho.find((item) => item.id === Number(id));
        if (nhaKho) {
            const result = {
                ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho),
            };
            this.dsNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
        } else {
            this.dsNganKho = [];
        }
    }

    onChangeNganKho(id) {
        const nganKho = this.dsNganKho.find((item) => item.id === Number(id));
        if (nganKho) {
            const result = {
                ...this.donviService.layDsPhanTuCon(this.dsTong, nganKho),
            };
            this.dsLoKho = result[DANH_MUC_LEVEL.LO_KHO];
        } else {
            this.dsLoKho = [];
        }
    }

    huy() {
        this.onClose.emit();
    }

    exportData() {
        this.spinner.show();
        try {
            const body = {
                "maDs": this.dataEditList.maDanhSach
            }
            this.quanlyChatLuongService
                .hangTieuHuyexportListDetail(body)
                .subscribe((blob) =>
                    saveAs(blob, 'chi-tiet-danh-sach-hang-tieu-huy.xlsx'),
                );
            this.spinner.hide();
        } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }

    inDanhSach() { }

    async luu() {
        this.spinner.show();
        const body = {
            "id": this.detail ? this.dataEditList.id : null,
            "maDonVi": this.formData.controls.maDvi.value,
            "ds": [],
        }
        this.dataTable.map((data: any) => {
            const lstNganKho = this.dsNganKho.find((item) => item.tenDvi == data.nganKho)
            const lstLoKho = lstNganKho?.children;
            const lstLoaiHang = this.dsLoaiHangHoa.find((item) => data.loaiHang.includes(item.ten));
            const lstChungLoai = lstLoaiHang?.child
            const objDS = {
                lyDo: data.lyDo,
                maChungLoaiHang: lstChungLoai.find((item) => item.ten == data.chungLoaiHang).ma,
                maDiemKho: this.dsDiemKho.find((item) => item.tenDvi == data.diemKho).maDvi,
                maLoKho: (lstLoKho && lstLoKho.length > 0 ? lstLoKho.find((item) => item.tenDvi == data.loKho).maDvi : null),
                maLoaiHang: this.dsLoaiHangHoa.find((item) => data.loaiHang.includes(item.ten)).ma,
                maNganKho: this.dsNganKho.find((item) => item.tenDvi == data.nganKho).maDvi,
                maNhaKho: this.dsNhaKho.find((item) => item.tenDvi == data.nhaKho).maDvi,
                slTon: data.slTon,
                slYeuCau: data.slYeuCau
            }
            body.ds.push(objDS)
        })
        var res: any
        try {
            if (this.detail) {
                res = await this.quanlyChatLuongService.hangTieuHuySuads(body);
                if (res.msg == MESSAGE.SUCCESS) {
                    this.onClose.emit();
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                }
                else {
                    this.notification.error(MESSAGE.ERROR, res.msg);
                }
            } else {
                res = await this.quanlyChatLuongService.hangTieuHuyThemds(body);
                if (res.msg == MESSAGE.SUCCESS) {
                    this.onClose.emit();
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                }
                else {
                    this.notification.error(MESSAGE.ERROR, res.msg);
                }
            }
            this.spinner.hide();
        } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }

    xoaItem(id: number) {
        this.dataTable = this.dataTable.filter(function (obj) {
            return obj.id !== id;
        });
    }

    themMoiItem() {
        if (!this.rowItem.idLoKho) {
            this.notification.error(MESSAGE.ERROR_NOT_EMPTY, 'Vui lòng chọn lô kho.');
            return;
        }
        const newItem = {
            lyDo: this.rowItem.lyDo,
            chungLoaiHang: this.dsChungLoaiHangHoa.find((item) => item.ma == this.rowItem.chungLoaiHangHoa).ten,
            diemKho: this.dsDiemKho.find((item) => item.id == this.rowItem.idDiemKho).tenDvi,
            loKho: (this.dsLoKho && this.dsLoKho.length > 0 && this.dsLoKho.find((item) => item.id == this.rowItem.idLoKho)) ? this.dsLoKho.find((item) => item.id == this.rowItem.idLoKho).tenDvi : null,
            loaiHang: this.dsLoaiHangHoa.find((item) => item.id == this.rowItem.idLoaiHangHoa).ten,
            nganKho: this.dsNganKho.find((item) => item.id == this.rowItem.idNganKho).tenDvi,
            nhaKho: this.dsNhaKho.find((item) => item.id == this.rowItem.idNhaKho).tenDvi,
            slTon: this.rowItem.soLuongTon,
            slYeuCau: this.rowItem.soLuongThanhLy,
            donVi: this.rowItem.donVi,
            id: this.dataTable.length,
        }
        this.dataEdit.push({ edit: false, data: newItem });
        this.dataTable = [...this.dataTable, newItem];
        console.log(this.dataTable);
        this.resetRowItem();
    }

    clearData() { }

    changePageIndex(event) { }

    changePageSize(event) { }

    resetRowItem() {
        Object.keys(this.rowItem).map(key => {
            this.rowItem[key] = null
        })
    }

    editItem(id: number): void {
        var idx = id > 0 ? id - 1 : id;
        this.dataEdit[idx].edit = true;
    }

    huyEdit(id: number): void {
        const index = this.dataTable.findIndex((item) => item.id === id);
        this.dataEdit[id] = {
            data: { ...this.dataTable[index] },
            edit: false,
        };
    }

    luuEdit(id: number): void {
        const index = this.dataTable.findIndex((item) => item.id === id);
        Object.assign(this.dataTable[index], this.dataEdit[id].data);
        this.dataEdit[id].edit = false;
    }

    updateEditCache(): void {
        this.dataTable.forEach((item) => {
            this.dataEdit[item.id] = {
                edit: false,
                data: { ...item },
            };
        });
    }
}

interface IDanhSachHangTieuHuy {
    id: number;
    maDanhSach: string;
    idDonVi: number;
    tenDonVi: string;
    ngayTao: Date;
    trangThai: string;
    danhSachHang: IHangTieuHuy[];
}

interface IHangTieuHuy {
    id: number;
    idLoaiHangHoa: number;
    loaiHangHoa: string;
    idHangHoa: number;
    chungLoaiHangHoa: string;
    idDiemKho: number;
    tenDiemKho: string;
    idNhaKho: number;
    tenNhaKho: string;
    idNganKho: number;
    tenNganKho: string;
    idLoKho: string;
    tenLoKho: string;
    soLuongTon: number;
    soLuongThanhLy: number;
    donVi: string;
    lyDo: string;
}
