import { Text, View, StyleSheet } from 'react-native';
import CoursesGraph from '../example.mjs';


export default function GraphScreen() {
    return (
        <View style={styles.container}>
            <Text>Local generation of audio files vs server generation test.</Text>
            <CoursesGraph />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
