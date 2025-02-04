import { SuccessResponse } from "../helpers/responseHelper.js";
import CountryModel from "../models/CountryModel.js";

const getAllCountries = async () => {
	const countries = await CountryModel.find();

	return new SuccessResponse(countries, null, countries.length);
};

export default {
	getAllCountries,
};
