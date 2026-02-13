import {StyleSheet, useColorScheme, View} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {Member} from "@/types/member";

type IdCardProps = {
    member: Member;
}

const avatarSize = 50;
const avatarColors =  [
    '#FFFACD', // yellow
    '#FCD5CE', // orange
    '#FDC9C9', // red
    '#FFC2D1', // pink
    '#BDE0FE', // blue
];

const IdCard = (props: IdCardProps) => {
    const { member } = props;
    const colorScheme = useColorScheme();
    const randomColorIdx = Math.floor(Math.random() * (avatarColors.length - 1) );
    return (<ThemedView style={[style.IdCard, {borderColor: colorScheme === 'dark' ? 'white' : 'black' }]}>
        <View style={style.Avatar}>
            <View style={[style.AvatarCircle,  {backgroundColor: avatarColors[ randomColorIdx ], borderRadius: avatarSize / 2,}]}>
                <ThemedText style={style.AvatarText}>{member.name?.substring(0, 2).toUpperCase()}</ThemedText>
            </View>
        </View>
        <View style={style.Demographics}>
            <ThemedText style={style.Label}>Id:</ThemedText>
            <ThemedText style={style.Data}>{member.id}</ThemedText>
            <ThemedText style={style.Label}>Name:</ThemedText>
            <ThemedText style={style.Data}>{member.name}</ThemedText>
        </View>
    </ThemedView>);
};


const style = StyleSheet.create(
    {
        IdCard: {
            width: '80%',
            borderWidth: 1,
            borderRadius: 10,
            margin: 30,
            padding: 36,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'

        },
        Avatar: {
            width: '30%',
        },
        AvatarText: {
            fontSize: 30,
            textAlign: 'center'
        },
        AvatarCircle: {
            width: avatarSize,
            height: avatarSize,
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
        },
        Demographics: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around'
        },
        Label: {
            width: '40%',
            fontWeight: "bold"
        },
        Data: {
            width: '60%',
        }
    }
);

export default IdCard;