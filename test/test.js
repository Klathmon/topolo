import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(sinonChai)
chai.use(chaiAsPromised)

require('./configKeys.spec.js')
require('./expandConfig.spec.js')
require('./buildRequiredTaskList.spec.js')
require('./buildTaskDependencyGraph.spec.js')
require('./sort.spec.js')
require('./runner.spec.js')
