/**
 * Shared pagination DTO — parses and validates ?page= & ?limit= query parameters.
 * If limit=0, pagination is disabled and all records are returned.
 */
export class PaginationDto {
    private constructor(
        public readonly page: number,
        public readonly limit: number,
    ) { }

    /**
     * @returns [error?, PaginationDto?]
     */
    static create(props: { [key: string]: any }): [string?, PaginationDto?] {
        const { page, limit } = props;

        const parsedPage = page ? parseInt(page as string, 10) : 1;
        const parsedLimit = limit !== undefined ? parseInt(limit as string, 10) : 25;

        if (isNaN(parsedPage) || parsedPage < 1) {
            return ['El parámetro "page" debe ser un número entero >= 1', undefined];
        }

        if (isNaN(parsedLimit) || parsedLimit < 0) {
            return ['El parámetro "limit" debe ser un número entero >= 0 (0 = sin paginación)', undefined];
        }

        return [undefined, new PaginationDto(parsedPage, parsedLimit)];
    }
}

/**
 * Paginated result wrapper — returned by getAll methods in datasources.
 */
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
