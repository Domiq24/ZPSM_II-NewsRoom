import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {Button, ButtonText} from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import News from "@/interfaces/news.interface";
import {ScrollView} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import { useLocalSearchParams } from "expo-router";
import RateDialog from "@/components/ui/RateDialog";
import { StyleSheet } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store'
import {
    ButtonBox,
    FillButton,
    FillButtonText,
    NewsDetailsInfo,
    OutlineButton,
    OutlineButtonText
} from "@/components/ui/StyledComponents";

export default function DetailsScreen() {
    const [rateOpen, setRateOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [newsItem, setNewsItem] = useState<News>({
        author: "",
        date: new Date(),
        introduction: "",
        newsID: 0,
        rating: 0,
        source: "",
        title: "",
        topics: []
    });
    const [token, setToken] = useState({
        tokenID: null,
        value: ""
    });
    const params = useLocalSearchParams();

    const checkIfNewsSaved = async (item: News) => {
        console.log(token);
        await axios.get("http://172.22.23.115:3100/news/saved", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': 'Bearer ' + token.value
            }
        })
        .then(res => {
            for (const savedItem of res.data) {
                if(item.newsID === savedItem.newsID) {
                    setIsSaved(true);
                }
            }
        })
        .catch(e => console.log(e.response.data));
    }

    const saveNews = async () => {
        await axios.post(`http://172.22.23.115:3100/news/saved/${newsItem.newsID}`,
            {},
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token.value
                }
            }
        )
        .then(() => setIsSaved(true))
        .catch(e => console.error(e.response.data));
    }

    const forgetNews = async () => {
        await axios.delete(`http://172.22.23.115:3100/news/saved/${newsItem.newsID}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token.value
                }
            }
        )
        .then(() => setIsSaved(false))
        .catch(e => console.error(e.response.data));
    }

    const formatDate = (date: Date) => {
        return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, "0")}.${date.getFullYear()}`;
    }

    const getToken = async () => {
        const json = await SecureStore.getItemAsync("token");
        if(json)
        {
            setToken(JSON.parse(json));
        }
    }

    useEffect(() => {
        const raw = JSON.parse(params.newsItem as string);
        const tmpItem: News = {
            ...raw,
            date: new Date(raw.date),
            topics: [...raw.topics]
        }
        setNewsItem(tmpItem);
        getToken();
    }, []);

    useEffect(() => {
        if(token.value != "" && newsItem.title != "")
            checkIfNewsSaved(newsItem)
    }, [token, newsItem]);

    return (
        <>
            <Box style={{padding: 16}}>
                <Heading size="2xl" style={{marginVertical: 0}}>{newsItem.title}</Heading>
                <Box style={{flexDirection: "row", gap: 6}}>
                    {newsItem.topics.map((topic) => {
                        return (<Text style={{color: "#2080FF"}}>#{topic}</Text>);
                    })}
                </Box>
                <NewsDetailsInfo>
                    <Box style={{flex: 2}}>
                        <Text style={{fontSize: 16}}>{newsItem.author}</Text>
                        <Text style={{fontSize: 16}}>{formatDate(newsItem.date)}</Text>
                        <Text numberOfLines={1}>{newsItem.source}</Text>
                    </Box>
                    <Box style={{flex: 1, alignItems: "flex-end", justifyContent: "space-evenly"}}>
                        <StarRatingDisplay
                            rating={newsItem.rating}
                            starSize={16}
                            color="#F0B020"
                            emptyColor="#909090"
                        />
                        {isSaved ?
                            <FillButton style={{paddingVertical: 4, paddingHorizontal: 16, width: "auto"}} onPress={() => forgetNews()}>
                                <FillButtonText style={{fontSize: 14}}>Saved</FillButtonText>
                            </FillButton> :
                            <OutlineButton style={{paddingVertical: 0, paddingHorizontal: 16, width: "auto"}} onPress={() => saveNews()}>
                                <OutlineButtonText style={{fontSize: 14}}>Save</OutlineButtonText>
                            </OutlineButton>
                        }
                    </Box>
                </NewsDetailsInfo>
                <ScrollView style={{marginTop: 16}}>
                    <Text style={{fontSize: 16}}>{newsItem.introduction}</Text>
                </ScrollView>
                <ButtonBox style={{marginTop: 24, justifyContent: "space-evenly", gap: 24}}>
                    <FillButton onPress={() => Linking.openURL(newsItem.source)}>
                        <FillButtonText>See more</FillButtonText>
                    </FillButton>
                    <OutlineButton onPress={() => setRateOpen(true)}>
                        <OutlineButtonText>Rate</OutlineButtonText>
                    </OutlineButton>
                </ButtonBox>
            </Box>
            <RateDialog id={newsItem.newsID} token={token.value} open={rateOpen} setOpen={setRateOpen} />
        </>
    );
}

const styles = StyleSheet.create({
    tags: {

    },
    info: {

    },
    button_box: {
        marginTop: 24,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    outline_button: {
        borderColor: "#2080FF",
        borderWidth: 3,
        borderRadius: 8
    },
    filled_button: {
        backgroundColor: "#2080FF",
        borderRadius: 8,
    },
    bottom_buttons: {
        padding: 12,
        width: 128
    },
    save_button: {
        padding: 1,
        width: 64
    },
    button_text: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold"
    }
})
