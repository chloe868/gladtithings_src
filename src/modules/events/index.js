import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import IncrementButton from 'components/Form/Button';
import StripeCard from 'components/Payments/Stripe/Stripe.js';

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
			donate: false
		}
	}

	render() {
		const { theme, user } = this.props.state;
		const { donate } = this.state;
		return (
			<View style={{
				backgroundColor: Color.containerBackground,
				height: height,
			}}>
				<ScrollView showsVerticalScrollIndicator={false}
					style={{
						backgroundColor: Color.containerBackground,
						marginBottom: 150
					}}>
					<CustomizedHeader
						version={2}
						redirect={() => {
							this.setState({ donate: true })
						}}
						showButton={donate}
					/>
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
						<View style={{
							padding: 20,
						}}>
							<View style={{
								justifyContent: 'center',
								alignItems: 'center',
								padding: 20,
							}}>
								<Text style={{ fontSize: 30 }}>1,000.00</Text>
								<Text style={{
									color: theme ? theme.primary : Color.primary,
									fontFamily: 'Poppins-SemiBold'
								}}>USD</Text>
							</View>
							<Text style={{
								fontFamily: 'Poppins-SemiBold',
								marginTop: 10
							}}>Payment Methods</Text>

							<View style={{
								flexDirection: 'row',
								marginBottom: 20,
								marginTop: 20
							}}>
								<IncrementButton
									style={{
										backgroundColor: Color.primary,
										width: '40%'
									}}
									textStyle={{
										fontFamily: 'Poppins-SemiBold'
									}}
									onClick={() => {
										this.setState({
											method: 'paypal'
										})
									}}
									title={'PayPal'}
								/>

								<IncrementButton
									style={{
										backgroundColor: Color.white,
										width: '40%',
										marginLeft: '1%',
										borderColor: Color.gray,
										borderWidth: 0.25
									}}
									textStyle={{
										fontFamily: 'Poppins-SemiBold',
										color: Color.gray
									}}
									onClick={() => {
										this.setState({
											method: 'stripe'
										})
									}}
									title={'CC / DC'}
								/>
							</View>
							<View style={{
								padding: 20,
							}}>
								<StripeCard />
							</View>
						</View>
					}
				</ScrollView>
				{donate && <View style={{
					position: 'absolute',
					bottom: 90,
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
							this.props.navigation.navigate('otpStack');
						}}
						title={'Continue'}
					/>
				</View>}
			</View>
		);
	}
}
const mapStateToProps = state => ({ state: state });

export default connect(
	mapStateToProps
)(Events);
