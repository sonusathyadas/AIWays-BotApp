
export interface ISpeakerInfo{
    name:string;
    image:string;
    area:string
}

export interface ISpeakerSession{
    topic:string;
    startTime:Date;
    endTime:Date;
    description:string;
    speaker:ISpeakerInfo;
}