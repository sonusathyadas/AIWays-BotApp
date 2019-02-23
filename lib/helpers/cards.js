"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const path = require("path");
function createCarousel(sessions, topIntent) {
    const heroCards = [];
    for (let i = 0; i < sessions.length; i++) {
        heroCards.push(createHeroCard(sessions[i], topIntent));
    }
    return botbuilder_1.MessageFactory.carousel(heroCards);
}
exports.createCarousel = createCarousel;
function createHeroCard(sessionInfo, topIntent) {
    return botbuilder_1.CardFactory.heroCard(sessionInfo.topic, botbuilder_1.CardFactory.images([{ alt: sessionInfo.speaker.name, url: path.join(__dirname, "../..", sessionInfo.speaker.image) }]), botbuilder_1.CardFactory.actions([
        { type: botbuilder_1.ActionTypes.OpenUrl, title: "Read more...", value: "http://www.synergetics-india.com" }
    ]), {
        text: `Speaker:${sessionInfo.speaker.name}
                  Starts at : ${sessionInfo.startTime}
                  Ends at :${sessionInfo.endTime}
                  ${sessionInfo.description}
                `
    });
}
exports.createHeroCard = createHeroCard;
//# sourceMappingURL=cards.js.map