import {FlatList, ScrollView, TouchableOpacity} from "react-native";
import { Box } from '@/components/ui/box';
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import News from '@/interfaces/news.interface'

const NewsListElement = ({newsItem}: {newsItem: News}) => {
    return (
        <TouchableOpacity>
            <Box>
                <Box>
                    <Heading>{newsItem.title}</Heading>
                    <Box>
                        <Text>{newsItem.author}</Text>
                        <Text>{newsItem.date}</Text>
                    </Box>
                </Box>
                <Box>
                    <Text>{newsItem.rating}</Text>
                    <Box>
                        {newsItem.topics.map((topic) => {
                            return (<Text>{topic}</Text>);
                        })}
                    </Box>
                </Box>
            </Box>
        </TouchableOpacity>
    );
}

export default function NewsList({news}: {news: News[]}) {
    return (
        <ScrollView>
            <FlatList data={news} renderItem={({item}) => <NewsListElement newsItem={item} /> } />
        </ScrollView>
    )
}