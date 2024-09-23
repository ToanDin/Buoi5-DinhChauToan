import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from './firebaseconfig'; // Import Firestore
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const UserManagementApp = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!name || !email || !age) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const newUser = { name, email, age: Number(age) };
      await addDoc(collection(db, 'users'), newUser);
      setUsers([...users, { ...newUser, id: newUser.id }]);
      setName('');
      setEmail('');
      setAge('');
      setError(null);
    } catch (error) {
      setError('Có lỗi xảy ra khi thêm người dùng');
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age.toString());
    setModalVisible(true);
  };

  const updateUser = async () => {
    if (!name || !email || !age) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const userRef = doc(db, 'users', selectedUserId);
      await updateDoc(userRef, { name, email, age: Number(age) });
      setUsers(users.map(user => (
        user.id === selectedUserId ? { ...user, name, email, age: Number(age) } : user
      )));
      setModalVisible(false);
      setName('');
      setEmail('');
      setAge('');
      setError(null);
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật người dùng');
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Người Dùng</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Tên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
      placeholder="Tuổi"
      value={age}
      onChangeText={setAge}
      keyboardType="numeric"
      style={styles.input}
    />
    <Button title="Thêm Người Dùng" onPress={addUser} color="#007BFF" />

    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.userItem}>
          <Text style={styles.userText}>{item.name} - {item.email} - {item.age}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => openUpdateModal(item)}>
              <Text style={styles.buttonText}>Cập Nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => deleteUser(item.id)}>
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Cập Nhật Người Dùng</Text>
        <TextInput
          placeholder="Tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Tuổi"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.modalButtonGroup}>
          <Button title="Cập Nhật" onPress={updateUser} color="#28A745" />
          <Button title="Hủy" onPress={() => setModalVisible(false)} color="#DC3545" />
        </View>
      </View>
    </Modal>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 20,
  backgroundColor: '#F8F9FA',
},
title: {
  marginTop: 20,
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
error: {
  color: 'red',
  textAlign: 'center',
  marginBottom: 10,
},
input: {
  borderWidth: 1,
  borderColor: '#CED4DA',
  borderRadius: 5,
  marginBottom: 10,
  padding: 10,
  backgroundColor: '#FFF',
},
userItem: {
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#CED4DA',
},
userText: {
  fontSize: 16,
  marginBottom: 5,
},
buttonGroup: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
button: {
  backgroundColor: '#007BFF',
  padding: 10,
  borderRadius: 5,
  marginHorizontal: 5,
},
buttonText: {
  color: '#FFF',
  textAlign: 'center',
},modalContainer: {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
  backgroundColor: 'white',
},
modalTitle: {
  fontSize: 22,
  marginBottom: 20,
  textAlign: 'center',
},
modalButtonGroup: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},
});

export default UserManagementApp;