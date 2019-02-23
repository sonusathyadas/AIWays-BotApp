import { Activity, Attachment, CardFactory, ActionTypes, HeroCard, MessageFactory } from "botbuilder";
import { ISpeakerSession } from "../models/types";
import * as path from "path";

export function createCarousel(sessions:ISpeakerSession[], topIntent:string):Partial<Activity>{
    const heroCards:Attachment[]=[];
    for(let i=0;i<sessions.length;i++){
        heroCards.push(createHeroCard(sessions[i], topIntent))
    }
    return MessageFactory.carousel(heroCards);
}

export function createHeroCard(sessionInfo:ISpeakerSession, topIntent:string):Attachment{
    return CardFactory.heroCard(
        sessionInfo.topic,
        CardFactory.images([{ alt:sessionInfo.speaker.name, url: path.join(__dirname,"../..", sessionInfo.speaker.image) }]),
        CardFactory.actions([
            { type:ActionTypes.OpenUrl, title:"Read more...", value:"http://www.synergetics-india.com"}
        ]),
        {
            text:`Speaker:${sessionInfo.speaker.name}
                  Starts at : ${sessionInfo.startTime}
                  Ends at :${sessionInfo.endTime}
                  ${sessionInfo.description}
                `
        }
    )
}