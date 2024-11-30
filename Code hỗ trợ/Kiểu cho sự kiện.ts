import { Url } from "./Kiểu cho URL.ts";

interface NewType {
  dateTime: string;
  timeZone: string;
}

export interface SựKiện {
  tiêuĐề: string;
  môTả: string;
  địaĐiểm: string;
  lúcBắtĐầu: Temporal.Instant;
  lúcKếtThúc: Temporal.Instant;
  ảnh?: Url | Url[];
  nguồnLấy: Url;
}

export class SựKiện {
  constructor({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh }: SựKiện) {
    this.tiêuĐề = tiêuĐề;
    this.môTả = môTả;
    this.địaĐiểm = địaĐiểm;
    this.nguồnLấy = nguồnLấy;
    this.ảnh = ảnh;

    this.lúcBắtĐầu = lúcBắtĐầu;
    this.lúcKếtThúc = lúcKếtThúc;
  }
}

export class GCalEvent {
  summary: string;
  description: string;
  location: string;
  source: { title: string; url: string };
  start?: NewType;
  end?: NewType;

  constructor({ tiêuĐề, môTả, địaĐiểm, url, lúcBắtĐầu, lúcKếtThúc }: SựKiện) {
    this.summary = tiêuĐề;
    this.description = môTả;
    this.location = địaĐiểm;
    this.source = {
      title: url,
      url: url,
    };

    this.start = {
      dateTime: format(lúcBắtĐầu, "yyyy-MM-dd'T'HH:mm:ss"),
      timeZone: "Asia/Ho_Chi_Minh",
    };
    this.end = {
      dateTime: format(lúcKếtThúc, "yyyy-MM-dd'T'HH:mm:ss"),
      timeZone: "Asia/Ho_Chi_Minh",
    };
  }
}
