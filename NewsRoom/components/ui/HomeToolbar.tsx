import { Box } from '@/components/ui/box'
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
import { ChevronDownIcon, SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { StyleSheet } from "react-native";

export default function HomeToolbar() {
    return (
        <Box style={styles.toolbar}>
            <Button style={styles.filter}>
                <ButtonText style={{color: "white", fontSize: 16}}>Filters</ButtonText>
            </Button>
            <Select style={{flex: 1}}>
                <SelectTrigger style={styles.sort}>
                    <SelectInput style={{color: "white"}} placeholder="Sort" />
                    <SelectIcon as={ChevronDownIcon} width={18} height={18} fill="#00000000" stroke="#FFFFFF" />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label="Latest" value="latest" />
                        <SelectItem label="Rating ascending" value="rate_asc" />
                        <SelectItem label="Rating descending" value="rate_dsc" />
                        <SelectItem label="By author" value="author" />
                        <SelectItem label="By title" value="title" />
                    </SelectContent>
                </SelectPortal>
            </Select>
            <Input
                variant="rounded"
                size="sm"
                style={styles.search}
            >
                <InputSlot >
                    <InputIcon as={SearchIcon} width={16} height={16} fill="#00000000" />
                </InputSlot>
                <InputField placeholder="Search" />
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
        borderColor: "white",
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 8
    },
    sort: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 0,
        height: 38
    },
    search: {
        flex: 1,
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