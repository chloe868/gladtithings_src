
let primary = '#56C596'
let secondary = '#000000'
let tertiary = '#4CCBA6'
let fourth = '#F88BFF'
let gradient = ['#CFF4D2', '#56C596', '#56C596']
export default {
  primaryDark: '#cae166',
  primary: primary,
  danger: '#C84848',
  warning: '#ffc107',
  secondary: secondary,
  white: '#fff',
  gray: '#cccccc',
  lightGray: '#eeeeee',
  darkGray: '#d4d4d4',
  normalGray: '#999',
  black: '#000',
  success: '#4BB543',
  goldenYellow: '#FFDF00',
  orange: '#F89551', //logo color
  tertiary: tertiary,
  blue: '#1B6F9C', //logo color
  containerBackground: '#F9F9F9',
  fourth: fourth,
  gradient: gradient,
  setPrimary(color){
    this.primary = color
  },
  setSecondary(color){
    this.secondary = color
  },
  setTertiary(color){
    this.tertiary = color
  },
  setFourth(color){
    fourth = color
  },
  setGradient(colors){
    this.gradient = colors
    console.log("[GRADIENT]", gradient);
  }
}