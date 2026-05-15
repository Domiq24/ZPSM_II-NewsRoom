import { AlertDialog } from '@/components/ui/alert-dialog';
import { Heading } from '@/components/ui/heading';
import {
    DialogBackdrop,
    DialogContent,
    FillButtonRed,
    FillButtonText,
    ButtonBox,
    OutlineButton, OutlineButtonText
} from '@/components/ui/StyledComponents';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Router } from 'expo-router';

export default function DeleteAccountDialog({open, setOpen, router}: {open: boolean, setOpen: (open: boolean) => void, router: Router}) {
    const handleDelete = async () => {
        const json = await SecureStore.getItemAsync("token");
        if(!json)
            return

        const token = JSON.parse(json);
        await axios.delete("http://172.22.23.115:3100/user",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token.value
                }
            }
        )
        .then(() => {
            setOpen(false);
            router.replace("/login")
        } )
        .catch(e => console.error(e.response.data))
    }

    return(
        <AlertDialog isOpen={open}>
            <DialogBackdrop />
            <DialogContent style={{width: "40%"}} >
                <Heading>Delete account?</Heading>
                <ButtonBox>
                    <FillButtonRed>
                        <FillButtonText onPress={handleDelete}>Delete</FillButtonText>
                    </FillButtonRed>
                    <OutlineButton onPress={() => setOpen(false)}>
                        <OutlineButtonText>Cancel</OutlineButtonText>
                    </OutlineButton>
                </ButtonBox>
            </DialogContent>
        </AlertDialog>
    )
}