import { createApp } from './app.js';
import { loadServerEnvironment } from './config/environment.js';

const environment = loadServerEnvironment();
const app = createApp();

app.listen(environment.PORT, environment.HOST, () => {
  console.log(`Server listening at http://${environment.HOST}:${environment.PORT}`);
});
