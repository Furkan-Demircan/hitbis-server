export class GroupInfoDto {
    id;
    name;
    description;
    isPublic;
    country;
    city;
    imageUrl;
    constructor(id, name, description, isPublic, country, city, imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.country = country;
        this.city = city;
        this.imageUrl = imageUrl;
    }
}

export class groupItemDto {
    userId;
    groupId;
    isAdmin;
    isBanned;
    constructor(userId, groupId, isAdmin, isBanned) {
        this.userId = userId;
        this.groupId = groupId;
        this.isAdmin = isAdmin;
        this.isBanned = isBanned;
    }
}
