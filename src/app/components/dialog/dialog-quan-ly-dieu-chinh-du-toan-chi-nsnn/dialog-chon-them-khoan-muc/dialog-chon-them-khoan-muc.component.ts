import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
// import { KHOANMUCLIST } from 'src/app/pages/quan-ly-ke-hoach-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.constant';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

export class ItemData {
	id: any;
	tenLoaiKhoan!: any;
	checked!: boolean;
	maNdung!: string;
	dtoanGiao!: string;
}
@Component({
	selector: 'dialog-chon-them-khoan-muc',
	templateUrl: './dialog-chon-them-khoan-muc.component.html',
	styleUrls: ['./dialog-chon-them-khoan-muc.component.scss'],
})
export class DialogChonThemKhoanMucComponent implements OnInit {
	@Input() id: any;

	// khoanMucs: any[] = KHOANMUCLIST;
	lstCTietBCao: ItemData[] = [];

	constructor(
		private _modalRef: NzModalRef,
		private notification: NzNotificationService,
		private spinner: NgxSpinnerService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		private datePipe: DatePipe,
	) { }

	async ngOnInit() {
		this.getDetailReport();
	}

	async getDetailReport() {
		this.spinner.show();
		await this.quanLyVonPhiService.chiTietPhanBo(this.id).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstCTietBCao = data.data.lstCtiet;
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

	getKmName(maNdung: string){
		// return this.khoanMucs.find(e => e.id == maNdung)?.tenDm;
	}

	handleOk() {
		this._modalRef.close(this.lstCTietBCao);
	}

	handleCancel() {
		this._modalRef.close();
	}
}
[]
