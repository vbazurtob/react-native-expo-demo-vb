import {ScrollView, StyleSheet, View} from "react-native";
import {ThemedView} from "@/components/themed-view";
import {Member} from "@/types/member";
import IdCard from "@/components/ui/id-card";

const members: Member[] = [
    { id: "1", name: "Lucas Garcia", avatar: "https://via.placeholder.com/150/F1DCDC/F1DCDC?text=LG" },
    { id: "2", name: "Mia Jackson", avatar: "https://via.placeholder.com/150/FFF7DC/FFF7DC?text=MJ" },
    { id: "3", name: "James Lopez", avatar: "https://via.placeholder.com/150/FFDCDC/FFDCDC?text=JL" },
    { id: "4", name: "Lucas Smith", avatar: "https://via.placeholder.com/150/FFDCDC/FFDCDC?text=LS" },
    { id: "5", name: "James Miller", avatar: "https://via.placeholder.com/150/DCE9FD/DCE9FD?text=JM" },
    { id: "6", name: "Mia Smith", avatar: "https://via.placeholder.com/150/FFDCDC/FFDCDC?text=MS" },
    { id: "7", name: "Sophia Jones", avatar: "https://via.placeholder.com/150/FFDCDC/FFDCDC?text=SJ" },
    { id: "8", name: "James Thomas", avatar: "https://via.placeholder.com/150/DCE2FF/DCE2FF?text=JT" },
    { id: "9", name: "Harper Moore", avatar: "https://via.placeholder.com/150/FDF9DC/FDF9DC?text=HM" },
    { id: "10", name: "Alexander Lopez", avatar: "https://via.placeholder.com/150/FFDCDC/FFDCDC?text=AL" },
    { id: "11", name: "Olivia Thomas", avatar: "https://via.placeholder.com/150/DCDCF8/DCDCF8?text=OT" },
    { id: "12", name: "Oliver Martin", avatar: "https://via.placeholder.com/150/EFDCDC/EFDCDC?text=OM" },
];

const IdCards = () => {
    return (
        <ThemedView style={style.ScreenContainer}>
            <View style={style.HeaderBar}>
            </View>
            <ScrollView style={style.ScrollableCards}>
                {members.map((member) => (
                    <IdCard key={member.id} member={member} />
                ))}
            </ScrollView>
        </ThemedView>
    );
};



const style = StyleSheet.create({
    HeaderBar: {
        width: '100%',
        height: 50
    },
    ScrollableCards: {
        width: '100%',
        flexDirection: 'column'
    },
    ScreenContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1,
    }
});

export default IdCards;