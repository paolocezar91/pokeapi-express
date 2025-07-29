import { request } from 'graphql-request';

export interface ResultsCount<T> {
    count: number,
    results: T[]
}

export interface ApiError {
    error: string,
    err: unknown
}

export const requestGraphQL = async <T>(query, queryParams?) => {
    return await request(process.env.GRAPHQL_URL, query, queryParams) as T;
}

export const formatResultsCount = <T>(results: T[]) => {
    return {
        count: results.length,
        results
    } as ResultsCount<T>
}