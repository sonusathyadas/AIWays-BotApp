"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_ai_1 = require("botbuilder-ai");
const data_parser_1 = require("./services/data-parser");
const cards_1 = require("./helpers/cards");
class SampleBot {
    constructor(conversationState, userState, qnaMaker, luis) {
        this.conversationState = conversationState;
        this.userState = userState;
        this.qnaMaker = qnaMaker;
        this.luis = luis;
    }
    onTurn(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.type === botbuilder_1.ActivityTypes.ConversationUpdate) {
                yield this.sendWelcomeMessage(context);
            }
            else if (context.activity.type === botbuilder_1.ActivityTypes.Message) {
                let qnaResults = yield this.qnaMaker.generateAnswer(context.activity.text);
                if (qnaResults.length > 0) {
                    yield context.sendActivity(qnaResults[0].answer);
                }
                else {
                    const results = yield this.luis.recognize(context);
                    console.log(results);
                    var topIntent = botbuilder_ai_1.LuisRecognizer.topIntent(results, "", 0.6);
                    switch (topIntent) {
                        case "Greeting":
                            yield context.sendActivity("Hi, How can I help you?");
                            break;
                        case "Speaker":
                        case "Topic":
                            var reply = this.getTopicResponse(results.entities, topIntent);
                            yield context.sendActivity(reply);
                            break;
                        case "Location":
                        case "Time":
                        default:
                            yield context.sendActivity(`Not able to handle ${topIntent}`);
                            break;
                    }
                }
            }
            else {
                yield context.sendActivity(`${context.activity.type} event detected`);
            }
        });
    }
    getTopicResponse(entities, topIntent) {
        var data = data_parser_1.DataParser.getTopicData(entities);
        let reply;
        if (data.length === 1) {
            reply = { type: botbuilder_1.ActivityTypes.Message, attachments: [cards_1.createHeroCard(data[0], topIntent)] };
        }
        else {
            reply = cards_1.createCarousel(data, topIntent);
        }
        return reply;
    }
    sendWelcomeMessage(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let activity = context.activity;
            if (activity.membersAdded) {
                for (let idx in activity.membersAdded) {
                    if (activity.membersAdded[idx].id != activity.recipient.id) {
                        yield context.sendActivity(`Welcome to Synergetics bot`);
                    }
                }
            }
        });
    }
}
exports.SampleBot = SampleBot;
//# sourceMappingURL=bot.js.map