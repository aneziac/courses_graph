import { StyleSheet, SafeAreaView } from 'react-native';
import GraphScreen from './screens/GraphScreen.jsx';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <GraphScreen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
