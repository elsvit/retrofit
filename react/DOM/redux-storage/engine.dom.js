import createEngine from 'redux-storage-engine-localstoragefakepromise';
import filter from './filter';

const engine = createEngine('application-state');
export default filter(engine);
