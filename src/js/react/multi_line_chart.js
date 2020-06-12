import React from "react";
import Chart from "react-google-charts";
import PropTypes from 'prop-types'

export default class MultiLineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let records = this.props.records
        let linesWithData = findLinesWithData(records, this.props.lines)
        let optionMaker = new GoogleChartOptionMaker()
        let chartRows = dataFormattedForGoogleCharts(records, linesWithData)
        let yAxisLabels = optionMaker.createYAxisLables(linesWithData);
        if (linesWithData.length === 0) {
            let lineDescription = this.props.lines.map(l => l.label).join(", ")
            return (
                <div>{lineDescription} data not available for {this.props.subject}</div>
            )
        }

        return <Chart
            width = {this.props.width || 700}
            height = {this.props.height || 500}
            columns = {optionMaker.createColumnHeaders(linesWithData)}
            chartType = "LineChart"
            loader={<div>Loading Chart...</div>}
            rows = {chartRows}
            options = {{
                title: this.props.subject,
                curveType: 'function',
                colors: linesWithData.map(l => l.color),
                legend: {
                    maxLines: 3,
                    position: 'bottom',
                    alignment: 'start'
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
                        scaleType: this.props.verticalScaleType,
                    },
                    1: {
                        scaleType: this.props.verticalScaleType,
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
    verticalScaleType: PropTypes.string.isRequired,
    lines:PropTypes.array.isRequired,
    subject: PropTypes.string.isRequired
}
function dataFormattedForGoogleCharts(records, lines) {
    return records.map(r => {
        let data = lines.map(line => line.sevenDayAvgValueExtractor(r))
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

        return hasData(records, line.sevenDayAvgValueExtractor);
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
                targetAxisIndex: this.axisIndex(lines.length === 1 ? 'left' : line.vAxis)
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
