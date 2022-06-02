import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Header, ChatItem, InputChat} from '../../components';
import {
  fonts,
  colors,
  getData,
  showError,
  getChatTime,
  setDateChat,
} from '../../utils';
import {database} from '../../config';
import {ref, push, onValue, set} from 'firebase/database';

export default function Chatting({navigation, route}) {
  const dataUser = route.params;
  const [chatContent, setChatContent] = useState('');
  const [user, setUser] = useState({});
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();
    const dbRef = ref(
      database,
      `chatting/${dataUser.data.uid}_${user.uid}/allchat/`,
    );
    onValue(dbRef, snapshot => {
      console.log('data chat : ', snapshot.val());
      if (snapshot.val()) {
        const dataSnapshot = snapshot.val();
        const allDataChat = [];
        Object.keys(dataSnapshot).map(item => {
          const dataChat = dataSnapshot[item];
          const newDataChat = [];
          Object.keys(dataChat).map(itemChat => {
            newDataChat.push({
              id: itemChat,
              data: dataChat[itemChat],
            });
          });

          allDataChat.push({
            id: item,
            data: newDataChat,
          });
        });
        console.log('All data chat: ', allDataChat);
        setChatData(allDataChat);
      }
    });
  }, [dataUser.data.uid, user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  const chatSend = () => {
    const today = new Date();

    const data = {
      sendBy: user.uid,
      chatDate: today.getTime(),
      chatTime: getChatTime(today),
      chatContent: chatContent,
    };
    const dbRef = ref(
      database,
      `chatting/${dataUser.data.uid}_${user.uid}/allchat/${setDateChat(today)}`,
    );
    const chatID = `${dataUser.data.uid}_${user.uid}`;
    const dbRefMessageUser = ref(database, `messages/${user.uid}/${chatID}`);
    const dbRefMessageDoctor = ref(
      database,
      `messages/${dataUser.data.uid}/${chatID}`,
    );
    const dataHistoryChatUser = {
      lastContentChat: chatContent,
      lastChatDate: today.getTime(),
      uidPartner: dataUser.data.uid,
    };
    const dataHistoryChatDoctor = {
      lastContentChat: chatContent,
      lastChatDate: today.getTime(),
      uidPartner: user.uid,
    };

    push(dbRef, data)
      .then(result => {
        setChatContent('');
        //History Chat for User
        set(dbRefMessageUser, dataHistoryChatUser);
        //History Chat for Doctor
        set(dbRefMessageDoctor, dataHistoryChatDoctor);
      })
      .catch(error => {
        showError(error.message);
        console.log(error.message);
      });
  };
  const scrollViewRef = useRef();

  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={dataUser.data.fullName}
        desc={dataUser.data.profession}
        photo={{uri: dataUser.data.photo}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({animated: true})
          }>
          {chatData.map(chat => {
            return (
              <View key={chat.id}>
                <Text style={styles.chatDate}>{chat.id}</Text>
                {chat.data.map(itemChat => {
                  const isMe = itemChat.data.sendBy === user.uid;
                  return (
                    <ChatItem
                      key={itemChat.id}
                      isMe={isMe}
                      text={itemChat.data.chatContent}
                      date={itemChat.data.chatTime}
                      photo={isMe ? null : {uri: dataUser.data.photo}}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <InputChat
        value={chatContent}
        onChangeText={value => setChatContent(value)}
        onButtonPress={chatSend}
        targetChat={dataUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {flex: 1},
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
