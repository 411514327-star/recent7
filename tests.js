// tests.js：測試都寫在這個檔。一條測試呼叫一次 addCase，格式見 README.md。
// 照 rules.md 規則撰寫，每條規則開頭標「規則 N」。

// ==========================================
// 規則 1：「最近 7 天」是今天，加上今天之前的 7 天，共 8 個日曆天（今天 11/23，就算 11/16～11/23，兩頭都算）
// ==========================================

addCase({
  name: '規則 1：今天的紀錄（11/23）算在範圍內（當天算）',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 }
  ],
  expect: { minutes: 30, count: 1 }
});

addCase({
  name: '規則 1：7 天前的紀錄（11/16）算在範圍內（兩頭都算，共 8 個日曆天）',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: 20 }
  ],
  expect: { minutes: 20, count: 1 }
});

addCase({
  name: '規則 1：8 天前的紀錄（11/15）不算在範圍內',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-15', minutes: 50 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 1：紀錄順序打亂時，仍能正確計算範圍內的分鐘與筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-20', minutes: 15 },
    { log_date: '2026-11-10', minutes: 100 },
    { log_date: '2026-11-23', minutes: 25 },
    { log_date: '2026-11-16', minutes: 10 }
  ],
  expect: { minutes: 50, count: 3 }
});

// ==========================================
// 規則 2：日期比今天晚的（未來）不算，分鐘和筆數都不算
// ==========================================

addCase({
  name: '規則 2：明天的紀錄（比今天晚 1 天的未來日期）不算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-24', minutes: 40 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 2：包含未來日期與今天紀錄時，只算今天，未來的忽略',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-28', minutes: 60 }
  ],
  expect: { minutes: 30, count: 1 }
});

// ==========================================
// 規則 3：沒填分鐘的（null），分鐘當 0，但這筆還是算一筆
// ==========================================

addCase({
  name: '規則 3：沒填分鐘（minutes 為 null），算 1 筆，分鐘當 0',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-20', minutes: null }
  ],
  expect: { minutes: 0, count: 1 }
});

addCase({
  name: '規則 3：minutes 為 null 與正常填寫分鐘的紀錄混合累加',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-20', minutes: null },
    { log_date: '2026-11-21', minutes: 45 }
  ],
  expect: { minutes: 45, count: 2 }
});

addCase({
  name: '規則 3：minutes 為 0 時，算 1 筆，分鐘加 0',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 0 }
  ],
  expect: { minutes: 0, count: 1 }
});

// ==========================================
// 規則 4：同一天有兩筆，分開算兩筆，不合併
// ==========================================

addCase({
  name: '規則 4：同一天有兩筆紀錄，分開算兩筆，分鐘全部累加',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 30 },
    { log_date: '2026-11-22', minutes: 20 }
  ],
  expect: { minutes: 50, count: 2 }
});

addCase({
  name: '規則 4：同一天有兩筆，其中一筆 minutes 為 null，算兩筆且分鐘正確累加',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 30 },
    { log_date: '2026-11-22', minutes: null }
  ],
  expect: { minutes: 30, count: 2 }
});

addCase({
  name: '規則 4：完全重複的紀錄不去重，各自算一筆並累加分鐘',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-21', minutes: 30 },
    { log_date: '2026-11-21', minutes: 30 }
  ],
  expect: { minutes: 60, count: 2 }
});

// ==========================================
// 規則 5：一筆都沒有的時候，回傳 0 分鐘、0 筆
// ==========================================

addCase({
  name: '規則 5：一筆都沒有（records 為空陣列），回傳 0 分鐘、0 筆',
  today: '2026-11-23',
  records: [],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 5：所有紀錄都在範圍之外時，回傳 0 分鐘、0 筆',
  today: '2026-11-23',
  records: [
    { log_date: '2026-01-01', minutes: 60 },
    { log_date: '2025-12-31', minutes: 90 }
  ],
  expect: { minutes: 0, count: 0 }
});

// ==========================================
// 規則 6：我自己的規矩：顯示結果時，日期後面要加星期幾，例如 11/23（一）
// ==========================================

addCase({
  name: '規則 6：紀錄包含星期或額外欄位時，recent7 仍正常統計分鐘與筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30, weekday: '一' }
  ],
  expect: { minutes: 30, count: 1 }
});
