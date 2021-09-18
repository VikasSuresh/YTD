const mongoose=require('mongoose');

const schema = new mongoose.Schema({
    status:{
        type:"String",
        enum:[
            'Started', 'Cancelled', 'Completed','Errored'
        ],
        index:true,
        required:true
    },
    fileLocation:{
        type:"String",
        default:"/files"
    },
    url:{
        type:"String",
        index:true,
        required:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Job",schema);