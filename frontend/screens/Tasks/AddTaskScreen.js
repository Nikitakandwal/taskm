import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import TaskContext from '../../context/TaskContext';

const AddTaskScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addTask } = useContext(TaskContext);

  const handleSubmit = async () => { 
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      console.error('Title cannot be empty');
      return;
    }

    try {
      await addTask({
        title: trimmedTitle,
        description: description.trim()
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        label="Title *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        placeholder="Enter task title"
        maxLength={100}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={4}
        placeholder="Enter task description"
        maxLength={2000}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={[styles.button, { backgroundColor: colors.primary }]}
        disabled={!title.trim()}
      >
        Add Task
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddTaskScreen;