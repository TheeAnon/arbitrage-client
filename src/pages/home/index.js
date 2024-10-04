import { useState, useEffect } from "react";
import { ArbTile } from "./components/arb_tile";
import { HistoryTile } from "./components/history_tile";

export default function Home() {
  const [arbitrages, setArbitrages] = useState([]);
  const [arbitragesTab, setArbitragesTab] = useState(true);
  const [history, setHistory] = useState([]);
  const [wager, setWager] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    fetchActiveArbitrages();
    fetchHistory();

    const interval = setInterval(() => {
      fetchActiveArbitrages();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchActiveArbitrages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/arbitrages/active/`
      );
      let data = await response.json();
      data = data.filter((arb) => parseFloat(arb.arbitrage_percentage) >= 0);
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
      const data = await response.json();
      data.sort((a, b) => new Date(b.ended) - new Date(a.ended));
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const prevPage = () => {
    if (arbitragesTab) {
      if (activePage > 1) {
        setActivePage((prev) => prev - 1);
      }
    } else {
      if (historyPage > 1) {
        setHistoryPage((prev) => prev - 1);
      }
    }
  };

  const nextPage = () => {
    if (arbitragesTab) {
      if (activePage < Math.ceil(arbitrages.length / itemsPerPage)) {
        setActivePage((prev) => prev + 1);
      }
    } else {
      if (historyPage < Math.ceil(history.length / itemsPerPage)) {
        setHistoryPage((prev) => prev + 1);
      }
    }
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
    return `${day} ${monthAbbreviation} ${hours}:${minutes}`;
  };

  return (
    <div id="main" className="min-h-screen w-full flex flex-col items-center">
      <div className="min-h-screen h-screen flex flex-col p-2 md:p-4 gap-4 md:gap-6 w-full max-w-7xl border-x overflow-hidden">
        <header
          id="nav"
          className="flex md:justify-between md:items-center flex-col gap-2 md:flex-row"
        >
          <h1 className="font-bold md:text-xl whitespace-nowrap">
            {arbitragesTab ? "Active" : "History"}
          </h1>
          <div className="flex gap-2 justify-between">
            {arbitragesTab ? (
              <>
                <div className="flex relative gap-2 pl-2 items-center text-sm md:text-base">
                  <span className="absolute p-2 border-r self-center">
                    Wager €
                  </span>
                  <input
                    value={wager}
                    onChange={(e) => setWager(e.target.value)}
                    type="number"
                    className="p-2 pl-20 rounded-full border border-black flex md:grow"
                  />
                </div>
                <button
                  onClick={() => setArbitragesTab(false)}
                  className="p-2 text-xs md:text-base rounded-full bg-blue-800 font-bold text-white/90 px-4 hover:scale-90"
                >
                  History
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  fetchHistory();
                  setArbitragesTab(true);
                }}
                className="p-2 text-xs md:text-base rounded-full bg-blue-800 font-bold text-white/90 px-4 hover:scale-90"
              >
                View active opportunities
              </button>
            )}
          </div>
        </header>
        <div
          id="content"
          className="flex flex-col grow p-4 gap-6 w-full overflow-y-scroll overflow-x-hidden"
        >
          {arbitragesTab ? (
            <>
              {paginateData(arbitrages, activePage).map((arbitrage) => (
                <ArbTile
                  key={arbitrage.id}
                  arbitrage={arbitrage}
                  wager={wager}
                  formatDate={formatDate}
                />
              ))}
            </>
          ) : (
            <>
              {paginateData(history, historyPage).map((arbitrage) => (
                <HistoryTile
                  key={arbitrage.id}
                  arbitrage={arbitrage}
                  formatDate={formatDate}
                />
              ))}
            </>
          )}
          <div className="flex gap-2 justify-center mt-auto">
            <button
              onClick={prevPage}
              className="rounded-full p-2 border hover:bg-blue-500 hover:text-white"
            >
              Previous page
            </button>
            <button className="rounded-full p-2 border bg-gray-50">
              {arbitragesTab ? (
                <>
                  {activePage}/{Math.ceil(arbitrages.length / itemsPerPage)}
                </>
              ) : (
                <>
                  {historyPage}/{Math.ceil(history.length / itemsPerPage)}
                </>
              )}
            </button>
            <button
              onClick={nextPage}
              className="rounded-full p-2 border hover:bg-blue-500 hover:text-white"
            >
              Next page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
