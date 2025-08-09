import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface SummaryEntry {
  taskTitle: string;
  hours: number;
}

interface Props {
  selectedDate?: string;
}

const TimesheetSummary: React.FC<Props> = ({ selectedDate }) => {
  const [summary, setSummary] = useState<SummaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user?.token) return;

      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/timesheets/my', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });


        let filtered = data;

        if (selectedDate && selectedDate.trim() !== '') {
          filtered = data.filter(
            (t: any) => t.date && t.date.startsWith(selectedDate)
          );
        }

        const mapped = filtered.map((t: any) => ({
          taskTitle: t.task?.title || 'Unknown Task',
          hours: t.actualHours || 0,
        }));

        setSummary(mapped);
        setIsLocked(filtered.length > 0);
      } catch (err) {
        console.error(err);
        setSummary([]);
        setIsLocked(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [selectedDate, user?.token]);

  if (isLoading) return <p>Loading summary...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Submitted Timesheet</h2>

      {isLocked ? (
        <p className="text-green-600 font-medium mb-2">
          Timesheet is submitted and locked.
        </p>
      ) : (
        <p className="text-yellow-600 mb-2">Timesheet not submitted yet.</p>
      )}

      {summary.length === 0 ? (
        <p className="text-gray-500">No data {selectedDate ? `for ${selectedDate}` : 'available'}.</p>
      ) : (
        <ul className="space-y-2">
          {summary.map((entry, idx) => (
            <li key={idx} className="border px-4 py-2 rounded shadow-sm">
              <strong>{entry.taskTitle}</strong>: {entry.hours} hrs
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimesheetSummary;
