import {Input, InputField} from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { styled } from "@gluestack-style/react";
import { Colors } from "@/constants/theme";
import { Text } from "@/components/ui/text";
import {AlertDialogBackdrop, AlertDialogBody, AlertDialogContent} from "@/components/ui/alert-dialog";
import {HStack} from "@/components/ui/hstack";
import { Platform } from 'react-native';

export const StyledPanel = styled(Box, {
    width: '80%',
    alignSelf: "center",
    backgroundColor: "white",
    padding: 16,
    marginTop: 120,
    elevation: 4
});
export const ButtonBox = styled(Box, {
    flexDirection: "row",
    justifyContent: "space-between",
});
export const StyledInput = styled(Input, {
    marginBottom: 16,
    flexDirection: "row",
    borderColor: "#000",
    borderBottomWidth: 2,
    justifyContent: "space-between"
});
export const StyledInputField = styled(InputField, {
    fontSize: 26,
    lineHeight: 28,
    fontFamily: 'Grenze_400Regular',
    flex: 1
})
export const FillButton = styled(Button, {
    backgroundColor: Colors.blue,
    borderRadius: 8,
    paddingVertical: 8,
    width: 100,
    alignItems: "center",
    ":active": {
        backgroundColor: Colors.darkBlue
    }
});
export const FillButtonText = styled(ButtonText, {
    color: "white",
    fontSize: 20,
    lineHeight: 22,
    fontFamily: 'Grenze_700Bold'
});
export const FillButtonRed = styled(FillButton, {
    backgroundColor: Colors.red,
    ":active": {
        backgroundColor: Colors.darkRed
    }
})
export const OutlineButton = styled(Button, {
    borderColor: Colors.blue,
    borderWidth: 3,
    borderRadius: 8,
    paddingVertical: 8,
    width: 100,
    alignItems: "center",
    ":active": {
        borderColor: Colors.darkBlue
    }
});
export const OutlineButtonText = styled(ButtonText, {
    color: Colors.blue,
    fontSize: 20,
    lineHeight: 22,
    fontFamily: 'Grenze_700Bold',
    ":active": {
        color: Colors.darkBlue
    }
});
export const OutlineButtonRed = styled(OutlineButton, {
    borderColor: Colors.red,
    ":active": {
        borderColor: Colors.darkRed
    }
});
export const OutlineButtonTextRed = styled(OutlineButtonText, {
    color: Colors.red,
    ":active": {
        color: Colors.darkRed
    }
});
export const Toolbar = styled(Box, {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.blue,
    maxHeight: 60,
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8
});
export const FilterButton = styled(Button, {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 8
});
export const FilterButtonText = styled(ButtonText, {
    color: "white",
    fontSize: 18,
    lineHeight: 20,
    marginHorizontal: 4,
    fontFamily: 'Grenze_400Regular'
})
export const SearchInput = styled(Input, {
    flex: 1.5,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: 38,
    paddingLeft: 8,
    borderRadius: 16
});
export const SearchInputField = styled(InputField, {
    fontFamily: 'Grenze_400Regular',
    fontSize: 18,
    paddingBottom: "auto",
    paddingTop: "auto",
    verticalAlign: "middle"
})
export const NewsItem = styled(Box, {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    gap: 4,
    backgroundColor: Colors.lightGrey,
    borderRadius: 16,
    elevation: 4
});
export const NewsItemSection = styled(Box, {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
});
export const NewsItemTags = styled(Box, {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
});
export const NewsItemTagsText = styled(Text, {
    paddingRight: 4,
    color: "#3070F0",
    fontSize: 16,
    lineHeight: 18,
    fontFamily: 'Grenze_400Regular'
})
export const NewsItemTitle = styled(Text, {
    flex: 2,
    fontSize: 22,
    fontFamily: "Grenze_700Bold",
    lineHeight: 24
});
export const NewsItemText = styled(Text, {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Grenze_400Regular'
})
export const DialogBackdrop = styled(AlertDialogBackdrop, {
    backgroundColor: "black",
    opacity: 0.4,
    height: "100%",
    width: "100%"
});
export const DialogContent = styled(AlertDialogContent, {
    position: "absolute",
    backgroundColor: "white",
    alignSelf: "center",
    width: "85%",
    padding: 16
});
export const NewsDetailsInfo = styled(HStack, {
    flexDirection: "row",
    marginTop: 16,
    borderBottomWidth: 2,
    borderColor: "black",
    paddingBottom: 16
});
export const TagInputField = styled(InputField, {
    fontSize: 16,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 8,
    marginTop: 16
});
export const Label = styled(Text, {
    marginTop: 16,
    fontSize: 24,
    lineHeight: 26,
    fontFamily: 'Grenze_700Bold'
});
export const ParallelInputsBox = styled(Box, {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8
});
export const ParallelInput = styled(InputField, {
    fontSize: 18,
    borderColor: Colors.grey,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 8,
    paddingRight: 8
});
export const ParallelButton = styled(Button, {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4
})
export const FiltersBody = styled(AlertDialogBody, {
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderColor: Colors.grey
})
export const NewsDetailsTitle = styled(Text, {
    marginVertical: 0,
    fontFamily: 'Grenze_700Bold',
    fontSize: 28,
    lineHeight: 30
})
export const NewsDetailsTag = styled(Text, {
    color: "#2080FF",
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Grenze_400Regular'
})
export const NewsDetailsParagraph = styled(Text, {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: 'Grenze_400Regular'
})