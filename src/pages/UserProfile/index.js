import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Gap, Header, List, Profile} from '../../components';
import {signOut} from 'firebase/auth';
import {auth} from '../../config';
import {getData, showError} from '../../utils';
import {ILNullPhoto} from '../../assets';

const UserProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    photo: ILNullPhoto,
  });
  useEffect(() => {
    getData('user').then(respons => {
      const data = respons;
      data.photo = {uri: respons.photo};
      setProfile(data);
    });
  });

  const pressSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Success Sign Out');
        navigation.replace('GetStarted');
      })
      .catch(error => {
        showError(error.code);
      });
  };
  return (
    <View style={styles.page}>
      <Header title="Profile" onPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={10} />
        {profile.fullName.length > 0 && (
          <Profile
            name={profile.fullName}
            desc={profile.profession}
            photo={profile.photo}
          />
        )}
        <Gap height={14} />
        <List
          name="Edit Profile"
          desc="Last Update Yesterday"
          type="next"
          icon="edit-profile"
          onPress={() => navigation.navigate('UpdateProfile')}
        />
        <List
          name="Languange"
          desc="Last Update Yesterday"
          type="next"
          icon="language"
        />
        <List
          name="Give Us Rate"
          desc="Last Update Yesterday"
          type="next"
          icon="rate"
        />
        <List
          name="Sign Out"
          desc="Last Update Yesterday"
          type="next"
          icon="help"
          onPress={pressSignOut}
        />
      </ScrollView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: 'white'},
});
