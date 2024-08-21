export const ArbTile = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-4 rounded border p-4 relative">
      <div className="flex flex-col gap-2 relative p-2 rounded grow bg-slate-50">
        <span className="text-gray-400 text-xs flex gap-1 whitespace-nowrap">
          9 Dec 20:24
          <span className="self-start text-xs text-red-600 font-bold">
            live
          </span>
        </span>
        <div className="font-bold flex gap-2 flex-col lg:flex-row">
          <span className="whitespace-nowrap">Team 1</span>
          <span className="text-gray-400 font-normal hidden lg:flex">vs</span>
          <span className="whitespace-nowrap">Team 2 Team 2 Team Team</span>
        </div>
        <span className="text-gray-400 text-xs">League</span>
      </div>
      <div className="flex flex-col gap-2 p-2 rounded bg-gray-50">
        <span className="text-gray-400 text-sm">Market</span>
        <span className="font-bold flex gap-2 items-center">Winner</span>
      </div>
      <div className="flex gap-4 justify-evenly bg-gray-50 rounded p-2 grow">
        <div className="flex flex-col gap-2 whitespace-nowrap">
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Bet</span>
          </div>
          <span className="font-bold flex gap-2 items-center ml-auto">
            Over 2.5
          </span>
          <span className="font-bold flex gap-2 items-center ml-auto">2</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-sm">Odds</span>
          <span className="whitespace-nowrap text-gray-500">1.32</span>
          <span className="whitespace-nowrap text-gray-500">2.7</span>
        </div>
        <div className="flex flex-col gap-2 items-end whitespace-nowrap">
          <span className="text-gray-400 text-sm">Wagger</span>
          <span className="font-bold whitespace-nowrap">€ 47</span>
          <span className="font-bold whitespace-nowrap">€ 53</span>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 p-2">
          <span className="text-gray-400 text-sm">Sites</span>
          <a className="font-bold flex gap-2 items-center text-blue-500">
            tonybet
          </a>
          <a className="font-bold flex gap-2 items-center text-blue-500">
            casino777
          </a>
        </div>
        <div className="flex flex-col gap-2 rounded bg-green-50 p-2">
          <span className="text-gray-400 text-sm">Payout</span>
          <span className="font-bold text-sm">€ 104.7</span>
          <span className="font-bold text-lg flex gap-2 items-center text-green-600">
            € 4.7
            <span className="rounded-full px-2 text-xs bg-green-600 items-center text-white font-bold">
              20%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
