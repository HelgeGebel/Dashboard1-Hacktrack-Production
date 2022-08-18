import { Pipe, PipeTransform } from '@angular/core';
import { first } from 'rxjs';
import { EventMeasures } from "../../models/interfaces/EventMeasures";
import { average } from '../shared/average';
import { standardDeviation } from '../shared/standardDeviation';
import { Session } from "../../models/interfaces/EventMeasures";
import { isNotNullArray } from '../shared/nullCheckList';

@Pipe({
  name: 'eventMeasuresPipe'
})
export class EventMeasuresPipe implements PipeTransform {

  transform(eventMeasures: EventMeasures): any {

    let SatisfactionInput = {
      avg: 0,
      sd: 0
    }

    let SessionInput = [
      {
        "name": "Pre-event webinar",
        "series": [
          {
            "name": "enjoyable",
            "value": 0 as number | null
          },
          {
            "name": "satisfied",
            "value": 0 as number | null
          },
          {
            "name": "useful",
            "value": 0 as number | null
          }
        ]
      },
      {
        "name": "Checkpoints",
        "series": [
          {
            "name": "enjoyable",
            "value": 0 as number | null
          },
          {
            "name": "satisfied",
            "value": 0 as number | null
          },
          {
            "name": "useful",
            "value": 0 as number | null
          }
        ]
      },
      {
        "name": "Mentoring sessions",
        "series": [
          {
            "name": "enjoyable",
            "value": 0 as number | null
          },
          {
            "name": "satisfied",
            "value": 0 as number | null
          },
          {
            "name": "useful",
            "value": 0 as number | null
          }
        ]
      }
    ];

    let FutureInput = [
      {
        "name": "Definitely not",
        "value": 0
      },
      {
        "name": "Probably not",
        "value": 0
      },
      {
        "name": "Probably yes",
        "value": 0
      },
      {
        "name": "Definitely yes",
        "value": 0
      },
      {
        "name": "Might or Might not",
        "value": 0
      }
    ];

    let  helpAverageList:any[]  = [];
    let  helpSdList: any[] = [];

    for(const secondSet of Object.entries(eventMeasures.SatisfactionWithHackathon) as any[]){
      if ((secondSet[1] as []).length !== 0 && isNotNullArray(secondSet[1])){
        helpAverageList.push(average(secondSet[1].filter((value:any) => value !== null)));
        helpSdList.push(standardDeviation(secondSet[1].filter((value:any) => value !== null)));
      }
    }
    if (helpAverageList.length !== 0) {
      SatisfactionInput = {
        avg : Math.round((average(helpAverageList) + 1 + Number.EPSILON) * 100) / 100,
        sd: Math.round((average(helpSdList) + Number.EPSILON) * 100) / 100
      };
    } else {
      SatisfactionInput = {} as {avg: number, sd: number};
    }

    // // for SatisfactionInput transform
    // if (isNotNullArray(eventMeasures.SatisfactionWithHackathon.Satisfaction)) {
    //   for(let entry of eventMeasures.SatisfactionWithHackathon.Satisfaction.filter(value => value !== null)) {
    //     SatisfactionInput[0].series[entry].value = SatisfactionInput[0].series[entry].value + 1;
    //   }
    // } else {
    //   SatisfactionInput.splice(SatisfactionInput.findIndex(item => item.name === '(1) Very dissatisfied to (5) Very satisfied'), 1);
    // } //  Satisfaction
    //
    // if (isNotNullArray(eventMeasures.SatisfactionWithHackathon.Pleasure)) {
    //   for(let entry of eventMeasures.SatisfactionWithHackathon.Pleasure.filter(value => value !== null)) {
    //     SatisfactionInput[1].series[entry].value = SatisfactionInput[1].series[entry].value + 1;
    //   }
    // } else {
    //   SatisfactionInput.splice(SatisfactionInput.findIndex(item => item.name === '(1) Very displeased to (5) Very pleased'), 1);
    // } // Pleasure
    //
    // if (isNotNullArray(eventMeasures.SatisfactionWithHackathon.Contended)) {
    //   for(let entry of eventMeasures.SatisfactionWithHackathon.Contended.filter(value => value !== null)) {
    //     SatisfactionInput[2].series[entry].value = SatisfactionInput[2].series[entry].value + 1;
    //   }
    // } else {
    //   SatisfactionInput.splice(SatisfactionInput.findIndex(item => item.name === '(1) Very frustrated to (5) Very contented'), 1);
    // } // Contented
    //
    // if (isNotNullArray(eventMeasures.SatisfactionWithHackathon.Delighted)) {
    //   for(let entry of eventMeasures.SatisfactionWithHackathon.Delighted.filter(value => value !== null)) {
    //     SatisfactionInput[3].series[entry].value = SatisfactionInput[3].series[entry].value + 1;
    //   }
    // } else {
    //   SatisfactionInput.splice(SatisfactionInput.findIndex(item => item.name === '(1) Absolutely terrible to (5) Absolutely delighted'), 1);
    // } // Delighted

    if (isNotNullArray(eventMeasures.FutureParticipationIntentions)) {
      // for future transform
      for(let entry of eventMeasures.FutureParticipationIntentions.filter(value => value !== null)) {
        if (entry !== null && entry !== undefined) FutureInput[entry].value = FutureInput[entry].value + 1;
      }
    } else {
      FutureInput = new Array();
    }

    // for session transform
    let PreEventHelper = 0;
    let CheckPointsHelper = 0;
    let MentoringHelper = 0;
    let NullChecker = true;
    let NotNullEntryAmount = 0;

    //TODO: Hier auf nulls checken!

    for(let entry of eventMeasures.SessionEnjoyment) {
      if(entry.PreEventWebinar !== null && entry.Checkpoints !== null && entry.MentoringSessions !== null){
        PreEventHelper += entry.PreEventWebinar;
        CheckPointsHelper += entry.Checkpoints;
        MentoringHelper += entry.MentoringSessions;
        NotNullEntryAmount = NotNullEntryAmount + 1;
        NullChecker = false;
      }
    }

    if (NullChecker) {
      SessionInput[0].series.splice(SessionInput[0].series.findIndex(value => value.name === 'enjoyable', 1));
      SessionInput[1].series.splice(SessionInput[0].series.findIndex(value => value.name === 'enjoyable', 1));
      SessionInput[2].series.splice(SessionInput[0].series.findIndex(value => value.name === 'enjoyable', 1));
    } else {
      SessionInput[0].series[0].value = PreEventHelper/NotNullEntryAmount;
      SessionInput[1].series[0].value = CheckPointsHelper/NotNullEntryAmount;
      SessionInput[2].series[0].value = MentoringHelper/NotNullEntryAmount;
    }

    PreEventHelper = 0;
    CheckPointsHelper = 0;
    MentoringHelper = 0;
    NullChecker = true;
    NotNullEntryAmount = 0;

    for(let entry of eventMeasures.SessionSatisfaction) {
      if(entry.PreEventWebinar !== null && entry.Checkpoints !== null && entry.MentoringSessions !== null){
        PreEventHelper += entry.PreEventWebinar;
        CheckPointsHelper += entry.Checkpoints;
        MentoringHelper += entry.MentoringSessions;
        NotNullEntryAmount = NotNullEntryAmount + 1;
        NullChecker = false;
      }
    }

    if (NullChecker) {
      SessionInput[0].series.splice(SessionInput[0].series.findIndex(value => value.name === 'satisfied', 1));
      SessionInput[1].series.splice(SessionInput[0].series.findIndex(value => value.name === 'satisfied', 1));
      SessionInput[2].series.splice(SessionInput[0].series.findIndex(value => value.name === 'satisfied', 1));
    } else {
      SessionInput[0].series[1].value = PreEventHelper/NotNullEntryAmount;
      SessionInput[1].series[1].value = CheckPointsHelper/NotNullEntryAmount;
      SessionInput[2].series[1].value = MentoringHelper/NotNullEntryAmount;
    }

    PreEventHelper = 0;
    CheckPointsHelper = 0;
    MentoringHelper = 0;
    NullChecker = true;
    NotNullEntryAmount = 0;

    for(let entry of eventMeasures.SessionUsefulness) {
      if(entry.PreEventWebinar !== null && entry.Checkpoints !== null && entry.MentoringSessions !== null){
        PreEventHelper += entry.PreEventWebinar;
        CheckPointsHelper += entry.Checkpoints;
        MentoringHelper += entry.MentoringSessions;
        NotNullEntryAmount = NotNullEntryAmount + 1;
        NullChecker = false;
      }
    }

    if (NullChecker) {
      SessionInput[0].series.splice(SessionInput[0].series.findIndex(value => value.name === 'useful', 1));
      SessionInput[1].series.splice(SessionInput[0].series.findIndex(value => value.name === 'useful', 1));
      SessionInput[2].series.splice(SessionInput[0].series.findIndex(value => value.name === 'useful', 1));
    } else {
      SessionInput[0].series[2].value = PreEventHelper/NotNullEntryAmount;
      SessionInput[1].series[2].value = CheckPointsHelper/NotNullEntryAmount;
      SessionInput[2].series[2].value = MentoringHelper/NotNullEntryAmount;
    }

    NullChecker = true;

    SessionInput.forEach(session => {
      if (session.series.length !== 0) {
        NullChecker = false;
      }
    });
    if (NullChecker) {
      SessionInput = new Array();
    }

    let eventMeasuresInput = {
      SatisfactionInput,
      FutureInput,
      SessionInput
    }

    return eventMeasuresInput;
  }
}
