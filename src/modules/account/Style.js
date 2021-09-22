import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 50
  },
  LogoContainer: {
    height: 100,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  LogoSize: {
    flex: 1,
    width: '65%',
    height: '100%',
    resizeMode: 'contain',
  },
  TextContainer: {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  messageContainer: {
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    color: Color.danger,
    marginBottom: 10
  },
  messageText: {
    color: Color.danger
  },
  textInput: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: width - 40,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5
  },
  btnPrimary: {
    height: 50,
    backgroundColor: Color.primary,
    width: width - 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  btnText: {
    color: Color.white
  }
}