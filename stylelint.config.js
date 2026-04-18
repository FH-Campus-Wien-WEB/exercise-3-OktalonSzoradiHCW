/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-plugin-defensive-css/configs/strict',
    'stylelint-plugin-logical-css/configs/recommended',
    'stylelint-config-concentric-order',
    'stylelint-config-two-dash-bem'
  ],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-high-performance-animation',
    'stylelint-media-use-custom-media',
    'stylelint-no-browser-hacks',
    'stylelint-no-unresolved-module',
    'stylelint-no-unsupported-browser-features',
    'stylelint-plugin-defensive-css',
    'stylelint-plugin-logical-css',
    'stylelint-plugin-use-baseline',
    'stylelint-value-no-unknown-custom-properties'
  ],
  rules: {
    'csstools/media-use-custom-media': 'never',
    'csstools/value-no-unknown-custom-properties': true,
    'defensive-css/no-fixed-sizes': null,
    'defensive-css/require-at-layer': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-browser-hacks': [true],
    'plugin/no-low-performance-animation-properties': true,
    'plugin/no-unsupported-browser-features': [true],
    'plugin/use-baseline': [true],
    'comment-empty-line-before': null
  }
}
