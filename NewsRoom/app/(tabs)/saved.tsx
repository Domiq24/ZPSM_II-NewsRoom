import NewsList from "@/components/ui/NewsList";
import {Box} from "@/components/ui/box";
import {useEffect, useState} from "react";
import News from "@/interfaces/news.interface";
import axios from "axios";

export default function SavedNewsScreen() {
    const [savedNews, setSavedNews] = useState<News[]>([])

    const fetchSavedNews = async () => {
        try {
            await axios.get("http://localhost:3100/news/saved/2")
                .then(res => {
                    setSavedNews(res.data);
                });
        } catch (error) {
            console.log(error);
        }
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
