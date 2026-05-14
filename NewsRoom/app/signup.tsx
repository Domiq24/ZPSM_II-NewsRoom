import {Box} from "@/components/ui/box";
import { InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import {
    ButtonBox,
    FillButton,
    FillButtonText,
    OutlineButton,
    OutlineButtonText,
    StyledInput,
    StyledPanel
} from "@/components/ui/StyledComponents";
import {Text} from "@/components/ui/text";


export default function SignUpScreen() {
    const [account, setAccount] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [rPassword, setRPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRPassword, setShowRPassword] = useState(false);
    const [error, setError] = useState({message: "", show: false});
    const router = useRouter()
    const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

    const handleSignUp = async () => {
        setError({message: "", show: false});

        if(account.name === "")
            setError({message: "Name is required", show: true});
        else if(account.email === "")
            setError({message: "E-mail is required", show: true});
        else if(!emailRegExp.test(account.email))
            setError({message: "Incorrect email", show: true});
        else if(account.password === "")
            setError({message: "Password is required", show: true});
        else if(rPassword === "")
            setError({message: "Password must be repeated", show: true});
        else if(rPassword != account.password)
            setError({message: "Repeated password must match the original", show: true});
        else {
            await axios.post("http://172.22.23.12:3100/user",
                {
                    user: {
                        ...account,
                        userID: null
                    }
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': ' application/json'
                    }
                }
            )
            .then(() => router.replace("./login"))
            .catch(e => {
                console.log(e.response.data);
                setError({message: e.response.data, show: true});
            });
        }
    }

    return(
        <Box>
            <StyledPanel>
                <StyledInput size="md">
                    <InputField
                        style={{fontSize: 24, flex: 1}}
                        placeholder="Name"
                        value={account.name}
                        onChangeText={e => setAccount({...account, name: e})}
                    />
                </StyledInput>
                <StyledInput size="md">
                    <InputField
                        style={{fontSize: 24, flex: 1}}
                        placeholder="E-mail"
                        value={account.email}
                        onChangeText={e => setAccount({...account, email: e})}
                    />
                </StyledInput>
                <StyledInput size="md">
                    <InputField
                        style={{fontSize: 24, flex: 1}}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={account.password}
                        onChangeText={e => setAccount({...account, password: e})}
                    />
                    <InputSlot style={{alignSelf: "center"}} onPress={() => setShowPassword(!showPassword)}>
                        <InputIcon width={24} height={24} fill="#00000000" as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                </StyledInput>
                <StyledInput size="md">
                    <InputField
                        style={{fontSize: 24, flex: 1}}
                        placeholder="Repeat Password"
                        type={showRPassword ? "text" : "password"}
                        value={rPassword}
                        onChangeText={e => setRPassword(e)}
                    />
                    <InputSlot style={{alignSelf: "center"}} onPress={() => setShowRPassword(!showRPassword)}>
                        <InputIcon width={24} height={24} fill="#00000000" as={showRPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                </StyledInput>
                {error.show && <Text style={{color: "red"}}>{error.message}</Text>}
                <ButtonBox>
                    <FillButton
                        onPress={handleSignUp}
                    >
                        <FillButtonText>
                            Sign up
                        </FillButtonText>
                    </FillButton>
                    <OutlineButton
                        onPress={() => router.dismissTo('./login')}
                    >
                        <OutlineButtonText>
                            Log in
                        </OutlineButtonText>
                    </OutlineButton>
                </ButtonBox>
            </StyledPanel>

        </Box>
    )
}