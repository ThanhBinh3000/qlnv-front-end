import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';


@Component({
    selector: 'app-bao-hiem-hang',
    templateUrl: './bao-hiem-hang.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BaoHiemHangComponent implements OnInit {
    @Input() dataInfo;

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }


    async ngOnInit() {
    }

    handleCancel() {
        this._modalRef.close();
    }

}
