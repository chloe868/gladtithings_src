import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  cardContainer: {
    width: '100%',
    backgroundColor: Color.white,
    borderRadius: 10,
    borderWidth: .25,
    borderColor: Color.gray,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    marginTop: 10
  }
};