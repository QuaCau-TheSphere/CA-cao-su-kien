[![Cron](https://github.com/QuaCau-TheSphere/meetup-ticketbox-to-google-calendar/actions/workflows/ci.yaml/badge.svg)](https://github.com/QuaCau-TheSphere/meetup-ticketbox-to-google-calendar/actions/workflows/ci.yaml)

## Lấy chứng chỉ Google API


1. `deno task start`
2. Follow the [Set up your environment](https://developers.google.com/calendar/api/quickstart/python#set_up_your_environment "Python quickstart  |  Google Tên lịch  |  Google for Developers") guide, dowload and move the `credentials.json` to this folder
3. Chỉnh `Thiết lập.yaml`


Việc cào trên web là theo cache hôm nay. Việc đẩy lên google calendar là theo cache mới nhất

- [ ] Tự động tạo lịch mới khi ghi thiết lập
- [ ] 

## Cách chương trình hoạt động
Tạo lớp `SựKiện` với các trường sau:
```ts
class SựKiện{
  tiêuĐề: string;
  môTả: string;
  địaĐiểm: string;
  lúcBắtĐầu: Temporal.Instant;
  lúcKếtThúc: Temporal.Instant;
  ảnh?: Url | Url[];
  nguồnLấy: Url;
  tênLịch: TênLịch;
}
```
Khi đẩy lên Google Calendar thì đổi sang cấu trúc
```ts
{
  summary: tiêuĐề,
  description: môTả,
  location: địaĐiểm,
  source: {
    title: tiêuĐề,
    url: nguồnLấy,
  },
  start: {
    dateTime: lúcBắtĐầu.toString({ smallestUnit: "second" }),
    timeZone: "Asia/Ho_Chi_Minh",
  },
  end: {
    dateTime: lúcKếtThúc.toString({ smallestUnit: "second" }),
    timeZone: "Asia/Ho_Chi_Minh",
  },
}
```

## Thiết lập chạy tự động trên GitHub Action
gpg --symmetric --cipher-algo AES256 credentials.json

## Nơi thảo luận
![](https://i.imgur.com/rw1WRu8.png)