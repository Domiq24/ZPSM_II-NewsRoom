import NewsList from "@/components/ui/NewsList";
import {Box} from "@/components/ui/box";
import {useEffect, useState} from "react";
import News from "@/interfaces/news.interface";
import axios from "axios";

export default function SavedNewsScreen() {
    const [savedNews, setSavedNews] = useState<News[]>([])

    const fetchSavedNews = async () => {
        await axios.get("http://172.22.23.12:3100/news/saved/2", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json'
            }
        })
        .then(res => {
            setSavedNews(res.data.map(newsItem => {
                return {
                    newsID: newsItem.newsID,
                    title: newsItem.title,
                    author: newsItem.author,
                    date: new Date(newsItem.date),
                    rating: newsItem.rating,
                    topics: [...newsItem.topics],
                    source: newsItem.source,
                    introduction: newsItem.introduction
                }
            }));
        })
        .catch(error => {
            console.error(error.message)
        })
    }

    useEffect(() => {
        fetchSavedNews();
    }, []);

    return (
        <Box>
            <NewsList news={savedNews} />
        </Box>
    );
}
