import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
export default {
  ScrollView: {
    flex: 1
  },
  MainContainer: {
    flex: 1,
    backgroundColor: Color.containerBackground,
    zIndex: 0
  },
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  title: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20
  },
  right: {
    flexDirection: 'row-reverse',
    width: '50%',
    position: 'absolute',
    right: 20,
    top: 20,
  }
}