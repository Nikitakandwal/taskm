import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Appbar, useTheme } from 'react-native-paper';
import TaskItem from '../../components/TaskItem';
import TaskContext from '../../context/TaskContext';
import AuthContext from '../../context/AuthContext';
import { RefreshControl } from 'react-native-gesture-handler';
import LoadingDots from '../../components/Loading';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { tasks, loading, fetchTasks, deleteTask } = useContext(TaskContext);  
  const { logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setIsLoading(true);
      await deleteTask(taskId); 
      await fetchTasks();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Tasks" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      
      <LoadingDots
        visible={isLoading}
        color="#4CAF50"
      />
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
            onDelete={() => handleDeleteTask(item._id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchTasks}
            progressViewOffset={50}
            progressBackgroundColor="#fff"
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.list}
      />

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;