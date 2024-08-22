import { useState, useEffect } from "react";
import { ArbTile } from "./components/arb_tile";
import { HistoryTile } from "./components/history_tile";

export default function Home() {
  const [arbitrages, setArbitrages] = useState([]);
  const [arbitragesTab, setArbitragesTab] = useState(true);
  const [history, setHistory] = useState([]);
  const [wager, setWager] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
      data.sort((a, b) => new Date(b.found) - new Date(a.found));
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
      data.sort((a, b) => new Date(b.ended) - new Date(a.ended));
      setHistory(data);
    } catch (error) {
      console.error("Error fetching arbitrages:", error);
    }
  };

  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

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
    const day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

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
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/arbitrages/delete/${id}/`,
        {
          method: "DELETE",
        }
      );
      // if (response.ok) {
      //   console.log(`Arbitrage with id ${id} deleted successfully`);
      // } else {
      //   console.error(`Failed to delete arbitrage with id ${id}`);
      // }
    } catch (error) {
      console.error(`Error deleting arbitrage with id ${id}: `, error);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="min-h-screen h-screen flex flex-col p-4 gap-6 w-full max-w-7xl border-x overflow-hidden">
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-lg md:text-xl">
            {arbitragesTab ? "Active Arbitrage Opportunities" : "History"}
          </h1>
          <div className="flex gap-2">
            {arbitragesTab ? (
              <>
                <div className="flex relative gap-2 pl-2 items-cente">
                  <span className="absolute p-2 border-r self-center">
                    Wager €
                  </span>
                  <input
                    value={wager}
                    onChange={(e) => setWager(e.target.value)}
                    type="number"
                    className="p-2 pl-20 rounded-full border border-black flex grow"
                  />
                </div>
                <button
                  onClick={() => setArbitragesTab(false)}
                  className="p-2 rounded-full bg-blue-800 font-bold text-white/90 px-4 hover:scale-90"
                >
                  History
                </button>
              </>
            ) : (
              <button
                onClick={() => setArbitragesTab(true)}
                className="p-2 rounded-full bg-blue-800 font-bold text-white/90 px-4 hover:scale-90"
              >
                View active opportunities Testtttt
              </button>
            )}
          </div>
        </header>
        <div className="flex flex-col grow p-4 gap-6 w-full overflow-y-scroll overflow-x-hidden">
          {arbitragesTab ? (
            <>
              {paginateData(arbitrages).map((arbitrage) => {
                const { wager1, wager2, payout, profit, arbPercentage } =
                  calculateArbitrage(arbitrage);

                if (profit < 0) {
                  deleteArbitrage(arbitrage.id);
                  return null;
                }

                return (
                  <ArbTile
                    data={arbitrage}
                    wager1={wager1}
                    wager2={wager2}
                    payout={payout}
                    profit={profit}
                    arbPercentage={arbPercentage}
                    formatDate={formatDate}
                  />
                );
              })}
            </>
          ) : (
            <>
              {paginateData(history).map((arbitrage) => {
                const { arbPercentage } = calculateArbitrage(arbitrage);
                return (
                  <HistoryTile
                    data={arbitrage}
                    arbPercentage={arbPercentage}
                    formatDate={formatDate}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
