const mongoose = require('mongoose');
const path = require('path');
const ytdl = require('ytdl-core');
const { Queue } = require('../../helpers');
const Joi = require('Joi');

const Schema = Joi.object({
    url: Joi.string().required()
}).required()


const Post =  async (req,res,next)=>{
    try {
        const
        {
            error,
            value:{
                url
            }
        } = Schema.validate(req.body)

        if (error) return res.status(400).send('400 Bad Request!');

        if(!ytdl.validateURL(url)) return res.status(404).send("Invalid URL!");

        const Job = mongoose.model('Job');

        const exist =  await Job.findOne({
            url,
        }).lean();

        if(exist){
            if(exist.status === 'Completed'){
                return res.status(200).download(path.resolve(process.cwd(),exist.fileLocation));
            }
        
            return res.status(403).send("Processing the File!");
        }

        const data = new Job({
            url,
            status:"Started"
        })

        await data.save();

        await Queue().add({ url, id: data._id })

        return res.status(200).send("Job Created")

    } catch (error) {
        return next(error)
    }
};
module.exports = Post