import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import {Button, ButtonText} from "@/components/ui/button";
import News from "@/interfaces/news.interface";
import {ScrollView} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import RateDialog from "@/components/ui/RateDialog";

export default function DetailsScreen({newsItem}: {newsItem: News}) {
    const [rateOpen, setRateOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const checkIfNewsSaved = async () => {
        try{
            await axios.get("http://localhost:3100/news/saved/2")
                .then(res => {
                    for (const savedItem in res.data) {
                        if(newsItem.newsID === savedItem.newsID)
                            setIsSaved(true);
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const saveNews = async () => {
        try {
            await axios.post("http://localhost:3100/news/saved/2", {
                newsID: newsItem.newsID
            });
        } catch (error) {
            console.log(error);
        }
    }

    const forgetNews = async () => {
        try {
            await axios.delete(`http://localhost:3100/news/saved/2/${newsItem.newsID}`);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfNewsSaved();
    }, [newsItem]);

    return (
        <>
            <Box>
                <Heading>{newsItem.title}</Heading>
                <Box>
                    {newsItem.topics.map((topic) => {
                        return (<Text>{topic}</Text>);
                    })}
                </Box>
                <Box>
                    <Box>
                        <Text>{newsItem.author}</Text>
                        <Text>{newsItem.date}</Text>
                        <Text>{newsItem.source}</Text>
                    </Box>
                    <Box>
                        <Text>{newsItem.rating}</Text>
                        {isSaved ?
                            <Button onPress={() => forgetNews()}>
                                <ButtonText>Saved</ButtonText>
                            </Button> :
                            <Button onPress={() => saveNews()}>
                                <ButtonText>Save</ButtonText>
                            </Button>
                        }
                    </Box>
                </Box>
                <Divider />
                <ScrollView>
                    <Text>{newsItem.introduction}</Text>
                </ScrollView>
                <Box>
                    <Button>See more</Button>
                    <Button onPress={() => setRateOpen(true)}>Rate</Button>
                </Box>
            </Box>
            <RateDialog id={newsItem.newsID} open={rateOpen} setOpen={setRateOpen} />
        </>

    );
}
