const enquiry = require('../../../models/Enquire')


module.exports.addEnquiryUmraha = async (req,res)=>{
    try {

        const {name,email,mobile,Category,date,nationality,message} = req.body
      
        const alreadyEnquiryUmraha = await enquiry.findOne({ mobile });

        if (alreadyEnquiryUmraha) {
            return res.status(400).json({ message: 'This mobile number has already been used for an enquiry. Please choose another number.' });
        }
        const newEnquiryUmraha = new enquiry({
            name,
            email,
            mobile,
            Category,
            date,
            nationality,
            message
        });

        await newEnquiryUmraha.save();

        res.status(201).json({ message: 'Enquiry Umraha added successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the enquiry.' });
    }
    
}

module.exports.getEnquiryUmraha = async (req, res) => {
    try {
        const EnquireData = await enquiry.find();
        console.log(EnquireData);
        res.status(200).json({
            success: true,
            results: EnquireData,
        });
    } catch (error) {
        console.log("EnquireData Error",error);
        
    }
}