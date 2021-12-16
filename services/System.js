import VersionCheck from 'react-native-version-check';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import { Platform, Linking , Alert} from 'react-native';
export default {
  async askPermission(){
    const trackingStatus = await requestTrackingPermission();
    if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      // enable tracking features
    }
  },
  checkVersion(callback){
    if(Platform.OS === 'android'){
      VersionCheck.needUpdate()
      .then(async res => {
        if(typeof res != undefined && typeof res != 'undefined'){
          if (res.isNeeded) {
            Alert.alert(
              'Update Required',
              'An update is required to continue using the Application!',
              [
                { text: 'Update', onPress: () =>  Linking.openURL(res.storeUrl)}
              ],
              { cancelable: false }
            );
           
          }else{
            callback(true)
          }
        }else{
          callback(true)
        }
      });
    }else if(Platform.OS === 'ios'){
      callback(true)
    }
  }
}