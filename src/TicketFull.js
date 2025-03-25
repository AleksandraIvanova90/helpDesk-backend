import getDate from './getDate'

const uuid = require('uuid')

export default class TicketFull {
  constructor(name, description ) {
    this.id = uuid.v4();
    this.name = name;
    this.description = description || '';
    this.status = false;
    this.created = getDate();
  }
}
