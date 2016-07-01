import mapValues from 'lodash.mapvalues'

// Wait a minute is this Javascript or Haskell
export default selectors => state => mapValues(selectors, selector => selector(state))
