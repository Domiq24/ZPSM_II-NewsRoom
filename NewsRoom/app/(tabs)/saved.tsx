import NewsList from "@/components/ui/NewsList";
import {Box} from "@/components/ui/box";
import {useEffect, useState} from "react";
import News from "@/interfaces/news.interface";
import axios from "axios";
import Preferences from "@/interfaces/preferences.interface";

export default function SavedNewsScreen() {
    const [savedNews, setSavedNews] = useState<News[]>([])
    const [savedPref, setSavedPref] = useState<Preferences>({
        search: "",
        sort: "rating_asc",
        tags: [],
        ratingFrom: 0,
        ratingTo: 5,
        dateFrom: null,
        dateTo: null
    })

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
                    ...newsItem,
                    date: new Date(newsItem.date),
                    rating: newsItem.rating === null ? 0 : newsItem.rating
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
            <NewsList news={savedNews} pref={savedPref} fetchNews={fetchSavedNews} />
        </Box>
    );
}
