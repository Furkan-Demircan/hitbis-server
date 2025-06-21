export class ProfileInfoDto {
    id;
    name;
    surname;
    avatar;
    isAdmin;
    constructor(id, name, surname, avatar, isAdmin) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.avatar = avatar;
        this.isAdmin = isAdmin || false;
    }
}

export class ProfileInfoByTokenDto extends ProfileInfoDto {
    email;
    birthDate;
    lenght;
    weight;
    avatar;
    age;
    username;
    constructor(
        id,
        name,
        surname,
        username,
        email,
        birthDate,
        lenght,
        weight,
        avatar,
        age
    ) {
        super(id, name, surname, username);
        this.username = username;
        this.email = email;
        this.birthDate = birthDate;
        this.lenght = lenght;
        this.weight = weight;
        this.avatar = avatar;
        this.age = age;
    }
}
