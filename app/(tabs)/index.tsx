import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {useState, useEffect} from 'react';
import {Announcements} from "@/components/announcements/announcements";

export type AnnouncementType = {
    id: number;
    title: string;
    type: announcementsTypes;
    body: string;
}

export type announcementsTypes = 'NORMAL' | 'EMERGENCY'

const data: AnnouncementType[] = [
    {
        id: 1,
        title: 'App Maintenance',
        body: 'There is going to be an app maintenance between 00:00 am and 02:00 service will be down',
        type: 'NORMAL'
    },
    {
        id: 2,
        title: 'Potential Scam Alert',
        body: 'There is an ongoing scam of people pretending to be us be aware and stay alert. be safe',
        type: 'EMERGENCY'
    },
    {
        id: 3,
        title: 'General Works Need',
        body: 'General workers are needed for Anglo mine. Apply through the careers section',
        type: 'NORMAL'
    },
    {
        id: 4,
        title: 'Community Meeting',
        body: 'Important community meeting at the village hall on Friday at 15:00. All residents encouraged to attend',
        type: 'NORMAL'
    },
    {
        id: 5,
        title: 'Water Shortage Warning',
        body: 'Due to maintenance work, water supply will be limited on Saturday from 08:00 to 14:00. Please store water accordingly',
        type: 'EMERGENCY'
    },
    {
        id: 6,
        title: 'New Training Program',
        body: 'Free digital skills training program starting next month. Registration opens on Monday',
        type: 'NORMAL'
    },
    {
        id: 7,
        title: 'Health Clinic Schedule',
        body: 'Mobile health clinic will visit the community center every Tuesday in April from 09:00 to 16:00',
        type: 'NORMAL'
    },
    {
        id: 8,
        title: 'Road Closure Alert',
        body: 'Main access road to the village will be closed for repairs from March 20-25. Please use alternate routes',
        type: 'EMERGENCY'
    },
    {
        id: 9,
        title: 'Scholarship Opportunity',
        body: 'Applications for the community education scholarship are now open until April 30. See website for details',
        type: 'NORMAL'
    },
    {
        id: 10,
        title: 'Severe Weather Warning',
        body: 'Heavy storms expected this weekend. Please secure property and avoid unnecessary travel',
        type: 'EMERGENCY'
    }
];

export default function HomeScreen() {
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncements] = useState<AnnouncementType[]>(data);
    useEffect(() => {
        fetchProfile()
    }, []);

    async function fetchProfile() {}

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Announcements data={announcements} />
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    announcements: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#403572',
        borderRadius: 15,
        width: 315,
        height: 105,
        paddingHorizontal: 20,
    },
    announcementsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        gap: 10
    },
    announcementsInfoContainer: {
        flexDirection: 'column',
        gap: 5
    },
    announcementsInfoText: {
        color: 'white',
        fontSize: 12,
    },
    announcementsInfoTextHeader: {
        color: 'white',
        fontSize: 16,
    }
});
