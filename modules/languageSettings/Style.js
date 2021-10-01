import { StyleSheet } from 'react-native';
import { Color } from 'common';

const styles = StyleSheet.create({
  ThemeTitleContainer: {
    width: '70%'
  },
  Container: {
    marginTop: 20,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 75,
    backgroundColor: 'white',
    borderColor: Color.gray,
    borderWidth: 0.3,
    borderRadius: 10,
    flexDirection: 'row'
  },
  ThemeTitleTextStyle: {
    fontFamily: 'Poppins-SemiBold',
  },
  ImageStyle: {
    flex: 1,
    width: '70%',
    height: '150%',
    resizeMode: 'contain'
  }
});

export default styles;
