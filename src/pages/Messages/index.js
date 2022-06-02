import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {List} from '../../components';
import {database} from '../../config';
import {ref, onValue, get} from 'firebase/database';
import {colors, fonts, getData} from '../../utils';

const Messages = ({navigation}) => {
  const [user, setUser] = useState({});
  const [historyChat, setHistoryChat] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();

    const dbRef = ref(database, `messages/${user.uid}/`);
    onValue(dbRef, async snapshot => {
      console.log('data history chat : ', snapshot.val());
      if (snapshot.val()) {
        const oldData = snapshot.val();
        const data = [];

        const promises = await Object.keys(oldData).map(async item => {
          const urlUidUser = `users/${oldData[item].uidPartner}`;
          const detailUser = await get(ref(database, urlUidUser));
          console.log('detail user : ', detailUser.val());
          data.push({
            id: item,
            detailUser: detailUser.val(),
            ...oldData[item],
          });
        });
        await Promise.all(promises);
        console.log('new data history: ', data);
        setHistoryChat(data);
      }
    });
  }, [user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        {historyChat.map(chat => {
          const dataUser = {
            id: chat.detailUser.uid,
            ...chat.detailUser,
          };
          return (
            <List
              key={chat.id}
              profile={{uri: chat.detailUser.data.photo}}
              name={chat.detailUser.data.fullName}
              desc={chat.lastContentChat}
              onPress={() => navigation.navigate('Chatting', dataUser)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.secondary, flex: 1},
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginLeft: 16,
  },
});
