import { Box } from '@/components/ui/box'
import { Button } from "@/components/ui/button";
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
import {Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";

export default function HomeToolbar() {
    return (
        <Box>
            <Button>Filters</Button>
            <Select>
                <SelectTrigger>
                    <SelectInput placeholder="Sort" />
                    <SelectIcon as={ChevronDownIcon} />
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
            >
                <InputSlot>
                    <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholder="Search" />
            </Input>
        </Box>
    );
}
