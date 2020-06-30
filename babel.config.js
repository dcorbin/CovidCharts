module.exports = function (api) {
  const isTest = api.env('test');

  api.cache(true);

  const presets = ['@babel/preset-env', '@babel/preset-react']
  const plugins = [  ];

  return {
    presets,
    plugins
  };
}
