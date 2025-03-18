import {StyleSheet, View, Text, TextInput, Pressable, ScrollView, ActivityIndicator} from 'react-native';
import {FunctionComponent, useState, useEffect} from "react";
import {useRouter} from "expo-router";
import * as Location from 'expo-location';
import {supabase} from '@/supabase/supabase';


type RegisterProps = {}
type InputType = 'NAME' | 'SURNAME' | 'EMAIL' | 'AGE' | 'VILLAGE' | 'STATUS' | 'CELLPHONE' | 'PASSWORD'

const Register: FunctionComponent<RegisterProps> = () => {
    const [formStep, setFormStep] = useState(1); // Changed from boolean to number for clarity
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        cellphone: '',
        age: '',
        village: '',
        status: '',
        password: ''
    });
    const router = useRouter();

    const handleNav = () => {
        router.navigate('/login');
    }

    const handleChange = (type: InputType, value: string) => {
        setFormData(prev => ({
            ...prev,
            [type.toLowerCase().replace('_', '')]: value
        }));
    }

    const validateStepOne = () => {
        const { name, surname, email, cellphone } = formData;
        if (!name.trim()) return { valid: false, message: 'Name is required' };
        if (!surname.trim()) return { valid: false, message: 'Surname is required' };
        if (!email.trim()) return { valid: false, message: 'Email is required' };
        if (!/^\S+@\S+\.\S+$/.test(email)) return { valid: false, message: 'Please enter a valid email' };
        if (!cellphone.trim()) return { valid: false, message: 'Phone number is required' };
        if (!/^\d{10}$/.test(cellphone.replace(/\D/g, '')))
            return { valid: false, message: 'Please enter a valid 10-digit phone number' };

        return { valid: true };
    }

    const validateStepTwo = () => {
        const { age, village, status, password } = formData;

        if (!age.trim()) return { valid: false, message: 'Age is required' };
        if (isNaN(Number(age)) || Number(age) < 18)
            return { valid: false, message: 'Please enter a valid age (18+)' };

        if (!village.trim()) return { valid: false, message: 'Village is required' };
        if (!status.trim()) return { valid: false, message: 'Employment status is required' };

        if (!password.trim()) return { valid: false, message: 'Password is required' };
        if (password.length < 8)
            return { valid: false, message: 'Password must be at least 8 characters' };

        return { valid: true };
    }

    const goToNextStep = () => {
        const validation = validateStepOne();
        if (!validation.valid) {
            alert(validation.message);
            return;
        }
        setFormStep(2);
    }

    const goToPreviousStep = () => {
        setFormStep(1);
    }

    const submitForm = async () => {
        const validation = validateStepTwo();
        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        surname: formData.surname,
                        age: formData.age,
                        village: formData.village,
                        cellphone: formData.cellphone,
                        status: formData.status,
                        location: location
                    }
                }
            });

            if (error) {
                alert('Error' + error)
                return
            }
            // update the push token for the user
            alert('Registration successful! Please check your email to verify your account.');
            router.navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Error while trying to create an account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function getCurrentLocation(): Promise<void> {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    const renderFormStep = () => {
        if (formStep === 1) {
            return (
                <>
                    <Text style={styles.stepIndicator}>Step 1 of 2: Personal Information</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleChange('NAME', value)}
                        placeholderTextColor="#666"
                        placeholder="Name *"
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.surname}
                        onChangeText={(value) => handleChange('SURNAME', value)}
                        placeholderTextColor="#666"
                        placeholder="Surname *"
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        onChangeText={(value) => handleChange('EMAIL', value)}
                        placeholderTextColor="#666"
                        placeholder="Email *"
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.cellphone}
                        keyboardType='phone-pad'
                        onChangeText={(value) => handleChange('CELLPHONE', value)}
                        placeholderTextColor="#666"
                        placeholder="Phone Number *"
                    />
                    <Pressable onPress={goToNextStep} style={styles.button}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </Pressable>
                </>
            );
        } else {
            return (
                <>
                    <Text style={styles.stepIndicator}>Step 2 of 2: Additional Information</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.age}
                        keyboardType='numeric'
                        onChangeText={(value) => handleChange('AGE', value)}
                        placeholderTextColor="#666"
                        placeholder="Age *"
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.village}
                        onChangeText={(value) => handleChange('VILLAGE', value)}
                        placeholderTextColor="#666"
                        placeholder="Village *"
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.status}
                        onChangeText={(value) => handleChange('STATUS', value)}
                        placeholderTextColor="#666"
                        placeholder="Employment Status *"
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.password}
                        autoCapitalize='none'
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={(value) => handleChange('PASSWORD', value)}
                        placeholderTextColor="#666"
                        placeholder="Password *"
                    />
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={goToPreviousStep} style={[styles.button, styles.backButton]}>
                            <Text style={styles.buttonText}>Back</Text>
                        </Pressable>
                        <Pressable
                            onPress={submitForm}
                            style={[styles.button, styles.submitButton]}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Submit</Text>
                            )}
                        </Pressable>
                    </View>
                </>
            );
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Create Account</Text>

                {renderFormStep()}

                <View style={styles.loginPrompt}>
                    <Text>Already have an account? </Text>
                    <Pressable onPress={handleNav}>
                        <Text style={styles.loginLink}>
                            Log in
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "white",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    stepIndicator: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        color: '#555',
    },
    input: {
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        height: 55,
        color: 'black',
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        marginVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#aaa',
        flex: 0.45,
    },
    submitButton: {
        flex: 0.45,
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    loginLink: {
        color: '#2196F3',
        fontWeight: '500',
    }
});

export default Register;