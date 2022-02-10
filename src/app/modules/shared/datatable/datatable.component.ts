import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpPaginatedDataSource } from '../../core/http-paginated-table-data-source';
import { DataTableConfig, DataTableConfigColumn } from '../types';

const ACTION_COL = 'action_col';
const DEFAULT_ACTION_STYLE = { flex: 1 };

@Component({
    selector: 'app-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() config: DataTableConfig<any>;
    dataSource: HttpPaginatedDataSource<any>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[];

    @Output()
    filterChange = new EventEmitter<string>();

    @Output()
    sortChange = new EventEmitter<Sort>();

    @Output()
    selectedPageAt = new EventEmitter<number>();

    @Output()
    selectedPageSize = new EventEmitter<number>();
    
    @Output()
    selectElement = new EventEmitter<any>();

    modelChanged: Subject<string> = new Subject<string>();

    dataPaginator: string[] = [];
    pageSelected = 1;
    numberOfPages = 1;
    pageSize: number = 10;
    lstPageSize: number[] = [10, 20, 30, 40, 50];

    constructor() {
        this.modelChanged.pipe(debounceTime(1000)).subscribe(x => {
            this.applyFilter(x);
        });
    }

    ngOnInit() {
        this.sort.disableClear = true;
    }

    ngAfterViewInit(): void {
        this.init();
    }
    changed(search: string) {
        this.modelChanged.next(search);
    }
    ngOnChanges(_: SimpleChanges): void {
        if (this.config) {
            if (this.config.meta && this.config.meta.startAtPage) {
                this.dataPaginator = [];
                this.numberOfPages = Math.ceil(this.config.meta.rowsNumber / this.config.meta.pageSize)
                this.pageSelected = this.config.meta.startAtPage.pageIndex + 1;
                if (this.numberOfPages > 5) {
                    if (this.pageSelected >= this.numberOfPages - 3) {
                        for (var i = 0; i < 5; i++) {
                            this.dataPaginator.push((this.numberOfPages - 4 + i).toString())
                        }
                    } else if (this.pageSelected >= 3 && this.pageSelected < this.numberOfPages - 3) {
                        for (var i = 0; i < 5; i++) {
                            if (i === 3) {
                                this.dataPaginator.push('...')
                            } else if (i === 4) {
                                this.dataPaginator.push(this.numberOfPages.toString())
                            } else {
                                this.dataPaginator.push((this.pageSelected - 1 + i).toString())
                            }
                        }
                    } else if (this.pageSelected === this.numberOfPages) {
                        for (var i = this.numberOfPages - 4; i <= this.numberOfPages; i++) {
                            this.dataPaginator.push(i.toString())
                        }
                    } else {
                        for (var i = 1; i < 6; i++) {
                            if (i === 4) {
                                this.dataPaginator.push('...')
                            } else if (i === 5) {
                                this.dataPaginator.push(this.numberOfPages.toString())
                            } else {
                                this.dataPaginator.push(i.toString())
                            }
                        }
                    }
                } else {
                    for (var i = 1; i < this.numberOfPages + 1; i++) {
                        this.dataPaginator.push(i.toString())
                    }
                }
            }
        }
        this.init();
    }

    init() {
        this.dataSource = new HttpPaginatedDataSource(
            this.config.data,
            this.config.tableName || '',
            this.config.filterKeys || [],
        );
        let actionColumns: string[] = [];
        if (!this.config.mergeActionColumns) {
            actionColumns = (this.config.actions || []).map(action => action.fieldName);
        } else {
            actionColumns = [ACTION_COL];
        }

        this.displayedColumns = this.config.columns
            .map(column => column.fieldName)
            .concat(actionColumns);
        this.dataSource.totalElements = this.config.meta.rowsNumber;
        this.dataSource.paginator = this.paginator;
        this.setStyle();
    }

    selectElementRow(element: any){
        this.selectElement.emit(element);
    }
    setStyle() {
        setTimeout(() => {
            let columns = this.config.columns.map(item => ({ fieldName: item.fieldName, style: item.style }));
            if (this.config.mergeActionColumns) {
                columns.push({ fieldName: ACTION_COL, style: this.config.actionStyle || DEFAULT_ACTION_STYLE });
            } else {
                columns = columns.concat(
                    (this.config.actions || []).map(item => ({ fieldName: item.fieldName, style: item.style })),
                );
            }

            columns.forEach(column => {
                const elem = document.querySelectorAll<HTMLElement>(`.mat-column-${column.fieldName}`);
                if (elem && column.style) {
                    for (const property in column.style) {
                        if (column.style[property]) {
                            elem.forEach(item => {
                                item.style.setProperty(property, column.style![property]);
                            });
                        }
                    }
                }
            });
        }, 0);
    }
    applyFilter(filterValue: string) {
        this.filterChange.emit(filterValue);
        this.setStyle();
    }
    sortColumn() {
        this.sortChange.emit(this.sort);
    }
    shouldDisplayActions(actionCols: DataTableConfigColumn<any>[], element: any) {
        return (actionCols || []).some(col => this.shouldDisplayAction(col, element));
    }
    shouldDisplayAction(col: DataTableConfigColumn<any>, element: any): boolean {
        return (!col.valueFunction) ||  (!!col.valueFunction && !!col.valueFunction(element));
    }
    diplayActionColum(actionCols: DataTableConfigColumn<any>[], element: any) {
        return (actionCols || []).some(action => (!action.condition || action.condition(element)) && this.shouldDisplayAction(action, element));
    }
    selecPageAt(index: string) {
        let indexNumber = +index
        this.pageSelected = indexNumber;
        this.selectedPageAt.emit(indexNumber - 1)
    }
    next() {
        this.pageSelected = this.pageSelected + 1;
        this.selectedPageAt.emit(this.pageSelected - 1)
    }
    back() {
        this.pageSelected = this.pageSelected - 1;
        this.selectedPageAt.emit(this.pageSelected - 1)
    }
    viewFirst() {
        this.pageSelected = 1;
        this.selectedPageAt.emit(this.pageSelected - 1)
    }
    viewLast() {
        this.pageSelected = this.numberOfPages;
        this.selectedPageAt.emit(this.pageSelected - 1)
    }
    selectPageSize(value){
        this.selectedPageSize.emit(value);
    }
}
