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

export default function FiltersDialog({open, setOpen, pref, setPref, minDate, maxDate}: {open: boolean, setOpen: (open: boolean) => void, pref: Preferences, setPref: (pref: Preferences) => void, minDate: Date, maxDate: Date}) {
    const [filterOpt, setFilterOpt] = useState(pref);
    const [openDateFrom, setOpenDateFrom] = useState(false);
    const [openDateTo, setOpenDateTo] = useState(false);

    const SavePreferences = () => {
        setPref(filterOpt);
        setOpen(false);
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
        setOpen(false);
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
            <AlertDialogBackdrop style={styles.backdrop} />
            <AlertDialogContent style={styles.container}>
                <AlertDialogHeader>
                    <Heading size="3xl" >Filters</Heading>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Input
                        variant="outline"
                        size="md"
                    >
                        <InputField
                            style={styles.tags}
                            placeholder="Tags"
                            value={filterOpt.tags.join(' ')}
                            onChangeText={e => handleChange(e.split(' '), "tags")}
                        />
                    </Input>
                    <Text style={styles.label}>Rating</Text>
                    <Box style={styles.input_section}>
                        <Input size="sm">
                            <InputField
                                style={styles.rate_input}
                                inputMode="numeric"
                                placeholder="From"
                                value={filterOpt.ratingFrom.toString()}
                                onChangeText={e => handleChange(Number(e), "ratingFrom")}
                            />
                        </Input>
                        <Text style={{fontSize: 18, marginRight: 8}}>-</Text>
                        <Input size="sm">
                            <InputField
                                style={styles.rate_input}
                                inputMode="numeric"
                                placeholder="To"
                                value={filterOpt.ratingTo.toString()}
                                onChangeText={e => handleChange(Number(e), "ratingTo")}
                            />
                        </Input>
                    </Box>
                    <Text style={styles.label}>Date</Text>
                    <Box style={styles.input_section}>
                        <Button style={styles.date_button} onPress={() => setOpenDateFrom(true)}>
                            <ButtonText style={{fontSize: 18}}>{filterOpt.dateFrom === null ? "From" : formatDate(filterOpt.dateFrom)}</ButtonText>
                            <ButtonIcon as={ChevronDownIcon} width={14} height={14} fill="#00000000" />
                        </Button>
                        <Text style={{fontSize: 18, marginRight: 8}}>-</Text>
                        <Button style={styles.date_button} onPress={() => setOpenDateTo(true)}>
                            <ButtonText style={{fontSize: 18}}>{filterOpt.dateTo === null ? "To" : formatDate(filterOpt.dateTo)}</ButtonText>
                            <ButtonIcon  as={ChevronDownIcon} width={14} height={14} fill="#00000000" />
                        </Button>
                    </Box>
                </AlertDialogBody>
                <AlertDialogFooter style={styles.footer}>
                    <Button style={styles.filter_button} onPress={SavePreferences}>
                        <ButtonText style={{...styles.button_text, color: "white"}}>Filter</ButtonText>
                    </Button>
                    <Button style={styles.cancel_button} onPress={() => setOpen(false)}>
                        <ButtonText style={{...styles.button_text, color: "#2080FF"}}>Cancel</ButtonText>
                    </Button>
                    <Button style={styles.clear_button} onPress={() => clearFilters()}>
                        <ButtonText style={{...styles.button_text, color: "#D02020"}}>Clear</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
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
        top: "25%"
    },
    tags: {
        fontSize: 16,
        borderColor: "#505050",
        borderWidth: 2,
        borderRadius: 16,
        paddingHorizontal: 8,
        marginTop: 16
    },
    label: {
        marginTop: 16,
        fontSize: 22,
        fontWeight: "bold"
    },
    input_section: {
        flexDirection: "row",
        alignItems: "center",
    },
    rate_input: {
        fontSize: 18,
        borderColor: "#505050",
        borderBottomWidth: 3,
        marginVertical: 8,
        marginRight: 8
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
        ":pressed": {
            backgroundColor: "#1020E0"
        }
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