const axios = require('axios');
require('dotenv').config();
const Tyre = require('../models/Tyreall');

const USERNAME = process.env.API_USERNAME;
const TOKEN = process.env.API_TOKEN;
const BASE_URL = 'https://api.driverightdata.com/eu/api';






exports.searchByRego = async (req, res) => {
  const { rego, state } = req.body;
  if (!rego || !state) return res.status(400).json({ error: 'rego & state required' });

  try {
    const vrmResp = await axios.get(`${BASE_URL}/vrm/GetVehicleInfoByAustralianNumberPlate3`, {
      params: { username: USERNAME, securityToken: TOKEN, rego, state },
      headers: { Accept: 'application/json' }
    });

    const data = vrmResp.data;
    const vehicle = data.vehicle;
    const vehicleKey = vehicle?.vehicleKey;
    

    // --- MULTIPLE VARIANTS
    if (!vehicleKey && data.questionTree?.resultSets?.resultSet?.length) {
      const variants = data.questionTree.resultSets.resultSet.map(set => set.vehicles.vehicle);
      const queries = [];
      const seen = new Set();


      for (const v of variants) {
        try {
          const fit = await fetchTyreInfo(v.vehicleKey);
          if (!fit.tyreSize) continue;

          const key = `${fit.tyreSize}|${fit.brand}`;
          if (seen.has(key)) continue;
          seen.add(key);

          queries.push({
            SIZE: new RegExp(`^${fit.tyreSize}$`, "i"),
            ...(fit.brand && { Brand: new RegExp(`^${fit.brand}$`, "i") })
          });
        } catch {
          // skip if failure
        }
      }

      const tyres = queries.length ? await Tyre.find({ $or: queries }) : [];

      return res.json({ multipleMatches: true, variantCount: variants.length,vehicleMake:variants?.[0].make, matchedTyres: tyres });
    }

    // --- SINGLE VARIANT
    const fit = await fetchTyreInfo(vehicleKey);
    const tyres = await Tyre.find({
      SIZE: new RegExp(`^${fit.tyreSize}$`, "i"),
      ...(fit.brand && { Brand: new RegExp(`^${fit.brand}$`, "i") })
    });

    return res.json({ vehicle, fitment: fit, matchedTyres: tyres });

  } catch (err) {
    console.error("Error in searchByRego:", err);
    return res.status(500).json({ error: 'Failed rego lookup' });
  }
};






async function fetchTyreInfo(vehicleKey) {
  const drdResp = await axios.get(`${BASE_URL}/australia/GetDRDFromAUSVehicleKey`, {
    params: { username: USERNAME, securityToken: TOKEN, vehicleKey }
  });

  const drd = drdResp.data.DRDs?.[0];
  const DRChassisID = drd?.DRChassisID;
  const DRModelID = drd?.DRModelID;

  if (!DRChassisID || !DRModelID) {
    throw new Error("DRModelID or DRChassisID missing");
  }

  const fitmentResp = await axios.get(`${BASE_URL}/vehicle-info/GetVehicleDataFromDRD`, {
    params: {
      username: USERNAME,
      securityToken: TOKEN,
      modelID: DRModelID,
      chassisID: DRChassisID
    }
  });

  const tyre = fitmentResp.data.DRDModelReturn?.PrimaryOption || {};
  const tyreSize = tyre?.TyreSize || '';
  const brand = tyre?.Brand || '';
  const [width, rest] = tyreSize.split('/');
  const profile = rest?.split('R')[0];
  const rimSize = rest?.split('R')[1];

  return {
    tyreSize,
    brand,
    width: parseInt(width),
    profile: parseInt(profile),
    rimSize,
    image: tyre?.ImageURL || null
  };
}
