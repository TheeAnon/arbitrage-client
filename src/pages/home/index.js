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

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="min-h-screen h-screen flex flex-col p-2 md:p-4 gap-4 md:gap-6 w-full max-w-7xl border-x overflow-hidden">
        <header className="flex justify-between items-center flex-wrap">
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
                onClick={() => setArbitragesTab(true)}
                className="p-2 text-xs md:text-base rounded-full bg-blue-800 font-bold text-white/90 px-4 hover:scale-90"
              >
                View active opportunities
              </button>
            )}
          </div>
        </header>
        <div className="flex flex-col grow p-4 gap-6 w-full overflow-y-scroll overflow-x-hidden">
          {arbitragesTab ? (
            <>
              {paginateData(arbitrages).map((arbitrage) => (
                <ArbTile
                  arbitrage={arbitrage}
                  wager={wager}
                  formatDate={formatDate}
                />
              ))}
            </>
          ) : (
            <>
              {paginateData(history).map((arbitrage) => (
                <HistoryTile
                  arbitrage={arbitrage}
                  wager={wager}
                  formatDate={formatDate}
                />
              ))}
            </>
          )}
        </div>
        {/* <div className="flex gap-2 justify-center">
          <button
            onClick={() => prevPage()}
            className="rounded-full p-2 border"
          >
            Previous page
          </button>
          <button className="rounded-full p-2 border bg-gray-50">
            {currentPage}
          </button>
          <button
            onClick={() => nextPage()}
            className="rounded-full p-2 border"
          >
            Next page
          </button>
        </div> */}
      </div>
    </div>
  );
}
