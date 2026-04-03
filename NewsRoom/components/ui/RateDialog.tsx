import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import {useEffect, useState} from "react";
import { StyleSheet } from "react-native";

export default function RateDialog({id, open, setOpen}: {id: number, open: boolean, setOpen: (open: boolean) => void}) {
    const [rating, setRating] = useState(0);

    const fetchNewsRating = async () => {
        await axios.get(`http://172.22.23.12:3100/news/rating/2/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json'
            }
        })
        .then(res => setRating(res.data.value))
        .catch(error => console.error(error.response));
    }

    const rateNews = async () => {
        if(rating == 0)
            return
        await axios.post("http://172.22.23.12:3100/news/rating/2", {
            newsID: id,
            value: rating
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json'
            }
        })
        .then(() => setOpen(false))
        .catch(error => console.error(error));
    }

    useEffect(() => {
        fetchNewsRating();
    }, [id]);

    return (
        <AlertDialog isOpen={open} onClose={() => setOpen(false)} useRNModal={true}  >
            <AlertDialogBackdrop style={styles.backdrop} />
            <AlertDialogContent style={styles.container}>
                <AlertDialogHeader>
                    <Heading size="3xl" style={{marginLeft: 8}}>Rate</Heading>
                </AlertDialogHeader>
                <AlertDialogBody contentContainerStyle={{alignItems: "center"}} >
                    <StarRating
                        rating={rating}
                        onChange={r => setRating(r)}
                        starSize={52}
                        step="full"
                        color="#F0B020"
                        emptyColor="#909090"
                    />
                </AlertDialogBody>
                <AlertDialogFooter style={styles.buttons_box}>
                    <Button onPress={() => rateNews()} style={styles.button_rate}>
                        <ButtonText style={{...styles.button_text, color: "white"}}>Rate</ButtonText>
                    </Button>
                    <Button onPress={() => setOpen(false)} style={styles.button_cancel}>
                        <ButtonText style={{...styles.button_text, color: "#2080FF"}} >Cancel</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "#000000",
        opacity: 0.4,
        height: "100%",
        width: "100%"
    },
    container: {
        position: "absolute",
        backgroundColor: "#FFFFFF",
        alignSelf: "center",
        width: "85%",
        padding: 16,
        top: "40%"
    },
    buttons_box: {
        flexDirection: "row",
        paddingTop: 24,
        paddingBottom: 8,
        paddingHorizontal: 16,
        justifyContent: "space-between"
    },
    button_rate: {
        padding: 12,
        backgroundColor: "#2080FF",
        borderRadius: 8,
        width: 96
    },
    button_cancel: {
        padding: 12,
        borderColor: "#2080FF",
        borderWidth: 3,
        borderRadius: 8,
        width: 96
    },
    button_text: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold"
    }
});