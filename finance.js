export const round=(n,d=2)=>Number(n.toFixed(d));
export function convert(amount, rate){if(amount<0)throw new Error('Investment must be positive');if(!Number.isFinite(rate)||rate<=0)throw new Error('Missing FX rate');return amount/rate}
export function cagr(start,end,years){if(start<=0||end<0||years<=0)throw new Error('Invalid CAGR inputs');return (end/start)**(1/years)-1}
export function nearestSession(date, sessions){if(!sessions.length)throw new Error('Missing price data');const target=new Date(date+'T00:00:00Z').getTime();return [...sessions].sort((a,b)=>Math.abs(new Date(a).getTime()-target)-Math.abs(new Date(b).getTime()-target))[0]}
export function inflationAdjusted(value,cpiStart,cpiEnd){if(cpiStart<=0||cpiEnd<=0)throw new Error('Missing CPI data');return value/(cpiEnd/cpiStart)}
export function calculate(s){
 if(!Number.isFinite(s.amount)||s.amount<=0)throw new Error('Investment must be greater than zero');if(s.date<s.ipo)throw new Error(`This security was not public before ${s.ipo}`);
 const usd=convert(s.amount,s.startFx), raw=usd/s.startPrice, shares=s.fractional?raw:Math.floor(raw), cashUsd=usd-shares*s.startPrice;
 const splitFactor=s.adjustedPrices?1:s.splits.reduce((v,x)=>v*x.factor,1);let finalShares=shares*splitFactor;let dividends=0;
 if(s.mode==='total'){for(const d of s.dividends){const payment=finalShares*d.amount;dividends+=payment;finalShares+=payment/d.reinvestmentPrice}}
 const finalUsd=finalShares*s.endPrice+cashUsd, current=finalUsd*s.endFx, multiple=current/s.amount, years=(new Date(s.endDate)-new Date(s.date))/31557600000;
 const inflationFactor=s.cpiEnd/s.cpiStart, purchasingPower=s.amount*inflationFactor, realValue=current/inflationFactor;
 return {usd,shares,finalShares,cashUsd,dividends,finalUsd,current,profit:current-s.amount,multiple,totalReturn:multiple-1,cagr:cagr(s.amount,current,years),years,inflationFactor,purchasingPower,realValue,realGain:realValue-s.amount,splitFactor};
}
