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
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import axios from "axios";
import { useState } from "react";

export default function RateDialog({id, open, setOpen}: {id: number, open: boolean, setOpen: (open: boolean) => void}) {
    const [rateValue, setRateValue] = useState(1);

    const rateNews = async () => {
        try {
            await axios.post("http://localhost:3100/news/rate/2", {
                newsID: id,
                value: rateValue
            });
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <AlertDialog isOpen={open} onClose={() => setOpen(false)}>
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading>Rate</Heading>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Select selectedValue={rateValue} onValueChange={itemValue => setRateValue(itemValue)}>
                        <SelectTrigger variant="outline" size="sm">
                            <SelectIcon as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem label="1" value={1} />
                                <SelectItem label="2" value={2} />
                                <SelectItem label="3" value={3} />
                                <SelectItem label="4" value={4} />
                                <SelectItem label="5" value={5} />
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </AlertDialogBody>
            </AlertDialogContent>
            <AlertDialogFooter>
                <Button onPress={() => rateNews()}>
                    <ButtonText>Rate</ButtonText>
                </Button>
                <Button>
                    <ButtonText onPress={() => setOpen(false)}>Cancel</ButtonText>
                </Button>
            </AlertDialogFooter>
        </AlertDialog>
    )
}