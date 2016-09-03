import chai from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

require('./configKeys.spec.js')
require('./expandConfig.spec.js')
require('./buildRequiredTaskList.spec.js')
