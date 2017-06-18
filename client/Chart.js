import React from 'react'
import ReactHighCharts from 'react-highcharts/ReactHighstock'

class Chart extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.stocks.length === this.props.stocks.length) {
			return false;
		}
		else {
			return true;
		}
}



	render() {
		let seriesArray = [];
    const colors = ['#f46036', '#1CABA9', '#2e294e', '#d7263d', '#f2af29', '#0f4c5c'];

    this.props.stocks.forEach((stock, i) => {

            seriesArray[i] = {
                name: stock.code,
                data: stock.data.slice((stock.data.length - 1096)),
                color: colors[i]
            };
     });

		let config = {
			chart: {
				plotBackgroundColor: 'white'
			},
			rangeSelector: {
					selected: 4
			},
			xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
           day: '%b %Y'
        }
			},
			yAxis: {
					labels: {
							formatter: function () {
									return (this.value > 0 ? ' + ' : '') + this.value + '%';
							}
					},
					plotLines: [{
							value: 0,
							width: 2,
							color: 'silver'
					}]
			},
			plotOptions: {
					series: {
							compare: 'percent',
							showInNavigator: true
					}
			},
			title: {
			    text: 'US stock prices for the last three years'
			},
			tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
					valueDecimals: 2,
					split: true
			},
			  series: seriesArray
		}




		return (
			<div className = 'chartWrapper'>
				{ this.props.stocks.length > 0 && <ReactHighCharts className = 'chart' config = {config} ref = 'chart' /> }
</div>
		);
	}
};

export default Chart;
