import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import TaskContext from '../../context/TaskContext';
import { format } from 'date-fns';

const TaskDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { tasks, deleteTask, toggleTaskCompletion, fetchTasks } = useContext(TaskContext);
  const { taskId } = route.params;
  
  const task = tasks.find(t => t._id === taskId);

  const handleDelete = async () => {
    try {
      await deleteTask(taskId); 
      navigation.goBack();
       
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Delete error:', error); 
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditTask', { taskId });
  };

  const handleToggleComplete = async () => {
    try {
      await toggleTaskCompletion(taskId);
      // Refresh tasks after toggle
      await fetchTasks();
    } catch (error) {
      console.error('Toggle completion error:', error);
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
         
        </View>

        <View style={styles.content}>
          <TouchableOpacity 
            onPress={handleToggleComplete}
            style={styles.completionContainer}
          >
            <View style={[
              styles.completionCircle,
              { 
                borderColor: colors.primary,
                backgroundColor: task.completed ? colors.primary : 'transparent'
              }
            ]}>
              {task.completed && (
                <IconButton 
                  icon="check" 
                  size={16} 
                  color="#fff" 
                  style={styles.checkIcon}
                />
              )}
            </View>
            <Text style={[
              styles.completionText,
              { color: task.completed ? colors.primary : colors.text }
            ]}>
              {task.completed ? 'Completed' : 'Mark as complete'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>

          {task.description && (
            <View style={styles.descriptionContainer}>
              <Text style={[styles.description, { color: colors.text }]}>
                {task.description}
              </Text>
            </View>
          )}

          <View style={styles.metaContainer}>
            {task.dueDate && (
              <View style={styles.metaItem}>
                <IconButton 
                  icon="calendar" 
                  size={20} 
                  color={colors.text} 
                  style={styles.metaIcon}
                />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </Text>
              </View>
            )}

            {task.createdAt && (
              <View style={styles.metaItem}>
                <IconButton 
                  icon="clock" 
                  size={20} 
                  color={colors.text} 
                  style={styles.metaIcon}
                />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <IconButton
          icon="pencil"
          size={28}
          onPress={handleEdit}
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          color="#fff"
        />
        <IconButton
          icon="delete"
          size={28}
          onPress={handleDelete}
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          color="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    lineHeight: 36,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  completionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIcon: {
    margin: 0,
  },
  completionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  metaContainer: {
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaIcon: {
    margin: 0,
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
    borderRadius: 50,
    elevation: 4,
  },
});

export default TaskDetailScreen;