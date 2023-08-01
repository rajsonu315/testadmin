const paymentmodel = require('../model/PaymentModel')

const csv = require('csvtojson');
const fs = require('fs');
const csvParser = require('csv-parser');
const { Op } = require('sequelize');
const batchSize = 90000; // Set the desired batch size

const jwt_token = require('jsonwebtoken')

const jwt_security = "sorrybabu"


const paymentadd= (req , res, next)=>{
    res.render("./payment/addPayment",{ msg: req.flash('info')[0] })
}

const dashboard = async (req, res, next) => {


    try {


        const paymentCount = await paymentmodel.count();
        const successfulPaymentCount = await paymentmodel.count({
            where: {
                Status: true, 
            },
        });
        const unsuccessfulPaymentCount = await paymentmodel.count({
            where: {
                Status: false,
            },
        });

        console.log(`Number of all payments: ${paymentCount}`);
        console.log(`Number of successful payments: ${successfulPaymentCount}`);
        console.log(`Number of unsuccessful payments: ${unsuccessfulPaymentCount}`);


        if (req.session.user) {
            const user = req.session.user.Username;
            console.log("user name", user);
            res.render('index', {
                success: successfulPaymentCount,
                unsuccessful: unsuccessfulPaymentCount,
                user: user,
                msg: req.flash('info')
            });
        } else {
            // User is not logged in, redirect to the login page
            res.redirect('/login');
        }


    } catch (error) {
        console.error('Error counting payments:', error);
    }



}




const PaymentImoprtCSV = async (req, res, next) => {

    try {

        // Function to process and insert a batch of rows into the database
        async function processBatch(batch) {
            // Perform any necessary data transformations or validations on the batch

            // Use Sequelize bulkCreate to insert the data in a single transaction
            await paymentmodel.bulkCreate(batch);

            console.log("success");

        }

        async function importCSV(filePath) {
            let batch = [];
            let rowCount = 0;

            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', async (row) => {
                    // Process each row here (transform data, validate, etc.)
                    // and add it to the batch array

                    batch.push(row);
                    rowCount++;

                    // Check if the batch size is reached, then process and insert the batch
                    if (batch.length >= batchSize) {
                        await processBatch(batch);
                        batch = []; // Reset the batch array after processing
                        console.log(`Processed ${rowCount} rows.`);
                    }
                })
                .on('end', async () => {
                    // Process the remaining rows in the last batch
                    if (batch.length > 0) {
                        await processBatch(batch);
                        console.log(`Processed ${rowCount} rows.`);
                    }

                    res.status(200).send({ mesage: "success" })
                    console.log('CSV import completed.');
                });
        }

        // Usage
        const filePath = req.file.path;
        importCSV(filePath);



        // var userdata = [];
        // csv()
        //     .fromFile(req.file.path)
        //     .then(async (response) => {
        //         for (let i = 0; i < response.length; i++) {
        //             userdata.push({
        //                 firstName: response[i].firstName,
        //                 lastName: response[i].lastName,
        //                 Mobile: response[i].Mobile,

        //             })

        //         }

        //         await paymentmodel.bulkCreate(userdata);
        //         console.log("PaymentImoprtCSV");

        //         res.status(200).send({ status: true, message: "data successfull import" });


        //     });



    } catch (error) {

        console.log(error);

    }

}



const PaymentCreate = async (req, res, next) => {

    try {
        const { firstName, Mobile, UPI_NO, Amount } = req.body;
        // Check if the mobile number is already registered in the database.
        const mobileNumberCheck = await paymentmodel.findOne({
            where: {
                Mobile: {
                    [Op.eq]: Mobile,
                },
            },
        });

        if (mobileNumberCheck) {
            

         req.flash('info', 'Your mobile number is already registered')
            res.redirect("addPayment")
             
        }else{
            const Cpayment = new paymentmodel({
                firstName: firstName,
                user_id: '1255',
                Mobile: Mobile,
                UPI_NO: UPI_NO,
                Amount: Amount,
                Token: '',
                Status: true
            });
    
            const result = await Cpayment.save();
    
            // If you want to generate a JWT token, you can uncomment the following code.
            // const tokenCreate = jwt.sign({ result }, jwt_security);
            // console.log(tokenCreate);
    
            res.redirect("./SuccessPayment");
        }



    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while processing the payment.");
    }
};



