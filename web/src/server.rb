require 'sinatra'
require 'daily_county_counts_table'
get '/' do
  erb :index
end

get '/hotspots' do
  JSON.pretty_generate(DailyCountyCountsTable.load.hot_counties)
end