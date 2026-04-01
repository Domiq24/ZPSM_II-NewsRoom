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
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import Preferences from "@/interfaces/preferences.interface";
import { StyleSheet } from "react-native";
import { useState } from "react";

export default function FiltersDialog({open, setOpen, pref, setPref}: {open: boolean, setOpen: (open: boolean) => void, pref: Preferences, setPref: (pref: Preferences) => void}) {
    const [filterOpt, setFilterOpt] = useState(pref);

    const SavePreferences = () => {
        setPref(filterOpt);
        setOpen(false);
    }

    const handleChange = (e: any, name: string) => {
        setFilterOpt({
            ...filterOpt,
            [name]: e
        });
    }

    return (
        <AlertDialog useRNModal={true} isOpen={open} onClose={() => setOpen(false)} style={styles.container}>
            <AlertDialogBackdrop />
            <AlertDialogContent>
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
                        <Text style={{fontSize: 16, marginRight: 8}}>-</Text>
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
                </AlertDialogBody>
                <AlertDialogFooter style={styles.footer}>
                    <Button style={styles.filter_button} onPress={SavePreferences}>
                        <ButtonText style={{...styles.button_text, color: "white"}}>Filter</ButtonText>
                    </Button>
                    <Button
                        style={styles.cancel_button}
                        variant="outline"
                        action="secondary"
                        onPress={() => setOpen(false)}
                    >
                        <ButtonText style={{...styles.button_text, color: "#2080FF"}}>Cancel</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 24,
        padding: 16,
        top: "30%"
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
        fontSize: 16,
        borderColor: "#505050",
        borderWidth: 2,
        paddingHorizontal: 16,
        marginVertical: 8,
        marginRight: 8
    },
    footer: {
        flexDirection: "row",
        paddingVertical: 8,
        justifyContent: "space-between"
    },
    filter_button: {
        backgroundColor: "#2080FF",
        paddingVertical: 8,
        width: 96,
        borderRadius: 8,
    },
    cancel_button: {
        borderColor: "#2080FF",
        borderRadius: 8,
        borderWidth: 3,
        paddingVertical: 8,
        width: 96,
    },
    button_text: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold"
    }
})