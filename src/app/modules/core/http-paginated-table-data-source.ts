import { _isNumberValue } from '@angular/cdk/coercion';
import { AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

const MAX_SAFE_INTEGER = 9007199254740991;

const PRA_DOCUMENTS = 'pra-documents';
const PRA_USERS = 'pra-users';
const IOM_USERS = 'iom-users';

export class HttpPaginatedDataSource<T> extends MatTableDataSource<T> {
    public totalElements = 0;
    public tableName: string;
    public keys: string[];

    constructor(initialData: T[] = [], tableName = '', keys = [] as string[]) {
        super(initialData);
        this.totalElements = (initialData && initialData.length) || 0;
        this.tableName = tableName;
        this.keys = keys;
    }

    /**
     * Override update paginator method
     * to ensure total unfiltered element count is consistent with the http result
     */
    public _updatePaginator(filteredDataLength: number): void {
        if (this.filter === '') {
            super._updatePaginator(this.totalElements);
        } else {
            super._updatePaginator(filteredDataLength);
        }
    }

    public _pageData(data: T[]): T[] {
        return data;
    }

    private getHeaderId(sortHeaderId: string) {
        if (this.tableName === PRA_DOCUMENTS) {
            switch (sortHeaderId) {
                case 'questionNumber':
                    return 'sectionQuestionNum';
                case 'fileUploadTimestamp':
                    return 'numericFileUploadTimestamp';
                case 'fileSize':
                    return 'numericFileSize';
                default:
                    break;
            }
        } else if (this.tableName === PRA_USERS) {
            switch (sortHeaderId) {
                case 'status':
                    return 'numUnscoredDocuments';
                case 'territory':
                    return 'geography';
                default:
                    break;
            }
        } else if (this.tableName === IOM_USERS) {
            switch (sortHeaderId) {
                case 'territory':
                    return 'geography';
                default:
                    break;
            }
        }

        return sortHeaderId;
    }

    private postProcessValue(dataValue: any, actualSortHeaderId: string) {
        if (this.tableName === PRA_USERS) {
            switch (actualSortHeaderId) {
                case 'numUnscoredDocuments':
                    return (dataValue || 0) > 0 ? 'Yes' : 'No';
                case 'agentStatus':
                case 'region':
                case 'geography':
                    return (dataValue && dataValue.value) || '';
                default:
                    break;
            }
        } else if (this.tableName === IOM_USERS) {
            switch (actualSortHeaderId) {
                case 'status':
                case 'region':
                case 'geography':
                    return (dataValue && dataValue.value) || '';
                default:
                    break;
            }
        }
        return dataValue;
    }

    sortingDataAccessor: (data: T, sortHeaderId: string) => string | number = (
        data: T,
        sortHeaderId: string,
    ): string | number => {
        const actualSortHeaderId = this.getHeaderId(sortHeaderId);
        const dataValue =
            data instanceof AbstractControl
                ? (data as AbstractControl).value[actualSortHeaderId]
                : (data as { [key: string]: any })[actualSortHeaderId];

        const value = this.postProcessValue(dataValue, actualSortHeaderId);

        if (_isNumberValue(value)) {
            const numberValue = Number(value);

            // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
            // leave them as strings. For more info: https://goo.gl/y5vbSg
            return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
        }

        return value;
    };

    private getObjectValue(data: any, key: string) {
        const cellValue = (data as { [key: string]: any })[key];
        if (this.tableName === PRA_USERS) {
            if (key === 'numUnscoredDocuments') {
                return (cellValue || 0) > 0 ? 'Yes' : 'No';
            } else if (key === 'agentStatus' || key === 'region' || key === 'geography') {
                return cellValue.value;
            } else if (key === 'agentLastLoginTime') {
                return cellValue || 'N/A';
            }
        } else if (this.tableName === IOM_USERS) {
            if (key === 'status' || key === 'region' || key === 'geography') {
                return cellValue.value;
            } else if (key === 'lastLoginTime') {
                return cellValue || 'N/A';
            }
        }
        return cellValue;
    }

    filterPredicate: (data: T, filter: string) => boolean = (data: T, filter: string): boolean => {
        const extractedData = data instanceof AbstractControl ? (data as AbstractControl).value : data;

        // Transform the data into a lowercase string of all property values.
        const dataStr = Object.keys(extractedData)
            .reduce((currentTerm: string, key: string) => {
                // Use an obscure Unicode character to delimit the words in the concatenated string.
                // This avoids matches where the values of two columns combined will match the user's query
                // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                // that has a very low chance of being typed in by somebody in a text field. This one in
                // particular is "White up-pointing triangle with dot" from
                // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                const value = this.getObjectValue(extractedData, key);
                return this.keys.length > 0 && this.keys.indexOf(key) < 0 ? currentTerm : currentTerm + value + '◬';
            }, '')
            .toLowerCase();

        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filter.trim().toLowerCase();

        return dataStr.indexOf(transformedFilter) !== -1;
    };
}
