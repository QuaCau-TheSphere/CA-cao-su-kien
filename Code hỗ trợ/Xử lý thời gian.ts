export function tạoĐịnhDạngNgày(thờiĐiểm: Temporal.PlainDate, địnhDang: "DD.MM" | "MM/YYYY" = "DD.MM") {
  const ngày = thờiĐiểm.day;
  const tháng = thờiĐiểm.month;
  const năm = thờiĐiểm.year;
  switch (địnhDang) {
    case "MM/YYYY":
      return `${tháng}/${năm}`;
    default:
      return `${ngày}.${tháng}`;
  }
}
