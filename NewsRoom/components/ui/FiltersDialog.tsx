import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import Preferences from "@/interfaces/preferences.interface";
import { StyleSheet } from "react-native";
import {useEffect, useState} from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {ChevronDownIcon} from "@/components/ui/icon";
import {
    ButtonBox,
    DialogBackdrop,
    DialogContent, FillButton, FillButtonText, FiltersBody,
    Label, OutlineButton, OutlineButtonRed, OutlineButtonText, OutlineButtonTextRed, ParallelButton, ParallelInput,
    ParallelInputsBox,
    TagInputField
} from "@/components/ui/StyledComponents";

export default function FiltersDialog({open, setOpen, pref, setPref, minDate, maxDate}: {open: boolean, setOpen: (open: boolean) => void, pref: Preferences, setPref: (pref: Preferences) => void, minDate: Date, maxDate: Date}) {
    const [filterOpt, setFilterOpt] = useState(pref);
    const [openDateFrom, setOpenDateFrom] = useState(false);
    const [openDateTo, setOpenDateTo] = useState(false);
    const [error, setError] = useState({message: "", show: false})

    const SavePreferences = () => {
        setError({message: "", show: false});
        if(filterOpt.ratingFrom < 0)
            setError({message: "Rating range must start from at least 0", show: true});
        else if(filterOpt.ratingFrom >= filterOpt.ratingTo)
            setError({message: "Rating range start must be smaller then range end", show: true});
        else if(filterOpt.ratingTo > 5)
            setError({message: "Rating range must end with at most 5", show: true});
        else {
            setPref(filterOpt);
            setOpen(false);
        }
    }

    const clearFilters = () => {
        const cleanFilter = {
            search: "",
            sort: "latest",
            tags: [],
            ratingFrom: 0,
            ratingTo: 5,
            dateFrom: null,
            dateTo: null
        }
        setFilterOpt(cleanFilter);
        setPref(cleanFilter);
        setError({message: "", show: false});
    }

    const handleChange = (e: any, name: string) => {
        setFilterOpt({
            ...filterOpt,
            [name]: e
        });
    }

    const formatDate = (date: Date) => {
        return `${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, "0")}.${date.getFullYear()}`;
    }

    return (
        <AlertDialog useRNModal={true} isOpen={open} onClose={() => setOpen(false)} >
            <DialogBackdrop />
            <DialogContent style={{top: "25%"}}>
                <AlertDialogHeader>
                    <Heading size="3xl" >Filters</Heading>
                </AlertDialogHeader>
                <FiltersBody>
                    <Input
                        variant="outline"
                        size="md"
                    >
                        <TagInputField
                            placeholder="Tags"
                            value={filterOpt.tags.join(' ')}
                            onChangeText={e => handleChange(e.split(' '), "tags")}
                        />
                    </Input>
                    <Label>Rating</Label>
                    <ParallelInputsBox>
                        <Input size="sm" style={{marginRight: 8}}>
                            <ParallelInput
                                inputMode="numeric"
                                placeholder="From"
                                value={filterOpt.ratingFrom.toString()}
                                onChangeText={e => handleChange(Number(e), "ratingFrom")}
                            />
                        </Input>
                        <Text style={{fontSize: 18, marginRight: 8}}>-</Text>
                        <Input size="sm">
                            <ParallelInput
                                inputMode="numeric"
                                placeholder="To"
                                value={filterOpt.ratingTo.toString()}
                                onChangeText={e => handleChange(Number(e), "ratingTo")}
                            />
                        </Input>
                    </ParallelInputsBox>
                    <Label>Date</Label>
                    <ParallelInputsBox>
                        <ParallelButton style={{marginRight: 8}} onPress={() => setOpenDateFrom(true)}>
                            <ButtonText style={{fontSize: 18}}>{filterOpt.dateFrom === null ? "From" : formatDate(filterOpt.dateFrom)}</ButtonText>
                            <ButtonIcon as={ChevronDownIcon} width={14} height={14} fill="#00000000" />
                        </ParallelButton>
                        <Text style={{fontSize: 18, marginRight: 8}}>-</Text>
                        <ParallelButton onPress={() => setOpenDateTo(true)}>
                            <ButtonText style={{fontSize: 18}}>{filterOpt.dateTo === null ? "To" : formatDate(filterOpt.dateTo)}</ButtonText>
                            <ButtonIcon  as={ChevronDownIcon} width={14} height={14} fill="#00000000" />
                        </ParallelButton>
                    </ParallelInputsBox>
                    {error.show && <Text styel={{color: "red", marginTop: 16}}>{error.message}</Text>}
                </FiltersBody>
                <ButtonBox style={{marginTop: 24}}>
                    <FillButton onPress={SavePreferences}>
                        <FillButtonText>Filter</FillButtonText>
                    </FillButton>
                    <OutlineButton onPress={() => clearFilters()}>
                        <OutlineButtonText>Clear</OutlineButtonText>
                    </OutlineButton>
                    <OutlineButtonRed onPress={() => setOpen(false)}>
                        <OutlineButtonTextRed>Cancel</OutlineButtonTextRed>
                    </OutlineButtonRed>
                </ButtonBox>
            </DialogContent>
            {openDateFrom && <DateTimePicker
                value={pref.dateFrom === null ? minDate : pref.dateFrom}
                minimumDate={minDate}
                maximumDate={filterOpt.dateTo !== null && filterOpt.dateTo < maxDate ? filterOpt.dateTo : maxDate}
                neutralButton={{label: "Clear"}}
                onNeutralButtonPress={() => { handleChange(null, "dateFrom"); setOpenDateTo(false) }}
                onValueChange={(e, date) => { handleChange(date <= minDate ? null : date, "dateFrom"); setOpenDateFrom(false) }}
                onDismiss={() => setOpenDateFrom(false)}
            />}
            {openDateTo && <DateTimePicker
                value={pref.dateTo === null ? maxDate : pref.dateTo}
                minimumDate={filterOpt.dateFrom !== null && filterOpt.dateFrom > minDate ? filterOpt.dateFrom : minDate}
                maximumDate={maxDate}
                neutralButton={{label: "Clear"}}
                onNeutralButtonPress={() => { handleChange(null, "dateTo"); setOpenDateTo(false) }}
                onValueChange={(e, date) => { handleChange(date >= maxDate ? null : date, "dateTo"); setOpenDateTo(false) }}
                onDismiss={() => setOpenDateTo(false)}
            />}
        </AlertDialog>
    )
}

const styles = StyleSheet.create({
    rate_input: {

    },
    footer: {
        flexDirection: "row",
        paddingVertical: 16,
        marginTop: 16,
        justifyContent: "space-between"
    },
    filter_button: {
        backgroundColor: "#2080FF",
        paddingVertical: 8,
        width: 96,
        borderRadius: 8,
    },
    clear_button: {
        borderColor: "#D02020",
        borderRadius: 8,
        borderWidth: 3,
        paddingVertical: 8,
        width: 96,
    },
    cancel_button: {
        borderColor: "#2080FF",
        borderRadius: 8,
        borderWidth: 3,
        paddingVertical: 8,
        width: 96,
    },
    date_button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderColor: "#505050",
        borderBottomWidth: 3,
        marginRight: 8
    },
    button_text: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold"
    }
})