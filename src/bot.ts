import {
    TurnContext, ActivityTypes,
    ConversationState, UserState, RecognizerResult, ActionTypes, Activity, Attachment
} from 'botbuilder';
import { QnAMaker, LuisRecognizer } from 'botbuilder-ai';
import { CardFactory, HeroCard, CardAction, CardImage } from 'botbuilder';
import * as path from 'path';

import { DataParser } from './services/data-parser';
import { ISpeakerSession } from './models/types';
import { createHeroCard, createCarousel } from './helpers/cards';

export class SampleBot {

    constructor(private conversationState: ConversationState,
        private userState: UserState,
        private qnaMaker: QnAMaker,
        private luis: LuisRecognizer) {

    }

    async onTurn(context: TurnContext) {
        if (context.activity.type === ActivityTypes.ConversationUpdate) {
            await this.sendWelcomeMessage(context);
        }
        else if (context.activity.type === ActivityTypes.Message) {
            let qnaResults = await this.qnaMaker.generateAnswer(context.activity.text);
            if (qnaResults.length > 0) {
                await context.sendActivity(qnaResults[0].answer);
            } else {
                const results: RecognizerResult = await this.luis.recognize(context);
                console.log(results);
                var topIntent: string = LuisRecognizer.topIntent(results,"", 0.6);
                switch (topIntent) {
                    case "Greeting":
                        await context.sendActivity("Hi, How can I help you?");
                        break;
                    case "Speaker":
                    case "Topic":
                        var reply = this.getTopicResponse(results.entities, topIntent);
                        await context.sendActivity(reply);
                        break;
                    case "Location":
                    case "Time":
                    default:
                        await context.sendActivity(`Not able to handle ${topIntent}`);
                        break;
                }
            }
        } else {
            await context.sendActivity(`${context.activity.type} event detected`);
        }
    }

    private getTopicResponse(entities: any, topIntent:string): any {
        var data: ISpeakerSession[] = DataParser.getTopicData(entities);
        let reply: Partial<Activity>;
        if (data.length === 1) {
            reply = { type: ActivityTypes.Message, attachments: [createHeroCard(data[0], topIntent)] }
        } else {
            reply= createCarousel(data, topIntent);
        }
        return reply;
    }

    async sendWelcomeMessage(context: TurnContext) {

        let activity = context.activity;
        //If users joined
        if (activity.membersAdded) {
            for (let idx in activity.membersAdded) {
                if (activity.membersAdded[idx].id != activity.recipient.id) {
                    await context.sendActivity(`Welcome to Synergetics bot`);
                }
            }
        }
    }

}