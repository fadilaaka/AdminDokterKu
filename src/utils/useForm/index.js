import {useState} from 'react';

export default function useForm(initialValue) {
  const [values, setValues] = useState(initialValue);
  return [
    values,
    (formType, formValue) => {
      if (formType === 'reset') {
        return setValues(initialValue);
      }
      return setValues({...values, [formType]: formValue});
    },
  ];
}
