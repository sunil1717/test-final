const ServiceArea = require('../models/ServiceArea');

// Check if a postcode is serviceable
exports.checkServiceArea = async (req, res) => {
  const { postcode, suburb } = req.body;

  if (!postcode || !suburb) {
    return res.status(400).json({ error: 'Postcode and suburb are required' });
  }

   
  

  try {
    const exists = await ServiceArea.findOne({
      postcode,
      suburb: { $regex: new RegExp(`^${suburb}$`, 'i') }
    
    });

    if (exists) {
      return res.json({ isServiceable: true });
    } else {
      return res.json({ isServiceable: false });
    }
  } catch (err) {
    console.error('Error checking service area:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Admin: View all serviceable postcodes
exports.getServiceAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find().sort({ postcode: 1, suburb: 1 });
    const formatted = areas.map(area => `${area.postcode},${area.suburb}`);
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching service areas:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Admin: Add a new serviceable postcode
exports.addServiceArea = async (req, res) => {
  const { postcode, suburb } = req.body;

  if (!postcode || !suburb) {
    return res.status(400).json({ error: 'Postcode and suburb are required' });
  }

  const exists = await ServiceArea.findOne({ postcode, suburb });
  if (exists) return res.status(400).json({ error: 'Service area already exists' });

  const newArea = new ServiceArea({ postcode, suburb });
  await newArea.save();

  res.status(201).json({ message: 'Service area added', area: newArea });
};

// Admin: Remove a serviceable postcode
exports.removeServiceArea = async (req, res) => {
  const { postcode, suburb } = req.body;

  if (!postcode || !suburb) {
    return res.status(400).json({ error: 'Postcode and suburb are required' });
  }

  const deleted = await ServiceArea.findOneAndDelete({ postcode, suburb });
  if (!deleted) {
    return res.status(404).json({ error: 'Service area not found' });
  }

  res.json({ message: 'Service area removed', area: deleted });
};

