import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const isObject = (value: any) => {
    const type = typeof value;
    return value != null && (type === 'object' || type === 'function');
};

const makeParamMap = (req: HttpRequest<any>) => {
    const paramMap = req.params.keys().reduce((acc, k) => {
        if (req.params.has(k)) {
            acc[k] = req.params.get(k) || '';
        }
        return acc;
    }, {} as { [key: string]: string });

    return paramMap;
};

const hideSensitiveParamValues = (requestArguments: { [key: string]: any }) => {
    const sensitiveParamNames = environment.elasticAPM.sensitiveParamNames;
    const merged = Object.keys(requestArguments).reduce((acc, k) => {
        acc[k] = sensitiveParamNames.indexOf(k) >= 0 ? 'REDACTED' : requestArguments[k] || '';
        return acc;
    }, {} as { [key: string]: any });
    return merged;
};

export const augmentErrorResponse = (errorResponse: HttpErrorResponse) => {
    try {
        if (typeof errorResponse.error === 'string') {
            const errorJson = JSON.parse(`${errorResponse.error}`);
            return { ...errorResponse, errorJson };
        } else if (isObject(errorResponse.error)) {
            return { ...errorResponse, errorJson: errorResponse.error };
        }
        return errorResponse;
    } catch {
        return errorResponse;
    }
};

export const makeLogArguments = (req: HttpRequest<any>): { [key: string]: string } => {
    const body: { [key: string]: string } = req.body || {};
    const paramMap = makeParamMap(req);

    const combinedArguments: { [key: string]: any } = { ...body, ...paramMap };
    return hideSensitiveParamValues(combinedArguments);
};
