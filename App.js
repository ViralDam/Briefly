import { StyleSheet, View, FlatList, Dimensions, ActivityIndicator, Text } from "react-native";
import { useState, useEffect } from "react";
import NewsCard from "./components/NewsCard";
import SearchBar from "./components/SearchBar";
import Logo from "./assets/briefly.jpg";
import { Image } from "expo-image";
import { getResearchPapers } from "./api/arxiv";
import { chatCompletion, chatCompletionWithTemp, imageGeneration } from "./api/openai";
import "react-native-url-polyfill/auto"

export default function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');

  const [items, setItems] = useState([]);

  const getData1 = async (query) => {
    console.log(query);
    const papers = await getResearchPapers(query);
    if (!papers) return;
    let data = [];
    await Promise.all(papers.map(async paper => {
      const imageDescriptionPromise = chatCompletion(`Given sumary of a research paper write a short 1 line description of an image that best describes what the paper is about. Make sure it uses only basic vocabulary that even 10 year old can understand.\n\n Summary:${paper.summary}\n\nImage Description:`);
      const summaryPromise = chatCompletion(`This is the summary of a research paper:\n ${paper.summary}\n\n Generate a good short description in one paragraph of 80 to 120 words in 3rd person.\n Description:`);
      const readMoreTextPromise = chatCompletion(`This the summary of research paper:\n ${paper.summary}.\n\n Write a text to inform user to tap to read whole paper. It should be custom to the paper. Make sure it doesnt exceed 5-10 words.\n`);
      const imageDescriptionResponse = await imageDescriptionPromise;
      const imagePromise = imageGeneration(imageDescriptionResponse.data.choices[0].message.content.trim());
      const summaryResponse = await summaryPromise;
      const readMoreTextResponse = await readMoreTextPromise;
      let imgUrl = '';
      try {
        const imageResponse = await imagePromise;
        imgUrl = imageResponse.data.data[0].url;
      }
      catch (e) {
        console.error(e)
        imgUrl = `https://dummyimage.com/600x400/000/fff.jpg&text=Sensitive+Image`;
      }
      data.push({
        name: paper.title,
        description: summaryResponse.data.choices[0].message.content.trim(),
        time: paper.published,
        url: paper.links.find(link => link.title == 'pdf').href,
        img: imgUrl,
        read_more: readMoreTextResponse.data.choices[0].message.content.trim()
      })
    }));
    setItems(data);
    setIsLoading(false);
  }

  const handleSubmit = () => {
    setIsLoading(true);
    getData1(searchPhrase);
  }

  useEffect(() => {
    setIsLoading(true);
    chatCompletionWithTemp(`Give a random topic in Physics, Mathematics, Computer Science, Quantitative Biology, Quantitative Finance, Statistics. Just give topic, no description needed.\n\nTopic: `, 2)
      .then((response) => getData1(response.data.choices[0].message.content.trim()));
  }, []);

  return (
    <View>
      {
        isLoading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '70%' }}>
            {/* <View style={{ height: '50%' }} /> */}
            <ActivityIndicator size="large"></ActivityIndicator>
            <Image style={{ width: 200, height: 100 }} source={Logo} />
            <Text style={{ textAlign: 'center', marginTop: 6, fontWeight: '500', color: 'gray' }}>Getting your Briefly!</Text>
          </View>
        ) : (
          <View>
            <SearchBar style={{ position: 'absolute' }} searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} handleSubmit={handleSubmit} />
            <FlatList
              data={items}
              renderItem={({ item }, index) => <NewsCard details={item} key={index} />}
              keyExtractor={(item, index) => { return index }}
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
