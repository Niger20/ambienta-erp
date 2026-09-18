/**
 * Safely extracts an array from any API response data structure.
 * Handles:
 * - Direct arrays: [...]
 * - PaginatedResult objects: { data: [...], pagination: { ... } }
 * - Named keys: { [key]: [...] } (e.g. { ventas: [...] }, { productos: [...] })
 * - Fallback to empty array [] if invalid or missing
 */
export function getArrayData<T = any>(resData: any, key?: string): T[] {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData.data)) return resData.data;
    if (key && Array.isArray(resData[key])) return resData[key];
    return [];
}
