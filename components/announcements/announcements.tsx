import {FlatList, StyleSheet, Text, View} from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {announcementsTypes, AnnouncementType} from "@/app/(tabs)";

export type AnnouncementsProps = {
    data: AnnouncementType[]
}

export function Announcements(props: AnnouncementsProps) {
    const { data } = props;
    const renderItem = ({ item }: { item: any }) => {
        return <Announcement  id={item.id}  title={item.title} body={item.body} key={item.id} type={item.type} />
    }
    return (
        <FlatList data={data} renderItem={renderItem} keyExtractor={(_, index) => index.toString()} />
    )
}


export type AnnouncementProps = {
    id: number;
    title: string;
    type: announcementsTypes;
    body: string;
}

export function Announcement(props: AnnouncementProps) {
    const { title, body, type } = props
    const iconRender = (type: announcementsTypes) => {
        switch (type) {
            case 'NORMAL':
                return (
                    <MaterialCommunityIcons name="calendar-month-outline" size={20} color="white" />
                )
            case 'EMERGENCY':
                return (
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="white" />
                )
            default:
                return (
                    <MaterialCommunityIcons name="information-outline" size={20} color="white" />
                )
        }
    }
    return (
        <View style={styles.announcements}>
            <View style={styles.announcementsContainer}>
                <View>
                    {iconRender(type)}
                </View>
                <View style={styles.announcementsInfoContainer}>
                    <View>
                        <Text style={styles.announcementsInfoTextHeader}>{title}</Text>
                    </View>
                    <View>
                        <Text style={styles.announcementsInfoText}>
                            {body}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
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
        marginVertical: 5,
    },
    announcementsContainer: {
        flexDirection: 'row',
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