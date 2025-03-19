export class EventInfoDtos {
    id;
    title;
    description;
    startDate;
    location;
    isActive;
    constructor(id, title, description, startDate, location, isActive) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.location = location;
        this.isActive = isActive;
    }
}
