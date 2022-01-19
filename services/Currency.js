require('intl');
require('intl/locale-data/jsonp/en.js');
import Countries from '../common/Countries';
export default {
  display(amount, currency){
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })
    return formatter.format(amount)
  },
  getMonth(index){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[index];
  },
  getWithCountry(currency){
    country = Countries.list.filter((item) => {
      return item.currency == currency;
    })
    if(country){
      return country[0].currencyLabel + ` - ${country[0].currency}`
    }
    return null
  }
}