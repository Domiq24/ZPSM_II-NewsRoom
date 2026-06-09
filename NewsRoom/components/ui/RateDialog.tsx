import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Heading } from "@/components/ui/heading";
import {Text} from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import {useEffect, useState} from "react";
import { StyleSheet } from "react-native";
import {
    ButtonBox,
    DialogBackdrop,
    DialogContent,
    FillButton,
    FillButtonText,
    OutlineButton, OutlineButtonText
} from "@/components/ui/StyledComponents";
import {config} from "@/constants/config";

export default function RateDialog({id, token, open, setOpen}: {id: number, token: string, open: boolean, setOpen: (open: boolean) => void}) {
    const [rating, setRating] = useState(0);

    const fetchNewsRating = async () => {
        await axios.get(`http://${config.serverAddress}:3100/news/rating/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': 'Bearer ' + token
            }
        })
        .then(res => setRating(res.data.value))
        .catch(e => console.error(e.response.data));
    }

    const rateNews = async () => {
        if(rating == 0)
            return
        await axios.post(`http://${config.serverAddress}:3100/news/rating/${id}`,
            {
                value: rating
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token
                }
            }
        )
        .then(() => setOpen(false))
        .catch(e => console.error(e.response.data));
    }

    useEffect(() => {
        if(token != "")
            fetchNewsRating();
    }, [id, token]);

    return (
        <AlertDialog isOpen={open} onClose={() => setOpen(false)} useRNModal={true}  >
            <DialogBackdrop />
            <DialogContent style={{top: "40%"}}>
                <AlertDialogHeader>
                    <Text style={{marginLeft: 8, marginBottom: 16, fontSize: 38, lineHeight: 40, fontFamily: 'Grenze_700Bold'}}>Rate</Text>
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
                <ButtonBox style={{paddingTop: 24}}>
                    <FillButton onPress={() => rateNews()}>
                        <FillButtonText>Rate</FillButtonText>
                    </FillButton>
                    <OutlineButton onPress={() => setOpen(false)}>
                        <OutlineButtonText>Cancel</OutlineButtonText>
                    </OutlineButton>
                </ButtonBox>
            </DialogContent>
        </AlertDialog>
    )
}