const enquiry = require('../../../models/EnquiryForVisa')


module.exports.addEnquiryVisa = async (req,res)=>{
    try {
        const {name,Email,mobileNumber,visaCategory,dateOfTravel,nationality,message} = req.body

      
        const alreadyEnquiryvisa = await enquiry.findOne({ mobileNumber });

        if (alreadyEnquiryvisa) {
            // If the mobile number already exists, send an error message to the client
            return res.status(400).json({ message: 'This mobile number has already been used for an enquiry. Please choose another number.' });
        }
        const newEnquiryVisa = new enquiry({
            name,
            Email,
            mobileNumber,
            visaCategory,
            dateOfTravel,
            nationality,
            message
        });

        await newEnquiryVisa.save();

        // Send a success response
        res.status(201).json({ message: 'Enquiry Visa added successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the enquiry.' });
    }
    
}


// Get all visa enquiries
module.exports.getEnquiryVisa = async (req, res) => {
    try {
      const getAllEnquiryVisa = await enquiry.find({})
      res.status(200).json({ message: 'Retrieved all visa enquiries successfully.', data: getAllEnquiryVisa });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while retrieving enquiries.' });
    }
  };