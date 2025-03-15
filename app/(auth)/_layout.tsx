import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'blue',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen name="login" options={{
                title: 'Login',
            }}/>
            <Stack.Screen name="register" options={{
                title: 'Register',
            }}/>
        </Stack>
    );
}