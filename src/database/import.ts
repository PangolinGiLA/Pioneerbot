import { AppDataSource } from "./data-source";
import { MusicLogger } from "./database";

const fs = require('fs');

let argumentss = process.argv

if (argumentss.length < 3) {
    console.log("Please provide a path to a file to import.")
    process.exit(1)
}

let json = fs.readFileSync(argumentss[2], 'utf8')
let parsed = JSON.parse(json)

AppDataSource.initialize().then(()=>{
    
    for (let guild in parsed) {
        let value = parsed[guild]
        for (let song in value) {
            let songData = value[song]
            MusicLogger.log(song, "<@!692365729009238107>", guild, false, new Date(0))
        }
        
    }

})

