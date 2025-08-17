import React from 'react';
import { Modal, View, Text, Button } from 'react-native';

const CreateAlertModal = ({ visible, onClose, onAlertCreated }) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Create Alert Modal Placeholder</Text>
        <Text>The form to search coins and set prices will go here.</Text>
        <Button title="Simulate Create" onPress={onAlertCreated} />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default CreateAlertModal;
