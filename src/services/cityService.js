import { SuccessResponse } from "../helpers/responseHelper.js";
import cityModel from "../models/cityModel.js";

const getCityByCountryId = async (countryId) => {
	const cities = await cityModel.find({ countryId });

	return new SuccessResponse(cities, null, cities.length);
};

export default {
	getCityByCountryId,
};
