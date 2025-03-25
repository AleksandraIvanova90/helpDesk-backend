import TicketController from './src/TicketController.js'
import { tickets } from './src/tickets.js'


const http = require('http');
const Koa = require('koa');
const koaBody  = require('koa-body');
const ticketCtlr = new TicketController(tickets)
const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(async ctx => {
  const { method, id } = ctx.request.query;
  switch (method, id) {
    case 'allTickets':
        ctx.response.body = ticketCtlr.getAllTickets();
        return;
    case 'ticketById':
        ctx.response.body = ticketCtlr.getTicketById(id);
        return;
    case 'createTicket':
        ctx.response.body = ticketCtlr.createTicket(name, description);
        return;
    case 'editTicket':
        const { id, name, description } = ctx.request.body;
        ctx.response.body = ticketCtlr.editTicket(id, name, description);
        return;
    case 'deleteTicket':
        const result = ticketCtlr.deleteTicket(id);
        ctx.response.body = ticketCtlr.deleteTicket(id);
        return;
    case 'changeStatus':
        ctx.response.body = ticketCtlr.changeStatus(id);
        return;
    default:
      ctx.response.status = 404;
      return;
  }
});


const server = http.createServer(app.callback());

const port = process.env.PORT || 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});