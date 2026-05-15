import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThreeDotsIcon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/components/ui/menu";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import DeleteAccountDialog from "@/components/ui/DeleteAccountDialog";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const router = useRouter()

    const handleLogOut = async () => {
        const json = await SecureStore.getItemAsync("token");
        if(!json)
            return

        const token = JSON.parse(json);
        await axios.delete(`http://172.22.23.115:3100/user/log-out/${token.tokenID}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json',
                'x-access-token': 'Bearer ' + token.value
            }
        })
        .then(() => SecureStore.deleteItemAsync("token"))
        .then(() => router.replace("/login"))
        .catch(e => console.error(e.response.data));
    }

    return (
        <>
            <Tabs screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                headerRight: () => (
                    <Menu style={{backgroundColor: "white", elevation: 4}} useRNModal={true} placement="bottom left" offset={6}
                          isOpen={menuOpen}
                          onClose={() => setMenuOpen(false)}
                          onBlur={() => setMenuOpen(false)}
                          trigger={({...triggerProps}) => {
                              return(
                                  <Button {...triggerProps} onPress={() => setMenuOpen(!menuOpen)} >
                                      <ButtonIcon as={ThreeDotsIcon} width={24} height={24} />
                                  </Button>
                              )
                          }}>
                        <MenuItem style={{padding: 8}} onPress={handleLogOut} key="logout" textValue="Log out">
                            <MenuItemLabel style={{fontSize: 16}}>Log out</MenuItemLabel>
                        </MenuItem>
                        <MenuItem style={{padding: 8}} onPress={() => setDeleteOpen(true)} key="delete-account" textValue="Delete account">
                            <MenuItemLabel style={{fontSize: 16, color: "red"}}>Delete account</MenuItemLabel>
                        </MenuItem>
                    </Menu>
                )
            }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: true,
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="saved"
                    options={{
                        title: 'Saved',
                        headerShown: true,
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="save.fill" color={color} />,
                    }}
                />
            </Tabs>
            <DeleteAccountDialog open={deleteOpen} setOpen={setDeleteOpen} />
        </>
    );
}
