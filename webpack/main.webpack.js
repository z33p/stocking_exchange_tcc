module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './src/backend/electron/app.ts',
  module: {
    rules: require('./rules.webpack'),
  }
}