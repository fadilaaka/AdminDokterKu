import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ILLogo} from '../../assets';
import {Button, Gap, Input, Link} from '../../components';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth, database} from '../../config';
import {ref, get, child} from 'firebase/database';
import {useDispatch} from 'react-redux';
import {colors, fonts, showError, storeData} from '../../utils';
import useForm from '../../utils/useForm';

const Login = ({navigation}) => {
  const [form, setForm] = useForm({email: '', password: ''});
  const dispatch = useDispatch();

  const login = () => {
    console.log('form : ', form);
    dispatch({type: 'SET_LOADING', value: true});
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then(res => {
        dispatch({type: 'SET_LOADING', value: false});
        const dbRef = ref(database);
        get(child(dbRef, `doctors/${res.user.uid}/`), 'value').then(
          resultDB => {
            console.log('data user: ', resultDB.val().data);
            if (resultDB.val().data) {
              storeData('user', resultDB.val().data);
              navigation.replace('MainApp');
            }
          },
        );
        console.log('success : ', res);
      })
      .catch(error => {
        dispatch({type: 'SET_LOADING', value: false});
        showError(error.code);
        console.log('error : ', JSON.stringify(error));
      });
  };

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={40} />
        <ILLogo />
        <Text style={styles.title}>Masuk dan mulai berkonsultasi</Text>
        <Input
          label="Email Address"
          value={form.email}
          onChangeText={value => setForm('email', value)}
        />
        <Gap height={24} />
        <Input
          label="Password"
          value={form.password}
          onChangeText={value => setForm('password', value)}
          secureTextEntry
        />
        <Gap height={10} />
        <Link title="Forgot My Password" size={12} />
        <Gap height={40} />
        <Button title="Sign In" onPress={login} />
        <Gap height={30} />
        <Link
          title="Create New Account"
          size={16}
          align="center"
          onPress={() => navigation.navigate('Register')}
        />
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  page: {paddingHorizontal: 40, backgroundColor: colors.white, flex: 1},
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 40,
    marginBottom: 40,
    maxWidth: 153,
  },
});
