import * as fs from 'fs';
import * as path from 'path';
import { ISpeakerSession } from '../models/types';

export class DataParser {

    static getTopicData(entities) {
        let output: ISpeakerSession[] = [];

        let data = fs.readFileSync(path.join(__dirname, "../..", "data", "conf-details.json"));
        let sessionData: ISpeakerSession[] = JSON.parse(data.toString());
        if (entities.subject) {
            entities.subject.forEach(subject => {
                sessionData.forEach(data => {
                    if (data.topic.toLowerCase().includes(subject.toLowerCase())) {
                        output.push(data);
                    }
                });
            });
        } else {
            output = sessionData;
        }
        output= output.length>0?output:sessionData;
        return output;
    }


}