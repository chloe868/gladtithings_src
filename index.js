/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { typography } from './typography.js';
import { setCustomText } from 'react-native-global-props';
// typography();
const customTextProps = {
  style: {
    fontFamily: 'Poppins-Light'
  }
}
setCustomText(customTextProps);
AppRegistry.registerComponent(appName, () => App);
