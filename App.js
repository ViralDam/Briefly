import { StyleSheet, View, FlatList, Dimensions, ActivityIndicator, Text } from "react-native";
import { useState, useEffect } from "react";
import NewsCard from "./components/NewsCard";
import { Feather, Entypo } from "@expo/vector-icons";
import SearchBar from "./components/SearchBar";
import Logo from "./assets/briefly.jpg";
import { Image } from "expo-image";

export default function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setCLicked] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');

  const [items, setItems] = useState([]);

  const getData1 = async () => {
    const response = await fetch(`http://172.20.10.3:8000/${searchPhrase}`, { method: 'GET' })
    const responseJson = await response.json();
    console.log(responseJson);
    let data = [];
    responseJson.forEach(element => {
      data.push({
        name: element.title,
        description: element.summary,
        time: element.date,
        url: element.pdf_url,
        img: element.image_url,
        read_more: element.read_more_text
      })
    });
    setItems(data);
    setIsLoading(false);
  }

  const handleSubmit = () => {
    setIsLoading(true);
    getData1()
  }

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('http://172.20.10.3:8000/', { method: 'GET' })
      const responseJson = await response.json();
      let data = [];
      responseJson.forEach(element => {
        data.push({
          name: element.title,
          description: element.summary,
          time: element.date,
          url: element.pdf_url,
          img: element.image_url,
          read_more: element.read_more_text
        })
      });
      setItems(data);
      setIsLoading(false);
    }

    setIsLoading(true);
    getData()

  }, []);

  return (
    <View>
      {
        isLoading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center',  marginTop: '70%'}}>
            {/* <View style={{ height: '50%' }} /> */}
            <ActivityIndicator size="large"></ActivityIndicator>
            <Image style={{width: 200, height: 100}} source={Logo} />
            <Text style={{ textAlign: 'center', marginTop: 6, fontWeight: '500', color: 'gray' }}>Getting your Briefly!</Text>
          </View>
        ) : (
          <View>
            <SearchBar style={{ position: 'absolute' }} setCLicked={setCLicked} searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} handleSubmit={handleSubmit} />
            <FlatList
              data={items}
              renderItem={({ item }, index) => <NewsCard details={item} key={index} />}
              keyExtractor={(item) => item.id}
              snapToAlignment="start"
              decelerationRate={"fast"}
              snapToInterval={Dimensions.get("window").height}
            />
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
});
