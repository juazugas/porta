const testsContext = require.context('../Users', true, /^(.+.spec.js)$/)
testsContext.keys().forEach(testsContext)
