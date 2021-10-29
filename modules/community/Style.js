
import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
export default {
  floatingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 50,
    backgroundColor: Color.primary,
    borderRadius: 100,
    color: Color.white
  }
}