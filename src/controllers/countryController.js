import countryService from "../services/countryService.js";

const getAllCountries = async (req, res) => {
	var result = await countryService.getAllCountries();
	return res.json(result);
};

export default { getAllCountries };
