import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
    borderRadius: 5
  },
  textInImageView: {
    position: 'absolute',
    bottom: 0,
    padding: 7
  },
  address: {
    width: '85%',
    fontSize: 12
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInImage: {
    color: Color.white,
    fontSize: 13
  },
  imageView: {
    height: '70%'
  },
  container: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },
  view: {
    height: 210,
    width: '50%',
    padding: 10
  }
};