export interface IPrefs {
    search: string,
    sort: string,
    tags: string[],
    ratingFrom: number,
    ratingTo: number,
    dateFrom?: Date | string,
    dateTo?: Date | string
}