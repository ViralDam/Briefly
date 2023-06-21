import { View, FlatList, Dimensions, ActivityIndicator, Text } from "react-native";
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
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');

  const [items, setItems] = useState([]);

  const [defaultTopic, setDefaultTopic] = useState('');

  const getData = async (query, start = 0) => {
    console.log(query);
    const papers = await getResearchPapers(query, start);
    console.log(papers);
    if (!papers) return;
    let data = [];
    await Promise.all(papers.map(async paper => {
      const imageDescriptionPromise = chatCompletion(`Given sumary of a research paper write a short 1 line description of an image that best describes what the paper is about. Make sure it uses only basic vocabulary that even 10 year old can understand.\n\n Summary:${paper.summary}\n\nImage Description:`);
      const summaryPromise = chatCompletion(`This is the summary of a research paper:\n ${paper.summary}\n\n Generate a good short description in one paragraph of 75 to 100 words in 3rd person.\n Description:`);
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
        name: paper.title.replace(/(\r\n|\n|\r)/gm, ""),
        description: summaryResponse.data.choices[0].message.content.trim().replace(/(\r\n|\n|\r)/gm, ""),
        time: paper.published,
        url: paper.links.find(link => link.title == 'pdf').href,
        img: imgUrl,
        read_more: readMoreTextResponse.data.choices[0].message.content.trim().replace(/(\r\n|\n|\r)/gm, "")
      })
    }));
    return data;
  }

  const handleSubmit = () => {
    setIsLoading(true);
    getData(searchPhrase).then(data => {
      setItems(data);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    chatCompletionWithTemp(`Give a random topic in Physics, Mathematics, Computer Science, Quantitative Biology, Quantitative Finance, Statistics. Just give topic, no description needed.\n\nTopic: `, 2)
      .then((response) => {
        setDefaultTopic(response.data.choices[0].message.content.trim());
        getData(response.data.choices[0].message.content.trim()).then(data => {
          setItems(data);
          setIsLoading(false);
        });
      });
  }, []);

  const loadMoreData = () => {
    if (!isBackgroundLoading) {
      setIsBackgroundLoading(true);
      const query = !!searchPhrase ? searchPhrase : defaultTopic;
      console.log(`start loading more ${query}`);
      getData(query, items.length).then(newData => {
        setItems([...items, ...newData]);
        setIsBackgroundLoading(false);
      });
    }
  }


  return (
    <View>
      {
        isLoading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '70%' }}>
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
              onEndReachedThreshold={3}
              onEndReached={loadMoreData}
            />
            {isBackgroundLoading && (<ActivityIndicator style={{ position: 'absolute', zIndex: 2, bottom: 35, }} ></ActivityIndicator>)}
          </View>
        )
      }
    </View>
  );
}
