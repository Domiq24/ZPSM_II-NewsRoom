import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { Picker } from "@react-native-picker/picker";
import { MenuIcon, SearchIcon } from '@/components/ui/icon';
import { InputField, InputSlot, InputIcon } from "@/components/ui/input";
import Preferences from "@/interfaces/preferences.interface";
import { FilterButton, SearchInput, Toolbar } from "@/components/ui/StyledComponents";

export default function HomeToolbar({pref, setPref, setOpen}: {pref: Preferences, setPref: (pref: Preferences) => void, setOpen: (open: boolean) => void}) {
    const handleInput = (value: string, name: string) => {
        setPref({
            ...pref,
            [name]: value
        });
    }

    return (
        <Toolbar>
            <FilterButton onPress={() => setOpen(true)}>
                <ButtonIcon as={MenuIcon} stroke="white" width={16} height={16} />
                <ButtonText style={{color: "white", fontSize: 16, marginHorizontal: 4}}>Filters</ButtonText>
            </FilterButton>
            <Picker
                selectedValue={pref.sort}
                onValueChange={(itemValue) => handleInput(itemValue, "sort")}
                style={{flex: 1.2, color: "white"}}
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
            <SearchInput>
                <InputSlot >
                    <InputIcon as={SearchIcon} width={16} height={16} fill="#00000000" />
                </InputSlot>
                <InputField onChangeText={(itemValue) => handleInput(itemValue, "search")} placeholder="Search" />
            </SearchInput>
        </Toolbar>
    );
}