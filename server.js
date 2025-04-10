const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const app = new Koa();

const ticketAll = [
  {
      id: 1232313,
      name: 'Тест1',
      description: 'Описание1',
      status: false,
      created: '10.03.19, 08:40',
    },
    {
      id: 123434352313,
      name: 'Тест2',
      description: 'Описание2',
      status: false,
      created: '10.03.19, 12:40',
    },
    {
      id: 12324545313,
      name: 'Тест3',
      description: 'Описание3',
      status: false,
      created: '11.03.19, 08:40',
    },
    {
      id: 5313,
      name: 'Тест4',
      description: 'Описание4',
      status: true,
      created: '12.03.19, 08:40',
    }
];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));



app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  };

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    };
  };

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    };

    ctx.response.status = 204;
  };
});

app.use(async ctx => {
  const { method, id } = ctx.request.query;
  switch (method) {
    case 'allTickets':
        ctx.response.body = ticketAll;
        return;
    case 'createTicket':
      const parse = JSON.parse(ctx.request.body);
      ticketAll.push({
        id: parse.id,
        name: parse.name,
        description: parse.description,
        status: parse.status,
        created: parse.created,
        });
        ctx.response.status = 200;
        return;    
    case 'editTicket':
        const dataEdit = JSON.parse(ctx.request.body);
        const index = ticketAll.findIndex(el => el.id == dataEdit.id);
          ticketAll[index] = {
            ...ticketAll[index],
            ...dataEdit,
          };
        ctx.response.status = 200;
        return;
    case 'deleteTicket':
      const ticketIndex = ticketAll.findIndex(el => el.id == id);
      if (ticketIndex !== -1) {
        ticketAll.splice(ticketIndex, 1);
        ctx.response.body = 'удалено';
        ctx.response.status = 200;
        return; 
      } else {
        ctx.response.status = 404;
        return;
      };
    case 'changeStatus':
        const parseToEdit = JSON.parse(ctx.request.body);
        const elIndex = ticketAll.findIndex(el => el.id == parseToEdit.id);
        ticketAll[elIndex] = {
          ...ticketAll[elIndex],
          ...parseToEdit,
        };
        ctx.response.status = 200;
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