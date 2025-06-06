import { ErrorResponse } from "../helpers/responseHelper.js";
import cityService from "../services/cityService.js";

const getCityByCountryId = async (req, res) => {
    const countryId = req.query.countryId;

    if (!countryId) {
        return res.json(new ErrorResponse(404, "CountryId not set."));
    }
    var result = await cityService.getCityByCountryId(countryId);
    return res.json(result);
};

const getCityById = async (req, res) => {
    const cityId = req.query.cityId;

    if (!cityId) {
        return res.json(new ErrorResponse(404, "CityId not set."));
    }
    var result = await cityService.getCityById(cityId);
    return res.json(result);
};

export default {
    getCityByCountryId,
    getCityById,
};
