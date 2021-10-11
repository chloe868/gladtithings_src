import {createStackNavigator} from 'react-navigation-stack';
import Login from 'src/modules/account/Login';
import ForgotPassword from 'src/modules/account/ForgotPassword';
import Register from 'src/modules/account/Register';
import ViewProfileStack from 'src/modules/viewProfile/Drawer';
import ProfileStack from 'src/modules/profile/Drawer';
import Welcome from 'src/modules/account/Landing';
import CommunityStack from 'src/modules/community/Drawer';
import SubscriptionStack from 'src/modules/subscription/Drawer';
import MessagePageStack from 'src/modules/messagePage/Drawer';
import PrivacyStack from 'src/modules/privacy/Drawer';
import TermsAndConditionsStack from 'src/modules/termsAndConditions/Drawer';
import DisplayStack from 'src/modules/display/DisplayDrawer';
import AccountSettingStack from 'src/modules/accountSettings/Drawer';
import TransactionsStack from 'src/modules/transactions/Drawer';
import PageMessageStack from 'src/modules/messages/Drawer';
import DepositStack from 'src/modules/deposit/Drawer';
import OtpStack from 'src/modules/otpPage/Drawer';
import EditProfileStack from 'src/modules/editProfile/Drawer';
import NotificationSettingsStack from 'src/modules/notificationSettings/Drawer';
import ChurchProfileStack from 'src/modules/churchProfile/Drawer';
import ChurchesStack from 'src/modules/churches/Drawer';
import EventsStack from 'src/modules/events/Drawer';
import QRCodeScannerStack from 'modules/qrCodeScanner/qrCodeScannerDrawer.js';
import EwalletStack from 'src/modules/ewallet/Drawer';
import LanguageSettingsStack from 'src/modules/languageSettings/Drawer';
import Drawer from './Drawer';
import CreateCommunityStack from 'src/modules/community/createCommunityDrawer.js';

const WelcomeStack = createStackNavigator(
  {
    loginScreen: {screen: Welcome},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);


// login stack
const LoginStack = createStackNavigator(
  {
    loginScreen: {screen: Login},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const ForgotPasswordStack = createStackNavigator(
  {
    forgotPasswordScreen: {screen: ForgotPassword},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const RegisterStack = createStackNavigator(
  {
    registerScreen: {screen: Register},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    landingStack: {screen: WelcomeStack},
    loginStack: {screen: LoginStack},
    forgotPasswordStack: {screen: ForgotPasswordStack},
    registerStack: {screen: RegisterStack},
    drawerStack: {screen: Drawer},
    profileStack: {screen: ProfileStack},
    viewProfileStack: {screen: ViewProfileStack},
    communityStack: {screen: CommunityStack},
    subscriptionStack: {screen: SubscriptionStack},
    messagePageStack: {screen: MessagePageStack},
    termsAndConditionStack: {screen: TermsAndConditionsStack},
    privacyStack: {screen: PrivacyStack},
    displayStack: {screen: DisplayStack},
    accountSettingsStack: { screen: AccountSettingStack},
    transactionsStack: {screen: TransactionsStack},
    pageMessageStack: { screen: PageMessageStack},
    depositStack: { screen: DepositStack},
    notificationSettingsStack: { screen: NotificationSettingsStack},
    otpStack: { screen: OtpStack },
    editProfileStack: { screen: EditProfileStack },
    churchProfileStack: { screen: ChurchProfileStack },
    churchesStack: { screen: ChurchesStack },
    eventsStack: { screen: EventsStack },
    qrCodeScannerStack: {screen: QRCodeScannerStack},
    ewalletStack: {screen: EwalletStack},
    createCommunityStack: { screen: CreateCommunityStack },
    languageSettingsStack: { screen: LanguageSettingsStack }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'landingStack',
  },
);

export default PrimaryNav;
