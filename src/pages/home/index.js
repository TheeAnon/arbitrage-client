import { useState, useEffect } from "react";

export default function Home() {
  const [arbitrages, setArbitrages] = useState([]);
  const [arbitragesTab, setArbitragesTab] = useState(true);
  const [history, setHistory] = useState([]);
  const [wager, setWager] = useState(100);

  useEffect(() => {
    fetchActiveArbitrages();
    fetchHistory();

    const interval = setInterval(() => {
      fetchActiveArbitrages();
      fetchHistory();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchActiveArbitrages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/arbitrages/active/`
      );
      if (!response.ok) {
        alert("Failed to fetch data");
      }
      const data = await response.json();
      setArbitrages(data);
    } catch (error) {
      console.error("Error fetching arbitrages:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/arbitrages/inactive/`
      );
      if (!response.ok) {
        alert("Failed to fetch data");
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching arbitrages:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Get month name abbreviation
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthAbbreviation = monthNames[date.getMonth()];

    // Get day of the month
    const day = date.getDate();

    // Get hours and minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Format hours with leading zero if necessary
    hours = hours.toString().padStart(2, "0");

    // Format minutes with leading zero if necessary
    minutes = minutes.toString().padStart(2, "0");

    // Construct the formatted date string
    const formattedDate = `${day} ${monthAbbreviation} ${hours}:${minutes}`;

    return formattedDate;
  };

  const calculateArbitrage = (arbitrage) => {
    const odds1 = arbitrage.site_one_odds;
    const odds2 = arbitrage.site_two_odds;
    const totalImpliedProbability = 1 / odds1 + 1 / odds2;

    const wager1 = (1 / odds1 / totalImpliedProbability) * wager;
    const wager2 = (1 / odds2 / totalImpliedProbability) * wager;

    const payout1 = wager1 * odds1;
    const profit = payout1 - wager;

    return {
      wager1: wager1.toFixed(2),
      wager2: wager2.toFixed(2),
      payout: payout1.toFixed(2),
      profit: profit.toFixed(2),
      arbPercentage: ((profit / wager) * 100).toFixed(2),
    };
  };

  async function deleteArbitrage(id) {
    try {
      const response = await fetch(`/arbitrages/delete/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`Arbitrage with id ${id} deleted successfully`);
      } else {
        console.error(`Failed to delete arbitrage with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting arbitrage with id ${id}: `, error);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 gap-6">
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-lg md:text-2xl">
          {arbitragesTab ? "Active Arbitrage Opportunities" : "History"}
        </h1>
        <div className="flex gap-2">
          {arbitragesTab && (
            <>
              <div className="flex gap-2 pl-2 items-center rounded border bg-slate-300">
                <span>Wager €</span>
                <input
                  value={wager}
                  onChange={(e) => setWager(e.target.value)}
                  type="number"
                  className="p-2 rounded flex grow"
                />
              </div>
              <button
                onClick={() => setArbitragesTab(false)}
                className="p-2 rounded bg-slate-300 hover:opacity-70"
              >
                History
              </button>
            </>
          )}
          {!arbitragesTab && (
            <button
              onClick={() => setArbitragesTab(true)}
              className="p-2 rounded bg-slate-300 hover:opacity-70"
            >
              View active opportunities
            </button>
          )}
        </div>
      </div>
      <table className="table-auto border p-2">
        <thead>
          <tr className="bg-slate-200">
            <th className="border border-slate-300 px-2 text-start">EVENT</th>
            <th className="border border-slate-300 px-2 text-start">BET</th>
            <th className="border border-slate-300 px-2 text-end">SIDES</th>
            <th className="border border-slate-300 px-2 text-start">ODDS</th>
            <th className="border border-slate-300 px-2">WAGER</th>
            <th className="border border-slate-300 px-2">PAYOUT</th>
            <th className="border border-slate-300 px-2">PROFIT</th>
            <th className="border border-slate-300 px-2">ARB %</th>
            <th className="border border-slate-300 px-2">SITES</th>
          </tr>
        </thead>
        {arbitragesTab ? (
          <tbody>
            {arbitrages.map((arbitrage) => {
              const { wager1, wager2, payout, profit, arbPercentage } =
                calculateArbitrage(arbitrage);

              if (profit < 0) {
                // Function to delete arbitrage from the database
                deleteArbitrage(arbitrage.id);
                return null;
              }

              return (
                <tr key={arbitrage.id}>
                  <td className="border border-slate-300 p-2">
                    <span>{formatDate(arbitrage.found)} </span>
                    <span className="text-gray-400">
                      {arbitrage.event_name}
                    </span>
                    <div className="w-full flex gap-2 items-center">
                      <h2 className="text-lg font-semibold">
                        {arbitrage.competitors}
                      </h2>
                    </div>
                  </td>
                  <td className="border border-slate-300 p-2">
                    <span>{arbitrage.market}</span>
                  </td>
                  <td className="border border-slate-300 p-2 text-end">
                    <h2 className="text-lg font-semibold">
                      {arbitrage.sides[0]}
                    </h2>
                    <h2 className="text-lg font-semibold">
                      {arbitrage.sides[1]}
                    </h2>
                  </td>
                  <td className="border border-slate-300 p-2">
                    <h2 className="text-lg">{arbitrage.site_one_odds}</h2>
                    <h2 className="text-lg">{arbitrage.site_two_odds}</h2>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-lg">
                    <h3>
                      <span class="text-sm font-normal">€ </span>
                      {wager1}
                    </h3>
                    <h3>
                      <span class="text-sm font-normal">€ </span>
                      {wager2}
                    </h3>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-lg">
                    <h3>
                      <span class="text-sm font-normal">€ </span>
                      {payout}
                    </h3>
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-green-500 font-bold text-lg">
                    <h3>
                      <span class="text-sm font-normal">€ </span>
                      {profit}
                    </h3>
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-green-500 font-bold text-lg">
                    {arbPercentage}%
                  </td>
                  <td className="p-2 border border-slate-300 text-center">
                    <a
                      href={arbitrage.site_one_link}
                      _blank
                      className="text-blue-500 hover:underline whitespace-nowrap line-clamp-1 overflow-ellipsis"
                    >
                      {arbitrage.site_one_name}
                    </a>
                    <a
                      href={arbitrage.site_two_link}
                      _blank
                      className="text-blue-500 hover:underline whitespace-nowrap line-clamp-1 overflow-ellipsis"
                    >
                      {arbitrage.site_two_name}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            {history.map((arbitrage) => {
              const { wager1, wager2, payout, profit, arbPercentage } =
                calculateArbitrage(arbitrage);
              if (profit < 0) {
                // Function to delete arbitrage from the database
                deleteArbitrage(arbitrage.id);
                return null;
              }

              return (
                <tr key={arbitrage.id}>
                  <td className="border border-slate-300 p-2">
                    <span className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                      {formatDate(arbitrage.found)}
                      {" - "}
                      {formatDate(arbitrage.ended)}
                      <span className="text-gray-400">
                        {" "}
                        {arbitrage.event_name}
                      </span>
                    </span>
                    <div className="w-full flex gap-2 items-center">
                      <h2 className="text-lg font-semibold whitespace-nowrap overflow-ellipsis line-clamp-1">
                        {arbitrage.competitors}
                      </h2>
                    </div>
                  </td>
                  <td className="border border-slate-300 p-2">
                    <span>{arbitrage.market}</span>
                  </td>
                  <td className="border border-slate-300 p-2 text-end">
                    <h2 className="text-lg font-semibold">
                      {arbitrage.sides[0]}
                    </h2>
                    <h2 className="text-lg font-semibold">
                      {arbitrage.sides[1]}
                    </h2>
                  </td>
                  <td className="border border-slate-300 p-2">
                    <h2 className="text-lg">{arbitrage.site_one_odds}</h2>
                    <h2 className="text-lg">{arbitrage.site_two_odds}</h2>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-lg">
                    <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                      <span class="text-sm font-normal">€ </span>
                      {wager1}
                    </h3>
                    <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                      <span class="text-sm font-normal">€ </span>
                      {wager2}
                    </h3>
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold text-lg">
                    <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                      <span class="text-sm font-normal">€ </span>
                      {payout}
                    </h3>
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-green-500 font-bold text-lg">
                    <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                      <span class="text-sm font-normal">€ </span>
                      {profit}
                    </h3>
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-green-500 font-bold text-lg">
                    {arbPercentage}%
                  </td>
                  <td className="p-2 border border-slate-300 text-center">
                    <a
                      href={arbitrage.site_one_link}
                      _blank
                      className="text-blue-500 hover:underline whitespace-nowrap line-clamp-1 overflow-ellipsis"
                    >
                      {arbitrage.site_one_name}
                    </a>
                    <a
                      href={arbitrage.site_two_link}
                      _blank
                      className="text-blue-500 hover:underline whitespace-nowrap line-clamp-1 overflow-ellipsis"
                    >
                      {arbitrage.site_two_name}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
