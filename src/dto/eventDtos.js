export class EventInfoDtos {
  id;
  name;
  description;
  date;
  constructor(id, name, description, date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.date = date;
  }
}
