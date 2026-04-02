import HomeToolbar from "@/components/ui/HomeToolbar";
import NewsList from "@/components/ui/NewsList";
import {useEffect, useState} from "react";
import axios from "axios";
import News from "@/interfaces/news.interface";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Preferences from "@/interfaces/preferences.interface";
import FiltersDialog from "@/components/ui/FiltersDialog";

export default function HomeScreen() {
    const [news, setNews] = useState<News[]>([]);
    const [pref, setPref] = useState<Preferences>({
        search: "",
        sort: "latest",
        tags: [],
        ratingFrom: 0,
        ratingTo: 5,
        dateFrom: null,
        dateTo: null
    });
    const [filtOpen, setFiltOpen] = useState(false);

    const fetchNews = async () => {
        await axios.get("http://172.22.23.12:3100/news", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json'
            }
        })
        .then(res => {
            setNews(res.data.map(newsItem => {
                return {
                    ...newsItem,
                    date: new Date(newsItem.date),
                    rating: newsItem.rating === null ? 0 : newsItem.rating
                }
            }));
        })
        .catch(error => {
            console.error(error.message)
        });
    }

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <SafeAreaProvider>
            <HomeToolbar pref={pref} setPref={setPref} setOpen={setFiltOpen} />
            <NewsList news={news} pref={pref} fetchNews={fetchNews} />
            <FiltersDialog open={filtOpen} setOpen={setFiltOpen} pref={pref} setPref={setPref} />
        </SafeAreaProvider>
    );
}
