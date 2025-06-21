import { SuccessResponse } from "../helpers/responseHelper.js";
import cityModel from "../models/CityModel.js";

const getCityByCountryId = async (countryId) => {
    const cities = await cityModel.find({ countryId });

    return new SuccessResponse(cities, null, cities.length);
};

const getCityById = async (cityId) => {
    const city = await cityModel.findById(cityId);
    if (!city) {
        return new SuccessResponse(null, "City not found", 0);
    }

    return new SuccessResponse(city, null, 1);
};

export default {
    getCityByCountryId,
    getCityById,
};
