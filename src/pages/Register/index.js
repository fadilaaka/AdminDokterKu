import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Button, Gap, Header, Input, Loading} from '../../components';
import {colors, showError, storeData} from '../../utils';
import useForm from '../../utils/useForm';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, database} from '../../config';
import {ref, set} from 'firebase/database';

export default function Register({navigation}) {
  const [form, setForm] = useForm({
    fullName: '',
    category: 'dokter umum',
    university: '',
    str_number: '',
    hospital_address: '',
    gender: 'pria',
    email: '',
    password: '',
  });

  const [itemCategory] = useState([
    {
      id: 1,
      label: 'Dokter Umum',
      value: 'dokter umum',
    },
    {
      id: 2,
      label: 'Dokter Hewan',
      value: 'dokter hewan',
    },
    {
      id: 3,
      label: 'Dokter Anak',
      value: 'dokter anak',
    },
    {
      id: 4,
      label: 'Psikiater',
      value: 'psikiater',
    },
  ]);

  const [itemGender] = useState([
    {
      id: 1,
      label: 'Pria',
      value: 'pria',
    },
    {
      id: 2,
      label: 'Wanita',
      value: 'wanita',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const onContinue = () => {
    console.log(form);

    setLoading(true);
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then(success => {
        setLoading(false);
        setForm('reset');
        const data = {
          fullName: form.fullName,
          category: form.category,
          rate: 0,
          university: form.university,
          str_number: form.str_number,
          hospital_address: form.hospital_address,
          gender: form.gender,
          email: form.email,
          uid: success.user.uid,
        };
        set(ref(database, 'doctors/' + success.user.uid + '/'), {data}).then(
          console.log('Data stored to realtime database'),
        );
        storeData('user', data);
        navigation.navigate('UploadPhoto', data);
        console.log('Register Success : ', success);
      })
      .catch(error => {
        setLoading(false);
        showError(error.code);
        console.log('error : ', error);
      });
  };
  return (
    <>
      <View style={styles.page}>
        <Header onPress={() => navigation.goBack()} title="Daftar Akun" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Input
              label="Nama Lengkap"
              value={form.fullName}
              onChangeText={value => setForm('fullName', value)}
            />
            <Gap height={24} />
            <Input
              label="Kategori"
              value={form.category}
              select
              selectItem={itemCategory}
              onValueChange={value => setForm('category', value)}
            />
            <Gap height={24} />
            <Input
              label="Universitas"
              value={form.university}
              onChangeText={value => setForm('university', value)}
            />
            <Gap height={24} />
            <Input
              label="Nomor STR"
              value={form.str_number}
              onChangeText={value => setForm('str_number', value)}
            />
            <Gap height={24} />
            <Input
              label="Alamat Rumah Sakit"
              value={form.hospital_address}
              onChangeText={value => setForm('hospital_address', value)}
            />
            <Gap height={24} />
            <Input
              label="Jenis Kelamin"
              value={form.gender}
              select
              selectItem={itemGender}
              onValueChange={value => setForm('gender', value)}
            />
            <Gap height={24} />
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

            <Gap height={40} />
            <Button title="Continue" onPress={onContinue} />
          </View>
        </ScrollView>
      </View>
      {loading && <Loading />}
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    padding: 40,
    paddingTop: 0,
  },
});

// import React, {useState} from 'react';
// import {ScrollView, StyleSheet, View} from 'react-native';
// import {useDispatch} from 'react-redux';
// import {Button, Gap, Header, Input} from '../../components';
// import {createUserWithEmailAndPassword} from 'firebase/auth';
// import {auth, database} from '../../config';
// import {ref, set} from 'firebase/database';
// import useForm from '../../utils/useForm';
// import {colors, showError, storeData} from '../../utils';

// export default function Register({navigation}) {
//   const dispatch = useDispatch();
//   const [form, setForm] = useForm({
//     fullName: '',
//     category: 'dokter umum',
//     university: '',
//     str_number: '',
//     hospital_address: '',
//     gender: 'pria',
//     email: '',
//     password: '',
//   });
// const [itemCategory] = useState([
//   {
//     id: 1,
//     label: 'Dokter Umum',
//     value: 'dokter umum',
//   },
//   {
//     id: 2,
//     label: 'Psikiater',
//     value: 'psikiater',
//   },
//   {
//     id: 3,
//     label: 'Dokter Obat',
//     value: 'dokter obat',
//   },
//   {
//     id: 4,
//     label: 'Dokter Anak',
//     value: 'dokter anak',
//   },
//   {
//     id: 5,
//     label: 'Dokter Bedah',
//     value: 'dokter bedah',
//   },
// ]);

// const [itemGender] = useState([
//   {
//     id: 1,
//     label: 'Pria',
//     value: 'pria',
//   },
//   {
//     id: 2,
//     label: 'Wanita',
//     value: 'wanita',
//   },
// ]);

//   const onContinue = () => {
//     dispatch({type: 'SET_LOADING', value: true});
//     createUserWithEmailAndPassword(auth, form.email, form.password)
//       .then(success => {
//         dispatch({type: 'SET_LOADING', value: false});
//         setForm('reset');
//         const data = {
// fullName: form.fullName,
// profession: form.category,
// category: form.category,
// rate: 0,
// university: form.university,
// str_number: form.str_number,
// hospital_address: form.hospital_address,
// gender: form.gender,
// email: form.email,
// uid: success.user.uid,
//         };
//         set(ref(database, 'doctors/' + success.user.uid + '/'), {data}).then(
//           console.log('Data stored to realtime database'),
//         );
//         storeData('user', data);
//         navigation.navigate('UploadFoto', data);
//         console.log('Register Success : ', success);
//       })
//       .catch(error => {
//         dispatch({type: 'SET_LOADING', value: false});
//         showError(error.code);
//         console.log('error : ', error);
//       });
//   };
//   return (
//     <View style={styles.page}>
//       <Header onPress={() => navigation.goBack()} title="Daftar Akun" />
//       <View style={styles.content}>
// <ScrollView showsVerticalScrollIndicator={false}>
//   <Input
//     label="Full Name"
//     value={form.fullName}
//     onChangeText={value => setForm('fullName', value)}
//   />
//   <Gap height={24} />
//   <Input
//     label="Kategori"
//     value={form.category}
//     onValueChange={value => setForm('category', value)}
//     select
//     selectItem={itemCategory}
//   />
//   <Gap height={24} />
//   <Input
//     label="Universitas"
//     value={form.university}
//     onChangeText={value => setForm('university', value)}
//   />
//   <Gap height={24} />
//   <Input
//     label="Nomor STR"
//     value={form.str_number}
//     onChangeText={value => setForm('str_number', value)}
//   />
//   <Gap height={24} />
//   <Input
//     label="Alamat Rumah Sakit"
//     value={form.hospital_address}
//     onChangeText={value => setForm('hospital_address', value)}
//   />
//   <Gap height={24} />
//   <Input
//     label="Jenis Kelamin"
//     value={form.gender}
//     onValueChange={value => setForm('gender', value)}
//     select
//     selectItem={itemGender}
//   />
//   <Gap height={24} />
//   <Input
//     label="Email"
//     value={form.email}
//     onChangeText={value => setForm('email', value)}
//   />
//   <Gap height={24} />
//   <Input
//     label="Password"
//     value={form.password}
//     onChangeText={value => setForm('password', value)}
//     secureTextEntry
//   />
//   <Gap height={40} />
//   <Button title="Continue" onPress={onContinue} />
//   <Gap height={40} />
// </ScrollView>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: {backgroundColor: colors.white, flex: 1},
//   content: {paddingHorizontal: 40, flex: 1},
// });
