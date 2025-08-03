import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { errorHandler } from './errorHandling';

const app = new Koa();
const router = new Router();

router.get('/health', async (ctx) => {
  ctx.body = { status: 'OK' };
});

// Add actual routes here

app.use(errorHandler);
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err) => {
  console.error('App level error:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service listening on port ${PORT}`);
});
