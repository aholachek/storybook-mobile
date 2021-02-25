module.exports = {
  stories: ['./testStories/stories/*.js'],
  addons: [
    './src/register.js',
    '@storybook/addon-viewport/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
  ],
}
