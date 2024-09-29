import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

const CIRCLE_SIZE = 40; // Adjusted size of each dot
const GRID_SIZE = 3; // 3x3 grid

const PatternLock = ({ visible, onClose }) => {
  const [savedPattern, setSavedPattern] = useState([]);
  const [currentPattern, setCurrentPattern] = useState([]);
  const dotPositions = useRef([]); // Holds the positions of dots

  const handleGesture = ({ nativeEvent }) => {
    // Check which dot the user is currently touching
    dotPositions.current.forEach((pos, index) => {
      if (
        nativeEvent.x >= pos.x - CIRCLE_SIZE / 2 &&
        nativeEvent.x <= pos.x + CIRCLE_SIZE / 2 &&
        nativeEvent.y >= pos.y - CIRCLE_SIZE / 2 &&
        nativeEvent.y <= pos.y + CIRCLE_SIZE / 2
      ) {
        if (!currentPattern.includes(index)) {
          setCurrentPattern((prevPattern) => [...prevPattern, index]);
        }
      }
    });
  };

  const handleGestureEnd = () => {
    if (currentPattern.length > 0) {
      setSavedPattern(currentPattern);
      Alert.alert('Pattern Saved');
      onClose();
    } else {
      Alert.alert('Please enter a pattern');
    }
    setCurrentPattern([]);
  };

  const handleClearPattern = () => {
    setSavedPattern([]);
    Alert.alert('Pattern Cleared');
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>Draw Your Pattern</Text>

          <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
            <View style={styles.grid}>
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                <View
                  key={index}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    dotPositions.current[index] = {
                      x: layout.x + CIRCLE_SIZE / 2,
                      y: layout.y + CIRCLE_SIZE / 2,
                    };
                  }}
                  style={[
                    styles.circle,
                    currentPattern.includes(index) && styles.activeCircle,
                  ]}
                />
              ))}
            </View>
          </PanGestureHandler>

          <TouchableOpacity style={styles.saveButton} onPress={handleGestureEnd}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={handleClearPattern}>
            <Text style={styles.buttonText}>Clear Pattern</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>

          {savedPattern.length > 0 && (
            <View style={styles.savedPatternContainer}>
              <Text style={styles.savedPatternText}>Saved Pattern: {savedPattern.join(', ')}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dimmed background
  },
  dialogBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  grid: {
    width: CIRCLE_SIZE * GRID_SIZE + 40,
    height: CIRCLE_SIZE * GRID_SIZE + 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    backgroundColor: '#ccc',
    borderRadius: CIRCLE_SIZE / 2,
    margin: 15, // Adjusted margin to match spacing in the image
  },
  activeCircle: {
    backgroundColor: '#007BFF',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#FF0055', // Pinkish red color for the save button
    padding: 15,
    borderRadius: 25, // Rounded save button
    width: '80%',
    alignItems: 'center',
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  savedPatternContainer: {
    marginTop: 10,
  },
  savedPatternText: {
    fontWeight: 'bold',
  },
});

export default PatternLock;
