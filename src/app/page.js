'use client';

import { useEffect, useState } from "react";

// 1. 시간별 주가 데이터 (불규칙 시점 포함)
const stockTimeline = {
  "00:00": { "옹심테크": 0, "공주뷰티": 0, "쓰껄엔터": 0, "선명전자": 0, "아가랑 생명": 0 },
  "14:30": { "옹심테크": 500, "공주뷰티": 500, "쓰껄엔터": 500, "선명전자": 500, "아가랑 생명": 500 },  
  "14:35": { "옹심테크": 1000, "공주뷰티": 1500, "쓰껄엔터": 1500, "선명전자": 1500, "아가랑 생명": 2000 },
  "16:15": { "옹심테크": 1000, "공주뷰티": 1500, "쓰껄엔터": 1500, "선명전자": 1500, "아가랑 생명": 2000 },
  "16:20": { "옹심테크": 1000, "공주뷰티": 1700, "쓰껄엔터": 1500, "선명전자": 1500, "아가랑 생명": 2300 },
  "16:25": { "옹심테크": 1200, "공주뷰티": 1700, "쓰껄엔터": 1300, "선명전자": 1800, "아가랑 생명": 2300 },
  "16:30": { "옹심테크": 1400, "공주뷰티": 1700, "쓰껄엔터": 1300, "선명전자": 2200, "아가랑 생명": 2800 },
  "16:35": { "옹심테크": 1400, "공주뷰티": 1200, "쓰껄엔터": 1700, "선명전자": 2200, "아가랑 생명": 2800 },
  "16:40": { "옹심테크": 1000, "공주뷰티": 1600, "쓰껄엔터": 1700, "선명전자": 2700, "아가랑 생명": 3400 },
  "16:45": { "옹심테크": 1200, "공주뷰티": 1600, "쓰껄엔터": 1200, "선명전자": 2300, "아가랑 생명": 3400 },
  "16:50": { "옹심테크": 1200, "공주뷰티": 2100, "쓰껄엔터": 1200, "선명전자": 1800, "아가랑 생명": 3400 },
  "16:55": { "옹심테크": 1400, "공주뷰티": 1800, "쓰껄엔터": 1600, "선명전자": 2300, "아가랑 생명": 3900 },
  "17:00": { "옹심테크": 1400, "공주뷰티": 1800, "쓰껄엔터": 1600, "선명전자": 2300, "아가랑 생명": 3900 },
  "17:30": { "옹심테크": 1400, "공주뷰티": 1800, "쓰껄엔터": 1600, "선명전자": 2300, "아가랑 생명": 3900 },
  "17:35": { "옹심테크": 1400, "공주뷰티": 1500, "쓰껄엔터": 2100, "선명전자": 2300, "아가랑 생명": 4500 },
  "17:40": { "옹심테크": 1700, "공주뷰티": 1500, "쓰껄엔터": 2700, "선명전자": 2800, "아가랑 생명": 4500 },
  "17:45": { "옹심테크": 2200, "공주뷰티": 1800, "쓰껄엔터": 2300, "선명전자": 2800, "아가랑 생명": 4500 },
  "17:50": { "옹심테크": 2200, "공주뷰티": 2400, "쓰껄엔터": 2300, "선명전자": 3200, "아가랑 생명": 5200 },
  "17:55": { "옹심테크": 1900, "공주뷰티": 2400, "쓰껄엔터": 2800, "선명전자": 3200, "아가랑 생명": 500 },
  "18:00": { "옹심테크": 2300, "공주뷰티": 2000, "쓰껄엔터": 2000, "선명전자": 3200, "아가랑 생명": 0 },
  "18:05": { "옹심테크": 3000, "공주뷰티": 2600, "쓰껄엔터": 1400, "선명전자": 2700, "아가랑 생명": 0 },
  "18:10": { "옹심테크": 3000, "공주뷰티": 3100, "쓰껄엔터": 1700, "선명전자": 3300, "아가랑 생명": 0 },
  "18:15": { "옹심테크": 3000, "공주뷰티": 3100, "쓰껄엔터": 1700, "선명전자": 3300, "아가랑 생명": 0 }
};



