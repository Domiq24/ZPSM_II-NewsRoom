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
        await axios.get("http://172.22.23.12:3100/news/saved", {
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
        await axios.post(`http://172.22.23.12:3100/news/saved/${newsItem.newsID}`,
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
        await axios.delete(`http://172.22.23.12:3100/news/saved/${newsItem.newsID}`,
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

    const getToken = () => {
        const json = SecureStore.getItem("token");
        if(json)
        {
            const token = JSON.parse(json);
            setToken(token);
            console.log(token);
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
        checkIfNewsSaved(tmpItem);
    }, []);

    return (
        <>
            <Box style={{padding: 16}}>
                <Heading size="2xl" style={{marginVertical: 0}}>{newsItem.title}</Heading>
                <Box style={styles.tags}>
                    {newsItem.topics.map((topic) => {
                        return (<Text style={{color: "#2080FF"}}>#{topic}</Text>);
                    })}
                </Box>
                <HStack style={styles.info}>
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
                            <Button style={{...styles.filled_button, ...styles.save_button}} onPress={() => forgetNews()}>
                                <ButtonText style={{textAlign: "center", color: "white"}}>Saved</ButtonText>
                            </Button> :
                            <Button style={{...styles.outline_button, ...styles.save_button}} onPress={() => saveNews()}>
                                <ButtonText  style={{textAlign: "center", color: "#2080FF"}}>Save</ButtonText>
                            </Button>
                        }
                    </Box>
                </HStack>
                <ScrollView style={{marginTop: 16}}>
                    <Text style={{fontSize: 16}}>{newsItem.introduction}</Text>
                </ScrollView>
                <Box style={styles.button_box}>
                    <Button style={{...styles.bottom_buttons, ...styles.filled_button}} onPress={() => Linking.openURL(newsItem.source)}>
                        <ButtonText style={{...styles.button_text,color: "white"}}>See more</ButtonText>
                    </Button>
                    <Button style={{...styles.bottom_buttons, ...styles.outline_button}} onPress={() => setRateOpen(true)}>
                        <ButtonText style={{...styles.button_text, color: "#2080FF"}}>Rate</ButtonText>
                    </Button>
                </Box>
            </Box>
            <RateDialog id={newsItem.newsID} token={token.value} open={rateOpen} setOpen={setRateOpen} />
        </>

    );
}

const styles = StyleSheet.create({
    tags: {
        flexDirection: "row",
        gap: 6
    },
    info: {
        flexDirection: "row",
        marginTop: 16,
        borderBottomWidth: 2,
        borderColor: "#000000",
        paddingBottom: 16
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
