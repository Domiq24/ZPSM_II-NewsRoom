import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import { Box } from '@/components/ui/box';
import { Text } from "@/components/ui/text";
import News from '@/interfaces/news.interface';
import {useEffect, useState} from "react";
import Preferences from "@/interfaces/preferences.interface";

const NewsListElement = ({newsItem}: {newsItem: News}) => {
    const dateFormat = (date: Date) => {
        return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`
    }

    return (
        <TouchableOpacity>
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

export default function NewsList({news, pref}: {news: News[], pref: Preferences}) {
    const [filtNews, setFiltNews] = useState<News[]>([])

    const searchNews = () => {
        setFiltNews(news.filter(n => (pref.search === "" || n.title.includes(pref.search))));
    }

    const filterNews = () => {
        setFiltNews(news.filter(n => {
            return (
                pref.tags.every((tag: string) => n.topics.includes(tag)) &&
                n.rating >= pref.ratingFrom &&
                n.rating <= pref.ratingTo &&
                (pref.dateFrom === null || pref.dateFrom <= n.date) &&
                (pref.dateTo === null || pref.dateTo >= n.date)
            )
        }));
    }

    const sortNews = () => {
        switch(pref.sort) {
            case "latest":
                setFiltNews(filtNews.sort((a, b) => b.date.getMilliseconds() - a.date.getMilliseconds()));
                break;
            case "rate_asc":
                setFiltNews(filtNews.sort((a, b) => a.rating - b.rating));
                break;
            case "rate_dsc":
                setFiltNews(filtNews.sort((a, b) => b.rating - a.rating));
                break;
            case "author":
                setFiltNews(filtNews.sort((a, b) => a.author.localeCompare(b.author)));
                break;
            case "title":
                setFiltNews(filtNews.sort((a, b) => a.title.localeCompare(b.title)));
                break;
        }
    }

    useEffect(() => {
        //searchNews();
        filterNews();
        sortNews();
    }, [news, pref]);

    return (
        <Box >
            <FlatList
                style={{paddingBottom: 8}}
                data={filtNews}
                renderItem={({item}) => <NewsListElement newsItem={item} /> }
                keyExtractor={(item) => item.newsID.toString()}
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