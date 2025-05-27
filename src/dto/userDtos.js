export class ProfileInfoDto {
    id;
    name;
    surname;
    avatar;
    constructor(id, name, surname, avatar) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.avatar = avatar;
    }
}

export class ProfileInfoByTokenDto extends ProfileInfoDto {
    email;
    birthDate;
    height;
    weight;
    avatar;
    age;
    constructor(
        id,
        name,
        surname,
        username,
        email,
        birthDate,
        height,
        weight,
        avatar,
        age
    ) {
        super(id, name, surname, username);
        this.email = email;
        this.birthDate = birthDate;
        this.height = height;
        this.weight = weight;
        this.avatar = avatar;
        this.age = age;
    }
}
