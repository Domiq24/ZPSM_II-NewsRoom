import HomeToolbar from "@/components/ui/HomeToolbar";
import NewsList from "@/components/ui/NewsList";
import {useEffect, useState} from "react";
import axios from "axios";
import News from "@/interfaces/news.interface";
import {Box} from "@/components/ui/box";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Stack } from "expo-router"

export default function HomeScreen() {
    const [news, setNews] = useState<News[]>([])

    const fetchNews = async () => {
        await axios.get("http://localhost:3100/news", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json'
            }
        })
        .then(res => {
            setNews(res.data);
        })
        .catch(error => {
            if (error.response) {
                // Serwer odpowiedział kodem statusu poza zakresem 2xx
                console.error('Błąd odpowiedzi:', error.response.data);
            } else if (error.request) {
                // Żądanie wysłane, ale brak odpowiedzi
                console.error('Błąd sieci:', error.request);
            } else {
                // Błąd konfiguracji żądania
                console.error('Błąd konfiguracji:', error.message);
            }
        })
    }

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <SafeAreaProvider>
            {true && <HomeToolbar />}
            {true && <NewsList news={news} />}
        </SafeAreaProvider>
    );
}
