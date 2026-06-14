import { AlertDialog } from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
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
import {config} from "@/constants/config";

export default function DeleteAccountDialog({open, setOpen, router}: {open: boolean, setOpen: (open: boolean) => void, router: Router}) {
    const handleDelete = async () => {
        const json = await SecureStore.getItemAsync("token");
        if(!json)
            return

        const token = JSON.parse(json);
        await axios.delete(`http://${config.serverAddress}:3100/user`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': ' application/json',
                    'x-access-token': 'Bearer ' + token.value
                }
            }
        )
        .then(async () => {
            await SecureStore.deleteItemAsync("token");
            setOpen(false);
            router.replace("/login")
        } )
        .catch(e => console.error(e.response.data))
    }

    return(
        <AlertDialog useRNModal={true} isOpen={open}>
            <DialogBackdrop />
            <DialogContent style={{width: "60%", top: "20%"}} >
                <Text style={{fontSize: 32, lineHeight: 34, fontFamily: 'Grenze_700Bold', marginBottom: 16}}>Delete account?</Text>
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