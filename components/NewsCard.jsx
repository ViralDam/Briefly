import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import TestImage from "../assets/test.jpeg"
import { Linking, Share } from 'react-native';
import { Icon } from 'react-native-elements'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const NewsCard = ({ details }) => {
    const { name, description, time, url, read_more, img} = details;
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const handleLike = () => {
        if(isLiked) {
            setIsLiked(false);
            return;
        }
        if(isDisliked) {
            setIsDisliked(false);
        }
        setIsLiked(true);
    }

    const handleDislike = () => {
        if(isDisliked) {
            setIsDisliked(false);
            return;
        }
        if(isLiked) {
            setIsLiked(false);
        }
        setIsDisliked(true);
    }


    const handleReadClick = () => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }
    
    const shareData = async () => {
        try {
            await Share.share({
                message: description,
                url: url,
                title: `Check out this paper: ${name}`
            },
            {
                dialogTitle: `Check out this paper: ${name}`,
                subject: `Check out this paper: ${name}`
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const date = new Date(time).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <View style={styles.container}>
            <View
                style={{
                    height: '40%',
                    width: '100%',
                    backgroundColor: 'blue',
                }}>
                <Image
                    style={[styles.image, {padding: 16}]}
                    source={img}
                    // source={TestImage}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                >
                    <View style={{ flex: 1 }} />
                    <View style={{ flexDirection: 'row'}}>
                        <View style={{ flex: 1 }} />
                        <Pressable style={styles.shareView} onPress={handleLike}>
                            <Icon
                                name={isLiked?'thumb-up':'thumb-up-off-alt'}
                                color='#00aced' />
                        </Pressable>
                        <Pressable style={styles.shareView} onPress={handleDislike}>
                            <Icon
                                name={isDisliked?'thumb-down':'thumb-down-off-alt'}
                                color='#00aced' />
                        </Pressable>
                        <Pressable style={styles.shareView} onPress={shareData}>
                            <Icon
                                name='ios-share'
                                color='#00aced' />
                        </Pressable>
                    </View>
                </Image>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            <Pressable
                style={{
                    height: '10%',
                    width: '100%',
                }} onPress={handleReadClick}>
                <Image
                    style={styles.image}
                    // source="https://picsum.photos/seed/696/3000/2000"
                    source={img}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                    blurRadius={40}
                >
                    <Text style={styles.buttonText}>{read_more}</Text>
                </Image>
            </Pressable>
        </View>
    );
};

export default NewsCard;

const styles = StyleSheet.create({
    textContainer: {
        padding: '6%',
        flex: 1,
    },
    container: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: "white",
        borderColor: "#000",
        borderWidth: 2,
    },
    title: {
        color: "#000",
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 20,
        // textAlign: 'justify'
    },
    image: {
        flex: 1,
        width: '100%',
    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
        lineHeight: 20,
        marginTop: '3%'
    },
    date: {
        fontWeight: '500',
        marginTop: '2%',
        color: 'gray',
        textAlign: 'right'
    },
    button: {
        width: '40%',
        padding: 10,
        textAlign: 'center',
        borderRadius: 15,
        backgroundColor: '#302E6A',
        padding: '10%'
    },
    buttonText: {
        color: 'black',
        textAlign: 'left',
        fontSize: 16,
        padding: '4%',
        fontWeight: '600',
        textShadowColor: 'white',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 20,
    },
    shareView: {
        backgroundColor: 'white',
        borderRadius: '100',
        borderWidth: 0.25,
        borderColor: '#00aced',
        padding: 12,
        alignSelf: 'flex-start',
        marginLeft: 8
    }
});