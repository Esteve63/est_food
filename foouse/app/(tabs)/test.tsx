import { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';


const TestScreen = () => {
    const [pong, setPong] = useState('')

    useEffect(() => {
        (async () => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ping`);
            const data = await response.json();
            console.log(data.ping);
            setPong(data.ping);
        })()
    }, [])

    return (
        <Text> PING: {pong} </Text>
    )
}

export default TestScreen;