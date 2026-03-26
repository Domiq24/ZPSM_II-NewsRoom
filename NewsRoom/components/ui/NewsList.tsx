import { FlatList, ScrollView } from "react-native";
import { Box } from '@/components/ui/box';
import { Heading } from "@/components/ui/heading";
import News from '@/interfaces/news.interface'

const NewsListElement = ({newsItem}: {newsItem: News}) => {
    return (
        <Box>
            <Heading>{newsItem.title}</Heading>
        </Box>
    );
}

export default function NewsList({news}: {news: News[]}) {
    return (
        <ScrollView>
            <FlatList data={news} renderItem={({item}) => <NewsListElement newsItem={item} /> } />
        </ScrollView>
    )
}