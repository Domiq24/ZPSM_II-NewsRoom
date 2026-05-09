export default interface News {
    newsID: number;
    title: string;
    author: string;
    date: Date;
    rating: number;
    topics: string[];
    source: string;
    introduction: string;
}