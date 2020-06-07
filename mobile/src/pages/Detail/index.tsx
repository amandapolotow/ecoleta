import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';
import styles from '../Detail/styles';

interface Params {
    point_id: number;
}

interface Data {
    point: {
        name: string;
        image: string;
        image_url: string;
        city: string;
        uf: string;
        email: string;
        whatsapp: string;
    };
    items: {
        title: string;
    }[];
}

const Detail = () => {
    const [data, setData] = useState<Data>({} as Data);
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(response => {
            setData(response.data);
        })
    }, []);

    function handleWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Gostaria de informações sobre a coleta de resíduos.`)
    }

    function handleComposeMail() {
        MailComposer.composeAsync({
            subject: 'Coleta de Resíduos',
            recipients: [data.point.email],
        })
    }

    function handleNavigateBack() {
        navigation.goBack();
    }

    if(!data.point){
        return null;
    }

    return(
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>
            <Image style={styles.pointImage} source={{ uri: data.point.image_url }} />
            <Text style={styles.pointName}>{data.point.name}</Text>
            <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>
            <View style={styles.address}>
                <Text style={styles.addressTitle}>Endereço</Text>
                <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
            </View>
        </View>
        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={handleWhatsapp}>
                <FontAwesome name="whatsapp" size={20} color="#FFF" />
                <Text style={styles.buttonText}>
                    Whatsapp
                </Text>
            </RectButton>
            <RectButton style={styles.button} onPress={handleComposeMail}>
                <Icon name="mail" size={20} color="#FFF" />
                <Text style={styles.buttonText}>
                    E-mail
                </Text>
            </RectButton>
        </View>
        </SafeAreaView>
    )
}

export default Detail;