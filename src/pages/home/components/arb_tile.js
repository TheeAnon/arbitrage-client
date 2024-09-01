export const ArbTile = ({ arbitrage, wager, formatDate }) => {
    const wager1 =
        (1 /
            arbitrage["odds"][0]["odd_value"] /
            arbitrage["total_implied_probability"]) *
        wager;
    const wager2 =
        (1 /
            arbitrage["odds"][1]["odd_value"] /
            arbitrage["total_implied_probability"]) *
        wager;
    const payout1 = arbitrage["odds"][0]["odd_value"] * Math.ceil(wager1);
    const payout2 = arbitrage["odds"][1]["odd_value"] * Math.ceil(wager2);

    return (
        <div
            id="arbitrage"
            className="flex flex-wrap gap-4 rounded border p-4 relative"
        >
            <div
                id="teams"
                className="flex flex-col gap-2 relative p-2 rounded grow bg-slate-50"
            >
                <span className="text-gray-400 text-xs flex gap-1 whitespace-nowrap">
                    {arbitrage["is_live"] ? (
                        <span
                            id="live-indicator"
                            className="self-start text-xs text-red-600 font-bold"
                        >
                            live
                        </span>
                    ) : (
                        formatDate(arbitrage["start_time"])
                    )}
                </span>
                <div
                    id="teams-container"
                    className="font-bold flex gap-2 flex-col lg:flex-row"
                >
                    <span id="home-teams" className="whitespace-nowrap">
                        {arbitrage["home_team"]}
                    </span>
                    <span className="text-gray-400 font-normal hidden lg:flex">
                        vs
                    </span>
                    <span id="away-team" className="whitespace-nowrap">
                        {arbitrage["away_team"]}
                    </span>
                </div>
                <span
                    id="competition"
                    className="text-gray-400 text-xs items-center"
                >
                    {arbitrage["sport"]} | {arbitrage["competition"]}
                </span>
            </div>
            <div
                id="market-type"
                className="flex flex-col gap-2 p-2 rounded bg-gray-50"
            >
                <span className="text-gray-400 text-sm">Market</span>
                <span id="market" className="font-bold flex gap-2 items-center">
                    {arbitrage["market"]}
                </span>
            </div>
            <div
                id="bet-info"
                className="flex gap-4 justify-evenly bg-gray-50 rounded p-2 grow"
            >
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
                    <span
                        id="odds1_value"
                        className="whitespace-nowrap text-gray-500"
                    >
                        {arbitrage["odds"][0]["odd_value"]}
                    </span>
                    <span
                        id="odds2_value"
                        className="whitespace-nowrap text-gray-500"
                    >
                        {arbitrage["odds"][1]["odd_value"]}
                    </span>
                </div>
                <div
                    id="wagger"
                    className="flex flex-col gap-2 items-end whitespace-nowrap"
                >
                    <span className="text-gray-400 text-sm">Wagger</span>
                    <span id="wagger1" className="font-bold whitespace-nowrap">
                        € {Math.ceil(wager1)}
                    </span>
                    <span id="wagger2" className="font-bold whitespace-nowrap">
                        € {Math.ceil(wager2)}
                    </span>
                </div>
            </div>
            <div className="flex justify-between gap-2">
                <div id="sites" className="flex flex-col gap-2 p-2">
                    <span className="text-gray-400 text-sm">Sites</span>
                    <a
                        id="site1"
                        target="_blank"
                        rel="noreferrer"
                        href={arbitrage["site_links"][0]}
                        className="font-bold flex gap-2 items-center text-blue-500"
                    >
                        {arbitrage["site_names"][0]}
                    </a>
                    <a
                        id="site2"
                        target="_blank"
                        rel="noreferrer"
                        href={arbitrage["site_links"][1]}
                        className="font-bold flex gap-2 items-center text-blue-500"
                    >
                        {arbitrage["site_names"][1]}
                    </a>
                </div>
                <div
                    id="payout"
                    className="flex flex-col gap-2 rounded bg-green-50 p-2"
                >
                    <span className="text-gray-400 text-sm">Payout</span>
                    <span id="payout1" className="font-bold">
                        € {payout1.toFixed(2)}
                    </span>
                    <span id="payout2" className="font-bold">
                        € {payout2.toFixed(2)}
                    </span>
                </div>
                <div
                    id="profit"
                    className="flex flex-col gap-2 rounded bg-green-50 p-2"
                >
                    <span className="text-gray-400 text-sm">Profit</span>
                    <span
                        id="profit1"
                        className="font-bold flex gap-2 items-center text-green-600"
                    >
                        € {(payout1 - wager).toFixed(2)}
                    </span>
                    <span
                        id="profit2"
                        className="font-bold flex gap-2 items-center text-green-600"
                    >
                        € {(payout2 - wager).toFixed(2)}
                    </span>
                </div>
                <div className="flex flex-col gap-2 rounded bg-green-50 p-2 items-center">
                    <span className="text-gray-400 text-sm">Arbitrage</span>
                    <span
                        id="arbitrage_percentage"
                        className="font-bold text-lg flex gap-2 items-center text-green-600"
                    >
                        {arbitrage["arbitrage_percentage"]}%
                    </span>
                </div>
            </div>
        </div>
    );
};
