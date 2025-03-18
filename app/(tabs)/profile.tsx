import {StyleSheet, View, Text, ActivityIndicator, Pressable, ScrollView, Image, RefreshControl, SafeAreaView} from 'react-native';
import {useEffect, useState} from "react";
import {getCurrentUser} from "@/service/user-service/user-service";
import {useRouter} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {supabase} from "@/supabase/supabase";
import { User } from '@supabase/supabase-js';

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await getCurrentUser();
            if (data) {
                setUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.replace('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleEditProfile = () => {
        // router.push('/edit-profile');
    };

    const ProfileSection = ({title, value}: any) => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionValue}>{value || 'Not provided'}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#403572" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={60} color="#f44336" />
                <Text style={styles.errorText}>Failed to load profile</Text>
                <Pressable style={styles.retryButton} onPress={fetchProfile}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#403572"]} />
                }
            >
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {user.user_metadata.name?.[0]?.toUpperCase() || "U"}
                        </Text>
                    </View>
                    <Text style={styles.nameText}>
                        {user.user_metadata.name} {user.user_metadata.surname}
                    </Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Personal Information</Text>

                    <ProfileSection title="Full Name" value={`${user.user_metadata.name} ${user.user_metadata.surname}`} />
                    <ProfileSection title="Age" value={user.user_metadata.age} />
                    <ProfileSection title="Email" value={user.email} />
                    <ProfileSection title="Village" value={user.user_metadata.village} />
                    <ProfileSection title="Employment Status" value={user.user_metadata.employmentStatus || user.user_metadata.status} />
                    <ProfileSection title="Phone" value={user.user_metadata.cellphone} />
                </View>

                <View style={styles.actionsContainer}>
                    <Pressable style={styles.editButton} onPress={handleEditProfile}>
                        <Feather name="edit-2" size={20} color="white" />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </Pressable>

                    <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                        <Feather name="log-out" size={20} color="white" />
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 18,
        color: '#333',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#403572',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#403572',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    emailText: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginHorizontal: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    sectionContainer: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    sectionValue: {
        fontSize: 16,
        color: '#333',
    },
    actionsContainer: {
        marginHorizontal: 16,
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#403572',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 12,
    },
    signOutButton: {
        backgroundColor: '#f44336',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});