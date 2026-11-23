function recent7(records, today) {
  let totalMinutes = 0;
  let totalCount = 0;

  if (!records || !Array.isArray(records) || !today) {
    return { minutes: 0, count: 0 };
  }

  // 計算 7 天前的日期字串（今天加上今天之前的 7 天，共 8 個日曆天，兩頭都算）
  const parts = today.split('-').map(Number);
  const targetDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  targetDate.setUTCDate(targetDate.getUTCDate() - 7);

  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getUTCDate()).padStart(2, '0');
  const minDateStr = `${year}-${month}-${day}`;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record || !record.log_date) continue;

    // 比今天晚的不算，比 7 天前早的不算
    if (record.log_date >= minDateStr && record.log_date <= today) {
      totalCount += 1;
      if (typeof record.minutes === 'number' && !isNaN(record.minutes)) {
        totalMinutes += record.minutes;
      }
    }
  }

  return {
    minutes: totalMinutes,
    count: totalCount
  };
}
