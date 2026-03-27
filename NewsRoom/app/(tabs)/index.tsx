import HomeToolbar from "@/components/ui/HomeToolbar";
import NewsList from "@/components/ui/NewsList";
import {useEffect, useState} from "react";
import axios from "axios";
import News from "@/interfaces/news.interface";
import {Box} from "@/components/ui/box";

export default function HomeScreen() {
    const [news, setNews] = useState<News[]>([])

    const fetchNews = async () => {
        try {
            await axios.get("http://localhost:3100/news")
                .then(res => {
                    setNews(res.data);
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <Box>
            <HomeToolbar />
            <NewsList news={news} />
        </Box>
    );
}
