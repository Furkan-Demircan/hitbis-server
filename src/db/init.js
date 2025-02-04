import countries from "../data/Country.json"  with { type: "json" };
import cities from "../data/City.json"  with { type: "json" };
import CountryModel from "../models/CountryModel.js";
import CityModel from "../models/CityModel.js";

export const addCountriesAndCities = async () => {
    var newCountries = countries.map(country => {
        return {
            id: country.Id,
            name: country.Name
        }
    });

    var newCities = cities.map(city => {
        return {
            id: city.Id,
            name: city.Name,
            countryId: city.CountryId
        }
    })

    await CountryModel.insertMany(newCountries);
    await CityModel.insertMany(newCities);
}

