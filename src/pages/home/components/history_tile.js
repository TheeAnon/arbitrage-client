export const HistoryTile = ({ arbitrage, formatDate, wager }) => {
  const wager1 =
    (1 /
      arbitrage["odds"][0]["odd_value"] /
      arbitrage["total_implied_probability"]) *
    wager;
  const payout = arbitrage["odds"][0]["odd_value"] * wager1;
  const profit = payout - wager;
  const arbPercentage = (profit / wager) * 100;

  return (
    <div
      id="inactive_arbitrage"
      className="flex flex-wrap gap-4 rounded border p-4 relative"
    >
      <div className="flex flex-col gap-2 relative p-2 rounded border grow">
        <span
          id="found_date"
          className="text-gray-400 whitespace-nowrap text-xs"
        >
          Found on {formatDate(arbitrage["found_at"])}
        </span>
        <span
          id="ended_date"
          className="text-gray-400 whitespace-nowrap text-xs"
        >
          Ended on {formatDate(arbitrage["ended_at"])}
        </span>
        <div id="teams" className="font-bold flex gap-2 flex-col lg:flex-row">
          <span id="home_team" className="whitespace-nowrap">
            {arbitrage["home_team"]}
          </span>
          <span className="text-gray-400 font-normal hidden lg:flex">vs</span>
          <span id="away_team" className="whitespace-nowrap">
            {arbitrage["away_team"]}
          </span>
        </div>
        <span id="competition" className="text-gray-400 text-xs">
          {arbitrage["sport"]} | {arbitrage["competition"]}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2 rounded bg-gray-50">
        <span className="text-gray-400 text-sm">Market</span>
        <span id="market" className="font-bold flex gap-2 items-center">
          {arbitrage["market"]}
        </span>
      </div>
      <div className="flex gap-4 rounded bg-gray-50 p-2 grow justify-evenly">
        <div id="bet" className="flex flex-col gap-2 whitespace-nowrap">
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Bet</span>
          </div>
          <span
            id="odds1_name"
            className="font-bold flex gap-2 items-center ml-auto"
          >
            {arbitrage["odds"][0]["odd_name"]}
          </span>
          <span
            id="odds2_name"
            className="font-bold flex gap-2 items-center ml-auto"
          >
            {arbitrage["odds"][1]["odd_name"]}
          </span>
        </div>
        <div id="odds" className="flex flex-col gap-2">
          <span className="text-gray-400 text-sm">Odds</span>
          <span id="odds1_value" className="whitespace-nowrap text-gray-500">
            {arbitrage["odds"][0]["odd_value"]}
          </span>
          <span id="odds2_value" className="whitespace-nowrap text-gray-500">
            {arbitrage["odds"][1]["odd_value"]}
          </span>
        </div>
      </div>
      <div id="sites" className="flex justify-between gap-2">
        <div className="flex flex-col gap-2 p-2">
          <span className="text-gray-400 text-sm">Sites</span>
          <p
            id="site1"
            className="font-bold flex gap-2 items-center text-blue-500"
          >
            {arbitrage["site_names"][0]}
          </p>
          <p
            id="site2"
            className="font-bold flex gap-2 items-center text-blue-500"
          >
            {arbitrage["site_names"][1]}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded bg-green-50 p-2 items-center">
          <span className="text-gray-400 text-sm">Arbitrage</span>
          <span
            id="arbitrage_percentage"
            className="font-bold text-lg flex gap-2 items-center text-green-600"
          >
            {arbPercentage.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
