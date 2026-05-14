import { Input } from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { styled } from "@gluestack-style/react";
import { Colors } from "@/constants/theme";

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
    marginTop: 16
});
export const StyledInput = styled(Input, {
    marginBottom: 16,
    flexDirection: "row",
    borderColor: "#000",
    borderBottomWidth: 2,
    justifyContent: "space-between"
});
export const FillButton = styled(Button, {
    backgroundColor: Colors.blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ":active": {
        backgroundColor: Colors.darkBlue
    }
});
export const FillButtonText = styled(ButtonText, {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
})
export const OutlineButton = styled(Button, {
    borderColor: Colors.blue,
    borderWidth: 3,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ":active": {
        borderColor: Colors.darkBlue
    }
});
export const OutlineButtonText = styled(ButtonText, {
    color: Colors.blue,
    fontSize: 18,
    fontWeight: "bold",
    ":active": {
        color: Colors.darkBlue
    }
})