import countryService from "../services/countryService.js";
import { ErrorResponse } from "../helpers/responseHelper.js";

const getAllCountries = async (req, res) => {
    var result = await countryService.getAllCountries();
    return res.json(result);
};

const getCountryCities = async (req, res) => {
    const countryId = req.query.countryId;
    if (!countryId) {
        return res.json(new ErrorResponse(404, "CountryId not set."));
    }
    var result = await countryService.getCountryCities(countryId);
    return res.json(result);
};

export default { getAllCountries, getCountryCities };
