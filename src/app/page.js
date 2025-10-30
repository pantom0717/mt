'use client';

import { useEffect, useState } from "react";

// 1. 시간별 주가 데이터 (8개 기업)
// 각 기업별 특성:
// - 선명전자: 초반 급등 → 중반 폭락 → 후반 반등 → 파산 (함정주)
// - 재영엔터: 초반 폭락 → 후반 역전 (역전주)
// - 우열축산: 중반 급등 (중반 대박주)
// - 본걸물류: 늦은 급등 (인내형 주식)
// - 민경테크: 초반 강세 → 중반 약세 (초반형)
// - 영빈뷰티: 꾸준한 상승 최고가 (프리미엄 안정주)
// - 경환FC: 극심한 변동성 (도박주)
// - 현선식품: 중반 최악 → 후반 급등 (숨은 대박주)
const stockTimeline = {
  "00:00": { "선명전자": 0, "재영엔터": 0, "우열축산": 0, "본걸물류": 0, "민경테크": 0, "영빈뷰티": 0, "경환FC": 0, "현선식품": 0 },
  "14:30": { "선명전자": 1000, "재영엔터": 1000, "우열축산": 1000, "본걸물류": 1000, "민경테크": 1000, "영빈뷰티": 1000, "경환FC": 1000, "현선식품": 1000 },
  "14:35": { "선명전자": 1000, "재영엔터": 1000, "우열축산": 1000, "본걸물류": 1000, "민경테크": 1000, "영빈뷰티": 1000, "경환FC": 1000, "현선식품": 1000 },
  "16:15": { "선명전자": 1000, "재영엔터": 1000, "우열축산": 1000, "본걸물류": 1000, "민경테크": 1000, "영빈뷰티": 1000, "경환FC": 1000, "현선식품": 1000 },
  "16:20": { "선명전자": 2000, "재영엔터": 700, "우열축산": 1100, "본걸물류": 900, "민경테크": 2200, "영빈뷰티": 1300, "경환FC": 1500, "현선식품": 1100 },
  "16:25": { "선명전자": 3000, "재영엔터": 500, "우열축산": 1200, "본걸물류": 800, "민경테크": 3200, "영빈뷰티": 1700, "경환FC": 900, "현선식품": 1200 },
  "16:30": { "선명전자": 3800, "재영엔터": 600, "우열축산": 1300, "본걸물류": 900, "민경테크": 4000, "영빈뷰티": 2200, "경환FC": 1800, "현선식품": 1000 },
  "16:35": { "선명전자": 3200, "재영엔터": 800, "우열축산": 1800, "본걸물류": 1000, "민경테크": 4300, "영빈뷰티": 2700, "경환FC": 1200, "현선식품": 700 },
  "16:40": { "선명전자": 2500, "재영엔터": 1100, "우열축산": 2800, "본걸물류": 1100, "민경테크": 4500, "영빈뷰티": 3300, "경환FC": 2200, "현선식품": 600 },
  "16:45": { "선명전자": 2000, "재영엔터": 1500, "우열축산": 4000, "본걸물류": 1300, "민경테크": 4700, "영빈뷰티": 4000, "경환FC": 1600, "현선식품": 800 },
  "16:50": { "선명전자": 1800, "재영엔터": 2000, "우열축산": 4800, "본걸물류": 1500, "민경테크": 4800, "영빈뷰티": 4600, "경환FC": 2800, "현선식품": 1000 },
  "16:55": { "선명전자": 2200, "재영엔터": 2700, "우열축산": 5300, "본걸물류": 1800, "민경테크": 4900, "영빈뷰티": 5200, "경환FC": 2200, "현선식품": 1300 },
  "17:00": { "선명전자": 2200, "재영엔터": 2700, "우열축산": 5300, "본걸물류": 1800, "민경테크": 4900, "영빈뷰티": 5200, "경환FC": 2200, "현선식품": 1300 },
  "17:30": { "선명전자": 2200, "재영엔터": 2700, "우열축산": 5300, "본걸물류": 1800, "민경테크": 4900, "영빈뷰티": 5200, "경환FC": 2200, "현선식품": 1300 },
  "17:35": { "선명전자": 2800, "재영엔터": 3500, "우열축산": 5400, "본걸물류": 2500, "민경테크": 4700, "영빈뷰티": 5400, "경환FC": 1900, "현선식품": 2000 },
  "17:40": { "선명전자": 3700, "재영엔터": 4300, "우열축산": 5500, "본걸물류": 3800, "민경테크": 4400, "영빈뷰티": 5600, "경환FC": 3500, "현선식품": 3200 },
  "17:45": { "선명전자": 4500, "재영엔터": 5000, "우열축산": 5600, "본걸물류": 5200, "민경테크": 4200, "영빈뷰티": 5800, "경환FC": 5100, "현선식품": 4800 },
  "17:50": { "선명전자": 200, "재영엔터": 200, "우열축산": 300, "본걸물류": 300, "민경테크": 500, "영빈뷰티": 700, "경환FC": 300, "현선식품": 200 },
  "17:55": { "선명전자": 0, "재영엔터": 900, "우열축산": 1400, "본걸물류": 1500, "민경테크": 2300, "영빈뷰티": 3200, "경환FC": 1600, "현선식품": 1100 },
  "18:00": { "선명전자": 0, "재영엔터": 1300, "우열축산": 1900, "본걸물류": 2000, "민경테크": 3000, "영빈뷰티": 4200, "경환FC": 2300, "현선식품": 1500 },
  "18:05": { "선명전자": 0, "재영엔터": 1600, "우열축산": 2300, "본걸물류": 2400, "민경테크": 3600, "영빈뷰티": 5000, "경환FC": 2900, "현선식품": 1800 },
  "18:10": { "선명전자": 0, "재영엔터": 1800, "우열축산": 2600, "본걸물류": 2700, "민경테크": 4000, "영빈뷰티": 5600, "경환FC": 3400, "현선식품": 2000 },
  "18:15": { "선명전자": 0, "재영엔터": 1800, "우열축산": 2600, "본걸물류": 2700, "민경테크": 4000, "영빈뷰티": 5600, "경환FC": 3400, "현선식품": 2000 }
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
          INSIDERS 29th MT
        </h1>
        <h2 className="text-4xl font-semibold text-red-400">
          폭풍의 증권시장
        </h2>
      </div>      
      
      
      <h1 className="text-4xl mb-6">🕒 {clock} (기준: {timeKey})</h1>
      <div className="w-full max-w-4xl border border-white divide-y divide-white/40">
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
      <div className="mt-12 max-w-4xl w-full bg-white/10 text-white border border-white p-6 rounded-xl leading-relaxed text-base">
        <h3 className="text-2xl font-bold mb-4 text-blue-100">📢 폭풍의 증권시장 규칙 📢 (Rule)</h3>

        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-2 text-yellow-300">🎯 게임 개요</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>각 팀은 8개 기업 중 하나를 무작위로 배정받습니다.</li>
            <li>초기 자산은 <strong>현금 10,000원</strong>과 <strong>자사 주식 7주</strong>입니다.</li>
            <li>각 팀은 자사 기업의 <strong>비공개 내부 정보 5개</strong>를 제공받습니다.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-2 text-yellow-300">⏰ 라운드 진행</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>1라운드:</strong> 16:15 ~ 17:00</li>
            <li><strong>2라운드:</strong> 17:30 ~ 18:15</li>
            <li>라운드 시작 후 <strong>5분마다</strong> 주식 가격이 변동됩니다.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-2 text-yellow-300">💼 증권 거래소</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>증권 거래소에는 <strong>각 팀중 한명만 방문 가능</strong>합니다.</li>
            <li><strong>증권 거래소</strong> 안에서만 주식 거래 가능하며, 각 주식은 <strong>15주</strong>만 시장에 존재합니다.</li>
            <li>거래소에는 <strong>최대 30초</strong> 동안만 머물 수 있습니다.</li>
            <li><strong>플레이어 간 거래는 불가</strong>하며, 각 팀의 주식/현금은 공개되지 않습니다.</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2 text-yellow-300">📰 정보 판매상</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>정보 판매상에게 추가 정보를 구매할 수 있습니다.</li>
            <li><strong>1라운드:</strong> 정보 1개당 <strong>500원</strong></li>
            <li><strong>2라운드:</strong> 정보 1개당 <strong>1,000원</strong></li>
          </ul>
        </div>
      </div>

    </main>
  );
}
