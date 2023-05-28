import { Input } from '@rneui/base'
import { StyleSheet } from 'react-native'
import { isFormatError } from '../utils/validateInputs'
import { isAuthError } from '@supabase/supabase-js'

export function InputStyled ({ name, errorMessage = null, ...props }) {
  return (
    <Input
      inputStyle={styles.inputplaceholder}
      inputContainerStyle={styles.inputcontainer}
      errorMessage={
                ((isFormatError(errorMessage) || isAuthError(errorMessage)) && errorMessage.param === name)
                  ? errorMessage.message
                  : (typeof errorMessage === 'string') ? errorMessage : null
            }cxf
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  inputplaceholder: {
    paddingLeft: 20,
    paddingTop: 13,
    paddingBottom: 12
  },
  inputcontainer: {
    width: 335,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center'
  }
})
