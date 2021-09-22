const Queue = require('bull');
const fs = require('fs');
const ytdl = require('ytdl-core');
const uuid = require('uuid').v4;
const mongoose= require('mongoose');

module.exports = () =>{
    const Job = mongoose.model('Job');

    const videoQueue = new Queue('video transcoding', {
        redis: {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_URL
        }
    });

    videoQueue.process(async(job,done)=>{
        const randomFileId = uuid();
        const fileName =  `./files/${randomFileId}.mp4`;
        const data = job.data;
        try {
            job.progress(0)
            global.io.emit('progress',{ progress: 0, jobId: data.id })
    
            const promise = new Promise((resolve,reject)=>{
                ytdl(data.url).on("progress",(length,downloaded,totalLength)=>{
                    const progress = (downloaded / totalLength) * 100;
                    if(progress>=49 && progress<=55 ){
                        global.io.emit('progress',{ progress, jobId: data.id })
                    }
                    if(progress>=100){
                        global.io.emit('videoDone', { fileLocation: `${randomFileId}.mp4`, jobId: data.id });
                        global.io.emit('progress', { progress: 100, jobId: data.id });
                    }
                })
                .pipe(fs.createWriteStream(fileName))
                .on('finish',()=>{
                    resolve("Resolved");
                })
                .on('error',(err)=>{
                    reject("Error");
                })  
            })

            

            promise.then(async ()=>{
                await Job.findOneAndUpdate({_id:mongoose.mongo.ObjectId(data.id)},{
                    status: 'Completed',
                    fileLocation: fileName,
                },{upsert:false})
        
            }).catch(async (error)=> {
                await err(Job,data.id,fileName)
            })
            
            done();    
        } catch (error) {
            await err(Job,data.id,fileName)
        }
    });

    return videoQueue;
}

const err = async (Job, id,fileName) =>{
    try {
        await Job.findOneAndUpdate({_id:mongoose.mongo.ObjectId(id)},{
            status: 'Errored',
            fileLocation: fileName,
        },{upsert:false})
    } catch (error) {
        console.log(error)
    }
}