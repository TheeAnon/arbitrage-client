import { useState, useEffect } from "react";

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="mx-4 self-center text-lg">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default function Home() {
  const [arbitrages, setArbitrages] = useState([]);
  const [arbitragesTab, setArbitragesTab] = useState(true);
  const [history, setHistory] = useState([]);
  const [wager, setWager] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    fetchActiveArbitrages();
    fetchHistory();

    const interval = setInterval(() => {
      fetchActiveArbitrages();
      fetchHistory();
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  const fetchActiveArbitrages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/arbitrages/active/?page=${currentPage}&size=${itemsPerPage}`
      );
      if (!response.ok) {
        alert("Failed to fetch data");
        return;
      }
      const data = await response.json();
      setTotalPages(data.totalPages);
      data.results.sort((a, b) => new Date(b.found) - new Date(a.found));
      setArbitrages(data.results);
    } catch (error) {
      console.error("Error fetching arbitrages:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/arbitrages/inactive/?page=${currentPage}&size=${itemsPerPage}`
      );
      if (!response.ok) {
        alert("Failed to fetch data");
        return;
      }
      const data = await response.json();
      setTotalPages(data.totalPages);
      data.results.sort((a, b) => new Date(b.ended) - new Date(a.ended));
      setHistory(data.results);
    } catch (error) {
      console.error("Error fetching arbitrages:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthAbbreviation = monthNames[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    return `${day} ${monthAbbreviation} ${hours}:${minutes}`;
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

  const deleteArbitrage = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/arbitrages/delete/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`Arbitrage with id ${id} deleted successfully`);
        fetchActiveArbitrages(); // Refresh the list after deletion
      } else {
        console.error(`Failed to delete arbitrage with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting arbitrage with id ${id}: `, error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 gap-6 bg-gray-50">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold text-lg md:text-2xl">
          {arbitragesTab ? "Active Arbitrage Opportunities" : "History"}
        </h1>
        <div className="flex gap-2">
          {arbitragesTab && (
            <>
              <div className="flex gap-2 pl-2 items-center rounded border bg-white shadow-sm">
                <span>Wager €</span>
                <input
                  value={wager}
                  onChange={(e) => setWager(parseFloat(e.target.value))}
                  type="number"
                  min="0"
                  className="p-2 rounded flex grow border border-gray-300"
                />
              </div>
              <button
                onClick={() => setArbitragesTab(false)}
                className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                History
              </button>
            </>
          )}
          {!arbitragesTab && (
            <button
              onClick={() => setArbitragesTab(true)}
              className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              View Active Opportunities
            </button>
          )}
        </div>
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full bg-white shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">EVENT</th>
            <th className="border border-gray-300 px-4 py-2 text-left">BET</th>
            <th className="border border-gray-300 px-4 py-2 text-right">SIDES</th>
            <th className="border border-gray-300 px-4 py-2 text-left">ODDS</th>
            <th className="border border-gray-300 px-4 py-2 text-center">WAGER</th>
            <th className="border border-gray-300 px-4 py-2 text-center">PAYOUT</th>
            <th className="border border-gray-300 px-4 py-2 text-center">PROFIT</th>
            <th className="border border-gray-300 px-4 py-2 text-center">ARB %</th>
            <th className="border border-gray-300 px-4 py-2 text-center">SITES</th>
          </tr>
        </thead>
        <tbody>
          {arbitragesTab
            ? arbitrages.map((arbitrage) => {
                const { wager1, wager2, payout, profit, arbPercentage } = calculateArbitrage(arbitrage);

                if (profit < 0) {
                  deleteArbitrage(arbitrage.id);
                  return null;
                }

                return (
                  <tr key={arbitrage.id}>
                    <td className="border border-gray-300 p-2">
                      <span>{formatDate(arbitrage.found)} </span>
                      <span className="text-gray-500">{arbitrage.event_name}</span>
                      <div className="w-full flex gap-2 items-center">
                        <h2 className="text-lg font-semibold">{arbitrage.competitors}</h2>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">{arbitrage.market}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      <h2 className="text-lg font-semibold">{arbitrage.sides[0]}</h2>
                      <h2 className="text-lg font-semibold">{arbitrage.sides[1]}</h2>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <h2 className="text-lg">{arbitrage.site_one_odds}</h2>
                      <h2 className="text-lg">{arbitrage.site_two_odds}</h2>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-lg">
                      <h3>
                        <span className="text-sm font-normal">€ </span>
                        {wager1}
                      </h3>
                      <h3>
                        <span className="text-sm font-normal">€ </span>
                        {wager2}
                      </h3>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-lg">
                      <h3>
                        <span className="text-sm font-normal">€ </span>
                        {payout}
                      </h3>
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-green-500 font-bold text-lg">
                      <h3>
                        <span className="text-sm font-normal">€ </span>
                        {profit}
                      </h3>
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-green-500 font-bold text-lg">
                      {arbPercentage}%
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <a
                        href={arbitrage.site_one_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block whitespace-nowrap overflow-ellipsis"
                      >
                        {arbitrage.site_one_name}
                      </a>
                      <a
                        href={arbitrage.site_two_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block whitespace-nowrap overflow-ellipsis"
                      >
                        {arbitrage.site_two_name}
                      </a>
                    </td>
                  </tr>
                );
              })
            : history.map((arbitrage) => {
                const { wager1, wager2, payout, profit, arbPercentage } = calculateArbitrage(arbitrage);

                if (profit < 0) {
                  deleteArbitrage(arbitrage.id);
                  return null;
                }

                return (
                  <tr key={arbitrage.id}>
                    <td className="border border-gray-300 p-2">
                      <span className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                        {formatDate(arbitrage.found)} - {formatDate(arbitrage.ended)}
                        <span className="text-gray-500"> {arbitrage.event_name}</span>
                      </span>
                      <div className="w-full flex gap-2 items-center">
                        <h2 className="text-lg font-semibold whitespace-nowrap overflow-ellipsis line-clamp-1">
                          {arbitrage.competitors}
                        </h2>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">{arbitrage.market}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      <h2 className="text-lg font-semibold">{arbitrage.sides[0]}</h2>
                      <h2 className="text-lg font-semibold">{arbitrage.sides[1]}</h2>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <h2 className="text-lg">{arbitrage.site_one_odds}</h2>
                      <h2 className="text-lg">{arbitrage.site_two_odds}</h2>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-lg">
                      <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                        <span className="text-sm font-normal">€ </span>
                        {wager1}
                      </h3>
                      <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                        <span className="text-sm font-normal">€ </span>
                        {wager2}
                      </h3>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold text-lg">
                      <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                        <span className="text-sm font-normal">€ </span>
                        {payout}
                      </h3>
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-green-500 font-bold text-lg">
                      <h3 className="whitespace-nowrap overflow-ellipsis line-clamp-1">
                        <span className="text-sm font-normal">€ </span>
                        {profit}
                      </h3>
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-green-500 font-bold text-lg">
                      {arbPercentage}%
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <a
                        href={arbitrage.site_one_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block whitespace-nowrap overflow-ellipsis"
                      >
                        {arbitrage.site_one_name}
                      </a>
                      <a
                        href={arbitrage.site_two_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block whitespace-nowrap overflow-ellipsis"
                      >
                        {arbitrage.site_two_name}
                      </a>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
