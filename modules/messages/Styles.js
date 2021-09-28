import { StyleSheet } from 'react-native';
import { Color } from 'common';

const styles = StyleSheet.create({
  Circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  SettingTileContainer: {
    height: 90,
    width: '100%',
    backgroundColor: Color.white,
    borderRadius: 10,
    borderWidth: .25,
    borderColor: Color.gray,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 7.5,
    marginTop: 7.5
  },
  ThemeDetailsContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  ThemeTitleContainer: {},
  ThemeTitleTextStyle: {
    fontFamily: 'Poppins-SemiBold',
  },
  ThemeColorsContainer: {},
  ThemeColorsTextStyle: {
    fontSize: 15,
  },
  ColorsContainer: {
    flexDirection: 'row',
  },
  ColorContainer: {
    paddingHorizontal: '2%',
    paddingVertical: '3%',
  },
  IconContainer: {
    alignItems: 'center',
    width: '10%'
  },
});

export default styles;
