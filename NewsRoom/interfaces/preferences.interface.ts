export default interface Preferences {
    search: string;
    sort: string;
    tags: string[];
    ratingFrom: number;
    ratingTo: number;
    dateFrom: Date | null;
    dateTo: Date | null;
}