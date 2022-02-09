import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpPaginatedDataSource } from '../../core/http-paginated-table-data-source';
import { DataTableConfig } from '../types';

@Component({
    selector: 'app-datatable-mobile',
    templateUrl: './datatable-mobile.component.html',
    styleUrls: ['./datatable-mobile.component.scss'],
})
export class DatatableMobileComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() config: DataTableConfig<any>;
    dataSource: HttpPaginatedDataSource<any>;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[];
    constructor() {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.init();
    }

    ngOnChanges(_: SimpleChanges): void {
        this.init();
    }

    init() {
        if (this.config.meta.startAtPage) {
            const { pageIndex } = this.config.meta.startAtPage;
            if (this.paginator.pageIndex !== pageIndex) {
                this.paginator.pageIndex = pageIndex;
            }
        }

        this.dataSource = new HttpPaginatedDataSource(this.config.data);
        this.displayedColumns = ['rowDetails'];
        this.dataSource.sort = this.sort;
        this.dataSource.totalElements = this.config.meta.rowsNumber;
        this.dataSource.paginator = this.paginator;
        this.paginator.page.subscribe(this.config.pageChange);
    }
}
