

export const BREAKPOINTS = {
    smallScreen: 550,
    medScreen: 1100,
    bigScreen: 1500,
  }
  
export const QUERIES = {
    'smallerThanTablet': `(max-width: ${BREAKPOINTS.smallScreen}px)`,
    'smallerThanLaptop': `(max-width: ${BREAKPOINTS.medScreen}px)`,
    'smallerThanDesktop': `(max-width: ${BREAKPOINTS.bigScreen}px)`,
  }