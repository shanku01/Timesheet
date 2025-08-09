import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

interface TimesheetSummary {
  associate: string;
  task: string;
  estimatedHours: number;
  actualHours: number;
  date: string;
}

export default function TimesheetSummary() {
  const [summary, setSummary] = useState<TimesheetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      if (!user?.token) {
        setError("User not authenticated");
        return;
      }
      setLoading(true);
      const { data } = await axios.get("/api/timesheets/reports/summary", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching timesheet summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Timesheet Summary</h2>

      {loading ? (
        <p className="text-gray-600">Loading summary...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : summary.length === 0 ? (
        <p className="text-gray-600">No timesheet records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Associate</th>
                <th className="py-2 px-4 text-left">Task</th>
                <th className="py-2 px-4 text-center">Estimated Hours</th>
                <th className="py-2 px-4 text-center">Actual Hours</th>
                <th className="py-2 px-4 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-2 px-4">{item.associate}</td>
                  <td className="py-2 px-4">{item.task}</td>
                  <td className="py-2 px-4 text-center">{item.estimatedHours}</td>
                  <td
                    className={`py-2 px-4 text-center ${
                      item.actualHours > item.estimatedHours
                        ? "text-red-500 font-semibold"
                        : "text-green-600"
                    }`}
                  >
                    {item.actualHours}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
