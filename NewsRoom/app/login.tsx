import { Box } from "@/components/ui/box";
import { InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text"
import { StyledPanel, ButtonBox, StyledInput, FillButton, FillButtonText, OutlineButton, OutlineButtonText } from "@/components/ui/StyledComponents";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import {useEffect, useState} from "react";
import axios from "axios";
import JWT from "expo-jwt";

export default function LoginScreen() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({message: "", show: false});
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();

    const handleLogIn = async () => {
        setError({message: "", show: false});
        if(login === "")
            setError({message: "Login required", show: true});
        else if(password === "")
            setError({message: "Password required", show: true});
        else {
            await axios.post("http://172.22.23.12:3100/user/auth",
                {
                    login: login,
                    password: password
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': ' application/json'
                    }
                }
            )
            .then(res => {
                SecureStore.setItemAsync("token", JSON.stringify(res.data));
            })
            .then(() => router.replace("/(tabs)"))
            .catch(e => {
                console.log(e.response.data);
                setError({message: e.response.data, show: true})
            });
        }
    }

    const checkToken = async () => {
        const json = SecureStore.getItem("token");
        if(!json)
            return

        try {
            const token = JSON.parse(json);
            const decoded = JWT.decode(token.value, "secret");
            router.replace("/(tabs)");
        } catch (e) {
            if(e.name === 'TokenExpiredError')
                await SecureStore.deleteItemAsync("token");
        }
    }

    useEffect(() => {
        checkToken()
    }, []);

    return(
        <Box>
            <StyledPanel>
                <StyledInput>
                    <InputField
                        style={{fontSize: 24, flex: 1}}
                        placeholder="Login"
                        value={login}
                        onChangeText={e => setLogin(e)}
                    />
                </StyledInput>
                <StyledInput size="md">
                    <InputField
                        style={{fontSize: 24, flex: 1}}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChangeText={e => setPassword(e)}
                    />
                    <InputSlot style={{alignSelf: "center"}} onPress={() => setShowPassword(!showPassword)}>
                        <InputIcon width={24} height={24} fill="#00000000" as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                </StyledInput>
                {error.show && <Text style={{color: "red"}}>{error.message}</Text>}
                <ButtonBox>
                    <FillButton
                        onPress={handleLogIn}
                    >
                        <FillButtonText>
                            Log in
                        </FillButtonText>
                    </FillButton>
                    <OutlineButton
                        onPress={() => router.push("./signup")}
                    >
                        <OutlineButtonText>
                            Sign up
                        </OutlineButtonText>
                    </OutlineButton>
                </ButtonBox>
            </StyledPanel>
        </Box>
    );
}