const PaymentSuccess = async (req, res, next) => {



    try {

        console.log("date post", req.query);


        const queryString = req.query;

        // Create a new URLSearchParams object with the queryString
        const params = new URLSearchParams(queryString);

        // Convert the URLSearchParams object to a regular object
        const dateRangeObject = {};
        params.forEach((value, key) => {
            dateRangeObject[key] = value;
        });

        //console.log(dateRangeObject);



        let startDate = '';
        let endDate = '';

        if (req.query.startDate && req.query.endDate) {
            startDate = new Date(req.query.startDate);
            endDate = new Date(req.query.endDate);
        }

        let searchQuery = '';

        if (req.query.Search) {
            searchQuery = req.query.Search;
        }

        // const result = await paymentmodel.findAll({
        //   where: {
        //     [Op.or]: [
        //       { Mobile: { [Op.like]: `%${searchQuery}%` } },
        //       { Amount: { [Op.like]: `%${searchQuery}%` } },
        //       { firstName: { [Op.like]: `%${searchQuery}%` } },
        //     ],
        //     //createdAt: startDate && endDate ? { [Op.between]: [startDate, endDate] } : {},

        //   },
        // });
        //res.status(200).send(result)



        const whereCondition = {


            [Op.or]: [
                { Mobile: { [Op.like]: `%${searchQuery}%` } },
                { Amount: { [Op.like]: `%${searchQuery}%` } },
                { user_id: { [Op.like]: `%${searchQuery}%` } },
                { UPI_NO: { [Op.like]: `%${searchQuery}%` } },
                { firstName: { [Op.like]: `%${searchQuery}%` } },

            ],

        };


        if (startDate && endDate) {
            whereCondition.createdAt = { [Op.between]: [startDate, endDate] };
        }
        const orderOption = [['createdAt', 'DESC']];


        const result = await paymentmodel.findAll({

            limit: 5,
            where: whereCondition,
            order: orderOption,


        });


        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const isoDateTimeString = element.createdAt;
            const dateObject = new Date(isoDateTimeString);

            // console.log(dateObject);
            // console.log(element.dataValues.createdAt);
        }


        res.render('payment/SuccessPayment', { patmentData: result });

    } catch (error) {

        console.log(error);

    }



}

const FailPayment = async (req, res, next) => {



    try {


        let startDate = '';
        let endDate = '';

        if (req.query.startDate && req.query.endDate) {
            startDate = new Date(req.query.startDate);
            endDate = new Date(req.query.endDate);
        }

        let searchQuery = '';

        if (req.query.Search) {
            searchQuery = req.query.Search;
        }

        // const result = await paymentmodel.findAll({
        //   where: {
        //     [Op.or]: [
        //       { Mobile: { [Op.like]: `%${searchQuery}%` } },
        //       { Amount: { [Op.like]: `%${searchQuery}%` } },
        //       { firstName: { [Op.like]: `%${searchQuery}%` } },
        //     ],
        //     //createdAt: startDate && endDate ? { [Op.between]: [startDate, endDate] } : {},

        //   },
        // });
        //res.status(200).send(result)



        const whereCondition = {


            [Op.or]: [
                { Mobile: { [Op.like]: `%${searchQuery}%` } },
                { Amount: { [Op.like]: `%${searchQuery}%` } },
                { user_id: { [Op.like]: `%${searchQuery}%` } },
                { UPI_NO: { [Op.like]: `%${searchQuery}%` } },
                { firstName: { [Op.like]: `%${searchQuery}%` } },

            ],

        };


        if (startDate && endDate) {
            whereCondition.createdAt = { [Op.between]: [startDate, endDate] };
        }
        const orderOption = [['createdAt', 'DESC']];


        const result = await paymentmodel.findAll({

            limit: 5,
            where: whereCondition,
            order: orderOption,


        });


        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const isoDateTimeString = element.createdAt;
            const dateObject = new Date(isoDateTimeString);

            // console.log(dateObject);
            // console.log(element.dataValues.createdAt);
        }


        res.render('payment/FailPayment', { patmentData: result });

    } catch (error) {

        console.log(error);

    }



}

module.exports = { PaymentCreate, PaymentSuccess, PaymentImoprtCSV, FailPayment, dashboard,paymentadd }