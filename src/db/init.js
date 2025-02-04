import countries from "../data/Country.json"  with { type: "json" };
import CountryModel from "../models/CountryModel.js";
import cities from "../data/City.json"  with { type: "json" };
import CityModel from "../models/CityModel.js";

export const addCountriesAndCities = async () => {
    var newCountries = countries.map(country => {
        return {
            id: country.Id,
            name: country.Name
        }
    });

    
    var countryResult = await CountryModel.insertMany(newCountries);

    const countryIds = newCountries.map(c => {
        const x = countryResult.find(f => f.name === c.name);
        
        return {
            _id: x?._id,
            id: c.id,
        }
    })

    console.log('countryResult :>> ', countryResult);

    var newCities = cities.map(city => {
        return {
            name: city.Name,
            countryId: countryIds.find(f => f.id === city.CountryId)?._id
        }
    })

    await CityModel.insertMany(newCities);
}

