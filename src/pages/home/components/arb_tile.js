export const ArbTile = ({ data, wager1, wager2, payout, profit, percentage, formatDate }) => {
  return (
    <div className="flex flex-wrap gap-4 rounded border p-4 relative">
      <div className="flex flex-col gap-2 relative p-2 rounded grow bg-slate-50">
        <span className="text-gray-400 text-xs flex gap-1 whitespace-nowrap">
          {formatDate(data["start_time"])}
            {
            data["is_live"] &&
          <span className="self-start text-xs text-red-600 font-bold">
            live
          </span>
          }
        </span>
        <div className="font-bold flex gap-2 flex-col lg:flex-row">
          <span className="whitespace-nowrap">{data["home_team"]}</span>
          <span className="text-gray-400 font-normal hidden lg:flex">vs</span>
          <span className="whitespace-nowrap">{data["away_team"]}</span>
        </div>
        <span className="text-gray-400 text-xs">{data["competition"]}</span>
      </div>
      <div className="flex flex-col gap-2 p-2 rounded bg-gray-50">
        <span className="text-gray-400 text-sm">Market</span>
        <span className="font-bold flex gap-2 items-center">{data["market"]}</span>
      </div>
      <div className="flex gap-4 justify-evenly bg-gray-50 rounded p-2 grow">
        <div className="flex flex-col gap-2 whitespace-nowrap">
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Bet</span>
          </div>
          <span className="font-bold flex gap-2 items-center ml-auto">
            {data["odds"][0]["odd_name"]}
          </span>
          <span className="font-bold flex gap-2 items-center ml-auto">
            {data["odds"][1]["odd_name"]}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-sm">Odds</span>
          <span className="whitespace-nowrap text-gray-500">
            {data["odds"][0]["odd_value"]}
          </span>
          <span className="whitespace-nowrap text-gray-500">
            {data["odds"][1]["odd_value"]}
          </span>
        </div>
        <div className="flex flex-col gap-2 items-end whitespace-nowrap">
          <span className="text-gray-400 text-sm">Wagger</span>
          <span className="font-bold whitespace-nowrap">€ {wager1}</span>
          <span className="font-bold whitespace-nowrap">€ {wager2}</span>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 p-2">
          <span className="text-gray-400 text-sm">Sites</span>
          <a href={data["site_links"][0]} className="font-bold flex gap-2 items-center text-blue-500">
            {data["site_names"][0]}
          </a>
          <a href={data["site_links"][1]} className="font-bold flex gap-2 items-center text-blue-500">
            {data["site_names"][1]}
          </a>
        </div>
        <div className="flex flex-col gap-2 rounded bg-green-50 p-2">
          <span className="text-gray-400 text-sm">Payout</span>
          <span className="font-bold text-sm">€ {payout}</span>
          <span className="font-bold text-lg flex gap-2 items-center text-green-600">
            € {profit}
            <span className="rounded-full px-2 text-xs bg-green-600 items-center text-white font-bold">
              {percentage}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
