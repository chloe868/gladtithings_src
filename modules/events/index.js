import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import IncrementButton from 'components/Form/Button';
import StripeCard from 'components/Payments/Stripe/Stripe.js';
import { WebView } from 'react-native-webview';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import {
	confirmPayment,
	createToken,
	initStripe
} from '@stripe/stripe-react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const data = [
	{
		id: 0,
		title: 'Theme 1',
		address: 'Cebu, Cebu City, Philippines',
		description: "Receives email address every time there's a login of the account.",
		date: 'July 23, 2021 5:00 PM',
		amount: 'USD 10.00',
		type: 'Recollection'
	},
	{
		id: 0,
		title: 'Theme 1',
		address: 'Cebu, Cebu City, Philippines',
		description: "Receives email address every time there's a login of the account.",
		date: 'July 23, 2021 5:00 PM',
		amount: 'USD 10.00',
		type: 'Recollection'
	},
	{
		id: 0,
		title: 'Theme 1',
		address: 'Cebu, Cebu City, Philippines',
		description: "Receives email address every time there's a login of the account.",
		date: 'July 23, 2021 5:00 PM',
		amount: 'USD 10.00',
		type: 'Recollection'
	},
	{
		id: 0,
		title: 'Theme 1',
		address: 'Cebu, Cebu City, Philippines',
		description: "Receives email address every time there's a login of the account.",
		date: 'July 23, 2021 5:00 PM',
		amount: 'USD 10.00',
		type: 'Recollection'
	},
	{
		id: 0,
		title: 'Theme 1',
		address: 'Cebu, Cebu City, Philippines',
		description: "Receives email address every time there's a login of the account.",
		date: 'July 23, 2021 5:00 PM',
		amount: 'USD 10.00',
		type: 'Recollection'
	},
	{
		id: 0,
		title: 'Theme 1',
		address: 'Cebu, Cebu City, Philippines',
		description: "Receives email address every time there's a login of the account.",
		date: 'July 23, 2021 5:00 PM',
		amount: 'USD 10.00',
		type: 'Recollection'
	}
]
class Events extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: null,
			method: 'paypal',
			donate: false,
			amount: 0,
			card: null,
			isLoading: false
		}
	}

	componentDidMount() {
		const { setPaypalUrl } = this.props;
		setPaypalUrl(null);
		this.props.navigation.addListener('didFocus', () => {
			console.log('[INIT STRIPE]');
			initStripe({
				publishableKey: Config.stripe.dev_pk,
				merchantIdentifier: 'merchant.identifier',
			})
		})
	}

	setDetails = (complete, details) => {
		console.log('[CARD DETAILS]', complete, details);
		if (complete === true) {
			this.setState({ card: details });
		}
	};

	createPayment = async () => {
		if (this.state.amount !== null && this.state.amount > 0) {
			await createToken({ type: 'Card' }).then(res => {
				console.log('[TOKEN]', res);
				let params = {
					amount: this.state.amount,
				};
				this.setState({ isLoading: true })
				Api.request(Routes.createPaymentIntent, params, response => {
					console.log('[PAYMENT REPONSE]', response.data);
					this.handlePayment(response.data, res.token);
				});
			});
		} else {
			Alert.alert('Payment Error', 'You are missing your amount', [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{
					text: 'OK',
					onPress: () => console.log('Cancel Pressed'),
				},
			]);
		}
	};

	createLedger = (source, paymentIntent) => {
		const { user } = this.props.state;
		let params = {
			account_id: user.id,
			account_code: user.code,
			amount: this.state.amount,
			currency: paymentIntent.currency,
			details: 'deposit',
			description: 'deposit',
		};
		console.log('[CHARGE PARAMETER]', Routes.ledgerCreate, params);
		Api.request(Routes.ledgerCreate, params, response => {
			console.log('[CHARGE RESPONSE]', response);
			this.setState({ isLoading: true })
			if (response.data != null) {
				this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success' });
			}
			if (respose.error !== null) {
				this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
			}
		});
	};

	handlePayment = async (data, source) => {
		const { user } = this.props.state;
		const { error, paymentIntent } = await confirmPayment(data.client_secret, {
			type: 'Card',
			billingDetails: { name: user.email },
		});
		if (error) {
			Alert.alert('Payment Failed', error.message, [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			]);
			console.log('[ERROR]', error);
		}
		if (paymentIntent) {
			await this.createLedger(source, paymentIntent);
			console.log('[SUCCESS]', paymentIntent);
		}
	};

	render() {
		const { theme, user, paypalUrl } = this.props.state;
		const { donate, amount } = this.state;
		return (
			<View style={{ backgroundColor: Color.containerBackground }}>
				<ScrollView showsVerticalScrollIndicator={false}
					style={{
						backgroundColor: Color.containerBackground
					}}>
					<View style={{ height: height * 1.5, }}>
						{paypalUrl === null && <CustomizedHeader
							version={2}
							redirect={() => {
								this.setState({ donate: true })
							}}
							showButton={donate}
						/>}
						{!donate ? <View style={{ marginTop: 20 }}>
							<View style={{
								paddingLeft: 20,
								paddingRight: 20
							}}>
								<Text style={{
									fontFamily: 'Poppins-SemiBold'
								}}>Upcoming Events</Text>
								{this.state.isLoading ? <Spinner mode="overlay" /> : null}
							</View>
							<CardsWithImages
								version={1}
								data={data}
								buttonColor={theme ? theme.secondary : Color.secondary}
								buttonTitle={'Donate'}
								redirect={() => { return }}
								buttonClick={() => { this.props.navigation.navigate('depositStack', { type: 'Send Event Tithings' }) }}
							/>
						</View> :
							(paypalUrl ? <View
								style={{
									height: height,
								}}>
								<WebView
									source={{
										uri: paypalUrl,
									}}
									style={{
										height: '100%',
									}}
									startInLoadingState={true}
									javaScriptEnabled={true}
									thirdPartyCookiesEnabled={true}
								/>
							</View> : <View style={{
								padding: 20,
							}}>
								<View style={{
									justifyContent: 'center',
									alignItems: 'center',
									padding: 20,
								}}>
									<TextInput
										style={{ fontSize: 30 }}
										onChangeText={input => this.setState({ amount: input })}
										value={amount}
										placeholder={'0.0'}
										keyboardType={'numeric'}
									/>
									<Text style={{
										color: theme ? theme.primary : Color.primary,
										fontFamily: 'Poppins-SemiBold'
									}}>USD</Text>
								</View>
								<View style={{
									padding: 20,
								}}>
									<StripeCard amount={amount} setCardDetails={(complete, cardDetails) => this.setDetails(complete, cardDetails)} />
								</View>
							</View>
							)
						}
					</View>
				</ScrollView>
				{donate && paypalUrl === null && <View style={{
					position: 'absolute',
					bottom: 10,
					left: 0,
					paddingLeft: 20,
					paddingRight: 20,
					width: '100%'
				}}>
					<IncrementButton
						style={{
							backgroundColor: Color.secondary,
							width: '100%'
						}}
						textStyle={{
							fontFamily: 'Poppins-SemiBold'
						}}
						onClick={() => {
							this.createPayment()
						}}
						title={'Continue'}
					/>
				</View>}
			</View>
		);
	}
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
	const { actions } = require('@redux');
	return {
		setPaypalUrl: paypalUrl => dispatch(actions.setPaypalUrl(paypalUrl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);

