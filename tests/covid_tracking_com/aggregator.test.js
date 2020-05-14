import Aggregator from "../../src/covid_tracking_com/aggregator";

test('aggregation of records with valid data', () => {
    let date1 = new Date(2020, 4, 1);
    let date2 = new Date(2020, 4, 2);
    let input = [
        { date: date1, positive: 1, death: 2, hospitalized: 4},
        { date: date2, positive: 64, death: 128, hospitalized: 256},
        { date: date1, positive: 8, death: 16, hospitalized: 32},
    ]

    let output = new Aggregator().aggregate(input)
    expect(output.length).toBe(2);
    expect(output).toEqual([
        { date: date1, positive: 9, death: 18, hospitalized: 36},
        { date: date2, positive: 64, death: 128, hospitalized: 256}
    ]);
});