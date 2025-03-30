import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import TaskContext from '../../context/TaskContext';

const EditTaskScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { tasks, updateTask } = useContext(TaskContext);
  const { taskId } = route.params;
  
  const task = tasks.find(t => t._id === taskId);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  const handleSubmit = async () => {
    try {
      await updateTask(taskId, title, description);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        Update Task
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
  },
  button: {
    marginTop: 8,
  },
});

export default EditTaskScreen;