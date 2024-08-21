export const HistoryTile = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-4 rounded border p-4 relative">
      <div className="flex flex-col gap-2 relative p-2 rounded border grow">
        <span className="text-gray-400 whitespace-nowrap text-xs">
          9 Dec 20:24 - 9 Dec 21:00
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
      <div className="flex gap-4 rounded bg-gray-50 p-2 grow justify-evenly">
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
        <div className="flex flex-col gap-2 rounded bg-green-50 p-2 items-center">
          <span className="text-gray-400 text-sm">Arbitrage</span>
          <span className="font-bold text-lg flex gap-2 items-center text-green-600">
            20%
          </span>
        </div>
      </div>
    </div>
  );
};
