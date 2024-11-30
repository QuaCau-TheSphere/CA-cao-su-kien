import * as log from "@std/log";
import { fromHtml } from "hast-util-from-html";
import { select } from "hast-util-select";
import { SựKiện } from "../../Code hỗ trợ/Kiểu cho sự kiện.ts";
import { Url } from "../../Code hỗ trợ/Kiểu cho URL.ts";

interface VậtThểSựKiệnRaw {
  "__typename": string;
  "id": string;
  "dateTime": string;
  "isAttending": string;
  "group": {
    "__typename": string;
    "urlname": string;
    "__ref": string;
  };
  "rsvpState": string;
  "series": Record<string, any>;
  "description": string;
  "eventType": string;
  "eventUrl": string;
  "featuredEventPhoto": string;
  "feeSettings": string;
  "isOnline": boolean;
  "isSaved": boolean;
  "covidPrecautions": {
    "__typename": string;
    "venueType": null;
  };
  "maxTickets": string;
  "rsvps": {
    "__typename": string;
    "totalCount": number;
  };
  "title": string;
  "venue": string;
  "socialLabels": [];
}

interface SựKiệnRaw {
  "__typename": string;
  "id": string;
  "token": string;
  "title": string;
  "description": string;
  "eventUrl": string;
  "status": string;
  "eventType": string;
  "featuredEventPhoto": {
    "__typename": string;
    "id": string;
    "source": string;
    "baseUrl": "https://secure-content.meetupstatic.com/images/classic-events/";
  };
  "eventHosts": [
    {
      "__typename": string;
      "memberId": "310198398";
    },
  ];
  "dateTime": string;
  "endTime": string;
  "isFeatured": false;
  "venue": {
    "__typename": string;
    "id": string;
    "name": string;
    "address": string;
    "city": string;
    "state": string;
    "country": string;
    "lat": number;
    "lng": number;
  };
  "maxTickets": number;
  "series": null;
  "rsvps": {
    "__typename": string;
    "totalCount": number;
  };
  "rsvpState": string;
  "waitlistMode": string;
  "guestsAllowed": false;
  "numberOfAllowedGuests": number;
  "proCompleteRsvp": null;
  "topics": {
    "__typename": string;
    "edges": {
      "__typename": string;
      "node": {
        "__typename": string;
        "id": string;
        "name": string;
      };
    }[];
  };
  "rsvpSurveySettings": null;
  "rsvpQuestions": [];
  "rsvp": null;
  "rsvpSettings": {
    "__typename": string;
    "rsvpOpenTime": null;
    "rsvpCloseTime": null;
  };
  "covidPrecautions": {
    "__typename": string;
    "masks": null;
    "vaccinations": null;
    "details": null;
    "venueType": null;
  };
  "isNetworkEvent": false;
  "hosts": {
    "__typename": string;
    "id": string;
    "name": string;
    "memberPhoto": {
      "__typename": string;
      "baseUrl": string;
      "id": string;
    };
  }[];
  "feeSettings": null;
  "networkEvent": null;
  "speakerDetails": null;
  "group": {
    "__typename": string;
    "id": string;
    "name": string;
    "isPrivate": false;
    "timezone": string;
    "link": string;
    "joinMode": string;
    "membershipMetadata": null;
    "topicCategory": {
      "__typename": string;
      "id": string;
      "urlkey": string;
      "name": string;
    }[];
    "topics": {
      "__typename": string;
      "id": string;
      "urlkey": string;
      "name": string;
    }[];
    "urlname": string;
    "country": string;
    "state": string;
    "city": string;
    "needsPhoto": null;
    "proNetwork": null;
    "featuredEvent": null;
    "stats": {
      "__typename": string;
      "memberCounts": {
        "__typename": string;
        "all": number;
      };
    };
    "needsQuestions": null;
    "duesSettings": null;
    "questions": [];
    "sponsors": {
      "__typename": string;
      "edges": [];
    };
    "groupPhoto": {
      "__typename": string;
      "id": string;
      "baseUrl": string;
      "source": string;
    };
    "status": string;
  };
  "sponsoredUntil": null;
  "timezone": string;
  "waiting": number;
  "timeStatus": string;
  "rsvpEventQuestion": null;
  "host": {
    "__typename": string;
    "id": string;
    "name": string;
    "memberPhoto": {
      "__typename": string;
      "baseUrl": string;
      "id": string;
    };
  };
  "currency": string;
}

async function lấyCache(source: Url) {
  let html;
  try {
    html = await Deno.readTextFile("Meetup.html");
  } catch {
    log.info("Cào Meetup");
    html = await (await fetch(source)).text();
    await Deno.writeTextFile("Meetup.html", html);
  }

  return html;
}

async function lấyDsUrl(source: Url) {
  const html = await lấyCache(source);
  const tree = fromHtml(html, { fragment: true });
  try {
    const elementChứaSựKiện = select("#__NEXT_DATA__", tree)!.children[0].value;
    const vậtThểChứaDsSựKiệnRaw = JSON.parse(elementChứaSựKiện!)["props"]["pageProps"]["__APOLLO_STATE__"] as VậtThểSựKiệnRaw;
    return Object.entries(vậtThểChứaDsSựKiệnRaw).flatMap((entry) => {
      const { title, eventUrl } = entry[1];
      return eventUrl && title ? [eventUrl] : [];
    });
  } catch {
    throw new Error("Meetup đã thay đổi cấu trúc website. Cần chỉnh lại code");
  }
}

async function lấySựKiệnRaw(skUrl: Url) {
  const html = await (await fetch(skUrl)).text();
  const tree = fromHtml(html, { fragment: true });
  try {
    const elementChứaSựKiện = select("#__NEXT_DATA__", tree)!.children[0].value;
    return JSON.parse(elementChứaSựKiện!)["props"]["pageProps"]["event"] as SựKiệnRaw;
  } catch {
    throw new Error("Meetup đã thay đổi cấu trúc website. Cần chỉnh lại code");
  }
}

export async function càoMeetup(source: Url): Promise<SựKiện[]> {
  const dsUrl = await lấyDsUrl(source);
  const dsSựKiện: SựKiện[] = [];

  for (const url of dsUrl) {
    const { title, description, eventUrl, venue, featuredEventPhoto, dateTime, endTime } = await lấySựKiệnRaw(url);
    const event = new SựKiện({
      tiêuĐề: title,
      môTả: description,
      địaĐiểm: venue?.address,
      nguồnLấy: eventUrl,
      lúcBắtĐầu: Temporal.Instant.from(dateTime),
      lúcKếtThúc: Temporal.Instant.from(endTime),
      ảnh: featuredEventPhoto?.baseUrl,
    });
    dsSựKiện.push(event);
  }
  return dsSựKiện;
}
