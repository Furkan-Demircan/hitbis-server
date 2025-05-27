import { SuccessResponse } from "../helpers/responseHelper.js";
import CountryModel from "../models/CountryModel.js";

const getAllCountries = async () => {
    const countries = await CountryModel.find();

    return new SuccessResponse(countries, null, countries.length);
};

const getCountryCities = async (countryId) => {
    const country = await CountryModel.findById(countryId).populate("cities");
    if (!country) {
        return new SuccessResponse(null, "Country not found", 0);
    }
    return new SuccessResponse(country.cities, null, country.cities.length);
};

export default {
    getAllCountries,
    getCountryCities,
};
