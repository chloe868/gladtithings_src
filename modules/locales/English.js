import { faHome, faShieldAlt, faCopy, faCog, faUsers, faWallet, faHistory, faCreditCard } from '@fortawesome/free-solid-svg-icons';
export default {
  lang: 'english',
  getStarted: 'Get Started',
  signIn: 'Sign In',
  alreadyHaveAnAccount: 'Already have an account?',
  availableLanguages: 'Available Languages',
  tapLanguage: 'Tap language you want to use.',
  username: 'Username',
  password: 'Password',
  forgotPassword: 'Forgot Password',
  signUp: 'Sign Up',
  dontHaveAnAccount: `Don't have an account`,
  languageSettings: 'Language Settings',
  welcome: 'Welcome',
  visitedChurches: 'Recently Visited Churches',
  findChurch: 'Find Church',
  subscribe: 'Subscribe',
  upcomingMasses: 'Upcoming Masses',
  viewMore: 'View more',
  upcomingEvents: 'Upcoming Events',
  donate: 'Donate',
  goToSubscription: 'Go to Subscription',
  DrawerMenu: [
    {
      title: 'Homepage',
      route: 'Homepage',
      icon: faHome,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'drawerStack'
    },
    {
      title: 'Communities',
      route: 'Community',
      icon: faUsers,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'Community'
    },
    {
      title: 'Wallet',
      route: 'Dashboard',
      icon: faWallet,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'Dashboard'
    },
    {
      title: 'Tithings',
      route: 'Donations',
      icon: faHistory,
      borderBottom: false,
      currentPage: 'Donations'
    },
    {
      title: 'Settings',
      route: 'Settings',
      icon: faCog,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'Settings'
    },
    {
      title: 'Deposit',
      route: 'depositStack',
      icon: faWallet,
      borderBottom: false,
      payload: 'drawerStack',
      currentPage: 'Deposit'
    },
    {
      title: 'Withdraw',
      route: 'withdrawStack',
      icon: faCreditCard,
      borderBottom: false,
      payload: 'drawerStack',
      currentPage: 'Deposit'
    }
  ],
  DrawerMenu1: [{
    title: 'Terms & Conditions',
    route: 'termsAndConditionStack',
    icon: faCopy,
    borderBottom: false
  },
  {
    title: 'Privacy Policy',
    route: 'privacyStack',
    icon: faShieldAlt,
    borderBottom: false
  }],
  settingsOptions: [
    {
      title: 'Account Settings',
      description: "Account details and update password",
      route: 'accountSettingsStack'
    },
    {
      title: 'Edit Profile',
      description: "Update your personal information and more.",
      route: 'profileStack'
    },
    {
      title: 'Subscriptions',
      description: "View your subscribe plan",
      route: 'subscriptionStack'
    },
    {
      title: 'Notification Settings',
      description: "Receives notification to any of the ff.",
      route: 'notificationSettingsStack'
    },
    {
      title: 'About Glad Tithings',
      description: "Open website ",
      route: 'website'
    },
    {
      title: 'Display Settings',
      description: "Change your theme colors here",
      route: 'displayStack'
    },
    {
      title: 'Laguage Settings',
      description: "Manage languages you want to use here",
      route: 'languageSettingsStack'
    }
  ],
  fieldError: 'Please fill up the required fields.',
  notMatchError: `Username and password didn't match.`,
  emailError: 'Email does not exist.',
  emailAddress: 'Email Address',
  confirmPassword: 'Confirm Password',
  newPassword: 'New Password',
  reset: 'Reset',
  submit: 'Submit',
  requestReset: 'Request to Reset Password',
  churchesNearby: 'Churches nearby',
  search: 'Search',
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  tithings: 'Tithings',
  availableBalance: 'Available Balance',
  subscriptions: 'Subscriptions',
  subscriptionDescription: 'Hassle free tithings. Just set the amount, church and time then we will do it for you.',
  accountSettings: 'Account Settings',
  update: 'Update',
  securityCredentials: 'Security Credentials',
  profile: 'Profile',
  verified: 'Verified',
  personalInformation: 'Personal Information',
  edit: 'Edit',
  noEmail: 'No email address provided',
  noPhoneNumber: 'No phone number provided',
  noLocation: 'No location provided',
  noGender: 'Gender',
  cancel: 'Cancel',
  firstName: 'First Name',
  lastName: 'Last Name',
  phoneNumber: 'Phone Number',
  address: 'Address',
  notificationSettings: 'Notification Settings',
  notificationsOptions: [
    {
      title: 'Email Login',
      description: "Receives email address every time there’s a login of the account.",
      flag: false
    },
    {
      title: 'Email OTP',
      description: "OTP will be send to you email address",
      flag: false
    },
    {
      title: 'SMS OTP',
      description: "OTP will be send to you via SMS using your registered mobile number",
      flag: true
    },
    {
      title: 'Subscribe to get our latest updates',
      description: "Receives events, and many more to your registered email address",
      flag: false
    },
  ],
  themeSettings: 'Theme Settings',
  colorList: [
    {
      title: 'Modo 1',
      details: 'Add description here',
      colors: ['#4CCBA6', '#000000'],
    },
    {
      title: 'Modo 2',
      details: 'Add description here',
      colors: ['#5842D7', '#000000'],
    },
    {
      title: 'Modo 3',
      details: 'Add description here',
      colors: ['#000000', '#4CCBA6'],
    }
  ]
}