import React from "react";
import Chart from "react-google-charts";
import DataLine from "../charting/data_line";
import PropTypes from 'prop-types'

export default class MultiLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.LINES = [
            new DataLine('New Positives', 'left', 'blue', r => {
                return r.seven_day_averages.new_positives
            }),
            new DataLine('New Hospitalizations', 'right', '#cc9900', r => {
                return r.seven_day_averages.new_hospitalizations
            }),
            new DataLine('New Deaths', 'right', 'red', r => {
                return r.seven_day_averages.new_deaths
            }),
        ];
    }

    render() {
        let records = this.props.records
        let linesWithData = findLinesWithData(records, this.LINES)
        let optionMaker = new GoogleChartOptionMaker()
        let chartRows = dataFormattedForGoogleCharts(records, linesWithData)
        let yAxisLabels = optionMaker.createYAxisLables(linesWithData);
        return <Chart
            width = {this.props.width || 700}
            height = {this.props.height || 500}
            columns = {optionMaker.createColumnHeaders(linesWithData)}
            chartType = "LineChart"
            loader={<div>Loading Chart...</div>}
            rows = {chartRows}
            options = {{
                title: this.props.subject + " (7-day avg)",
                curveType: 'function',
                colors: linesWithData.map(l => l.color),
                legend: {
                    maxLines: 3,
                },
                hAxis: {
                    slantedText: true,
                    slantedTextAngle: 60,
                    format: 'M/d/yy',
                    units: {
                        days: {format: ['M/d/yy']},
                    },
                    multiple: 7
                },

                series: optionMaker.createSeriesDescription(linesWithData),
                vAxes: {
                    0: {
                        title: yAxisLabels[0].join(" / "),
                        viewWindow: {
                            min: 0
                        },
                        minValue: 0,
                    },
                    1: {
                        title: yAxisLabels[1].join(" / "),
                        viewWindow: {
                            min: 0
                        },
                        minValue: 0,
                        gridlines: {
                            count: 0
                        }

                    }
                }
            }}
        />
    }
}

MultiLineChart.propTypes = {
    records: PropTypes.array.isRequired,
    subject: PropTypes.string.isRequired
}
function dataFormattedForGoogleCharts(records, lines) {
    return records.map(r => {
        let data = lines.map(line => line.valueExtractor(r))
        data.unshift(r.date)
        return data
    });
}

function findLinesWithData(records, lines) {
    return lines.filter(line => {
        function hasData(records, valueExtractor) {
            return records.some(r => {
                let value = valueExtractor(r);
                return !(value === null || isNaN(value));
            })
        }

        return hasData(records, line.valueExtractor);
    });
}


class GoogleChartOptionMaker {
    createColumnHeaders(lines) {
        let columnHeaders = [{type: 'date', label: 'Date'}]
        lines.forEach((line, index) => {
            let axis_index = this.axisIndex(line.vAxis)
            columnHeaders.push({type: 'number', label: line.label})
        })
        return columnHeaders;
    }

    createYAxisLables(lines) {
        let yAxisLabels = [[], []]
        lines.forEach((line, index) => {
            let axis_index = this.axisIndex(line.vAxis)
            yAxisLabels[axis_index].push(line.label)
        })
        return yAxisLabels;
    }

    createSeriesDescription(lines) {
        let series = {}
        lines.forEach((line, index) => {
            series[index] = {
                targetAxisIndex: this.axisIndex(line.vAxis)
            }
        })
        return series;
    }

    axisIndex(name) {
        if (name === 'left')
            return 0
        if (name === 'right')
            return 1
        return 0
    }

}
