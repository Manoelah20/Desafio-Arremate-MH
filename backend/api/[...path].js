const app = require('../src/app');
const publishSupabaseBroadcast = require('../src/services/supabaseBroadcast');

app.set('publishLotEvent', publishSupabaseBroadcast);
app.set('runDueLotCheck', true);

module.exports = app;