// 2. 현재 시각을 "HH:mm" 포맷으로
function getCurrentTimeKey() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}`;
}

function getLastAvailablePastTimeKey() {
  const now = getCurrentTimeKey();
  const keys = Object.keys(stockTimeline).sort().filter(k => k <= now);
  return keys.at(-1) ?? null;
}
// ✅ 새로 추가: 실제로 존재하는 가장 가까운 "과거 시점" 찾기
function getPreviousAvailableTimeKey(currentKey) {
  const keys = Object.keys(stockTimeline).sort();
  const currentIndex = keys.indexOf(currentKey);
  for (let i = currentIndex - 1; i >= 0; i--) {
    const key = keys[i];
    if (stockTimeline[key]) return key;
  }
  return null;
}

export default function Home() {
  const [timeKey, setTimeKey] = useState("");
  const [clock, setClock] = useState("");
  console.log("현재 timeKey:", timeKey);
  console.log("해당 시각의 데이터:", stockTimeline[timeKey]);

  useEffect(() => {
    const updateTime = () => {
      const nowKey = getCurrentTimeKey();
      const validKey = stockTimeline[nowKey] ? nowKey : getLastAvailablePastTimeKey();
      setTimeKey(validKey);
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const h = pad(now.getHours());
      const m = pad(now.getMinutes());
      const s = pad(now.getSeconds());
      setClock(`${h}:${m}:${s}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const prevKey = getPreviousAvailableTimeKey(timeKey);
  const current = stockTimeline[timeKey] || {};
  const prev = stockTimeline[prevKey] || {};

  const stocks = Object.keys(current).map((name) => {
    const now = current[name];
    const before = prev[name];
    const change = now - before;
    return { name, now, before, change };
  });
  if (!timeKey) return null;
  return (
    <main className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wider mb-3 text-purple-400">
          INSIDERS 28th MT
        </h1>
        <h2 className="text-4xl font-semibold text-red-400">
          폭풍의 증권시장
        </h2>
      </div>      
      
      
      <h1 className="text-4xl mb-6">🕒 {clock} (기준: {timeKey})</h1>
      <div className="w-full max-w-2xl border border-white divide-y divide-white/40">
        <div className="grid grid-cols-4 p-2 font-bold bg-white text-black">
          <div className="border-r border-dashed border-white pr-2">종목</div>
          <div className="border-r border-dashed border-white px-2 text-center">직전가</div>
          <div className="border-r border-dashed border-white px-2 text-center">현재가</div>
          <div className="pl-2 text-center">등락폭</div>
        </div>

        {stocks.map(({ name, now, before, change }) => {
          const isUp = change > 0;
          const isSame = change === 0;
          const symbol = isUp ? "▲" : change < 0 ? "▼" : "";
          const color = isUp
            ? "text-red-400"
            : isSame
            ? "text-green-400"
            : "text-blue-400";

          return (
            <div
              key={name}
              className="grid grid-cols-4 p-2 text-xl items-center divide-x divide-dashed divide-white/60"
            >
              <div className="pr-2">{name}</div>
              <div className="px-2 text-center text-gray-400">{before ?? "-"}</div>
              <div className={`px-2 text-center ${color}`}>{now ?? "-"}</div>
              <div className={`pl-2 text-center ${color}`}>
                {before != null && now != null ? `${symbol} ${Math.abs(change)}` : "-"}
              </div>
            </div>
          );
        })}
      </div>
      {/* 게임 규칙 안내 */}
      <div className="mt-12 max-w-3xl w-full bg-white/10 text-white border border-white p-6 rounded-xl leading-relaxed text-base">
        <h3 className="text-2xl font-bold mb-4 text-blue-100">📢폭풍의 증권시장 규칙📢 (Rule)</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>1라운드:</strong> 16:15 ~ 17:00</li>
          <li><strong>2라운드:</strong> 17:30 ~ 18:15</li>
          <li>라운드 시작 후 <strong>5분마다</strong> 주식 가격이 변동됩니다.</li>
          <li>증권 거래소에는 <strong>각 팀장만 방문 가능</strong>합니다.</li>
          <li>
          변동 정보는 라운드 시작 전, <strong>증권 거래소에서 팀장에게 제공</strong>됩니다.<br />
          <span className="ml-4 text-sm text-white/70">(총 24개의 정보, 팀당 3종)</span>
          </li>
          <li><strong>증권 거래소</strong> 안에서만 주식 거래 가능하며, 각 주식은 <strong>15주</strong>만 시장에 존재합니다.</li>
          <li>거래소에는 <strong>최대 30초</strong> 동안만 머물 수 있습니다.</li>
          <li><strong>플레이어 간 거래는 불가</strong>하며, 각 팀의 주식/현금은 공개되지 않습니다.</li>
        </ul>
      </div>

    </main>
  );
}
