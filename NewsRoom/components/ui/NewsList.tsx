import {FlatList, RefreshControl, StyleSheet, TouchableOpacity} from "react-native";
import { Box } from '@/components/ui/box';
import { Text } from "@/components/ui/text";
import News from '@/interfaces/news.interface';
import {useEffect, useState} from "react";
import Preferences from "@/interfaces/preferences.interface";
import { useRouter, Router } from "expo-router";

const NewsListElement = ({newsItem, router}: {newsItem: News, router: Router}) => {
    const dateFormat = (date: Date) => {
        return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`
    }

    return (
        <TouchableOpacity onPress={() => router.push({
            pathname: "/details",
            params: { newsItem: JSON.stringify(newsItem) }
        })}>
            <Box style={styles.item_container}>
                <Box style={styles.item_top}>
                    <Text numberOfLines={2} style={{flex: 2, fontSize: 18, fontWeight: 'bold'}}>{newsItem.title}</Text>
                    <Text style={{flex: 1}}>{newsItem.rating}</Text>
                </Box>
                <Box style={styles.item_bottom}>
                    <Box style={{flex: 1}}>
                        <Text numberOfLines={1} style={{fontSize: 16}}>{newsItem.author}</Text>
                        <Text style={{fontSize: 16}}>{dateFormat(newsItem.date)}</Text>
                    </Box>
                    <Box style={styles.tags}>
                        {newsItem.topics.map((topic) => {
                            return (<Text style={{paddingRight: 4, color: "#3070F0"}}>#{topic}</Text>);
                        })}
                    </Box>
                </Box>
            </Box>
        </TouchableOpacity>
    );
}

export default function NewsList({news, pref, fetchNews}: {news: News[], pref: Preferences, fetchNews: () => Promise<void>}) {
    const [filtNews, setFiltNews] = useState<News[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const applyPreferences = () => {
        let tmpNews = news.filter(n => {
            if(pref.search === "") {
                return true;
            }
            const tmpSearch = pref.search.toLowerCase();
            const tmpTitle = n.title.toLowerCase();
            return tmpTitle.includes(tmpSearch);
        });

        tmpNews = tmpNews.filter(n => {
            return (
                pref.tags.every((tag: string) => n.topics.includes(tag)) &&
                n.rating >= pref.ratingFrom &&
                n.rating <= pref.ratingTo &&
                (pref.dateFrom === null || pref.dateFrom <= n.date) &&
                (pref.dateTo === null || pref.dateTo >= n.date)
            )
        });

        switch(pref.sort) {
            case "latest":
                tmpNews = tmpNews.sort((a, b) => b.date.getMilliseconds() - a.date.getMilliseconds());
                break;
            case "rate_asc":
                tmpNews = tmpNews.sort((a, b) => a.rating - b.rating);
                break;
            case "rate_dsc":
                tmpNews = tmpNews.sort((a, b) => b.rating - a.rating);
                break;
            case "author":
                tmpNews = tmpNews.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case "title":
                tmpNews = tmpNews.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        setFiltNews(tmpNews);
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNews().then(() => setRefreshing(false))
    }

    useEffect(() => {
        setRefreshing(true)
        applyPreferences();
        setRefreshing(false)
    }, [news, pref]);

    return (
        <Box >
            <FlatList
                style={{paddingBottom: 8}}
                data={filtNews}
                extraData={refreshing}
                renderItem={({item}) => <NewsListElement newsItem={item} router={router} /> }
                keyExtractor={(item) => item.newsID.toString()}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />}
            />
        </Box>
    )
}

const styles = StyleSheet.create({
    item_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        gap: 4,
        backgroundColor: "#D0D0D0",
        borderRadius: 16,
        elevation: 4,
    },
    item_top: {
        flex: 1,
        flexDirection: 'row',
        gap: 4
    },
    item_bottom: {
        flex: 1,
        flexDirection: 'row',
        gap: 4
    },
    tags: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})