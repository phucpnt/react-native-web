import AccessibilityUtil from '../AccessibilityUtil';
import StyleSheet from '../../apis/StyleSheet';
import StyleRegistry from '../../apis/StyleSheet/registry';

const emptyObject = {};

const styles = StyleSheet.create({
  buttonReset: {
    appearance: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    font: 'inherit',
    textAlign: 'inherit'
  },
  linkReset: {
    backgroundColor: 'transparent',
    color: 'inherit',
    textDecorationLine: 'none'
  },
  listReset: {
    listStyle: 'none'
  }
});

const pointerEventStyles = StyleSheet.create({
  auto: {
    pointerEvents: 'auto'
  },
  'box-none': {
    pointerEvents: 'box-none'
  },
  'box-only': {
    pointerEvents: 'box-only'
  },
  none: {
    pointerEvents: 'none'
  }
});

const resolver = style => StyleRegistry.resolve(style);

const createDOMProps = (rnProps, resolveStyle = resolver) => {
  const props = rnProps || emptyObject;
  const {
    accessibilityLabel,
    accessibilityLiveRegion,
    accessible,
    importantForAccessibility,
    pointerEvents,
    style: rnStyle,
    testID,
    type,
    /* eslint-disable */
    accessibilityComponentType,
    accessibilityRole,
    accessibilityTraits,
    /* eslint-enable */
    ...domProps
  } = props;

  const role = AccessibilityUtil.propsToAriaRole(props);
  const pointerEventStyle = pointerEvents !== undefined && pointerEventStyles[pointerEvents];
  const reactNativeStyle = [
    (role === 'button' && styles.buttonReset) ||
      (role === 'link' && styles.linkReset) ||
      (role === 'list' && styles.listReset),
    rnStyle,
    pointerEventStyle
  ];
  const { className, style } = resolveStyle(reactNativeStyle) || emptyObject;

  if (accessible === true) {
    domProps.tabIndex = AccessibilityUtil.propsToTabIndex(props);
  }
  if (typeof accessibilityLabel === 'string') {
    domProps['aria-label'] = accessibilityLabel;
  }
  if (typeof accessibilityLiveRegion === 'string') {
    domProps['aria-live'] = accessibilityLiveRegion === 'none' ? 'off' : accessibilityLiveRegion;
  }
  if (typeof className === 'string' && className !== '') {
    domProps.className = domProps.className ? `${domProps.className} ${className}` : className;
  }
  if (importantForAccessibility === 'no-hide-descendants') {
    domProps['aria-hidden'] = true;
  }
  if (typeof role === 'string') {
    domProps.role = role;
    if (role === 'button') {
      domProps.type = 'button';
    } else if (role === 'link' && domProps.target === '_blank') {
      domProps.rel = `${domProps.rel || ''} noopener noreferrer`;
    }
  }
  if (style != null) {
    domProps.style = style;
  }
  if (typeof testID === 'string') {
    domProps['data-testid'] = testID;
  }
  if (typeof type === 'string') {
    domProps.type = type;
  }

  return domProps;
};

module.exports = createDOMProps;
