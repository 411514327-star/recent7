// recent7-quick.js：對照用。只用一句話請 AI 寫的版本放這裡。
// 函式名稱一樣叫 recent7，輸入、輸出的格式跟 recent7.js 一樣（見 README.md）。

function recent7(records, today) {
  let minutes = 0;
  let count = 0;

  if (!Array.isArray(records)) {
    return { minutes, count };
  }

  const todayDate = new Date(today);
  const msPerDay = 24 * 60 * 60 * 1000;

  for (const record of records) {
    if (!record || !record.log_date) continue;

    const recordDate = new Date(record.log_date);
    const diffDays = Math.round((todayDate - recordDate) / msPerDay);

    // 最近 7 天：今天（0 天前）到 6 天前
    if (diffDays >= 0 && diffDays < 7) {
      count++;
      if (typeof record.minutes === 'number') {
        minutes += record.minutes;
      }
    }
  }

  return { minutes, count };
}
