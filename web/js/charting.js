function chart_state_data(covid_data_by_state, state) {
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawStateCharts);

    function drawStateCharts() {
        function drawLineChart(targetElementId, lines) {
            let chart_data = covid_data_by_state[state].map(r => {
                let data =  lines.map(line => line.value_extractor(r))
                data.unshift(r.date)
                return data
            })
            var datatable = new google.visualization.DataTable();
            datatable.addColumn('date', 'Date');
            let series = {}
            let axis_labels = [[], []]
            lines.forEach((line, index) => {
                function axisIndex(name) {
                    if (name === 'left')
                        return 0
                    if (name === 'right')
                        return 1
                    return 0
                }
                let axis_index = axisIndex(line.vAxis)
                series[index] = {
                    targetAxisIndex: axis_index
                }
                datatable.addColumn('number', line.label)
                axis_labels[axis_index].push(line.label)
            })
            datatable.addRows(chart_data)
            let options = {
                title: state + " (7-day avg)",
                curveType: 'function',
                width: 700,
                height: 500,
                colors: lines.map(l => l.color),
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

                series: series,
                vAxes: {
                    0: {
                        title: axis_labels[0].join(" / "),
                        viewWindow: {
                            min:0
                        },
                        minValue: 0,
                    },
                    1: {
                        title: axis_labels[1].join(" / "),
                        viewWindow: {
                            min:0
                        },
                        minValue: 0,
                        gridlines: {
                            count: 0
                        }

                    }
                }
        };

            var chart = new google.visualization.LineChart(document.getElementById(targetElementId));
            chart.draw(datatable, options);
        }
        drawLineChart('chart', [
                {
                    label: 'New Positives',
                    value_extractor: r => { return r.seven_day_averages.new_positives },
                    vAxis: 'left',
                    color: 'blue'
                },
                {
                    label: 'New Hospitalizations',
                    value_extractor: r => { return r.seven_day_averages.new_hospitalizations },
                    vAxis: 'right',
                    color: '#cc9900'
                },
                {
                    label: 'New Deaths',
                    value_extractor: r => { return r.seven_day_averages.new_deaths },
                    vAxis: 'right',
                    color: 'red'
                }
            ])
    }
}
