function chart_state_data(covid_data_by_state, states) {
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic);
    let ga_chart_data = covid_data_by_state['GA'].map(r => [
        r.date,
        r.seven_day_averages.new_positives,
        r.seven_day_averages.new_hospitalizations
    ])

    function drawBasic() {

        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'New Positive (7 day Avg)');
        data.addColumn('number', 'New Hospitalizations (7 day Avg)');
        data.addRows(ga_chart_data)

        var options = {
            curveType: 'function',
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'New Positive'
            },
            width: 800,
            height: 600,
            legend: { position: 'bottom' },
            chartArea:{left:'12%', top:60, width:'76%', height:'75%'},
            colors: ['red', '#cc9900'    ],
            hAxis: {
                showTextEvery: 7,
                gridlines: {
                    count: 0
                },
            },
            series: {
                1: {
                    targetAxisIndex: 1
                }
            },
            vAxes: {
                0: {
                    minValue: 0,
                    gridlines: {
                        count: 0
                    }
                },
                1: {
                    title:'Hospitalizations',
                    minValue: 0,
                    gridlines: {
                        count: 0
                    }
                }
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
}
