export class CommunityInfoDto {
	id;
	name;
	description;
	isPublic;
	country;
	city;
	constructor(id, name, description, isPublic, country, city) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.isPublic = isPublic;
		this.country = country;
		this.city = city;
	}
}
