const Order = require('../models/Order');
const moment = require('moment');
const errorHandler = require('../utils/errorhandler');
module.exports.overview = async function (req, res) {
	try {
		const allOrders = await  Order.find({user: req.user.id}).sort(({date: 1}));
		const ordersMap = getOrdersMap(allOrders);
		const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
		const yestardayOrderNumber = yesterdayOrders.length;
		//total orders
		const totalOrdersNumber = allOrders.length;
		//all days
		const daysNumber = Object.keys(ordersMap).length;
		//orders in day
		const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
		//persent for orders
		const orderPercent = (((yestardayOrderNumber / ordersPerDay) - 1) * 100).toFixed(2);
		//total gain
		const totalGain = calculatePrice(allOrders);
		//gaine per day
		const gainePerDay = totalGain / daysNumber;
		//gain yesterday
		const yesterdayGain = calculatePrice(yesterdayOrders);
		//percent gain
		const gainPercent = (((yesterdayGain / gainePerDay) - 1) * 100).toFixed(2);
		//compare gain
		const compareGain = (yesterdayGain - gainePerDay).toFixed(2);
		//compare number
		const compareNumber = (yestardayOrderNumber - ordersPerDay).toFixed(2);
		res.status(200).json({
			gain: {
				percent: Math.abs(+gainPercent),
				compare: Math.abs(+compareGain),
				yesterday: +yesterdayGain,
				isHigher: gainPercent > 0
			},
			orders: {
				percent: Math.abs(+ordersPerDay),
				compare: Math.abs(+compareNumber),
				yesterday: +yestardayOrderNumber,
				isHigher: orderPercent > 0
			}
		})
	} catch (e) {
		errorHandler(e)
	}
};
module.exports.analytics = async function (req, res) {
	try {
		const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
		const ordersMap = getOrdersMap(allOrders);
		const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);
		const chart = Object.keys(ordersMap).map(label => {
			//label 03.03.2018
			const gain = calculatePrice(ordersMap[label]);
			const order = ordersMap[label].length;
			return {label, order, gain}
		});
		res.status(200).json({
			average,
			chart
		})
	} catch (e) {
		errorHandler(e)
	}
};

function getOrdersMap(orders = []) {
	const daysOrders = [];
	orders.forEach(order => {
		const date = moment(order.date).format('DD.MM.YYYY');
		if (date === moment().format('DD.MM.YYYY')) {
			return;
		}
		if (!daysOrders[date]) {
			daysOrders[date] = []
		}
		daysOrders[date].push(order);
	});
	return daysOrders;
}

function calculatePrice(orders = []) {
	return orders.reduce((total, order) => {
		const orderPrice = order.list.reduce((orderTotal, item) => {
			return orderTotal += item.cost * item.quantity
		}, 0);
		return total += orderPrice;
	}, 0)
}