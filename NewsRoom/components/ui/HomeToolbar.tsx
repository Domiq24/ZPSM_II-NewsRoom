import { Box } from '@/components/ui/box'
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import { Picker } from "@react-native-picker/picker";
import {ChevronDownIcon, MenuIcon, SearchIcon} from '@/components/ui/icon';
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { StyleSheet } from "react-native";
import Preferences from "@/interfaces/preferences.interface";

export default function HomeToolbar({pref, setPref, setOpen}: {pref: Preferences, setPref: (pref: Preferences) => void, setOpen: (open: boolean) => void}) {
    const handleInput = (value: string, name: string) => {
        setPref({
            ...pref,
            [name]: value
        });
    }

    return (
        <Box style={styles.toolbar}>
            <Button style={styles.filter} onPress={() => setOpen(true)}>
                <ButtonIcon as={MenuIcon} stroke="white" width={16} height={16} />
                <ButtonText style={{color: "white", fontSize: 16, marginHorizontal: 4}}>Filters</ButtonText>
            </Button>
            <Picker
                selectedValue={pref.sort}
                onValueChange={(itemValue) => handleInput(itemValue, "sort")}
                style={styles.sort}
                mode="dropdown"
                dropdownIconColor="white"
                selectionColor="#2080FF"
            >
                <Picker.Item label="Latest" value="latest" />
                <Picker.Item label="Rating ascending" value="rating_asc" />
                <Picker.Item label="Rating descending" value="rating_dsc" />
                <Picker.Item label="Author" value="author" />
                <Picker.Item label="Title" value="tilte" />
            </Picker>
            <Input
                variant="rounded"
                size="sm"
                style={styles.search}
            >
                <InputSlot >
                    <InputIcon as={SearchIcon} width={16} height={16} fill="#00000000" />
                </InputSlot>
                <InputField onChangeText={(itemValue) => handleInput(itemValue, "search")} placeholder="Search" />
            </Input>
        </Box>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2080FF',
        maxHeight: 60,
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 8
    },
    filter: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    sort: {
        flex: 1.2,
        color: "white",
    },
    search: {
        flex: 1.5,
        backgroundColor: 'white',
        flexDirection: "row",
        alignItems: "center",
        height: 38,
        paddingLeft: 8,
        borderRadius: 16
    },
    icon: {
        fontSize: 2
    }
})