import {StyleSheet, View, Text, ActivityIndicator, Pressable} from 'react-native';
import {useEffect, useState} from "react";

export default function ProofOfResidence() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
            {loading && (
                <ActivityIndicator size="large"/>
            )}
            {!loading && data && (
                <>

                </>
            )}
            {!loading && !data && (
                <View>
                    <Text>Failed to fetch data</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'gray',
        width: 300,
        padding: 20,
        borderRadius: 10,
        margin: 5
    },
    infoText: {
        color: 'white',
        paddingLeft: 15,
        fontSize: 18,
    }
});
