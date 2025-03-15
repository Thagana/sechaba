import * as React from "react";
import {Pressable} from "react-native";

export type ButtonProps = {
    onPress: () => void;
    children?: React.ReactNode;
}

export default function Button(props: ButtonProps) {
    const { onPress, children } = props;
    return (
        <Pressable onPress={onPress}
            style={{
                backgroundColor: 'blue',
                padding: 15,
                margin: 5,
                borderRadius: 10,
                alignItems: 'center'
        }}>
            {children}
        </Pressable>
    )
}