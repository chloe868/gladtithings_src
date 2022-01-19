import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { BasicStyles, Color, Routes } from 'common';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import Currency from '../../services/Currency';
class Ledgers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentDidMount(){
    this.retrieveSummaryLedger()
  }

  retrieveSummaryLedger = () => {
    const {user, ledger} = this.props.state;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      account_code: user.code
    };
    this.setState({isLoading: true});
    console.log('[dffffff]', parameter, Routes.ledgerSummary)
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      this.setState({isLoading: false});
      if (response.data != null) {
        this.setState({
          data: response.data
        })
      } else {
        this.setState({
          data: []
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false});
    });
  };

  getCountry(currency){
    return Currency.getWithCountry(currency)
  }

  selectHandler = (item) => {
    const { setLedger } = this.props;
    setLedger(item)
    setTimeout(() => {
      this.props.navigation.pop()
    }, 100)
  };

  render() {
    const { data } = this.state;
    const { theme, ledger } = this.props.state;
    return(
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView>
          <View style={{
            width: '100%',
          }}>
            {
              data && data.map((item, index) => (
                <TouchableOpacity
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 30,
                    paddingBottom: 30,
                    borderBottomColor: Color.lightGray,
                    borderBottomWidth: 1,
                    backgroundColor: ledger && ledger.currency == item.currency ? (theme ? theme.secondary : Color.secondary) : Color.white
                  }}
                  onPress={() => {
                    this.selectHandler(item)
                  }}>
                  <View style={[styles.AddressContainer], {flexDirection: 'row', flexWrap: "wrap"}}>
                    <Text
                      style={{
                          fontWeight: 'bold',
                          fontSize: BasicStyles.standardFontSize,
                          color: ledger && ledger.currency == item.currency ? Color.white : Color.black,
                          alignContent: 'flex-start',
                          flex: 1
                        }}>
                      {this.getCountry(item.currency)}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: BasicStyles.standardFontSize,
                        color: ledger && ledger.currency == item.currency ? Color.white : Color.black,
                        alignContent: 'flex-end'
                      }}>
                      {Number(item.available_balance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            }
          {
            this.state.isLoading && (<Skeleton size={1} template={'block'} height={50}/>)
          }
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  TermsAndConditionsContainer: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%'
  },
  SectionContainer: {
    width: '100%',
  },
  SectionTitleContainer: {},
  SectionTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
    marginTop: 10
  },
  SectionTwoTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
  },
  SectionDescriptionContainer: {},
  SectionDescriptionTextStyle: {
    textAlign: 'justify',
    fontSize: BasicStyles.standardFontSize
  },
});

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ledgers);
