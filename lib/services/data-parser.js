"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class DataParser {
    static getTopicData(entities) {
        let output = [];
        let data = fs.readFileSync(path.join(__dirname, "../..", "data", "conf-details.json"));
        let sessionData = JSON.parse(data.toString());
        if (entities.subject) {
            entities.subject.forEach(subject => {
                sessionData.forEach(data => {
                    if (data.topic.toLowerCase().includes(subject.toLowerCase())) {
                        output.push(data);
                    }
                });
            });
        }
        else {
            output = sessionData;
        }
        output = output.length > 0 ? output : sessionData;
        return output;
    }
}
exports.DataParser = DataParser;
//# sourceMappingURL=data-parser.js.map