export class EventInfoDtos {
    id;
    title;
    description;
    startDate;
    location;
    isActive;
    difficulty;
    imageUrl;
    constructor(
        id,
        title,
        description,
        startDate,
        location,
        isActive,
        difficulty,
        imageUrl
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.location = location;
        this.isActive = isActive;
        this.difficulty = difficulty;
        this.imageUrl = imageUrl;
    }
}
