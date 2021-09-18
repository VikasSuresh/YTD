const mongoose = require('mongoose');
const path = require('path');
const Joi = require('Joi');

const Schema = Joi.object({
    fileId: Joi.string().hex().length(24).required()
}).required()

const Get = async(req,res,next)=>{
  try {
    const
    {
        error,
        value:{
            fileId
        }
    } = Schema.validate(req.params)

    if (error) return res.status(400).send('400 Bad Request!');

    const Job = mongoose.model('Job').lean();

    const data = await Job.findOne({_id:mongoose.mongo.ObjectId(fileId)}).lean();

    if(data.status === 'Completed'){
        return res.status(200).download(path.resolve(process.cwd(),data.fileLocation));
    }

    return res.status(403).send("File Not Processed Yet!");
  } catch (error) {
        return next(error)
  }
};

module.exports = Get
