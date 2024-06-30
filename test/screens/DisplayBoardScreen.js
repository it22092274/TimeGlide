import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import UserContext from '../UserContext'; // Adjust the path as necessary

const BoardsScreen = ({ navigation }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://172.28.3.238:3000/api/board/read');
        setBoards(response.data.data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {boards.length === 0 ? (
        <View>
          <Text>No boards available. Let's create one!</Text>
          <Button title="Create Board" onPress={() => navigation.navigate('CreateBoardScreen')} />
        </View>
      ) : (
        <FlatList
          data={boards}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.boardItem}>
              <Text style={styles.boardName}>{item.name}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  boardItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  boardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BoardsScreen;
