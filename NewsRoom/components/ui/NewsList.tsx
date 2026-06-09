import {FlatList, RefreshControl, StyleSheet, TouchableOpacity} from "react-native";
import { Box } from '@/components/ui/box';
import { Text } from "@/components/ui/text";
import News from '@/interfaces/news.interface';
import {useEffect, useState} from "react";
import Preferences from "@/interfaces/preferences.interface";
import { useRouter, Router } from "expo-router";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import {
    NewsItem,
    NewsItemSection,
    NewsItemTags,
    NewsItemTagsText,
    NewsItemText,
    NewsItemTitle
} from "@/components/ui/StyledComponents";

const NewsListElement = ({newsItem, router}: {newsItem: News, router: Router}) => {
    const dateFormat = (date: Date) => {
        return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`
    }

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push({
            pathname: "/details",
            params: { newsItem: JSON.stringify(newsItem) }
        })}>
            <NewsItem>
                <NewsItemSection style={{alignItems: "center"}}>
                    <NewsItemTitle numberOfLines={2}>{newsItem.title}</NewsItemTitle>
                    <StarRatingDisplay
                        rating={newsItem.rating}
                        starSize={16}
                        color="#E0A020"
                        emptyColor="#808080"
                    />
                </NewsItemSection>
                <NewsItemSection>
                    <Box style={{flex: 1}}>
                        <NewsItemText numberOfLines={1}>{newsItem.author}</NewsItemText>
                        <NewsItemText>{dateFormat(newsItem.date)}</NewsItemText>
                    </Box>
                    <NewsItemTags>
                        {newsItem.topics.map((topic) => {
                            return (<NewsItemTagsText>#{topic}</NewsItemTagsText>);
                        })}
                    </NewsItemTags>
                </NewsItemSection>
            </NewsItem>
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
                style={{paddingBottom: 8, minHeight: 300}}
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
    tags: {

    }
})