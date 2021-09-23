import {StyleSheet} from 'react-native';
import { BasicStyles, Color } from 'common';

const styles = StyleSheet.create({
  CardContainer: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'flex-start',
    backgroundColor: Color.primary,
    marginTop: 25
  },
  AvailableBalanceTextStyle: {
    textAlign: 'center',
    fontSize: BasicStyles.standardFontSize,
    color: '#FFFFFF',
    paddingTop: 40,
  },
  BalanceTextStyle: {
    textAlign: 'center',
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    paddingTop: 10,
    paddingBottom: 20
  },
  CurrentBalanceTextStyle: {
    textAlign: 'center',
    fontSize: BasicStyles.standardFontSize,
    color: '#FFFFFF',
    paddingLeft: 10
  }
});

export default styles;
