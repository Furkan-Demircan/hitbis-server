export class ProfileInfoDto {
	id;
	name;
	surname;
	username;
	constructor(id, name, surname, username) {
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.username = username;
	}
}

export class ProfileInfoByTokenDto extends ProfileInfoDto {
	email;
	birthDate;
	height;
	weight;
	constructor(id, name, surname, username, email, birthDate, height, weight) {
		super(id, name, surname, username);
		this.email = email;
		this.birthDate = birthDate;
		this.height = height;
		this.weight = weight;
	}
}
