import countryService from "../services/countryService.js";

const getAllCountries = async (req, res) => {
	var result = await countryService.getAllCountries(null);
	return res.json(result);
};

export default { getAllCountries };
