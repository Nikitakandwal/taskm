import React from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Card, Title, Paragraph } from 'react-native-paper';

const TaskItem = ({ task, onPress, onDelete }) => {
  const swipeableRef = React.useRef(null);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => swipeableRef.current?.close()
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete();
              swipeableRef.current?.close();
            } catch (error) {
              console.error('Delete error:', error);
            }
          }
        }
      ]
    );
  };

  const renderRightActions = (progress, dragX) => {
    return (
      <RectButton style={styles.rightAction} onPress={handleDelete}>
        <Text style={styles.actionText}>Delete</Text>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      <Card style={styles.card} onPress={onPress}>
        <Card.Content>
          <Title 
            numberOfLines={1} 
            ellipsizeMode="tail"
            style={styles.title}
          >
            {task.title}
          </Title>
          {task.description && (
            <Paragraph 
              numberOfLines={1} 
              ellipsizeMode="tail"
              style={styles.description}
            >
              {task.description}
            </Paragraph>
          )}
        </Card.Content>
      </Card>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    marginBottom: 16,
    borderRadius: 4,
    height: '80%',
    alignSelf: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default TaskItem;