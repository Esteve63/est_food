import { TouchableOpacity, StyleSheet, Text, GestureResponderEvent } from "react-native";

interface SubmitButtonProps {
    onPress: (event: GestureResponderEvent) => void;
}

const SubmitButton = ({ onPress }: SubmitButtonProps) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#841584',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
        margin: 20,
        bottom: 0,
        position: 'absolute'
    },
    buttonText: {
        color: 'white',
    },
});

export default SubmitButton;
