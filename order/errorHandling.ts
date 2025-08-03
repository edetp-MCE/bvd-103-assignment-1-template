import { Context, Next } from 'koa';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error('Unhandled Error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: 'Internal Server Error',
      message: err.message || 'Something went wrong',
    };
    ctx.app.emit('error', err, ctx);
  }
}
