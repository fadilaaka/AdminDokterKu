import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {ILNullPhoto} from '../../assets';
import {Button, Gap, Header, Input, Profile} from '../../components';
import {colors, getData, showError, storeData} from '../../utils';
import {ref, update} from 'firebase/database';
import {auth, database} from '../../config';
import {launchImageLibrary} from 'react-native-image-picker';
import {onAuthStateChanged, updatePassword} from 'firebase/auth';

const UpdateProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(ILNullPhoto);
  const [photoToDB, setPhotoToDB] = useState('');

  useEffect(() => {
    getData('user').then(respons => {
      const data = respons;
      data.photo = {uri: respons.photo};
      setPhoto(data.photo);
      setProfile(data);
    });
  }, []);

  const updateSaveProfile = () => {
    if (password.length > 0) {
      if (password.length < 6) {
        showError('Password kurang dari 6 karater');
      } else {
        updatePasswordProfile();
        updateProfileData();
        navigation.replace('MainApp');
      }
    } else {
      updateProfileData();
      navigation.replace('MainApp');
    }
  };

  const updatePasswordProfile = () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        updatePassword(user, password)
          .then(success => {
            console.log('Password Updated : ', success);
          })
          .catch(error => {
            showError(error.code);
          });
      }
    });
  };

  const updateProfileData = () => {
    const data = profile;
    data.photo = photoToDB;
    update(ref(database, `doctors/${profile.uid}/data`), data)
      .then(() => {
        console.log('updated : ', data);
        storeData('user', data);
      })
      .catch(error => {
        showError(error.code);
      });
  };

  const changeText = (key, value) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const getImage = () => {
    launchImageLibrary(
      {includeBase64: true, quality: 0.5, maxWidth: 200, maxHeight: 200},
      response => {
        if (response.didCancel || response.error) {
          showError('oops, sepertinya anda tidak memilih foto nya?');
        } else {
          console.log('respons getImage: ', response);
          const source = {uri: response.assets[0].uri};

          setPhotoToDB(
            `data:${response.assets[0].type};base64, ${response.assets[0].base64}`,
          );
          setPhoto(source);
        }
      },
    );
  };
  return (
    <View style={styles.page}>
      <Header title="Edit Profile" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Profile isRemove photo={photo} onPress={getImage} />
          <Gap height={26} />
          <Input
            label="Full Name"
            value={profile.fullName}
            onChangeText={value => changeText('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Pekerjaan"
            value={profile.profession}
            onChangeText={value => changeText('profession', value)}
          />
          <Gap height={24} />
          <Input label="Email" value={profile.email} disable />
          <Gap height={24} />
          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={value => setPassword(value)}
          />
          <Gap height={40} />
          <Button title="Save Profile" onPress={updateSaveProfile} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {padding: 40, paddingTop: 0},
});
