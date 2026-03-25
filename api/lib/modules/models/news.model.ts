export interface INews {
    newsID: number;
    title: string;
    author: string;
    date: Date;
    rating: number;
    topics: string[];
    source: string;
    introduction: string;
}