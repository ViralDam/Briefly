import React from "react";
import { StyleSheet, TextInput, Text, View, Keyboard, Button, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

const SearchBar = ({searchPhrase, setSearchPhrase, handleSubmit}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar__unclicked}>
        {/* search Icon */}
        <Feather
          name="search"
          size={15}
          color="black"
          style={{ marginLeft: 4, marginRight: 4 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          enablesReturnKeyAutomatically
          blurOnSubmit
          onSubmitEditing={handleSubmit}
        />
      </View>
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    position:'absolute',
    zIndex: 2,
    top: 35,
    margin: 15,
    // marginHorizontal: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "93%",

  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#efefef",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 8,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#efefef",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    marginLeft: 10,
    width: "90%",
  },
});