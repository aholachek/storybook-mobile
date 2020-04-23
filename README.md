# 📱storybook-mobile

This addon gives you hints and warnings that will improve your UI for users on mobile devices. It does this by offering suggestions on how you can improve the HTML, CSS and UX of your components to be more mobile-friendly.

## Demo

[Check out a live storybook demo here.]()

## Quick Start

1. Install

`yarn add -D storybook-mobile` or `npm install --dev storybook-mobile`

2. Add `storybook-mobile` to your list of addons:

in `main.js`:

```js
module.exports = {
  stories: ['./testStories/stories/*.js'],
  addons: ['@storybook/addon-viewport/register', 'storybook-mobile']
}
```

This addon works best along with the [@storybook/addon-viewport](https://github.com/storybookjs/storybook/tree/next/addons/viewport) addon so please consider installing that as well if you don't have it already.

## Contributing

This addon is very new. If you have any suggestions or find any bugs, please make an issue or a pr!
