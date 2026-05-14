import HomeToolbar from "@/components/ui/HomeToolbar";
import NewsList from "@/components/ui/NewsList";
import {useEffect, useState} from "react";
import axios from "axios";
import News from "@/interfaces/news.interface";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Preferences from "@/interfaces/preferences.interface";
import FiltersDialog from "@/components/ui/FiltersDialog";
import * as SecureStore from 'expo-secure-store';
import {useNavigation} from "expo-router";

export default function HomeScreen() {
    const [news, setNews] = useState<News[]>([]);
    const [prefs, setPrefs] = useState<Preferences>({
        search: "",
        sort: "latest",
        tags: [],
        ratingFrom: 0,
        ratingTo: 5,
        dateFrom: null,
        dateTo: null
    });
    const [filtOpen, setFiltOpen] = useState(false);
    const [minDate, setMinDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState(new Date());
    const [token, setToken] = useState({
        tokenID: null,
        value: ""
    });
    const navigation = useNavigation();

    const fetchNews = async () => {
        await axios.get("http://172.22.23.12:3100/news", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': 'Bearer ' + token.value
            }
        })
        .then(res => {
            setNews(res.data.map((newsItem: News) => {
                return {
                    ...newsItem,
                    date: new Date(newsItem.date),
                    rating: newsItem.rating === null ? 0 : newsItem.rating,
                }
            }));
        })
        .catch(e => console.error(e.response.data));
    }

    const fetchPrefs = async () => {
        axios.get("http://172.22.23.12:3100/user/pref",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token.value
                }
            }
        )
        .then(res => {
            setPrefs(res.data);
            SecureStore.setItem("prefs", JSON.stringify(res.data));
        })
        .catch(e => console.error(e.response.data))
    }

    const savePrefs = async () => {
        axios.post("http://172.22.23.12:3100/user/pref",
            {
                prefs: prefs
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token.value
                }
            }
        )
        .then(() => SecureStore.setItem("prefs", JSON.stringify(prefs)))
        .catch(e => console.error(e.response.data))
    }

    const getPrefs = async () => {
        const json = SecureStore.getItem("prefs");
        if(json) {
            setPrefs(JSON.parse(json));
        } else {
            await fetchPrefs();
        }
    }

    const getToken = () => {
        const json = SecureStore.getItem("token");
        if(json)
            setToken(JSON.parse(json));
    }

    useEffect(() => {
        getToken()
        getPrefs();
        fetchNews();
    }, []);

    useEffect(() => {
        if(news.length > 0) {
            setMinDate(news.reduce((prev, next) => { return prev.date < next.date ? prev : next }, {date: news[0].date}).date);
            setMaxDate(news.reduce((prev, next) => { return prev.date > next.date ? prev : next }, {date: news[0].date}).date);
        }
    }, [news]);

    useEffect(() => {
        const unsub = navigation.addListener('beforeRemove', (e) => {
            savePrefs();
        })

        return () => unsub();
    }, [navigation]);

    return (
        <SafeAreaProvider>
            <HomeToolbar pref={prefs} setPref={setPrefs} setOpen={setFiltOpen} />
            <NewsList news={news} pref={prefs} fetchNews={fetchNews} />
            <FiltersDialog open={filtOpen} setOpen={setFiltOpen} pref={prefs} setPref={setPrefs} minDate={minDate} maxDate={maxDate} />
        </SafeAreaProvider>
    );
}
